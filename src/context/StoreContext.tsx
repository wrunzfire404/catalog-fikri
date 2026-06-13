import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  getAllProducts as readProducts,
  saveProduct as writeProduct,
  deleteProduct as removeProduct,
  getSettings as readSettings,
  saveSettings as writeSettings,
} from "@/lib/store";
import { defaultProducts, defaultSettings, type Product, type Settings } from "@/lib/products";

type StoreValue = {
  products: Product[];
  settings: Settings;
  loading: boolean;
  refresh: () => void;
  saveProduct: (p: Product) => Promise<void>;
  toggleFeatured: (slug: string) => Promise<void>;
  deleteProduct: (slug: string) => Promise<void>;
  saveSettings: (s: Settings) => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [prods, sets] = await Promise.all([readProducts(), readSettings()]);
    setProducts(prods);
    setSettings(sets);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const saveProduct = useCallback(
    async (p: Product) => {
      await writeProduct(p);
      // Only full refresh on saveProduct (add/edit via modal)
      await refresh();
    },
    [refresh]
  );

  const toggleFeatured = useCallback(
    async (slug: string) => {
      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, featured: !p.featured } : p
        )
      );
      // Save in background without reordering
      const product = products.find((p) => p.slug === slug);
      if (product) {
        await writeProduct({ ...product, featured: !product.featured });
      }
    },
    [products]
  );

  const deleteProduct = useCallback(
    async (slug: string) => {
      await removeProduct(slug);
      await refresh();
    },
    [refresh]
  );

  const saveSettings = useCallback(
    async (s: Settings) => {
      await writeSettings(s);
      await refresh();
    },
    [refresh]
  );

  return (
    <StoreContext.Provider value={{ products, settings, loading, refresh, saveProduct, toggleFeatured, deleteProduct, saveSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
