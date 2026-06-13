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

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
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
        <section className="relative overflow-hidden text-white">
          {/* Banner images */}
          <div className="absolute inset-0">
            {BANNERS.map((banner, i) => (
              <img
                key={banner.src}
                src={banner.src}
                alt={banner.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  i === bannerIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 md:py-40 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/15 px-5 py-2 text-[12px] font-semibold backdrop-blur-md mb-8 animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5" />
              {settings.tagline}
            </span>

            <h1
              className="text-4xl md:text-7xl lg:text-8xl font-bold font-serif leading-[1.02] mb-7 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Rajut Premium,
              <br />
              Harga Grosir.
            </h1>

            <p
              className="text-white/80 text-[15px] md:text-lg leading-relaxed mb-10 max-w-lg mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Koleksi rajut terkini langsung dari pusat grosir Bandung. Kualitas terjamin, harga langsung pabrik, siap kirim ke seluruh Indonesia.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href={waCsLink(settings)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition hover:bg-[#20bd5a] btn-press w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Chat CS Sekarang
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === bannerIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <div className="bg-white border-b border-border/60">
          <div className="mx-auto max-w-5xl px-4 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12px] md:text-[13px] text-muted-foreground">
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

        {/* Pilihan Menu */}
        <section className="flex-1 -mt-8 relative z-10 mx-auto max-w-5xl px-4 pb-24 w-full">
          <div className="text-center mb-10 animate-fade-in-up">
            <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold mb-3">Jelajahi</p>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Mau Ngapain Hari Ini?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
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
        </section>
      </main>

      <footer className="border-t border-border/60 bg-white py-12">
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
