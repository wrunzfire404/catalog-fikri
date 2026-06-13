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
import type { Product, Settings } from "@/lib/products";

type StoreValue = {
  products: Product[];
  settings: Settings;
  refresh: () => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (slug: string) => void;
  saveSettings: (s: Settings) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => readProducts());
  const [settings, setSettings] = useState<Settings>(() => readSettings());

  const refresh = useCallback(() => {
    setProducts(readProducts());
    setSettings(readSettings());
  }, []);

  const saveProduct = useCallback(
    (p: Product) => {
      writeProduct(p);
      setProducts(readProducts());
    },
    []
  );

  const deleteProduct = useCallback(
    (slug: string) => {
      removeProduct(slug);
      setProducts(readProducts());
    },
    []
  );

  const saveSettings = useCallback(
    (s: Settings) => {
      writeSettings(s);
      setSettings(readSettings());
    },
    []
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("pgrb-")) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return (
    <StoreContext.Provider value={{ products, settings, refresh, saveProduct, deleteProduct, saveSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
