import {
  defaultProducts,
  defaultSettings,
  type Product,
  type Settings,
} from "./products";

// ---- Storage Keys ----
const KEY_PRODUCTS = "pgrb-products";
const KEY_SETTINGS = "pgrb-settings";
const KEY_AUTH_SESSION = "pgrb-auth-session";
const KEY_CREDS = "pgrb-admin-creds";

// ---- Products ----
export function getAllProducts(): Product[] {
  try {
    const raw = window.localStorage.getItem(KEY_PRODUCTS);
    if (raw) {
      const stored: Product[] = JSON.parse(raw);
      if (stored.length > 0) return stored;
    }
  } catch { /* ignore */ }
  return defaultProducts;
}

export function saveProduct(product: Product) {
  const all = getAllProducts();
  const idx = all.findIndex((p) => p.slug === product.slug);
  if (idx >= 0) {
    all[idx] = product;
  } else {
    all.push(product);
  }
  window.localStorage.setItem(KEY_PRODUCTS, JSON.stringify(all));
}

export function deleteProduct(slug: string) {
  const all = getAllProducts().filter((p) => p.slug !== slug);
  window.localStorage.setItem(KEY_PRODUCTS, JSON.stringify(all));
}

export function resetProductsToDefault() {
  window.localStorage.removeItem(KEY_PRODUCTS);
}

// ---- Settings ----
export function getSettings(): Settings {
  try {
    const raw = window.localStorage.getItem(KEY_SETTINGS);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<Settings>;
      return { ...defaultSettings, ...stored };
    }
  } catch { /* ignore */ }
  return defaultSettings;
}

export function saveSettings(s: Settings) {
  window.localStorage.setItem(KEY_SETTINGS, JSON.stringify(s));
}

export function resetSettingsToDefault() {
  window.localStorage.removeItem(KEY_SETTINGS);
}

// ---- Auth ----
export function getAdminCreds(): { user: string; pass: string } {
  try {
    const raw = window.localStorage.getItem(KEY_CREDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.user && parsed.pass) return parsed;
    }
  } catch { /* ignore */ }
  return { user: "admin", pass: "pgrb2024" };
}

export function saveAdminCreds(user: string, pass: string) {
  window.localStorage.setItem(KEY_CREDS, JSON.stringify({ user, pass }));
}

export function isAdminLoggedIn(): boolean {
  return window.localStorage.getItem(KEY_AUTH_SESSION) === "1";
}

export function adminLogin(user: string, pass: string): boolean {
  const creds = getAdminCreds();
  if (user === creds.user && pass === creds.pass) {
    window.localStorage.setItem(KEY_AUTH_SESSION, "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  window.localStorage.removeItem(KEY_AUTH_SESSION);
}
