-- Begin transaction
BEGIN;

-- Drop existing tables (in reverse order to avoid foreign key constraints)
DROP TABLE IF EXISTS public.chat_history;
DROP TABLE IF EXISTS public.knowledge_answers;
DROP TABLE IF EXISTS public.interview_answers;
DROP TABLE IF EXISTS public.answers;
DROP TABLE IF EXISTS public.settings;

-- Drop triggers if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_chat_history_updated_at') THEN
        DROP TRIGGER update_chat_history_updated_at ON public.chat_history;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_answers_updated_at') THEN
        DROP TRIGGER update_answers_updated_at ON public.answers;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'check_user_id_match') THEN
        DROP TRIGGER check_user_id_match ON public.chat_history;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_settings_updated_at') THEN
        DROP TRIGGER update_settings_updated_at ON public.settings;
    END IF;
END $$;


-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS check_user_id_match_func();
DROP FUNCTION IF EXISTS migrate_to_unified_schema();
DROP FUNCTION IF EXISTS update_settings_updated_at();

-- Drop types if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_role') THEN
        DROP TYPE message_role;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'answers_type') THEN
        DROP TYPE answers_type;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Just continue if there's an error
END $$;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create message role type
CREATE TYPE message_role AS ENUM ('user', 'assistant');

-- Create answers_type type for differentiating answer types
CREATE TYPE answers_type AS ENUM ('interview', 'knowledge');

-- Create a unified answers table
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type answers_type NOT NULL,
    category TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    model TEXT NOT NULL
);

-- Create chat_history table with proper foreign key to answers
CREATE TABLE public.chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    answer_id UUID REFERENCES public.answers(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create settings table with optimized structure
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Commonly accessed API keys as columns for better indexing
  openai TEXT,
  gemini TEXT,
  mistral TEXT,
  openchat TEXT,
  google_sheet_api_key TEXT,
  
  -- Flexible JSONB fields for different setting categories
  api_settings JSONB DEFAULT '{}'::jsonb, -- Spreadsheet IDs, sheet names, etc.
  app_preferences JSONB DEFAULT '{}'::jsonb, -- UI preferences, language, etc.
  feature_flags JSONB DEFAULT '{}'::jsonb, -- For toggling features on/off
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Create a function to check if user_id in chat_history matches user_id in answers
CREATE OR REPLACE FUNCTION check_user_id_match_func()
RETURNS TRIGGER AS $$
DECLARE
    answer_user_id UUID;
BEGIN
    SELECT user_id INTO answer_user_id
    FROM public.answers
    WHERE id = NEW.answer_id;
    
    IF NEW.user_id != answer_user_id THEN
        RAISE EXCEPTION 'User ID in chat_history (%) must match user_id in answers (%)', 
                        NEW.user_id, answer_user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to auto-update the updated_at column for settings table
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to ensure user_id matches
CREATE TRIGGER check_user_id_match
BEFORE INSERT OR UPDATE ON public.chat_history
FOR EACH ROW
EXECUTE FUNCTION check_user_id_match_func();

-- Create indexes for performance
CREATE INDEX answers_user_id_idx ON public.answers(user_id);
CREATE INDEX answers_type_idx ON public.answers(type);
CREATE INDEX answers_category_idx ON public.answers(category);
CREATE INDEX chat_history_answer_id_idx ON public.chat_history(answer_id);
CREATE INDEX chat_history_user_id_idx ON public.chat_history(user_id);

-- Auto-update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to chat_history
CREATE TRIGGER update_chat_history_updated_at
BEFORE UPDATE ON public.chat_history
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Add similar trigger to answers table
CREATE TRIGGER update_answers_updated_at
BEFORE UPDATE ON public.answers
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Add similar trigger to settings table
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE PROCEDURE update_settings_updated_at();

-- Enable Row Level Security
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for answers table
CREATE POLICY "Users can view their own answers"
ON public.answers
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers"
ON public.answers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
ON public.answers
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers"
ON public.answers
FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for chat_history table
CREATE POLICY "Users can view their own chat history"
ON public.chat_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history"
ON public.chat_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history"
ON public.chat_history
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
ON public.chat_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for settings table
CREATE POLICY "Users can view their own settings"
ON public.settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.settings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
ON public.settings
FOR DELETE
USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE public.answers IS 'Unified table for interview and knowledge answers';
COMMENT ON COLUMN public.answers.id IS 'Unique ID for each answer';
COMMENT ON COLUMN public.answers.user_id IS 'User ID of the owner';
COMMENT ON COLUMN public.answers.type IS 'Type of answer: interview or knowledge';
COMMENT ON COLUMN public.answers.category IS 'Optional category for the answer';
COMMENT ON COLUMN public.answers.question IS 'The question text';
COMMENT ON COLUMN public.answers.answer IS 'The answer text';
COMMENT ON COLUMN public.answers.created_at IS 'Creation timestamp';
COMMENT ON COLUMN public.answers.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN public.answers.model IS 'AI model used for the answer';

COMMENT ON TABLE public.chat_history IS 'Chat history related to answers';
COMMENT ON COLUMN public.chat_history.id IS 'Unique ID for each chat history';
COMMENT ON COLUMN public.chat_history.answer_id IS 'Reference to the answer this chat belongs to';
COMMENT ON COLUMN public.chat_history.user_id IS 'User ID of the owner';
COMMENT ON COLUMN public.chat_history.messages IS 'JSON array of chat messages';
COMMENT ON COLUMN public.chat_history.created_at IS 'Creation timestamp';
COMMENT ON COLUMN public.chat_history.updated_at IS 'Last update timestamp';

COMMENT ON TABLE public.settings IS 'User settings including API keys and app preferences';
COMMENT ON COLUMN public.settings.api_settings IS 'JSON field for spreadsheet IDs, sheet names, and other API-related settings';
COMMENT ON COLUMN public.settings.app_preferences IS 'JSON field for user preferences like theme, language, UI settings';
COMMENT ON COLUMN public.settings.feature_flags IS 'JSON field for feature toggles like auto-saving questions, notifications';

-- Commit transaction
COMMIT;