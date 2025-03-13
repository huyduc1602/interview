-- Begin transaction
BEGIN;

-- Drop existing tables (in reverse order to avoid foreign key constraints)
DROP TABLE IF EXISTS public.chat_history CASCADE;
DROP TABLE IF EXISTS public.knowledge_answers CASCADE;
DROP TABLE IF EXISTS public.interview_answers CASCADE;
DROP TABLE IF EXISTS public.answers CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS update_chat_history_updated_at ON public.chat_history;
DROP TRIGGER IF EXISTS update_answers_updated_at ON public.answers;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS migrate_to_unified_schema() CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS message_role CASCADE;
DROP TYPE IF EXISTS answers_type CASCADE;

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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- Ensure the user_id in chat_history matches the user_id in answers
    CONSTRAINT chat_history_user_match CHECK (
        user_id = (SELECT user_id FROM public.answers WHERE id = answer_id)
    )
);

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

-- Enable Row Level Security
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

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

-- Commit transaction
COMMIT;