import { supabase, uploadImage } from "./supabase";
import {
  defaultProducts,
  defaultSettings,
  type Product,
  type Settings,
  type CustomerInfo,
  type CartItem,
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
    isHidden: (row.is_hidden as boolean) || false,
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
    is_hidden: product.isHidden || false,
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
    menuKatalogImage: data.menu_katalog_image !== null && data.menu_katalog_image !== undefined ? (data.menu_katalog_image as string) : defaultSettings.menuKatalogImage,
    menuCsImage: data.menu_cs_image !== null && data.menu_cs_image !== undefined ? (data.menu_cs_image as string) : defaultSettings.menuCsImage,
    menuLokasiImage: data.menu_lokasi_image !== null && data.menu_lokasi_image !== undefined ? (data.menu_lokasi_image as string) : defaultSettings.menuLokasiImage,
    bannerText: data.banner_text !== null && data.banner_text !== undefined ? (data.banner_text as string) : defaultSettings.bannerText,
    paymentInfo: data.payment_info !== null && data.payment_info !== undefined ? (data.payment_info as string) : defaultSettings.paymentInfo,
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
    menu_katalog_image: s.menuKatalogImage === "" ? "" : s.menuKatalogImage || null,
    menu_cs_image: s.menuCsImage === "" ? "" : s.menuCsImage || null,
    menu_lokasi_image: s.menuLokasiImage === "" ? "" : s.menuLokasiImage || null,
    banner_text: s.bannerText === "" ? "" : s.bannerText || null,
    payment_info: s.paymentInfo === "" ? "" : s.paymentInfo || null,
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

// ---- Orders ----
export type Order = {
  id: string;
  invoice_no: string;
  customer_info: CustomerInfo;
  cart_items: CartItem[];
  total_price: number;
  status?: "unpaid" | "paid";
  created_at: string;
};

export async function saveOrder(orderData: Omit<Order, "id" | "created_at">) {
  const { error } = await supabase.from("orders").insert(orderData);
  if (error) {
    console.error("Gagal menyimpan pesanan:", error);
  }
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat daftar pesanan:", error);
    return [];
  }
  return data as Order[];
}

export async function updateOrderStatus(id: string, status: "unpaid" | "paid") {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) {
    console.error("Gagal mengubah status pesanan:", error);
    throw error;
  }
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus pesanan:", error);
    throw error;
  }
}

export async function bulkCompressAllImages(onProgress: (msg: string) => void) {
  try {
    const products = await getAllProducts();
    onProgress(`Ditemukan ${products.length} produk. Memulai kompresi...`);

    let count = 0;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      let updated = false;

      // Fungsi bantu untuk mendownload dan mengompres
      const processImage = async (url: string, name: string) => {
        try {
          if (!url.startsWith("http")) return url;
          onProgress(`Mendownload ${name}...`);
          const res = await fetch(url);
          const blob = await res.blob();
          
          // Jika ukuran > 150KB, kompres
          if (blob.size > 150 * 1024) {
            onProgress(`Mengompres ${name} (${(blob.size / 1024).toFixed(0)}KB)...`);
            const ext = url.split(".").pop() || "jpg";
            const file = new File([blob], `image.${ext}`, { type: blob.type });
            const newUrl = await uploadImage(file);
            return newUrl;
          }
          return url;
        } catch (e) {
          console.error(`Gagal memproses gambar ${name}:`, e);
          return url; // Kembalikan url asli jika gagal
        }
      };

      if (p.image) {
        const newImage = await processImage(p.image, p.name);
        if (newImage !== p.image) {
          p.image = newImage;
          updated = true;
        }
      }

      if (p.variants) {
        for (let j = 0; j < p.variants.length; j++) {
          const v = p.variants[j];
          if (v.image) {
            const newVImage = await processImage(v.image, `${p.name} - ${v.color}`);
            if (newVImage !== v.image) {
              v.image = newVImage;
              updated = true;
            }
          }
        }
      }

      if (updated) {
        onProgress(`Menyimpan pembaruan untuk ${p.name}...`);
        await saveProduct(p);
        count++;
      }
    }

    onProgress(`Selesai! ${count} produk telah diperbarui ukurannya.`);
  } catch (err) {
    console.error("Bulk compress error:", err);
    onProgress("Terjadi kesalahan saat melakukan bulk compress.");
  }
}
