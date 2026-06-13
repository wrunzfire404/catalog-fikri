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
    <div className="h-[100dvh] flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header — ultra compact */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-border/60 shrink-0">
        <div className="flex items-center justify-center px-4 py-2">
          <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-7 object-contain" />
        </div>
      </header>

      {/* Hero Banner — compact */}
      <section className="relative bg-primary text-white shrink-0">
        <div className="relative aspect-[2/1] sm:aspect-[3/1] overflow-hidden">
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/10 px-3 py-1 text-[10px] font-semibold backdrop-blur-sm mb-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                {settings.tagline}
              </span>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight">
                Rajut Premium, Harga Grosir.
              </h1>
            </div>
          </div>
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5">
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

      {/* Menu — tight spacing, stretch to fill remaining space */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 space-y-2 max-w-lg mx-auto w-full">

        {/* Katalog */}
        <button
          onClick={() => navigate("/stock")}
          className="w-full flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card border border-border/20 card-lift text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/[0.07] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold font-serif text-foreground">Cek Katalog</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Lihat koleksi rajut, pilih varian, checkout via WA</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0" />
        </button>

        {/* Hubungi CS */}
        <button
          onClick={() => navigate("/contact")}
          className="w-full flex items-center gap-3 rounded-xl bg-white p-3 shadow-card border border-border/20 card-lift text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/[0.07] flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold font-serif text-foreground">Hubungi CS</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Info stok, harga grosir, pengiriman</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0" />
        </button>

        {/* Lokasi */}
        <button
          onClick={() => navigate("/visit")}
          className="w-full flex items-center gap-3 rounded-xl bg-white p-3 shadow-card border border-border/20 card-lift text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/[0.07] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold font-serif text-foreground">Lokasi Toko</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Datang langsung ke toko kami di Bandung</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0" />
        </button>

      </div>

      {/* Copyright — tucked at bottom */}
      <p className="text-center text-[10px] text-muted-foreground/30 py-2 shrink-0">
        © {new Date().getFullYear()} {settings.shopName}
      </p>
    </div>
  );
}
