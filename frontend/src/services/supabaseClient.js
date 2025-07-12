import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iunjragmtdlyjbjrknev.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmpyYWdtdGRseWpianJrbmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzQ2NjUsImV4cCI6MjA2NzkxMDY2NX0.JsQ_sgjcX8LzFJ5D-1CVXSjpDbryMHMUX85zW02wmeA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 