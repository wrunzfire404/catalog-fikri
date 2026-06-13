import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle, Clock, Navigation } from "lucide-react";
import { waCsLink } from "@/lib/products";
import { useStore } from "@/context/StoreContext";

export default function Visit() {
  const { settings } = useStore();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-9 object-contain" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Kunjungi Kami</p>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">Lokasi Toko</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            Datang langsung ke toko kami di pusat grosir Bandung. Lihat dan pilih langsung koleksi rajut premium dengan harga grosir terbaik.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-6 shadow-card border border-border/40 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-[15px] mb-1">Alamat Toko</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-[15px] mb-1">Jam Operasional</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">Senin - Sabtu: 08.00 - 17.00 WIB<br />Minggu: Libur</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
              >
                <Navigation className="w-5 h-5" />
                Petunjuk Arah (Google Maps)
              </a>
              <a
                href={waCsLink(settings)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#20bd5a] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Customer Service
              </a>
            </div>
          </div>

          <a
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl overflow-hidden border border-border shadow-card min-h-[280px] md:min-h-0 group"
          >
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-background group-hover:from-secondary/80 transition p-6 text-center">
              <MapPin className="w-14 h-14 text-primary/40" />
              <span className="text-[15px] font-bold text-primary">Buka di Google Maps</span>
              <span className="text-[13px] text-muted-foreground">{settings.tagline}</span>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
