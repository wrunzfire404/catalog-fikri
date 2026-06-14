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
        <div className="relative aspect-[16/9] md:aspect-[3/1] lg:aspect-[4/1] max-h-[35vh] lg:max-h-[40vh] overflow-hidden">
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
      <main className="flex-1 flex flex-col justify-center px-4 py-8 md:py-12 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {/* Katalog */}
          <button
            onClick={() => navigate("/stock")}
            className="w-full flex md:flex-col items-center gap-4 md:gap-5 rounded-2xl bg-white p-4 md:p-8 shadow-card border border-border/20 card-lift text-left md:text-center"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/[0.07] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] md:text-lg font-bold font-serif text-foreground">Cek Katalog</h3>
              <p className="text-[12px] md:text-[14px] text-muted-foreground mt-0.5 md:mt-2 line-clamp-2 md:line-clamp-none">Lihat koleksi rajut, pilih varian, checkout via WhatsApp</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/30 shrink-0 md:hidden" />
          </button>

          {/* Hubungi CS */}
          <button
            onClick={() => navigate("/contact")}
            className="w-full flex md:flex-col items-center gap-4 md:gap-5 rounded-2xl bg-white p-4 md:p-8 shadow-card border border-border/20 card-lift text-left md:text-center"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/[0.07] flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] md:text-lg font-bold font-serif text-foreground">Hubungi CS</h3>
              <p className="text-[12px] md:text-[14px] text-muted-foreground mt-0.5 md:mt-2 line-clamp-2 md:line-clamp-none">Info stok, harga grosir, pengiriman — tim kami siap bantu</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/30 shrink-0 md:hidden" />
          </button>

          {/* Lokasi */}
          <button
            onClick={() => navigate("/visit")}
            className="w-full flex md:flex-col items-center gap-4 md:gap-5 rounded-2xl bg-white p-4 md:p-8 shadow-card border border-border/20 card-lift text-left md:text-center"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/[0.07] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] md:text-lg font-bold font-serif text-foreground">Lokasi Toko</h3>
              <p className="text-[12px] md:text-[14px] text-muted-foreground mt-0.5 md:mt-2 line-clamp-2 md:line-clamp-none">Datang langsung ke toko kami di Bandung — lihat di Google Maps</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/30 shrink-0 md:hidden" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-white py-6 md:py-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
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
