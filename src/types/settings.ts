/**
 * Type definitions for the settings table in Supabase
 */

// API Settings structure stored in JSONB
export interface ApiSettings {
  spreadsheetId?: string;
  sheetNameKnowledgeBase?: string;
  sheetNameInterviewQuestions?: string;
  // Allow for additional API settings
  [key: string]: any;
}

// Application preferences structure stored in JSONB
export interface AppPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  fontSize?: string;
  // Allow for additional preferences
  [key: string]: any;
}

// Feature flags structure stored in JSONB
export interface FeatureFlags {
  auto_save_knowledge?: boolean;
  auto_save_interview?: boolean;
  save_history_knowledge?: boolean;
  save_history_interview?: boolean;
  // Nested structure example
  auto_save?: {
    knowledge?: boolean;
    interview?: boolean;
  };
  // Allow for additional feature flags
  [key: string]: any;
}

// Main Settings type that matches the database table
export interface UserSettings {
  id: string;
  user_id: string;
  
  // Direct API key columns
  openai?: string;
  gemini?: string;
  mistral?: string;
  openchat?: string;
  google_sheet_api_key?: string;
  
  // JSONB columns
  api_settings: ApiSettings;
  app_preferences: AppPreferences;
  feature_flags: FeatureFlags;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Type for Supabase response when fetching settings
export interface SettingsResponse {
  data: UserSettings | null;
  error: Error | null;
}

// Type for saving settings
export interface SaveSettingsInput {
  openai?: string;
  gemini?: string;
  mistral?: string;
  openchat?: string;
  google_sheet_api_key?: string;
  api_settings?: ApiSettings;
  app_preferences?: AppPreferences;
  feature_flags?: FeatureFlags;
  [key: string]: any; // Allow additional fields for flexibility
}