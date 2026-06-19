import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, ShoppingBag, ArrowLeft } from "lucide-react";
import { type Product } from "@/lib/products";
import { ProductCard, ProductModal } from "@/components/catalog";
import { CartDrawer } from "@/components/cart";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { usePopup } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";

export default function Stock() {
  const { cart, totalItems, addToCart, updateQty, removeItem } = useCart();
  const { products: storeProducts, settings } = useStore();
  const { showPopup } = usePopup();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Fetch featured products for popup
  const fetchFeatured = () =>
    supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .then(({ data, error }) => {
        if (!error && data) {
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
          })) as Product[];
        }
        return [] as Product[];
      });

  // Listen for product selection from popup
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      const product = storeProducts.find((p) => p.slug === slug);
      if (product) setSelectedProduct(product);
    };
    window.addEventListener("select-product", handler);
    return () => window.removeEventListener("select-product", handler);
  }, [storeProducts]);

  const filtered = storeProducts.filter((p) =>
    `${p.code} ${p.name}`.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <img src="/images/logo.png" alt={settings.shopName} className="h-9 object-contain mix-blend-multiply" />
          </Link>

          <Link
            to="/cart"
            className="relative p-2 text-foreground hover:bg-secondary rounded-full transition"
            aria-label="Keranjang"
          >
            <ShoppingCart className="w-6 h-6 text-primary" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-white badge-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
          <div className="animate-fade-in-up">
            <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold mb-2">Koleksi</p>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Katalog</h1>
            <p className="text-muted-foreground mt-2 text-[14px]">Pilih varian favoritmu, langsung checkout ke WhatsApp.</p>
          </div>
          <div className="relative w-full md:w-72 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full rounded-full border border-border/60 bg-white pl-10 pr-4 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/5"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Produk "{query}" tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} onSelect={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(variant, qty) => {
            addToCart(selectedProduct, variant, qty);
            const currentProduct = selectedProduct;
            const name = selectedProduct.name;
            setSelectedProduct(null);
            // Fetch featured & show popup with rekomendasi
            fetchFeatured().then((featuredProducts) => {
              // Exclude product yg barusan ditambahin
              const recs = featuredProducts.filter((p) => p.slug !== selectedProduct.slug);
              showPopup(`${name} berhasil ditambahkan (${qty} pcs)`, {
                action: { label: "Lanjut Belanja", onClick: () => setTimeout(() => setSelectedProduct(currentProduct), 300) },
                secondary: { label: "Lihat Keranjang", onClick: () => setIsCartOpen(true) },
                featured: recs,
              });
            });
          }}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={updateQty}
          onRemoveItem={removeItem}
        />
      )}

      {totalItems > 0 && !isCartOpen && !selectedProduct && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:hidden z-20 animate-in slide-in-from-bottom-full">
          <Link
            to="/cart"
            className="w-full flex items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold text-[15px]">{totalItems} Item</span>
            </div>
            <span className="font-bold text-[15px]">Lihat Keranjang</span>
          </Link>
        </div>
      )}
    </div>
  );
}
