import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukkjgwnmukvuhzeaehec.supabase.co";
const supabaseAnonKey = "sb_publishable_DbFLCGU-ud2aWBN8nVlA8A_W5wShL0M";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(filename, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
  return data.publicUrl;
}
