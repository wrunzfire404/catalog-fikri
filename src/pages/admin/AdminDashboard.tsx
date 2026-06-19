import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Boxes,
  Star,
  FileText,
} from "lucide-react";
import { adminLogout } from "@/lib/store";
import { useStore } from "@/context/StoreContext";
import { formatRupiah, type Product } from "@/lib/products";
import ProductEditor from "./ProductEditor";
import SettingsPanel from "./SettingsPanel";
import OrdersPanel from "./OrdersPanel";

type Tab = "products" | "settings" | "orders";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { products, settings, toggleFeatured, deleteProduct } = useStore();
  const location = useLocation();
  const initialTab = (location.state as any)?.tab || "products";
  const [tab, setTab] = useState<Tab>(initialTab as Tab);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null); // slug yg lagi di-toggle

  const handleLogout = () => {
    adminLogout();
    onLogout();
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      deleteProduct(product.slug);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 bg-white border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt={settings.shopName} className="h-9 object-contain mix-blend-multiply" />
            <span className="text-[13px] font-semibold text-muted-foreground border-l border-border pl-3">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/stock"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-secondary transition"
            >
              <ExternalLink className="w-4 h-4" />
              Lihat Toko
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/5 transition"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-secondary/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab("products")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold transition ${
              tab === "products" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4" />
            Produk
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold transition ${
              tab === "orders" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            Pesanan
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold transition ${
              tab === "settings" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Pengaturan
          </button>
        </div>

        {tab === "products" ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-muted-foreground text-[14px]">
                <Boxes className="w-5 h-5" />
                <span>{products.length} produk</span>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[14px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Tambah Produk
              </button>
            </div>

            <div className="grid gap-3">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-card border border-border/40"
                >
                  <div className="w-14 h-16 shrink-0 rounded-lg overflow-hidden bg-secondary">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20 font-serif text-2xl font-bold">
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5">{product.code}</span>
                      <h3 className="text-[15px] font-semibold text-foreground truncate">{product.name}</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                      {formatRupiah(product.price)}
                      {product.variants?.length ? ` · ${product.variants.length} varian` : ""}
                      {product.featured && " · ⭐ Rekomendasi"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={async () => {
                        setToggling(product.slug);
                        try {
                          await toggleFeatured(product.slug);
                        } catch (e) {
                          alert("Error: " + (e instanceof Error ? e.message : "Gagal menyimpan"));
                        } finally {
                          setToggling(null);
                        }
                      }}
                      disabled={toggling === product.slug}
                      className={`grid h-9 w-9 place-items-center rounded-lg transition disabled:opacity-40 ${
                        product.featured
                          ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                      aria-label="Toggle Rekomendasi"
                      title={product.featured ? "Hapus dari rekomendasi" : "Tandai rekomendasi"}
                    >
                      <Star className="w-[18px] h-[18px]" fill={product.featured ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => setEditing(product)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-primary transition"
                      aria-label="Edit"
                    >
                      <Pencil className="w-[18px] h-[18px]" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : tab === "orders" ? (
          <OrdersPanel />
        ) : (
          <SettingsPanel />
        )}
      </div>

      {(editing || isCreating) && (
        <ProductEditor
          product={editing}
          onClose={() => {
            setEditing(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}
