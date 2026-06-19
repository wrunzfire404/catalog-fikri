import { Link } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { formatRupiah, type CartItem } from "@/lib/products";
import { PlaceholderArt } from "./catalog";

export function CartDrawer({
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
}: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
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
            <ShoppingCart className="w-5 h-5 text-primary" />
            Keranjang Belanja
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4 md:hidden" />
            <X className="w-4 h-4 hidden md:block" />
            <span className="hidden md:inline">Tutup</span>
            <span className="md:hidden">Kembali</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-background">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <ShoppingCart className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                Keranjang belanja Anda masih kosong.
                <br />
                Yuk, mulai belanja!
              </p>
              <button onClick={onClose} className="mt-2 text-primary font-semibold text-sm hover:underline">
                Lihat Produk
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.product.slug}-${item.variant?.slug}-${index}`}
                  className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-border/50"
                >
                  <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-secondary">
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
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-[14px] font-semibold text-foreground line-clamp-1">
                          {item.product.name}
                        </h4>
                        {item.variant?.color && item.variant.color !== item.product.name && (
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            Warna: {item.variant.color}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-muted-foreground hover:text-destructive p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <p className="text-[14px] font-bold text-primary">
                        {formatRupiah(item.product.price)}
                      </p>
                      <div className="flex items-center rounded-lg border border-border p-0.5 bg-secondary/30">
                        <button
                          onClick={() => onUpdateQty(index, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm disabled:opacity-50 transition"
                          disabled={item.quantity <= 2}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={2}
                          value={item.quantity}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v) && v >= 2) onUpdateQty(index, v);
                            else if (e.target.value === "") onUpdateQty(index, 2);
                          }}
                          className="w-10 text-center font-semibold text-[13px] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => onUpdateQty(index, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm transition"
                        >
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
            <Link
              to="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
            >
              Lanjut ke Pengiriman
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
