import { useState } from "react";
import { X, Plus, Trash2, Upload, ImageIcon, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { supabase, uploadImage } from "@/lib/supabase";
import { slugify, type Product, type ProductVariant } from "@/lib/products";

type DraftVariant = { slug: string; color: string; image: string; stock: string };

type Draft = {
  slug: string;
  code: string;
  name: string;
  ld: string;
  pj: string;
  price: string;
  note: string;
  image: string;
  stock: string;
  variants: DraftVariant[];
};

function toDraft(product: Product | null): Draft {
  if (!product) {
    return { slug: "", code: "", name: "", ld: "", pj: "", price: "", note: "", image: "", stock: "", variants: [] };
  }
  return {
    slug: product.slug,
    code: product.code,
    name: product.name,
    ld: product.ld,
    pj: product.pj,
    price: String(product.price),
    note: product.note ?? "",
    image: product.image ?? "",
    stock: product.stock !== undefined ? String(product.stock) : "",
    variants: product.variants ? product.variants.map((v) => ({ ...v, stock: v.stock !== undefined ? String(v.stock) : "" })) : [],
  };
}



export default function ProductEditor({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { products, saveProduct } = useStore();
  const [draft, setDraft] = useState<Draft>(() => toDraft(product));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // "main" or "variant-{idx}"
  const isEdit = Boolean(product);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleMainImage = async (file: File) => {
    try {
      setUploading("main");
      const url = await uploadImage(file);
      set("image", url);
    } catch {
      setError("Gagal upload gambar ke storage.");
    } finally {
      setUploading(null);
    }
  };

  const addVariant = () => {
    setDraft((prev) => ({
      ...prev,
      variants: [...prev.variants, { slug: `varian-${prev.variants.length + 1}`, color: "", image: "", stock: "" }],
    }));
  };

  const updateVariant = (index: number, patch: Partial<DraftVariant>) => {
    setDraft((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], ...patch };
      return { ...prev, variants };
    });
  };

  const handleVariantImage = async (index: number, file: File) => {
    try {
      setUploading(`variant-${index}`);
      const url = await uploadImage(file);
      updateVariant(index, { image: url });
    } catch {
      setError("Gagal upload gambar varian ke storage.");
    } finally {
      setUploading(null);
    }
  };

  const removeVariant = (index: number) => {
    setDraft((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setError("");
    if (!draft.name.trim()) return setError("Nama produk wajib diisi.");
    if (!draft.code.trim()) return setError("Kode produk wajib diisi.");
    const priceNum = Number(draft.price);
    if (!draft.price || Number.isNaN(priceNum) || priceNum <= 0) return setError("Harga harus angka lebih dari 0.");

    const slug = draft.slug || slugify(draft.name);

    if (!isEdit && products.some((p) => p.slug === slug)) {
      return setError("Sudah ada produk dengan nama serupa. Ubah nama produk.");
    }

    const cleanVariants = draft.variants
      .filter((v) => v.color.trim())
      .map((v) => ({
        slug: v.slug || slugify(v.color),
        color: v.color.trim(),
        image: v.image || undefined,
        stock: v.stock.trim() ? parseInt(v.stock.replace(/[^0-9]/g, ""), 10) : undefined,
      }));

    const finalProduct: Product = {
      slug,
      code: draft.code.trim().toUpperCase(),
      name: draft.name.trim(),
      ld: draft.ld.trim(),
      pj: draft.pj.trim(),
      price: priceNum,
      note: draft.note.trim() || undefined,
      image: draft.image || cleanVariants[0]?.image || undefined,
      stock: draft.stock.trim() && cleanVariants.length === 0 ? parseInt(draft.stock.replace(/[^0-9]/g, ""), 10) : undefined,
      variants: cleanVariants.length ? cleanVariants : undefined,
    };

    setSaving(true);
    try {
      await saveProduct(finalProduct);
      onClose();
    } catch {
      setError("Gagal menyimpan produk. Cek koneksi internet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="flex w-full max-w-lg flex-col max-h-[94vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold font-serif text-foreground">{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main image */}
          <div>
            <label className="text-[13px] font-semibold text-foreground mb-2 block">Foto Utama</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-secondary shrink-0 flex items-center justify-center">
                {draft.image ? (
                  <img src={draft.image} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-muted-foreground/40" />
                )}
              </div>
              <label className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium text-foreground cursor-pointer hover:bg-secondary transition">
                {uploading === "main" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading === "main" ? "Uploading..." : "Upload Foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleMainImage(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Kode" required value={draft.code} onChange={(v) => set("code", v)} placeholder="A / B / C" />
            <Field label="Harga (Rp)" required value={draft.price} onChange={(v) => set("price", v.replace(/[^0-9]/g, ""))} placeholder="63000" />
          </div>

          <Field label="Nama Produk" required value={draft.name} onChange={(v) => set("name", v)} placeholder="Contoh: RERE" />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Lingkar Dada (LD)" value={draft.ld} onChange={(v) => set("ld", v)} placeholder="110-115" />
            <Field label="Panjang (PJ)" value={draft.pj} onChange={(v) => set("pj", v)} placeholder="55" />
          </div>

          {draft.variants.length === 0 && (
            <Field label="Stok Total (opsional)" value={draft.stock} onChange={(v) => set("stock", v.replace(/[^0-9]/g, ""))} placeholder="Kosongkan jika tak terbatas" />
          )}

          <div>
            <label className="text-[13px] font-semibold text-foreground mb-1.5 block">Catatan (opsional)</label>
            <textarea
              value={draft.note}
              onChange={(e) => set("note", e.target.value)}
              rows={2}
              placeholder="Deskripsi bahan, dll..."
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            />
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[13px] font-semibold text-foreground">Varian Warna</label>
              <button
                onClick={addVariant}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                Tambah Varian
              </button>
            </div>

            {draft.variants.length === 0 ? (
              <p className="text-[13px] text-muted-foreground bg-secondary/40 rounded-lg px-3 py-3 text-center">
                Belum ada varian. Tanpa varian, produk dijual sebagai item tunggal.
              </p>
            ) : (
              <div className="space-y-2">
                {draft.variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-lg border border-border p-2">
                    <label className="w-12 h-14 rounded-md overflow-hidden bg-secondary shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                      {variant.image ? (
                        <img src={variant.image} alt={variant.color} className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-4 h-4 text-muted-foreground/50" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleVariantImage(index, e.target.files[0])}
                      />
                    </label>
                    <input
                      value={variant.color}
                      onChange={(e) => updateVariant(index, { color: e.target.value })}
                      placeholder="Nama warna"
                      className="flex-1 min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    <input
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, { stock: e.target.value.replace(/[^0-9]/g, "") })}
                      placeholder="Stok"
                      className="w-16 rounded-lg border border-border bg-white px-2 py-2 text-[14px] text-center outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    <button
                      onClick={() => removeVariant(index)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition shrink-0"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-[13px] text-destructive bg-destructive/5 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="border-t border-border p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-3 text-[14px] font-semibold text-foreground hover:bg-secondary transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-[14px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-foreground mb-1.5 block">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}
