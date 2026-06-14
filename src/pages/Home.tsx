import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, ShoppingBag, MessageCircle, MapPin, Sparkles } from "lucide-react";
import { type Product } from "@/lib/products";
import { ProductCard, ProductModal } from "@/components/catalog";
import { CartDrawer } from "@/components/cart";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { usePopup } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";

const BANNERS = [
  { src: "/images/banner1.jpeg", alt: "Banner PGRB 1" },
  { src: "/images/banner2.jpeg", alt: "Banner PGRB 2" },
  { src: "/images/banner3.jpeg", alt: "Banner PGRB 3" },
];

export default function Home() {
  const navigate = useNavigate();
  const { cart, totalItems, addToCart, updateQty, removeItem } = useCart();
  const { products: storeProducts, settings } = useStore();
  const { showPopup } = usePopup();
  
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 transition hover:opacity-80">
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-9 object-contain" />
          </Link>

          <div className="flex items-center gap-4">
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
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-primary text-white">
        <div className="relative w-full h-[30vh] md:h-[40vh] lg:h-[45vh] overflow-hidden">
          {BANNERS.map((banner, i) => (
            <img
              key={banner.src}
              src={banner.src}
              alt={banner.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === bannerIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold backdrop-blur-sm mb-2">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {settings.tagline}
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
                Rajut Premium, Harga Grosir.
              </h1>
            </div>
          </div>
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === bannerIndex ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white border-b border-border/40 py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 justify-center">
           <button
            onClick={() => navigate("/contact")}
            className="flex items-center justify-center gap-3 bg-secondary/30 hover:bg-secondary/60 transition p-3 md:p-4 rounded-xl text-primary font-medium"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[13px] md:text-[15px]">Hubungi CS</span>
          </button>
          <button
            onClick={() => navigate("/visit")}
            className="flex items-center justify-center gap-3 bg-secondary/30 hover:bg-secondary/60 transition p-3 md:p-4 rounded-xl text-primary font-medium"
          >
            <MapPin className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[13px] md:text-[15px]">Lokasi Toko</span>
          </button>
        </div>
      </section>

      {/* Catalog Section */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-10 md:py-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
          <div className="animate-fade-in-up">
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-primary font-semibold mb-2">Koleksi</p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Katalog Utama</h2>
            <p className="text-muted-foreground mt-2 text-[14px] md:text-[15px] max-w-xl">
              Pilih koleksi rajut premium kami, tambahkan varian ke keranjang, dan nikmati kemudahan checkout otomatis via WhatsApp.
            </p>
          </div>
          <div className="relative w-full md:w-80 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari model atau kode produk..."
              className="w-full rounded-2xl border border-border/60 bg-white pl-11 pr-4 py-3 text-[14px] md:text-[15px] shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/5"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground bg-white/50 rounded-3xl border border-dashed border-border">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30 text-primary" />
            <p className="text-lg font-medium text-foreground">Pencarian tidak ditemukan.</p>
            <p className="text-[14px] mt-1">Coba gunakan kata kunci lain untuk "{query}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 stagger-children">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} onSelect={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-white py-8 md:py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-8 md:h-10 object-contain opacity-80" />
            <span className="text-[13px] text-muted-foreground">© {new Date().getFullYear()} {settings.shopName}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-[14px] font-medium">
            <button onClick={() => navigate("/contact")} className="text-muted-foreground hover:text-primary transition">Hubungi Kami</button>
            <button onClick={() => navigate("/visit")} className="text-muted-foreground hover:text-primary transition">Lokasi Toko</button>
            <button onClick={() => navigate("/stock")} className="text-muted-foreground hover:text-primary transition">Katalog</button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(variant, qty) => {
            addToCart(selectedProduct, variant, qty);
            const name = selectedProduct.name;
            setSelectedProduct(null);
            fetchFeatured().then((featuredProducts) => {
              const recs = featuredProducts.filter((p) => p.slug !== selectedProduct.slug);
              showPopup(`${name} berhasil ditambahkan (${qty} pcs)`, {
                action: { label: "Lihat Keranjang", onClick: () => setIsCartOpen(true) },
                secondary: { label: "Lanjut Belanja", onClick: () => {} },
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

      {/* Mobile Sticky Cart Bar */}
      {totalItems > 0 && !isCartOpen && !selectedProduct && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:hidden z-20 animate-in slide-in-from-bottom-full">
          <Link
            to="/cart"
            className="w-full flex items-center justify-between rounded-2xl bg-primary px-6 py-4 text-white shadow-button btn-press"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-semibold text-[15px]">{totalItems} Item</span>
            </div>
            <span className="font-bold text-[15px]">Lihat Keranjang</span>
          </Link>
        </div>
      )}
    </div>
  );
}
