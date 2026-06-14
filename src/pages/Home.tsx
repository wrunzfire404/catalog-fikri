import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, MessageCircle, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const BANNERS = [
  { src: "/images/banner1.jpeg", alt: "Banner PGRB 1" },
  { src: "/images/banner2.jpeg", alt: "Banner PGRB 2" },
  { src: "/images/banner3.jpeg", alt: "Banner PGRB 3" },
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
      <header className="bg-white/80 backdrop-blur-xl border-b border-border/60">
        <div className="flex items-center justify-center px-4 py-3">
          <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-9 object-contain" />
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
            className="relative w-full h-32 md:h-48 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/banner1.jpeg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Katalog" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Cek Katalog</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Koleksi Terbaru</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Hubungi CS */}
          <button
            onClick={() => navigate("/contact")}
            className="relative w-full h-32 md:h-48 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/banner2.jpeg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Hubungi CS" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Hubungi CS</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Tanya Stok & Harga</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Lokasi */}
          <button
            onClick={() => navigate("/visit")}
            className="relative w-full h-32 md:h-48 overflow-hidden group transition-all duration-500 hover:shadow-xl text-left border border-border"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img src="/images/banner3.jpeg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Lokasi Toko" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-20">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white mb-1 tracking-wide">Lokasi Toko</h3>
              <p className="text-xs md:text-sm text-white/90 font-medium uppercase tracking-widest">Kunjungi Kami</p>
            </div>
            <ChevronRight className="absolute bottom-6 right-6 w-6 h-6 text-white z-20 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-white py-6 md:py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-7 object-contain opacity-60" />
            <span className="text-[12px] text-muted-foreground">© {new Date().getFullYear()} {settings.shopName}</span>
          </div>
          <div className="flex items-center gap-5 text-[12px] md:text-[13px]">
            <button onClick={() => navigate("/contact")} className="text-muted-foreground hover:text-primary transition">Kontak</button>
            <button onClick={() => navigate("/visit")} className="text-muted-foreground hover:text-primary transition">Lokasi</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
