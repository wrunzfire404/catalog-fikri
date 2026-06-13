import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, MessageCircle, MapPin, Sparkles, ArrowRight } from "lucide-react";
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
      {/* Compact Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-border/60">
        <div className="flex items-center justify-center px-4 py-2">
          <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-8 object-contain" />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Banner — small, clean */}
        <section className="relative bg-primary text-white">
          <div className="relative aspect-[3/2] sm:aspect-[21/9] overflow-hidden">
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

            {/* Overlay text */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold backdrop-blur-sm mb-2">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {settings.tagline}
                </span>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight px-2">
                  Rajut Premium,<br className="sm:hidden" /> Harga Grosir.
                </h1>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-2 sm:bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
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

        {/* 3 Menu — compact cards, fit full viewport on mobile */}
        <section className="flex-1 flex items-center bg-background">
          <div className="w-full max-w-5xl mx-auto px-4 py-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {/* Katalog */}
              <button
                onClick={() => navigate("/stock")}
                className="card-lift group flex flex-col items-center text-center p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl bg-white shadow-card border border-border/20"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition">
                  <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-[13px] sm:text-base md:text-lg font-bold font-serif text-foreground mb-1">Katalog</h3>
                <p className="text-[10px] sm:text-[12px] md:text-sm text-muted-foreground leading-snug hidden sm:block">
                  Lihat koleksi, pilih varian, checkout via WA
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 sm:mt-2 text-[11px] sm:text-[12px] font-semibold text-primary">
                  Lihat <ArrowRight className="w-3 h-3 hidden sm:block" />
                </span>
              </button>

              {/* CS */}
              <button
                onClick={() => navigate("/contact")}
                className="card-lift group flex flex-col items-center text-center p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl bg-white shadow-card border border-border/20"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition">
                  <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-[13px] sm:text-base md:text-lg font-bold font-serif text-foreground mb-1">Hubungi CS</h3>
                <p className="text-[10px] sm:text-[12px] md:text-sm text-muted-foreground leading-snug hidden sm:block">
                  Info stok, harga grosir, pengiriman
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 sm:mt-2 text-[11px] sm:text-[12px] font-semibold text-primary">
                  Chat <ArrowRight className="w-3 h-3 hidden sm:block" />
                </span>
              </button>

              {/* Lokasi */}
              <button
                onClick={() => navigate("/visit")}
                className="card-lift group flex flex-col items-center text-center p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl bg-white shadow-card border border-border/20"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition">
                  <MapPin className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-[13px] sm:text-base md:text-lg font-bold font-serif text-foreground mb-1">Lokasi</h3>
                <p className="text-[10px] sm:text-[12px] md:text-sm text-muted-foreground leading-snug hidden sm:block">
                  Datang langsung ke toko di Bandung
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 sm:mt-2 text-[11px] sm:text-[12px] font-semibold text-primary">
                  Peta <ArrowRight className="w-3 h-3 hidden sm:block" />
                </span>
              </button>
            </div>

            {/* Footer compact — just copyright */}
            <p className="text-center text-[10px] text-muted-foreground/40 mt-6 pb-2">
              © {new Date().getFullYear()} {settings.shopName}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
