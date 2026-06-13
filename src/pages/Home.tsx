import { useNavigate } from "react-router-dom";
import { ShoppingBag, UserCog, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { waCsLink } from "@/lib/products";
import { useStore } from "@/context/StoreContext";

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-10 object-contain" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#1f4530] text-white py-20 md:py-28">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-semibold backdrop-blur-sm mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {settings.tagline}
            </span>
            <h1 className="text-4xl md:text-7xl font-bold font-serif leading-[1.05] tracking-tight mb-5">
              Rajut Premium,<br />Harga Grosir.
            </h1>
            <p className="text-white/80 text-[15px] md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Koleksi rajut terkini langsung dari pusat grosir Bandung. Kualitas terjamin, harga langsung pabrik.
            </p>
            <a
              href={waCsLink(settings)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-bold text-white shadow-lg transition hover:bg-[#20bd5a] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              Chat Customer Service
            </a>
          </div>
        </section>

        {/* Pilihan Menu */}
        <section className="flex-1 -mt-10 relative z-10 mx-auto max-w-5xl px-4 pb-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {/* Cek Stock */}
            <button
              onClick={() => navigate("/stock")}
              className="group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-white shadow-card hover:shadow-elegant transition-all duration-300 border border-border/40 hover:-translate-y-1"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition">
                <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2">Cek Katalog</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Lihat koleksi rajut premium, pilih varian, langsung checkout via WhatsApp.
              </p>
            </button>

            {/* Hubungi Admin / CS */}
            <a
              href={waCsLink(settings)}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-white shadow-card hover:shadow-elegant transition-all duration-300 border border-border/40 hover:-translate-y-1"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition">
                <UserCog className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2">Hubungi Admin / CS</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Chat langsung via WhatsApp untuk info stok, harga grosir, dan pemesanan dalam jumlah besar.
              </p>
            </a>

            {/* Visit / Lokasi */}
            <button
              onClick={() => navigate("/visit")}
              className="group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-white shadow-card hover:shadow-elegant transition-all duration-300 border border-border/40 hover:-translate-y-1"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition">
                <MapPin className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2">Visit / Lokasi Toko</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Datang langsung ke toko kami di Bandung. Lihat lokasi di Google Maps.
              </p>
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center space-y-3">
          <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-8 mx-auto object-contain opacity-80" />
          <p className="font-serif text-lg font-bold text-primary">{settings.shopName}</p>
          <p className="text-muted-foreground text-sm">{settings.tagline}</p>
          <a href={settings.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-primary hover:underline">
            <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
          </a>
          <p className="text-[12px] text-muted-foreground/60 pt-2">© {new Date().getFullYear()} {settings.shopName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
