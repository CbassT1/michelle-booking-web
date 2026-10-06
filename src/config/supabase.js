import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://wkrbpuwzylgjhacamghg.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcmJwdXd6eWxnamhhY2FtZ2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NTc1NzgsImV4cCI6MjEwNjUzMzU3OH0.tJIz4-pY0NfP2FoQvHT4IL-s0aTxA2AzLwde_ffZsAQ';

export const supabase = createClient(supabaseUrl, supabaseKey);