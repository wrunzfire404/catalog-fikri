import { supabase } from "./supabase";
import {
  defaultProducts,
  defaultSettings,
  type Product,
  type Settings,
} from "./products";

// ---- Products ----
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) return defaultProducts;

  return data.map((row: Record<string, unknown>) => ({
    slug: row.slug as string,
    code: row.code as string,
    name: row.name as string,
    ld: (row.ld as string) || "",
    pj: (row.pj as string) || "",
    price: row.price as number,
    note: (row.note as string) || undefined,
    image: (row.image as string) || undefined,
    variants: Array.isArray(row.variants) ? (row.variants as Product["variants"]) : undefined,
    featured: (row.featured as boolean) || false,
    stock: typeof row.stock === "number" ? row.stock : undefined,
  }));
}

export async function saveProduct(product: Product) {
  const { data: existing, error: findError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", product.slug)
    .maybeSingle();

  const payload = {
    slug: product.slug,
    code: product.code,
    name: product.name,
    ld: product.ld,
    pj: product.pj,
    price: product.price,
    note: product.note || null,
    image: product.image || null,
    variants: product.variants || [],
    featured: product.featured || false,
    stock: product.stock !== undefined ? product.stock : null,
  };

  if (existing) {
    return supabase.from("products").update(payload).eq("slug", product.slug);
  }
  return supabase.from("products").insert(payload);
}

export async function deleteProduct(slug: string) {
  return supabase.from("products").delete().eq("slug", slug);
}

export async function resetProductsToDefault() {
  // Delete all, then re-insert defaults
  await supabase.from("products").delete().neq("slug", "");
  for (const p of defaultProducts) {
    await saveProduct(p);
  }
}

// ---- Settings ----
export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return defaultSettings;

  return {
    shopName: (data.shop_name as string) || defaultSettings.shopName,
    tagline: (data.tagline as string) || defaultSettings.tagline,
    waNumber: (data.wa_number as string) || defaultSettings.waNumber,
    address: (data.address as string) || defaultSettings.address,
    mapsUrl: (data.maps_url as string) || defaultSettings.mapsUrl,
    banners: Array.isArray(data.banners) ? (data.banners as Settings["banners"]) : defaultSettings.banners,
  };
}

export async function saveSettings(s: Settings) {
  return supabase.from("settings").upsert({
    id: 1,
    shop_name: s.shopName,
    tagline: s.tagline,
    wa_number: s.waNumber,
    address: s.address,
    maps_url: s.mapsUrl,
    banners: s.banners || null,
  });
}

export async function resetSettingsToDefault() {
  await saveSettings(defaultSettings);
}

// ---- Auth ----
export function getAdminCreds(): { user: string; pass: string } {
  const KEY_CREDS = "pgrb-admin-creds";
  try {
    const raw = window.localStorage.getItem(KEY_CREDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.user && parsed.pass) return parsed;
    }
  } catch { /* ignore */ }
  return { user: "admin", pass: "adminpgrb2024" };
}

export function saveAdminCreds(user: string, pass: string) {
  window.localStorage.setItem("pgrb-admin-creds", JSON.stringify({ user, pass }));
}

export function isAdminLoggedIn(): boolean {
  return window.localStorage.getItem("pgrb-auth-session") === "1";
}

export async function adminLogin(user: string, pass: string): Promise<boolean> {
  const creds = getAdminCreds();
  if (user === creds.user && pass === creds.pass) {
    // Try Supabase auth login, but don't block on it
    try {
      await supabase.auth.signInWithPassword({ email: `${user}@pgrb.local`, password: pass });
    } catch {
      // Fallback: auth mungkin belum di-setup di Supabase
    }
    window.localStorage.setItem("pgrb-auth-session", "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  window.localStorage.removeItem("pgrb-auth-session");
  supabase.auth.signOut().catch(() => {});
}
