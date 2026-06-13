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
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-border/60 shrink-0">
        <div className="flex items-center justify-center px-4 py-2.5">
          <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-8 sm:h-9 object-contain" />
        </div>
      </header>

      {/* Content area — fills remaining height */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Hero Banner — fixed portion */}
        <section className="relative bg-primary text-white md:w-[45%] shrink-0">
          <div className="relative h-full overflow-hidden">
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
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-serif leading-tight">
                  Rajut Premium,<br className="md:hidden" /> Harga Grosir.
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

        {/* Menu — fills the rest on desktop, scrollable on mobile if needed */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-4 md:py-6 space-y-2.5 md:space-y-3 overflow-y-auto">
          {/* Katalog */}
          <button
            onClick={() => navigate("/stock")}
            className="w-full flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl bg-white p-3 md:p-4 shadow-card border border-border/20 card-lift text-left"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/[0.07] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] md:text-base font-bold font-serif text-foreground">Cek Katalog</h3>
              <p className="text-[11px] md:text-[13px] text-muted-foreground mt-0.5">Lihat koleksi rajut, pilih varian, checkout via WhatsApp</p>
            </div>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/30 shrink-0" />
          </button>

          {/* Hubungi CS */}
          <button
            onClick={() => navigate("/contact")}
            className="w-full flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl bg-white p-3 md:p-4 shadow-card border border-border/20 card-lift text-left"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/[0.07] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] md:text-base font-bold font-serif text-foreground">Hubungi CS</h3>
              <p className="text-[11px] md:text-[13px] text-muted-foreground mt-0.5">Info stok, harga grosir, pengiriman — tim kami siap bantu</p>
            </div>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/30 shrink-0" />
          </button>

          {/* Lokasi */}
          <button
            onClick={() => navigate("/visit")}
            className="w-full flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl bg-white p-3 md:p-4 shadow-card border border-border/20 card-lift text-left"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/[0.07] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] md:text-base font-bold font-serif text-foreground">Lokasi Toko</h3>
              <p className="text-[11px] md:text-[13px] text-muted-foreground mt-0.5">Datang langsung ke toko kami di Bandung — lihat di Google Maps</p>
            </div>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/30 shrink-0" />
          </button>

          {/* Mini footer */}
          <p className="text-center text-[10px] md:text-[11px] text-muted-foreground/30 pt-2">
            © {new Date().getFullYear()} {settings.shopName}
          </p>
        </div>
      </div>
    </div>
  );
}
