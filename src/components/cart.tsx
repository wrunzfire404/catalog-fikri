import { useState } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import {
  formatRupiah,
  waCheckoutLink,
  type CartItem,
  type CustomerInfo,
} from "@/lib/products";
import { PlaceholderArt, EMPTY_CUSTOMER } from "./catalog";

export function CartDrawer({
  cart,
  isCheckout,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onGoCheckout,
  onBackToCart,
  onOrdered,
}: {
  cart: CartItem[];
  isCheckout: boolean;
  onClose: () => void;
  onUpdateQty: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
  onGoCheckout: () => void;
  onBackToCart: () => void;
  onOrdered: () => void;
}) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="flex w-full sm:w-[420px] h-full flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-white z-10">
          <h2 className="text-lg font-bold font-serif text-foreground flex items-center gap-2">
            {isCheckout ? (
              <>
                <button onClick={onBackToCart} className="grid h-8 w-8 -ml-2 place-items-center rounded-full hover:bg-secondary transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                Data Pengiriman
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 text-primary" />
                Keranjang Belanja
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground transition hover:bg-neutral-200 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isCheckout ? (
          <CheckoutForm cart={cart} totalPrice={totalPrice} totalItems={totalItems} onOrdered={onOrdered} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 bg-background">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">Keranjang belanja Anda masih kosong.<br />Yuk, mulai belanja!</p>
                  <button onClick={onClose} className="mt-2 text-primary font-semibold text-sm hover:underline">Lihat Produk</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.product.slug}-${item.variant?.slug}-${index}`} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-border/50">
                      <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-secondary">
                        {item.variant?.image || item.product.image ? (
                          <img src={item.variant?.image || item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <PlaceholderArt name={item.product.name} />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-[14px] font-semibold text-foreground line-clamp-1">{item.product.name}</h4>
                            {item.variant?.color && item.variant.color !== item.product.name && (
                              <p className="text-[12px] text-muted-foreground mt-0.5">Warna: {item.variant.color}</p>
                            )}
                          </div>
                          <button onClick={() => onRemoveItem(index)} className="text-muted-foreground hover:text-destructive p-1 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <p className="text-[14px] font-bold text-primary">{formatRupiah(item.product.price)}</p>
                          <div className="flex items-center rounded-lg border border-border p-0.5 bg-secondary/30">
                            <button onClick={() => onUpdateQty(index, item.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm transition">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-semibold text-[13px]">{item.quantity}</span>
                            <button onClick={() => onUpdateQty(index, item.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm transition">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border bg-white p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Item</span>
                    <span>{totalItems} Item</span>
                  </div>
                  <div className="flex justify-between text-[17px] font-bold text-foreground">
                    <span>Total Pesanan</span>
                    <span className="text-primary">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
                <button
                  onClick={onGoCheckout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
                >
                  Lanjut ke Pengiriman
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({
  cart,
  totalPrice,
  totalItems,
  onOrdered,
}: {
  cart: CartItem[];
  totalPrice: number;
  totalItems: number;
  onOrdered: () => void;
}) {
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [submitted, setSubmitted] = useState(false);

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
    onOrdered();
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
        <h3 className="text-xl font-bold font-serif text-foreground">Pesanan Terkirim!</h3>
        <p className="text-muted-foreground text-sm">Orderan kamu sudah dikirim ke WhatsApp PGRB. Tim kami akan segera merespon.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 p-5 space-y-5">
        <div className="rounded-xl bg-secondary/40 p-4 space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-muted-foreground">Total Item</span><span className="font-semibold">{totalItems}</span></div>
          <div className="flex justify-between border-t border-border/50 pt-2"><span className="font-semibold">Total</span><span className="font-bold text-primary">{formatRupiah(totalPrice)}</span></div>
        </div>

        <InputField label="Nama Lengkap" required error={errors.nama} placeholder="Masukkan nama penerima" value={customer.nama} onChange={set("nama")} />
        <InputField label="Provinsi" required error={errors.provinsi} placeholder="Contoh: Jawa Barat" value={customer.provinsi} onChange={set("provinsi")} />
        <InputField label="Kabupaten / Kota" required error={errors.kabupaten} placeholder="Contoh: Bandung" value={customer.kabupaten} onChange={set("kabupaten")} />
        <InputField label="Kecamatan" required error={errors.kecamatan} placeholder="Contoh: Babakan Ciparay" value={customer.kecamatan} onChange={set("kecamatan")} />
        <InputField label="No WhatsApp" required error={errors.noWa} placeholder="Contoh: 08123456789" value={customer.noWa} onChange={set("noWa")} />

        <div>
          <label className="text-[13px] font-semibold text-foreground mb-1.5 block">Catatan (opsional)</label>
          <textarea
            value={customer.catatan}
            onChange={(e) => {
              setCustomer((prev) => ({ ...prev, catatan: e.target.value }));
            }}
            rows={2}
            placeholder="Warna tambahan, request khusus, dll..."
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
          />
        </div>
      </div>

      <div className="p-4 border-t border-border bg-white">
        <button
          onClick={handleOrder}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#20bd5a] active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
          </svg>
          Order via WhatsApp
        </button>
      </div>
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
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
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
