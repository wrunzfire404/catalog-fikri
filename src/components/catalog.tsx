import { useRef, useState } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import {
  formatRupiah,
  getProductGallery,
  type Product,
  type ProductVariant,
} from "@/lib/products";

export function ProductCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const gallery = getProductGallery(product);
  const hasVariants = gallery.length > 1;

  return (
    <div className="group flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-border/40">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40 cursor-pointer" onClick={onSelect}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="img-zoom h-full w-full object-cover" loading="lazy" />
        ) : (
          <PlaceholderArt name={product.name} />
        )}

        {hasVariants && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-primary shadow-sm border border-border/30">
            {gallery.length} Warna
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
          <span className="text-[12px] font-semibold text-white tracking-wider bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5">
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col p-4 flex-1">
        <div className="flex items-start gap-1 mb-1.5">
          <span className="text-[10px] font-bold text-primary bg-primary/[0.07] rounded px-1.5 py-0.5 shrink-0">{product.code}</span>
          <p className="text-[13px] font-semibold text-foreground line-clamp-2 leading-snug">{product.name}</p>
        </div>

        <div className="mt-auto">
          <p className="text-[16px] font-bold text-primary">{formatRupiah(product.price)}</p>
        </div>

        <button
          onClick={onSelect}
          className="mt-3 w-full rounded-xl border border-border py-2.5 text-[13px] font-semibold text-foreground transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary uppercase tracking-wider"
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
  const minQty = product.minOrder ?? 2;
  const [quantity, setQuantity] = useState(minQty);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
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
        className="relative flex w-full flex-col max-h-[92vh] sm:max-h-[88vh] max-w-md overflow-hidden rounded-t-[1.5rem] bg-white shadow-2xl animate-in slide-in-from-bottom-8 sm:rounded-[1.5rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-[30] grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative shrink-0 bg-background p-4 sm:p-5 pb-0">
            <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="relative flex aspect-[4/5] sm:aspect-[4/3] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl shadow-sm border border-border/50 bg-secondary"
          >
            {gallery.map((variant, index) => (
              <div 
                key={`${product.slug}-${variant.slug}-${index}`} 
                className="w-full shrink-0 snap-center relative group cursor-pointer overflow-hidden"
                onClick={() => {
                  if (variant.image) setZoomedImage(variant.image);
                }}
              >
                {variant.image ? (
                  <img
                    src={variant.image}
                    alt={`${product.name}${variant.color ? ` warna ${variant.color}` : ""}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderArt name={product.name} />
                )}
                {/* Gradient overlay for "Click to enlarge" */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pointer-events-none">
                  <span className="text-white text-[12px] font-medium tracking-wide">Klik untuk perbesar</span>
                </div>
              </div>
            ))}
          </div>

          {hasVariants && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {gallery.map((variant, index) => (
                <button
                  key={`${variant.slug}-dot`}
                  onClick={() => scrollToIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${index === activeIndex ? "w-6 bg-primary shadow-sm" : "w-1.5 bg-white/70 hover:bg-white"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-5">
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
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border p-1 bg-secondary/30">
                <button
                  onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                  className="grid h-8 w-8 place-items-center rounded-md text-foreground hover:bg-white hover:shadow-sm disabled:opacity-50 transition"
                  disabled={quantity <= minQty}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={minQty}
                  value={quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= minQty) setQuantity(v);
                    else if (e.target.value === "") setQuantity(minQty);
                  }}
                  className="w-16 text-center font-semibold text-[15px] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
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
        </div>

        <div className="p-4 border-t border-border bg-white shrink-0">
          <button
            onClick={() => onAddToCart(activeVariant, quantity)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" />
            Tambah ke Keranjang — {formatRupiah(product.price * quantity)}
          </button>
        </div>
      </div>

      {/* Lightbox / Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[70] grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed" 
            className="max-h-full max-w-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
