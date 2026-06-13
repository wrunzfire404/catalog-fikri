import { useRef, useState } from "react";
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
} from "@/lib/products";


export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-[#ECE5DD] text-neutral-900">
      <header className="sticky top-0 z-30 bg-[#075E54] text-white shadow-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white/95">
            <img src="/images/pgrb-logo.png" alt="PGRB" className="h-10 w-10 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-sans text-base font-semibold leading-tight">{SHOP_NAME}</h1>
            <p className="truncate text-[11px] text-white/80">Bisnis · {SHOP_TAGLINE}</p>
          </div>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
        <div className="bg-[#128C7E]">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
            <span className="text-sm font-medium">Katalog</span>
            <span className="text-[11px] text-white/85">{products.length} item</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-3 py-4">
        <div className="mb-3 rounded-2xl bg-white/70 px-3 py-2 text-[11px] text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          Ketuk produk untuk lihat detail dan geser foto untuk cek varian warna.
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => {
            const gallery = getProductGallery(product);
            const hasVariants = gallery.length > 1;

            return (
              <button
                key={product.slug}
                onClick={() => setSelected(product)}
                className="group flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition active:scale-[0.98]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#F0F0F0]">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  ) : (
                    <PlaceholderArt name={product.name} />
                  )}
                  {hasVariants && (
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                      {gallery.length} warna
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5 p-2.5">
                  <p className="line-clamp-2 text-[13px] font-medium leading-tight text-[#111]">
                    {product.code}. {product.name}
                  </p>
                  <p className="text-[14px] font-semibold text-[#075E54]">{formatRupiah(product.price)}</p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">LD {product.ld} · PJ {product.pj}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11px] text-neutral-500">Order tetap diarahkan ke WhatsApp</p>
      </main>

      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      <footer className="pb-24 pt-4 text-center text-[11px] text-neutral-500">
        © {new Date().getFullYear()} {SHOP_NAME} · +{WA_NUMBER}
      </footer>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const gallery = getProductGallery(product);
  const [activeIndex, setActiveIndex] = useState(0);
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-in fade-in sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white animate-in slide-in-from-bottom-4 sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((variant, index) => (
            <div key={`${product.slug}-${variant.slug}-${index}`} className="w-full shrink-0 snap-center">
              <div className="relative aspect-square bg-[#F0F0F0]">
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
            </div>
          ))}
        </div>

        {gallery.length > 1 && (
          <div className="border-b border-neutral-100 px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {gallery.map((variant, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={variant.slug}
                    onClick={() => scrollToIndex(index)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "border-[#128C7E] bg-[#E7F7F2] text-[#075E54]"
                        : "border-neutral-200 bg-white text-neutral-600"
                    }`}
                  >
                    {variant.color}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {gallery.map((variant, index) => (
                <button
                  key={`${variant.slug}-dot`}
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Lihat varian ${variant.color}`}
                  className={`h-1.5 rounded-full transition ${index === activeIndex ? "w-5 bg-[#128C7E]" : "w-1.5 bg-neutral-300"}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-5">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500">
            Kode {product.code} · LD {product.ld} · PJ {product.pj}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-neutral-900">{product.name}</h2>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xl font-bold text-[#075E54]">{formatRupiah(product.price)}</p>
            {activeVariant?.color && gallery.length > 1 && (
              <div className="rounded-full bg-[#F6F6F6] px-3 py-1 text-xs font-medium text-neutral-700">
                Warna {activeVariant.color}
              </div>
            )}
          </div>
          {product.note && <p className="mt-3 text-sm leading-relaxed text-neutral-600">{product.note}</p>}
          <div className="mt-5 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Tutup
            </button>
            <a
              href={waLink(product, activeVariant)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Pesan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderArt({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#DCF8C6] to-[#ECE5DD]">
      <span className="font-serif text-6xl font-semibold text-[#075E54]/40">{initial}</span>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}
