import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle2, X, Sparkles } from "lucide-react";
import { formatRupiah, type Product } from "@/lib/products";

type PopupData = {
  message: string;
  action?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  featured?: Product[];
};

type ToastContextValue = {
  showPopup: (message: string, opts?: { action?: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void }; featured?: Product[] }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<PopupData | null>(null);

  const showPopup = useCallback(
    (message: string, opts?: { action?: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void }; featured?: Product[] }) => {
      setPopup({ message, ...opts });
    },
    []
  );

  const dismiss = () => setPopup(null);

  return (
    <ToastContext.Provider value={{ showPopup }}>
      {children}

      {/* Popup Modal */}
      {popup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={dismiss}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold font-serif text-foreground text-[16px]">Berhasil!</h3>
                <p className="text-[14px] text-muted-foreground mt-0.5">{popup.message}</p>
              </div>
              <button
                onClick={dismiss}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-neutral-200 transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tombol */}
            <div className="flex flex-col gap-2 mb-5">
              {popup.action && (
                <button
                  onClick={() => {
                    popup.action?.onClick();
                    dismiss();
                  }}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
                >
                  {popup.action.label}
                </button>
              )}
              {popup.secondary && (
                <button
                  onClick={() => {
                    popup.secondary?.onClick();
                    dismiss();
                  }}
                  className="w-full rounded-xl border border-border px-4 py-3 text-[14px] font-semibold text-foreground hover:bg-secondary transition"
                >
                  {popup.secondary.label}
                </button>
              )}
            </div>

            {/* Produk Rekomendasi */}
            {popup.featured && popup.featured.length > 0 && (
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h4 className="font-bold font-serif text-foreground text-[14px]">Mungkin Kamu Suka</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {popup.featured.slice(0, 4).map((product) => (
                    <button
                      key={product.slug}
                      onClick={() => {
                        dismiss();
                        // Trigger product selection via callback
                        window.dispatchEvent(new CustomEvent("select-product", { detail: product.slug }));
                      }}
                      className="flex items-center gap-3 rounded-xl bg-secondary/40 p-2 text-left hover:bg-secondary transition"
                    >
                      <div className="w-12 h-14 shrink-0 rounded-lg overflow-hidden bg-white">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/20 font-serif text-lg font-bold">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-foreground line-clamp-2 leading-snug">
                          {product.name}
                        </p>
                        <p className="text-[13px] font-bold text-primary mt-0.5">{formatRupiah(product.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function usePopup() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("usePopup must be used within a ToastProvider");
  return ctx;
}
