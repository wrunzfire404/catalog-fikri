import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { formatRupiah } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { PlaceholderArt } from "@/components/catalog";

export default function Cart() {
  const { cart, totalItems, totalPrice, updateQty, removeItem } = useCart();
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-0">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/stock" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-[15px]">Lanjut Belanja</span>
          </Link>
          <h1 className="text-lg font-bold font-serif text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Keranjang
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20 space-y-5">
            <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground opacity-30" />
            <h2 className="text-xl font-bold font-serif text-foreground">Keranjang Kosong</h2>
            <p className="text-muted-foreground text-sm">Yuk, pilih produk favoritmu dari katalog.</p>
            <Link
              to="/stock"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90"
            >
              Lihat Katalog
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item, index) => (
                <div
                  key={`${item.product.slug}-${item.variant?.slug}-${index}`}
                  className="flex gap-4 bg-white p-4 rounded-xl shadow-card border border-border/40"
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
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h4 className="text-[15px] font-semibold text-foreground">
                          {item.product.code}. {item.product.name}
                        </h4>
                        {item.variant?.color && item.variant.color !== item.product.name && (
                          <p className="text-[12px] text-muted-foreground mt-0.5">Warna: {item.variant.color}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-muted-foreground hover:text-destructive p-1 transition shrink-0"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[15px] font-bold text-primary">{formatRupiah(item.product.price)}</p>
                      <div className="flex items-center rounded-lg border border-border p-0.5 bg-secondary/30">
                        <button
                          onClick={() => updateQty(index, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v) && v >= 1) updateQty(index, v);
                            else if (e.target.value === "") updateQty(index, 1);
                          }}
                          className="w-12 text-center font-semibold text-[14px] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => updateQty(index, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white shadow-card border border-border/40 p-5 space-y-4 sticky bottom-4">
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[16px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
              >
                Lanjut ke Pengiriman
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
