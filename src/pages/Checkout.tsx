import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  formatRupiah,
  waCheckoutLink,
  SHOP_NAME,
  type CustomerInfo,
} from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { PlaceholderArt } from "@/components/catalog";

const EMPTY_CUSTOMER: CustomerInfo = {
  nama: "",
  provinsi: "",
  kabupaten: "",
  kecamatan: "",
  noWa: "",
  catatan: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalItems, totalPrice, updateQty, removeItem, clearCart } = useCart();
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Redirect if cart empty
  if (cart.length === 0 && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground opacity-40" />
          <h2 className="text-xl font-bold font-serif text-foreground">Keranjang Kosong</h2>
          <p className="text-muted-foreground text-sm">Yuk, pilih produk dulu sebelum checkout.</p>
          <Link
            to="/stock"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90"
          >
            Lihat Ready Stock
          </Link>
        </div>
      </div>
    );
  }

  const set = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.nama.trim()) errs.nama = "Nama wajib diisi";
    if (!customer.provinsi.trim()) errs.provinsi = "Provinsi wajib diisi";
    if (!customer.kabupaten.trim()) errs.kabupaten = "Kabupaten wajib diisi";
    if (!customer.kecamatan.trim()) errs.kecamatan = "Kecamatan wajib diisi";
    if (!customer.noWa.trim()) errs.noWa = "No WA wajib diisi";
    else if (!/^[0-9]+$/.test(customer.noWa.trim())) errs.noWa = "No WA harus angka";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrder = () => {
    if (!validate()) return;
    window.open(waCheckoutLink(cart, customer), "_blank", "noreferrer");
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-5 max-w-md">
          <CheckCircle2 className="w-24 h-24 mx-auto text-green-500" />
          <h2 className="text-2xl font-bold font-serif text-foreground">Pesanan Terkirim!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Orderan kamu sudah dikirim ke WhatsApp PGRB. Tim kami akan segera merespon dan mengkonfirmasi ketersediaan stok & ongkir.
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <Link
              to="/stock"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90"
            >
              Lanjut Belanja
            </Link>
            <Link
              to="/"
              className="text-[14px] text-muted-foreground hover:text-primary transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-foreground hover:text-primary transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <img src="/images/pgrb-logo.png" alt={SHOP_NAME} className="h-9 object-contain" />
          </button>
          <h1 className="text-lg font-bold font-serif text-foreground hidden sm:block">Checkout</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-14">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground tracking-tight mb-8 sm:hidden">
          Checkout
        </h1>

        {/* 2 Kolom di Desktop — Order Summary kiri, Form kanan */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Kolom Kiri: Ringkasan Pesanan */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-card border border-border/40 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-border bg-secondary/30">
                <h2 className="font-bold font-serif text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Ringkasan Pesanan
                </h2>
                <p className="text-[12px] text-muted-foreground mt-1">{totalItems} item</p>
              </div>

              <div className="divide-y divide-border/50 max-h-[50vh] overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.product.slug}-${item.variant?.slug}-${index}`} className="flex gap-4 p-4">
                    <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-secondary">
                      {item.variant?.image || item.product.image ? (
                        <img
                          src={item.variant?.image || item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PlaceholderArt name={item.product.name} />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground line-clamp-1">
                          {item.product.code}. {item.product.name}
                        </p>
                        {item.variant?.color && item.variant.color !== item.product.name && (
                          <p className="text-[11px] text-muted-foreground">Warna: {item.variant.color}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold text-primary">
                          {formatRupiah(item.product.price)}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(index, item.quantity - 1)}
                            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-[13px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(index, item.quantity + 1)}
                            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeItem(index)}
                            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:text-destructive transition ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-border bg-secondary/20 space-y-2">
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted-foreground">Subtotal ({totalItems} item)</span>
                  <span className="font-semibold">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[17px] font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-4 rounded-xl bg-white border border-border/40 p-4 flex items-center gap-3 text-[12px] text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>Pesanan kamu akan dikonfirmasi oleh admin PGRB via WhatsApp. Pembayaran bisa COD atau transfer setelah konfirmasi.</span>
            </div>
          </div>

          {/* Kolom Kanan: Form Data Customer */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white shadow-card border border-border/40 p-6 md:p-8">
              <h2 className="font-bold font-serif text-foreground text-lg mb-1">Data Pengiriman</h2>
              <p className="text-[13px] text-muted-foreground mb-6">Lengkapi data di bawah, lalu klik Order via WhatsApp.</p>

              <div className="space-y-5">
                <InputField
                  label="Nama Lengkap"
                  required
                  error={errors.nama}
                  placeholder="Masukkan nama penerima"
                  value={customer.nama}
                  onChange={set("nama")}
                />
                <InputField
                  label="Provinsi"
                  required
                  error={errors.provinsi}
                  placeholder="Contoh: Jawa Barat"
                  value={customer.provinsi}
                  onChange={set("provinsi")}
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField
                    label="Kabupaten / Kota"
                    required
                    error={errors.kabupaten}
                    placeholder="Contoh: Bandung"
                    value={customer.kabupaten}
                    onChange={set("kabupaten")}
                  />
                  <InputField
                    label="Kecamatan"
                    required
                    error={errors.kecamatan}
                    placeholder="Contoh: Babakan Ciparay"
                    value={customer.kecamatan}
                    onChange={set("kecamatan")}
                  />
                </div>
                <InputField
                  label="No WhatsApp"
                  required
                  error={errors.noWa}
                  placeholder="Contoh: 08123456789"
                  value={customer.noWa}
                  onChange={set("noWa")}
                />

                <div>
                  <label className="text-[13px] font-semibold text-foreground mb-1.5 block">
                    Catatan <span className="text-muted-foreground font-normal">(opsional)</span>
                  </label>
                  <textarea
                    value={customer.catatan}
                    onChange={(e) => setCustomer((prev) => ({ ...prev, catatan: e.target.value }))}
                    rows={3}
                    placeholder="Warna tambahan, request khusus, catatan pengiriman, dll..."
                    className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleOrder}
                className="w-full mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-4 text-[16px] font-bold text-white shadow-lg transition hover:bg-[#20bd5a] active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
                Order via WhatsApp — {formatRupiah(totalPrice)}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InputField({
  label,
  required,
  error,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  error?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-foreground mb-1.5 block">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] outline-none transition focus:ring-2 focus:ring-primary/10 ${
          error ? "border-destructive focus:border-destructive/50" : "border-border focus:border-primary"
        }`}
      />
      {error && <p className="text-[12px] text-destructive mt-1">{error}</p>}
    </div>
  );
}
