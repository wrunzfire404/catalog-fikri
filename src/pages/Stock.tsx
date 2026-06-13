import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, ShoppingBag, ArrowLeft } from "lucide-react";
import { type Product } from "@/lib/products";
import { ProductCard, ProductModal } from "@/components/catalog";
import { CartDrawer } from "@/components/cart";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

export default function Stock() {
  const { cart, totalItems, addToCart, updateQty, removeItem } = useCart();
  const { products, settings } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    `${p.code} ${p.name}`.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-0">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-9 object-contain" />
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-foreground hover:bg-secondary rounded-full transition"
            aria-label="Keranjang"
          >
            <ShoppingCart className="w-6 h-6 text-primary" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Koleksi Terbaru</p>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">Katalog</h1>
            <p className="text-muted-foreground mt-2 text-[14px]">Pilih varian favoritmu, langsung checkout ke WhatsApp.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full rounded-full border border-border bg-white pl-10 pr-4 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Produk "{query}" tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} onSelect={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(variant, qty) => {
            addToCart(selectedProduct, variant, qty);
            setSelectedProduct(null);
            setIsCartOpen(true);
          }}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={updateQty}
          onRemoveItem={removeItem}
        />
      )}

      {totalItems > 0 && !isCartOpen && !selectedProduct && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden z-20 animate-in slide-in-from-bottom-full">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold text-[15px]">{totalItems} Item</span>
            </div>
            <span className="font-bold text-[15px]">Lihat Keranjang</span>
          </button>
        </div>
      )}
    </div>
  );
}
