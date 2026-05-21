import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://hmxykurbnuamibcgfxwp.supabase.co";
export const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteHlrdXJibnVhbWliY2dmeHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDYzMjUsImV4cCI6MjA4NDcyMjMyNX0.K58CtqNo5A0gz1EZ7sGoccIL1pS76gtz7shX9Uwhl4c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
