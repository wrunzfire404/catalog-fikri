import { useRef, useState } from "react";
import { Search, Filter, ArrowDownUp, ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import {
  formatRupiah,
  getProductGallery,
  products,
  SHOP_NAME,
  SHOP_TAGLINE,
  WA_NUMBER,
  waLink,
  type Product,
  type ProductVariant,
  type CartItem,
} from "@/lib/products";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product, variant: ProductVariant | null, quantity: number) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.product.slug === product.slug && item.variant?.slug === variant?.slug
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prev, { product, variant, quantity }];
    });
  };

  const updateCartItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].quantity = newQty;
      return newCart;
    });
  };

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0">
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 items-center justify-center">
              <img src="/images/pgrb-logo.png" alt="PGRB" className="h-10 object-contain" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground hover:bg-secondary rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        {/* Filters */}
        <div className="mb-8 rounded-xl bg-white p-4 shadow-sm border border-border/50">
          <div className="text-[13px] font-medium text-muted-foreground mb-3">Filter</div>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary transition">
              <Search className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary transition">
              <Filter className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary transition">
              <ArrowDownUp className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 font-serif text-foreground tracking-tight">Ready Stock</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const gallery = getProductGallery(product);
            const hasVariants = gallery.length > 1;

            return (
              <div
                key={product.slug}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:shadow-elegant border border-border/40"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary/50 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <PlaceholderArt name={product.name} />
                  )}
                  
                  {/* "Perbesar" Hover overlay */}
                  <div className="absolute inset-x-0 bottom-0 flex h-1/3 items-end justify-center bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-xs font-semibold text-white drop-shadow-md tracking-wide">Perbesar</span>
                  </div>
                </div>
                <div className="flex flex-col p-4 flex-1">
                  <p className="text-[13px] font-medium text-foreground mb-2 line-clamp-2 leading-snug">
                    {product.code}-{product.name.toUpperCase()}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-[15px] font-bold text-primary">
                        {formatRupiah(product.price)}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="mt-4 w-full rounded-lg border border-primary/20 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    {hasVariants ? "Pilih Varian" : "Beli Sekarang"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="mt-12 py-10 bg-white border-t border-border text-center text-sm text-muted-foreground">
        <p className="font-serif text-lg font-bold text-primary mb-2">{SHOP_NAME}</p>
        <p>{SHOP_TAGLINE}</p>
        <p className="mt-4 text-[12px] opacity-70">© {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.</p>
      </footer>

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
          onUpdateQty={updateCartItemQty}
          onRemoveItem={removeCartItem}
        />
      )}
      
      {/* Mobile Sticky Cart Button (if cart has items and not open) */}
      {cartItemsCount > 0 && !isCartOpen && (
         <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden z-20 animate-in slide-in-from-bottom-full">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-white shadow-lg"
            >
              <div className="flex items-center gap-3">
                 <ShoppingCart className="w-5 h-5" />
                 <span className="font-semibold text-[15px]">{cartItemsCount} Item</span>
              </div>
              <span className="font-bold text-[15px]">Lihat Keranjang</span>
            </button>
         </div>
      )}
    </div>
  );
}

