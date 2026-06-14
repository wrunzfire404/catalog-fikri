import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, Sparkles, ChevronRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart";

const BANNERS = [
  { src: "/images/banner1.jpeg", alt: "Banner PGRB 1" },
  { src: "/images/banner2.jpeg", alt: "Banner PGRB 2" },
  { src: "/images/banner3.jpeg", alt: "Banner PGRB 3" },
  { src: "/images/banner4.png", alt: "Banner PGRB 4" },
];

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const { cart, totalItems, updateQty, removeItem } = useCart();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
          <img src="/images/logo.png" alt={settings.shopName} className="h-12 object-contain mix-blend-multiply" />
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 text-[12px] font-semibold tracking-widest uppercase text-foreground">
              <button onClick={() => navigate("/stock")} className="hover:text-primary transition-colors">Katalog</button>
              <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">Kontak</button>
              <button onClick={() => navigate("/visit")} className="hover:text-primary transition-colors">Lokasi</button>
            </nav>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground hover:bg-secondary rounded-full transition"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-white badge-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-primary text-white">
        <div className="relative w-full h-[30vh] md:h-[35vh] lg:h-[45vh] overflow-hidden">
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
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold font-serif leading-tight">
                Rajut Premium, Harga Grosir.
              </h1>
            </div>
          </div>
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === bannerIndex ? "w-4 h-1 bg-white" : "w-1 h-1 bg-white/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8 md:py-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {/* Katalog */}
          <button
            onClick={() => navigate("/stock")}
            className="relative w-full h-48 md:h-64 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border rounded-3xl"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/katalog.jpeg" className="absolute inset-0 w-[110%] h-full object-cover -translate-x-[5%] group-hover:translate-x-0 transition-transform duration-700" alt="Katalog" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Cek Katalog</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Koleksi Terbaru</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Hubungi CS */}
          <button
            onClick={() => navigate("/contact")}
            className="relative w-full h-48 md:h-64 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border rounded-3xl"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/cs.jpeg" className="absolute inset-0 w-[110%] h-full object-cover -translate-x-[5%] group-hover:translate-x-0 transition-transform duration-700" alt="Hubungi CS" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Hubungi CS</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Tanya Stok & Harga</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Lokasi */}
          <button
            onClick={() => navigate("/visit")}
            className="relative w-full h-48 md:h-64 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border rounded-3xl"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/toko.jpeg" className="absolute inset-0 w-[110%] h-full object-cover -translate-x-[5%] group-hover:translate-x-0 transition-transform duration-700" alt="Lokasi Toko" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Lokasi Toko</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Kunjungi Kami</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-auto relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] md:text-[11px] text-primary-foreground/60 uppercase tracking-widest font-sans">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt={settings.shopName} className="h-6 md:h-8 object-contain brightness-0 invert opacity-90" />
            <span className="hidden md:inline">| Pusat grosir rajut premium Bandung</span>
          </div>
          <span>© {new Date().getFullYear()} {settings.shopName}. All rights reserved.</span>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={updateQty}
          onRemoveItem={removeItem}
        />
      )}
    </div>
  );
}
