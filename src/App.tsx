import { useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  MapPin,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  formatRupiah,
  getProductGallery,
  products,
  SHOP_NAME,
  SHOP_TAGLINE,
  SHOP_ADDRESS,
  SHOP_MAPS,
  waCheckoutLink,
  waCsLink,
  type Product,
  type ProductVariant,
  type CartItem,
  type CustomerInfo,
} from "@/lib/products";

const EMPTY_CUSTOMER: CustomerInfo = {
  nama: "",
  provinsi: "",
  kabupaten: "",
  kecamatan: "",
  noWa: "",
  catatan: "",
};

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [query, setQuery] = useState("");

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

  const scrollToStock = () => {
    document.getElementById("ready-stock")?.scrollIntoView({ behavior: "smooth" });
  };

  const filtered = products.filter((p) =>
    `${p.code} ${p.name}`.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-0">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => {
          setIsCheckout(false);
          setIsCartOpen(true);
        }}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      <Hero onCekStock={scrollToStock} />

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <section id="ready-stock" className="scroll-mt-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Koleksi Terbaru</p>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">Ready Stock</h2>
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
        </section>
      </main>

      <StoreInfo />
      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(variant, qty) => {
            addToCart(selectedProduct, variant, qty);
            setSelectedProduct(null);
            setIsCheckout(false);
            setIsCartOpen(true);
          }}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          isCheckout={isCheckout}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={updateCartItemQty}
          onRemoveItem={removeCartItem}
          onGoCheckout={() => setIsCheckout(true)}
          onBackToCart={() => setIsCheckout(false)}
          onOrdered={() => {
            setCart([]);
            setIsCheckout(false);
            setIsCartOpen(false);
          }}
        />
      )}

      {cartItemsCount > 0 && !isCartOpen && !selectedProduct && (
        <MobileCartBar
          count={cartItemsCount}
          onClick={() => {
            setIsCheckout(false);
            setIsCartOpen(true);
          }}
        />
      )}
    </div>
  );
}

