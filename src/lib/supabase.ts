import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zxqwetmvbcgkqpodmomb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cXdldG12YmNna3Fwb2Rtb21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDIyNDUsImV4cCI6MjA1NzgxODI0NX0.aIVfUHLxqfdBd5CFN5r8X3Lw4-cuFqdIazfZmCL_mdI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const fetchPets = async () => {
  const { data, error } = await supabase.from("pets").select("*");
  if (error) {
    console.error("Error fetching pets:", error.message);
  }
  return data;
};
