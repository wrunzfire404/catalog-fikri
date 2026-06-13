import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, MessageCircle, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { waCsLink } from "@/lib/products";
import { useStore } from "@/context/StoreContext";

const BANNERS = [
  { src: "/images/banner1.jpeg", alt: "Banner 1" },
  { src: "/images/banner2.jpeg", alt: "Banner 2" },
  { src: "/images/banner3.jpeg", alt: "Banner 3" },
];

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const [bannerIndex, setBannerIndex] = useState(0);

  // Auto-slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-10 object-contain" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Slideshow */}
        <section className="relative text-white bg-primary flex-1 md:flex-none">
          <div className="relative aspect-[4/3] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] overflow-hidden flex-1 md:flex-none">
            {BANNERS.map((banner, i) => (
              <img
                key={banner.src}
                src={banner.src}
                alt={banner.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  i === bannerIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
            <div className="text-center max-w-lg pointer-events-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/15 px-4 py-1.5 text-[11px] font-semibold backdrop-blur-sm mb-3">
                <Sparkles className="w-3 h-3" />
                {settings.tagline}
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif leading-[1.08]">
                Rajut Premium, Harga Grosir.
              </h1>
              <p className="text-white/75 text-sm sm:text-[15px] leading-relaxed mt-3 max-w-sm mx-auto hidden sm:block">
                Koleksi terkini dari pusat grosir Bandung — kualitas terjamin, siap kirim ke seluruh Indonesia.
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-10">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === bannerIndex ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Trust Bar */}
        <div className="bg-white border-b border-border/60 shrink-0">
          <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap items-center justify-center gap-x-6 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              Kualitas Terjamin
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              Harga Grosir Langsung
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              Kirim Seluruh Indonesia
            </span>
          </div>
        </div>

        {/* Menu Grid — kalau mobile, stretch ke full height */}
        <div className="flex-1 md:flex-none flex items-center justify-center bg-background">
          <div className="w-full max-w-5xl px-4 py-6 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7">
            {/* Cek Katalog */}
            <button
              onClick={() => navigate("/stock")}
              className="card-lift group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-white shadow-card border border-border/20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] bg-primary/[0.07] flex items-center justify-center mb-6 group-hover:bg-primary/[0.12] group-hover:scale-105 transition-all duration-300">
                <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2.5">Cek Katalog</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Lihat koleksi rajut premium, pilih varian, langsung checkout via WhatsApp.
              </p>
              <span className="inline-flex items-center gap-1 mt-5 text-[13px] font-semibold text-primary group-hover:gap-2 transition-all">
                Lihat Katalog <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Hubungi CS */}
            <button
              onClick={() => navigate("/contact")}
              className="card-lift group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-white shadow-card border border-border/20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] bg-primary/[0.07] flex items-center justify-center mb-6 group-hover:bg-primary/[0.12] group-hover:scale-105 transition-all duration-300">
                <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2.5">Hubungi CS</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Info stok, harga grosir, pengiriman — tim kami siap bantu via WhatsApp.
              </p>
              <span className="inline-flex items-center gap-1 mt-5 text-[13px] font-semibold text-primary group-hover:gap-2 transition-all">
                Hubungi Kami <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Lokasi Toko */}
            <button
              onClick={() => navigate("/visit")}
              className="card-lift group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-white shadow-card border border-border/20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] bg-primary/[0.07] flex items-center justify-center mb-6 group-hover:bg-primary/[0.12] group-hover:scale-105 transition-all duration-300">
                <MapPin className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2.5">Lokasi Toko</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Datang langsung ke toko kami di Bandung. Lihat lokasi di Google Maps.
              </p>
              <span className="inline-flex items-center gap-1 mt-5 text-[13px] font-semibold text-primary group-hover:gap-2 transition-all">
                Lihat Peta <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 bg-white py-8 md:py-12 shrink-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-8 mx-auto md:mx-0 object-contain opacity-80" />
              <p className="font-serif text-xl font-bold text-primary">{settings.shopName}</p>
              <p className="text-muted-foreground text-sm">{settings.tagline}</p>
            </div>
            <div className="flex items-center gap-6 text-[13px]">
              <button onClick={() => navigate("/stock")} className="text-muted-foreground hover:text-primary transition">Katalog</button>
              <button onClick={() => navigate("/contact")} className="text-muted-foreground hover:text-primary transition">Kontak</button>
              <button onClick={() => navigate("/visit")} className="text-muted-foreground hover:text-primary transition">Lokasi</button>
            </div>
          </div>
          <p className="text-center text-[12px] text-muted-foreground/50 mt-8">
            © {new Date().getFullYear()} {settings.shopName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