function Header({
  cartItemsCount,
  onCartClick,
  onLogoClick,
}: {
  cartItemsCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={onLogoClick} className="flex items-center gap-3">
          <img src="/images/pgrb-logo.png" alt={SHOP_NAME} className="h-10 object-contain" />
        </button>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-foreground">
          <a href="#ready-stock" className="hover:text-primary transition">Ready Stock</a>
          <a href="#store-info" className="hover:text-primary transition">Lokasi Toko</a>
          <a href={waCsLink()} target="_blank" rel="noreferrer" className="hover:text-primary transition">Customer Service</a>
        </nav>

        <button
          onClick={onCartClick}
          className="relative p-2 text-foreground hover:bg-secondary rounded-full transition"
          aria-label="Keranjang"
        >
          <ShoppingCart className="w-6 h-6 text-primary" />
          {cartItemsCount > 0 && (
            <span className="absolute top-0 right-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-white">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function Hero({ onCekStock }: { onCekStock: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary via-primary to-[#1f4530] text-white">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-semibold backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {SHOP_TAGLINE}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-[1.05] tracking-tight mb-5">
            Rajut Premium,<br />Harga Grosir.
          </h1>
          <p className="text-white/80 text-[15px] md:text-lg leading-relaxed mb-8 max-w-lg">
            Koleksi rajut terkini langsung dari pusat grosir Bandung. Kualitas terjamin, varian lengkap, siap kirim ke seluruh Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCekStock}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-primary shadow-lg transition hover:bg-white/90 active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              Cek Ready Stock
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={waCsLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              Chat CS
            </a>
            <a
              href={SHOP_MAPS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-[0.98]"
            >
              <MapPin className="w-5 h-5" />
              Lokasi Toko
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const gallery = getProductGallery(product);
  const hasVariants = gallery.length > 1;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:shadow-elegant border border-border/40">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/50 cursor-pointer" onClick={onSelect}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <PlaceholderArt name={product.name} />
        )}

        {hasVariants && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-sm shadow-sm">
            {gallery.length} Warna
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex h-1/3 items-end justify-center bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-xs font-semibold text-white drop-shadow-md tracking-wide">Lihat Detail</span>
        </div>
      </div>
      <div className="flex flex-col p-4 flex-1">
        <p className="text-[13px] font-medium text-foreground mb-2 line-clamp-2 leading-snug">
          {product.code}-{product.name.toUpperCase()}
        </p>

        <div className="mt-auto">
          <p className="text-[15px] font-bold text-primary">{formatRupiah(product.price)}</p>
        </div>

        <button
          onClick={onSelect}
          className="mt-4 w-full rounded-lg border border-primary/20 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          {hasVariants ? "Pilih Varian" : "Beli Sekarang"}
        </button>
      </div>
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (variant: ProductVariant | null, qty: number) => void;
}) {
  const gallery = getProductGallery(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const activeVariant = gallery[activeIndex] ?? null;
  const hasVariants = gallery.length > 1;

  const scrollToIndex = (index: number) => {
    const container = carouselRef.current;
    if (!container) return;
    container.scrollTo({ left: container.clientWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    const container = carouselRef.current;
    if (!container) return;
    const nextIndex = Math.round(container.scrollLeft / Math.max(container.clientWidth, 1));
    if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full flex-col max-h-[92vh] sm:max-h-[88vh] max-w-md overflow-hidden rounded-t-[1.5rem] bg-white shadow-2xl animate-in slide-in-from-bottom-8 sm:rounded-[1.5rem]"
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

          {hasVariants && (
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
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Kode {product.code}</p>
            <h2 className="text-xl font-bold text-foreground font-serif leading-tight">{product.name}</h2>
            <p className="mt-2 text-2xl font-bold text-primary">{formatRupiah(product.price)}</p>
          </div>

          {hasVariants && (
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
              <div className="text-sm text-muted-foreground">Stok Tersedia</div>
            </div>
          </div>

          <div className="mb-2 rounded-xl bg-secondary/50 p-4 border border-border/50">
            <h3 className="text-[13px] font-bold text-foreground mb-2">Detail Ukuran</h3>
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
            Tambah ke Keranjang — {formatRupiah(product.price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
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

function StoreInfo() {
  return (
    <section id="store-info" className="border-t border-border bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Kunjungi Kami</p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight mb-4">Lokasi Toko</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Langsung datang ke toko kami di pusat grosir Bandung. Lihat dan pilih langsung koleksi rajut premium dengan harga grosir terbaik.
            </p>
            <div className="space-y-3 text-[14px]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground">{SHOP_ADDRESS}</span>
              </div>
              <a
                href={waCsLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-4 py-2 text-[14px] font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Customer Service
              </a>
              <a
                href={SHOP_MAPS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[14px] font-semibold text-primary hover:bg-primary/20 transition"
              >
                <MapPin className="w-4 h-4" />
                Buka di Google Maps
              </a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border shadow-card h-64 md:h-80 bg-secondary">
            <a href={SHOP_MAPS} target="_blank" rel="noreferrer" className="block h-full w-full">
              <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-background hover:from-secondary/80 transition">
                <MapPin className="w-12 h-12 text-primary/40" />
                <span className="text-[14px] font-semibold text-primary">Buka Google Maps</span>
                <span className="text-[12px] text-muted-foreground">{SHOP_ADDRESS}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <img src="/images/pgrb-logo.png" alt={SHOP_NAME} className="h-8 object-contain opacity-80" />
        </div>
        <p className="font-serif text-xl font-bold text-primary">{SHOP_NAME}</p>
        <p className="text-muted-foreground text-sm">{SHOP_TAGLINE}</p>
        <div className="flex items-center justify-center gap-4 text-[13px] text-muted-foreground pt-2">
          <a href="#ready-stock" className="hover:text-primary transition">Ready Stock</a>
          <a href={waCsLink()} target="_blank" rel="noreferrer" className="hover:text-primary transition">Customer Service</a>
          <a href={SHOP_MAPS} target="_blank" rel="noreferrer" className="hover:text-primary transition">Lokasi</a>
        </div>
        <p className="text-[12px] text-muted-foreground/60 mt-6">© {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}

function MobileCartBar({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden z-20 animate-in slide-in-from-bottom-full">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-white shadow-lg"
      >
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold text-[15px]">{count} Item</span>
        </div>
        <span className="font-bold text-[15px]">Lihat Keranjang</span>
      </button>
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
