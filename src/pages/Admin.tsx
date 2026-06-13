import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone, Package, Tag, Truck } from "lucide-react";
import { SHOP_NAME, WA_NUMBER, waCsLink } from "@/lib/products";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <img src="/images/pgrb-logo.png" alt={SHOP_NAME} className="h-9 object-contain" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Butuh Bantuan?</p>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">Hubungi Admin</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            Tim admin kami siap membantu kebutuhan grosir, info stok terbaru, dan pemesanan dalam jumlah besar.
          </p>
        </div>

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
            <p className="text-[12px] text-muted-foreground">Harga khusus reseller</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card border border-border/40 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-[14px] mb-1">Pengiriman</h3>
            <p className="text-[12px] text-muted-foreground">Kirim ke seluruh Indonesia</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-card border border-border/40 text-center space-y-5">
          <div className="flex items-center justify-center gap-2 text-foreground">
            <Phone className="w-5 h-5 text-primary" />
            <span className="font-semibold text-[15px]">+{WA_NUMBER}</span>
          </div>
          <a
            href={waCsLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#20bd5a] active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Chat Admin via WhatsApp
          </a>
          <p className="text-[12px] text-muted-foreground">Respon cepat di jam operasional (08.00 - 17.00 WIB)</p>
        </div>
      </main>
    </div>
  );
}
