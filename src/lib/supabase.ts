import { createClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";

const supabaseUrl = "https://ukkjgwnmukvuhzeaehec.supabase.co";
const supabaseAnonKey = "sb_publishable_DbFLCGU-ud2aWBN8nVlA8A_W5wShL0M";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File): Promise<string> {
  const options = {
    maxSizeMB: 0.15, // Max 150KB
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, options);
  } catch (error) {
    console.warn("Image compression failed, using original file", error);
  }

  const ext = compressedFile.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(filename, compressedFile, { upsert: true, contentType: compressedFile.type });

  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
  return data.publicUrl;
}
