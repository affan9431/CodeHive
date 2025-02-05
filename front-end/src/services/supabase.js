import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qfngfzrjxhlajtvioxpy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbmdmenJqeGhsYWp0dmlveHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNTEyOTcsImV4cCI6MjA1MTgyNzI5N30.BRULzS1mkyxa23VxCS6MlUee0nDsQ6e2X-j2ACx0_Go";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
