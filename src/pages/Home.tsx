import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, MessageCircle, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const BANNERS = [
  { src: "/images/banner1.jpeg", alt: "Banner PGRB 1" },
  { src: "/images/banner2.jpeg", alt: "Banner PGRB 2" },
  { src: "/images/banner3.jpeg", alt: "Banner PGRB 3" },
  { src: "/images/banner4.png", alt: "Banner PGRB 4" },
];

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const [bannerIndex, setBannerIndex] = useState(0);

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
          <img src="/images/logo.png" alt={settings.shopName} className="h-10 object-contain mix-blend-multiply" />
          <nav className="hidden md:flex items-center gap-8 text-[12px] font-semibold tracking-widest uppercase text-foreground">
            <button onClick={() => navigate("/stock")} className="hover:text-primary transition-colors">Katalog</button>
            <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">Kontak</button>
            <button onClick={() => navigate("/visit")} className="hover:text-primary transition-colors">Lokasi</button>
          </nav>
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
            className="relative w-full h-32 md:h-48 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border rounded-3xl"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/katalog.jpeg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Katalog" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Cek Katalog</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Koleksi Terbaru</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Hubungi CS */}
          <button
            onClick={() => navigate("/contact")}
            className="relative w-full h-32 md:h-48 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border rounded-3xl"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/cs.jpeg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Hubungi CS" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Hubungi CS</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Tanya Stok & Harga</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Lokasi */}
          <button
            onClick={() => navigate("/visit")}
            className="relative w-full h-32 md:h-48 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border rounded-3xl"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/toko.jpeg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Lokasi Toko" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Lokasi Toko</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Kunjungi Kami</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="flex flex-col gap-5 max-w-sm">
            {/* Trik invert + brightness-0 membuat logo jadi solid putih */}
            <img src="/images/logo.png" alt={settings.shopName} className="h-10 object-contain brightness-0 invert opacity-90" />
            <p className="text-[13px] text-primary-foreground/70 leading-relaxed font-sans">
              Pusat grosir rajut premium di Bandung. Kami menyediakan koleksi rajut berkualitas dengan harga terbaik untuk kebutuhan retail maupun partai besar.
            </p>
          </div>
          <div className="flex gap-12 md:gap-20 text-[12px] uppercase tracking-widest font-semibold font-sans">
            <div className="flex flex-col gap-4">
              <span className="text-primary-foreground/40 mb-1">Menu Utama</span>
              <button onClick={() => navigate("/")} className="hover:text-white text-primary-foreground/80 transition text-left">Beranda</button>
              <button onClick={() => navigate("/stock")} className="hover:text-white text-primary-foreground/80 transition text-left">Katalog Belanja</button>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-primary-foreground/40 mb-1">Layanan</span>
              <button onClick={() => navigate("/contact")} className="hover:text-white text-primary-foreground/80 transition text-left">Hubungi CS</button>
              <button onClick={() => navigate("/visit")} className="hover:text-white text-primary-foreground/80 transition text-left">Lokasi Toko</button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-primary-foreground/40 uppercase tracking-widest font-sans">
          <span>© {new Date().getFullYear()} {settings.shopName}. All rights reserved.</span>
          <span className="mt-3 md:mt-0">Designed for Fashion</span>
        </div>
      </footer>
    </div>
  );
}
