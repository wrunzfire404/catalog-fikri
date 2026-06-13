import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone, MapPin, Clock, Package, Tag, Truck } from "lucide-react";
import { waCsLink } from "@/lib/products";
import { useStore } from "@/context/StoreContext";

export default function Contact() {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-9 object-contain" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Butuh Bantuan?</p>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">Hubungi Admin / CS</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            Tim kami siap membantu kebutuhan grosir, info stok terbaru, pemesanan dalam jumlah besar, dan pertanyaan seputar produk.
          </p>
        </div>

        {/* Layanan */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white p-5 shadow-card border border-border/40 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-[14px] mb-1">Info Stok</h3>
            <p className="text-[12px] text-muted-foreground">Ketersediaan & varian terbaru</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card border border-border/40 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-[14px] mb-1">Harga Grosir</h3>
            <p className="text-[12px] text-muted-foreground">Harga khusus reseller & partai besar</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card border border-border/40 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-[14px] mb-1">Pengiriman</h3>
            <p className="text-[12px] text-muted-foreground">Kirim ke seluruh Indonesia</p>
          </div>
        </div>

        {/* Kartu Kontak & Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Info Toko */}
          <div className="rounded-2xl bg-white p-6 shadow-card border border-border/40 space-y-5">
            <h2 className="font-bold font-serif text-foreground text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Info Toko
            </h2>
            <div className="space-y-4 text-[14px]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Alamat</p>
                  <p className="text-muted-foreground">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Jam Operasional</p>
                  <p className="text-muted-foreground">Senin - Sabtu: 08.00 - 17.00 WIB</p>
                  <p className="text-muted-foreground">Minggu: Libur</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <p className="text-muted-foreground">+62 {settings.waNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="rounded-2xl bg-white p-6 shadow-card border border-border/40 space-y-5 text-center md:text-left">
            <h2 className="font-bold font-serif text-foreground text-lg flex items-center justify-center md:justify-start gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Langsung Chat
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Tim admin kami siap merespon secepat mungkin di jam operasional. Silakan chat via WhatsApp untuk:
            </p>
            <ul className="text-[14px] text-muted-foreground space-y-2 list-disc list-inside text-left">
              <li>Pertanyaan ketersediaan stok</li>
              <li>Harga grosir & partai besar</li>
              <li>Info pengiriman & ongkos kirim</li>
              <li>Request varian atau produk custom</li>
            </ul>
            <a
              href={waCsLink(settings)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] px-5 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#20bd5a] active:scale-[0.98] mt-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat via WhatsApp
            </a>
            <p className="text-[12px] text-muted-foreground">
              Respon cepat di jam operasional (08.00 - 17.00 WIB)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
