import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukkjgwnmukvuhzeaehec.supabase.co";
const supabaseAnonKey = "sb_publishable_DbFLCGU-ud2aWBN8nVlA8A_W5wShL0M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
