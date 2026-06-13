import { useRef, useState } from "react";
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
  getProductGallery,
  waCheckoutLink,
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

export function ProductCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
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

export function ProductModal({
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

export function PlaceholderArt({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-background">
      <span className="font-serif text-6xl font-bold text-primary/10">{initial}</span>
    </div>
  );
}

export { EMPTY_CUSTOMER };
