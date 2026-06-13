import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle2, X, ShoppingCart } from "lucide-react";

type Toast = {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
};

type ToastContextValue = {
  show: (message: string, opts?: { action?: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void } }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback(
    (message: string, opts?: { action?: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void } }) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, ...opts }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-start gap-3 rounded-xl bg-white shadow-elegant border border-border/60 p-4 max-w-sm w-full md:w-auto"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground">{toast.message}</p>
              {(toast.action || toast.secondary) && (
                <div className="flex gap-2 mt-2">
                  {toast.action && (
                    <button onClick={toast.action.onClick} className="text-[13px] font-semibold text-primary hover:underline">
                      {toast.action.label}
                    </button>
                  )}
                  {toast.secondary && (
                    <button onClick={toast.secondary.onClick} className="text-[13px] text-muted-foreground hover:text-foreground hover:underline">
                      {toast.secondary.label}
                    </button>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => dismiss(toast.id)} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