function ProductModal({ product, onClose, onAddToCart }: { product: Product; onClose: () => void; onAddToCart: (variant: ProductVariant | null, qty: number) => void }) {
  const gallery = getProductGallery(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const activeVariant = gallery[activeIndex] ?? null;

  const scrollToIndex = (index: number) => {
    const container = carouselRef.current;
    if (!container) return;

    container.scrollTo({
      left: container.clientWidth * index,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    const container = carouselRef.current;
    if (!container) return;

    const nextIndex = Math.round(container.scrollLeft / Math.max(container.clientWidth, 1));
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full flex-col max-h-[90vh] sm:max-h-[85vh] max-w-md overflow-hidden rounded-t-[1.5rem] bg-white shadow-2xl animate-in slide-in-from-bottom-8 sm:rounded-[1.5rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex aspect-[4/5] sm:aspect-square snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-secondary"
          >
            {gallery.map((variant, index) => (
              <div key={`${product.slug}-${variant.slug}-${index}`} className="w-full shrink-0 snap-center relative">
                {variant.image ? (
                  <img
                    src={variant.image}
                    alt={`${product.name}${variant.color ? ` warna ${variant.color}` : ""}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderArt name={product.name} />
                )}
              </div>
            ))}
          </div>
          
          {/* Dots Indicator overlay */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
              {gallery.map((variant, index) => (
                <button
                  key={`${variant.slug}-dot`}
                  onClick={() => scrollToIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-6 bg-primary shadow-sm" : "w-1.5 bg-white/70 hover:bg-white"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto p-5">
          <div className="mb-4">
             <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Kode {product.code}
            </p>
            <h2 className="text-xl font-bold text-foreground font-serif leading-tight">{product.name}</h2>
            <p className="mt-2 text-2xl font-bold text-primary">{formatRupiah(product.price)}</p>
          </div>

          {gallery.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-foreground mb-3">
                Pilih Warna: <span className="text-muted-foreground font-normal ml-1">{activeVariant?.color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {gallery.map((variant, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={variant.slug}
                      onClick={() => scrollToIndex(index)}
                      className={`rounded-lg border px-4 py-2 text-[13px] font-medium transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                          : "border-border bg-white text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {variant.color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-6">
             <p className="text-sm font-semibold text-foreground mb-3">Atur Jumlah</p>
             <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-border p-1 bg-secondary/30">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="grid h-8 w-8 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm disabled:opacity-50 transition"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold text-[15px]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="grid h-8 w-8 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Stok Tersedia
                </div>
             </div>
          </div>

          <div className="mb-6 rounded-xl bg-secondary/50 p-4 border border-border/50">
            <h3 className="text-[13px] font-bold text-foreground mb-2 flex items-center gap-2">
               Detail Ukuran
            </h3>
            <ul className="text-[13px] text-muted-foreground space-y-1">
              <li>Lingkar Dada (LD): <span className="font-medium text-foreground">{product.ld} cm</span></li>
              <li>Panjang Baju (PJ): <span className="font-medium text-foreground">{product.pj} cm</span></li>
            </ul>
            {product.note && <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground border-t border-border/50 pt-3">{product.note}</p>}
          </div>
        </div>
        
        <div className="p-4 border-t border-border bg-white">
          <button
            onClick={() => onAddToCart(activeVariant, quantity)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" />
            Tambah ke Keranjang - {formatRupiah(product.price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onUpdateQty, onRemoveItem }: { cart: CartItem[]; onClose: () => void; onUpdateQty: (index: number, qty: number) => void; onRemoveItem: (index: number) => void }) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="flex w-full sm:w-[400px] h-full flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-white z-10">
          <h2 className="text-lg font-bold font-serif text-foreground flex items-center gap-2">
             <ShoppingCart className="w-5 h-5 text-primary" />
             Keranjang Belanja
          </h2>
          <button 
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground transition hover:bg-neutral-200 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-background">
          {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">Keranjang belanja Anda masih kosong.<br/>Yuk, mulai belanja!</p>
                <button onClick={onClose} className="mt-2 text-primary font-semibold text-sm hover:underline">
                  Lihat Produk
                </button>
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
                        <button 
                          onClick={() => onRemoveItem(index)}
                          className="text-muted-foreground hover:text-destructive p-1 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-2">
                         <p className="text-[14px] font-bold text-primary">{formatRupiah(item.product.price)}</p>
                         
                         <div className="flex items-center rounded-lg border border-border p-0.5 bg-secondary/30">
                            <button 
                              onClick={() => onUpdateQty(index, item.quantity - 1)}
                              className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-semibold text-[13px]">{item.quantity}</span>
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
             
             <a
              href={waLink(cart)}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#20bd5a] active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
              </svg>
              Checkout via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderArt({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-background">
      <span className="font-serif text-6xl font-bold text-primary/10">{initial}</span>
    </div>
  );
}
