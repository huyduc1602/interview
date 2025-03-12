import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nusledxyrnjehfiohsmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c2xlZHh5cm5qZWhmaW9oc216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM4NDMsImV4cCI6MjA1NzMxOTg0M30.MQYt9hSlObGX2dnsDsUXDq91T5aVZBStrwKjIZTGElA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };