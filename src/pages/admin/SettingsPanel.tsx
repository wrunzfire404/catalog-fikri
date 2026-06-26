import { useState } from "react";
import { Save, RotateCcw, ShieldCheck, KeyRound, Image as ImageIcon, Upload, Trash2, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { saveAdminCreds, getAdminCreds, resetProductsToDefault, resetSettingsToDefault, bulkCompressAllImages } from "@/lib/store";
import { type Settings } from "@/lib/products";
import { uploadImage } from "@/lib/supabase";

export default function SettingsPanel() {
  const { settings, saveSettings, refresh } = useStore();
  const [draft, setDraft] = useState<Settings>({ ...settings, banners: settings.banners || [] });
  const [saved, setSaved] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  const [compressLog, setCompressLog] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);

  const handleBulkCompress = async () => {
    if (!window.confirm("PENTING: Proses ini akan mengunduh, mengecilkan, dan menimpa semua foto produk lama Anda dengan versi yang lebih hemat kuota. Proses ini bisa memakan waktu beberapa menit. Lanjutkan?")) return;
    
    setIsCompressing(true);
    setCompressLog("Memulai...");
    
    await bulkCompressAllImages((msg) => {
      setCompressLog(msg);
    });
    
    setIsCompressing(false);
  };

  // Creds
  const [creds, setCreds] = useState(() => getAdminCreds());
  const [showCreds, setShowCreds] = useState(false);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await saveSettings(draft);
      saveAdminCreds(creds.user, creds.pass);
      setSaved(true);
      alert("Berhasil menyimpan pengaturan!");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan pengaturan! Pastikan Anda sudah menjalankan script SQL di Supabase.");
    }
  };

  const handleUploadBanner = async (file: File) => {
    try {
      setUploadingBanner(true);
      const url = await uploadImage(file);
      const newBanner = { src: url, alt: `Banner ${draft.banners?.length ? draft.banners.length + 1 : 1}` };
      setDraft((prev) => ({ ...prev, banners: [...(prev.banners || []), newBanner] }));
      setSaved(false);
    } catch {
      alert("Gagal mengunggah banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleUploadMenuImage = async (field: "menuKatalogImage" | "menuCsImage" | "menuLokasiImage", file: File) => {
    try {
      const url = await uploadImage(file);
      setDraft((prev) => ({ ...prev, [field]: url }));
      setSaved(false);
    } catch {
      alert("Gagal mengunggah gambar menu.");
    }
  };

  const moveBanner = (index: number, direction: "up" | "down") => {
    const arr = [...(draft.banners || [])];
    if (direction === "up" && index > 0) {
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    } else if (direction === "down" && index < arr.length - 1) {
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    }
    setDraft((prev) => ({ ...prev, banners: arr }));
    setSaved(false);
  };

  const removeBanner = (index: number) => {
    setDraft((prev) => ({ ...prev, banners: (prev.banners || []).filter((_, i) => i !== index) }));
    setSaved(false);
  };

  const handleResetAll = async () => {
    if (window.confirm("Reset semua data ke pengaturan awal? Produk, settings, dan kredensial akan kembali ke default. Tindakan ini tidak bisa dibatalkan.")) {
      await resetProductsToDefault();
      await resetSettingsToDefault();
      await refresh();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl bg-white shadow-card border border-border/40 p-6 md:p-8 mb-6">
        <h2 className="font-bold font-serif text-foreground text-lg mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Informasi Toko
        </h2>

        <div className="space-y-5">
          <Field label="Nama Toko" value={draft.shopName} onChange={(v) => set("shopName", v)} />
          <Field label="Tagline (Teks Kecil di Atas)" value={draft.tagline} onChange={(v) => set("tagline", v)} />
          <Field label="Teks Banner Utama" value={draft.bannerText || ""} onChange={(v) => set("bannerText", v)} placeholder="Contoh: Rajut Premium, Harga Grosir." />
          <Field label="Nomor WhatsApp" value={draft.waNumber} onChange={(v) => set("waNumber", v)} placeholder="628xxxxxxxxxx tanpa + atau 0" />
          <Field label="Alamat Toko" value={draft.address} onChange={(v) => set("address", v)} />
          <Field label="URL Google Maps" value={draft.mapsUrl} onChange={(v) => set("mapsUrl", v)} placeholder="https://maps.google.com/?q=..." />
          
          <div>
            <label className="text-[13px] font-semibold text-foreground mb-1.5 block">Instruksi Pembayaran / Rekening Bank</label>
            <textarea
              value={draft.paymentInfo || ""}
              onChange={(e) => set("paymentInfo", e.target.value)}
              placeholder="Contoh: Bank BCA 1234567 a.n. Fikri"
              rows={4}
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Banner Management */}
      <div className="rounded-2xl bg-white shadow-card border border-border/40 p-6 md:p-8 mb-6">
        <h2 className="font-bold font-serif text-foreground text-lg mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Manajemen Banner Homepage
        </h2>

        <div className="space-y-4">
          <label className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium text-foreground cursor-pointer hover:bg-secondary transition">
            {uploadingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingBanner ? "Mengunggah..." : "Tambah Banner"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUploadBanner(e.target.files[0])}
            />
          </label>

          {(!draft.banners || draft.banners.length === 0) && (
            <p className="text-[13px] text-muted-foreground bg-secondary/40 rounded-lg px-4 py-3 border border-border/50">
              Belum ada banner. Banner default akan ditampilkan di Homepage.
            </p>
          )}

          <div className="space-y-3">
            {draft.banners?.map((banner, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-border p-2 bg-white">
                <div className="w-24 h-14 bg-secondary rounded-md overflow-hidden shrink-0 border border-border/50">
                  <img src={banner.src} alt={banner.alt} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    value={banner.alt}
                    onChange={(e) => {
                      const newBanners = [...(draft.banners || [])];
                      newBanners[idx].alt = e.target.value;
                      setDraft((prev) => ({ ...prev, banners: newBanners }));
                    }}
                    placeholder="Teks alternatif banner"
                    className="w-full text-[13px] bg-transparent outline-none font-medium"
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0 px-2">
                  <button onClick={() => moveBanner(idx, "up")} disabled={idx === 0} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md disabled:opacity-30 transition">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveBanner(idx, "down")} disabled={idx === draft.banners!.length - 1} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md disabled:opacity-30 transition">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <button onClick={() => removeBanner(idx)} className="p-1.5 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-md transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Image Management */}
      <div className="rounded-2xl bg-white shadow-card border border-border/40 p-6 md:p-8 mb-6">
        <h2 className="font-bold font-serif text-foreground text-lg mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Gambar Menu Utama
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MenuImageUploader 
            label="Katalog" 
            src={draft.menuKatalogImage} 
            onUpload={(file) => handleUploadMenuImage("menuKatalogImage", file)}
            onRemove={() => { setDraft(p => ({ ...p, menuKatalogImage: "" })); setSaved(false); }}
          />
          <MenuImageUploader 
            label="Hubungi CS" 
            src={draft.menuCsImage} 
            onUpload={(file) => handleUploadMenuImage("menuCsImage", file)}
            onRemove={() => { setDraft(p => ({ ...p, menuCsImage: "" })); setSaved(false); }}
          />
          <MenuImageUploader 
            label="Lokasi Toko" 
            src={draft.menuLokasiImage} 
            onUpload={(file) => handleUploadMenuImage("menuLokasiImage", file)}
            onRemove={() => { setDraft(p => ({ ...p, menuLokasiImage: "" })); setSaved(false); }}
          />
        </div>
      </div>

      {/* Credentials */}
      <div className="rounded-2xl bg-white shadow-card border border-border/40 p-6 md:p-8 mb-6">
        <h2 className="font-bold font-serif text-foreground text-lg mb-6 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          Kredensial Admin
        </h2>

        <button
          onClick={() => setShowCreds((v) => !v)}
          className="text-[14px] font-semibold text-primary hover:underline mb-4 inline-block"
        >
          {showCreds ? "Sembunyikan" : "Ubah Username / Password"}
        </button>

        {showCreds && (
          <div className="space-y-4">
            <Field label="Username" value={creds.user} onChange={(v) => setCreds((prev) => ({ ...prev, user: v }))} />
            <Field label="Password" value={creds.pass} onChange={(v) => setCreds((prev) => ({ ...prev, pass: v }))} />
            <p className="text-[12px] text-muted-foreground">
              ⚠️ Kredensial ini hanya gerbang sederhana — bukan keamanan server-side.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleSave}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          {saved ? "Tersimpan!" : "Simpan Semua"}
        </button>
        <button
          onClick={handleResetAll}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-[14px] font-semibold text-destructive transition hover:bg-destructive/10"
        >
          <RotateCcw className="w-5 h-5" />
          Reset ke Default
        </button>
      </div>

      {/* Bulk Compress Section */}
      <div className="border border-yellow-200 bg-yellow-50/50 p-4 rounded-xl">
        <h3 className="font-bold text-yellow-800 text-[14px] mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Sihir: Bulk Compress Foto Lama
        </h3>
        <p className="text-[13px] text-yellow-700/80 mb-4 leading-relaxed">
          Gunakan tombol ini HANYA jika Anda memiliki ratusan foto lama yang belum dikompresi.
          Sistem akan mendownload semua foto produk lama, mengecilkannya, dan menimpanya secara otomatis dengan versi hemat kuota.
        </p>
        <button
          onClick={handleBulkCompress}
          disabled={isCompressing}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-[14px] font-bold text-white shadow-sm transition hover:bg-yellow-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isCompressing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
          {isCompressing ? "Memproses Kompresi..." : "Mulai Bulk Compress Sekarang"}
        </button>
        
        {compressLog && (
          <div className="mt-4 p-3 bg-white border border-yellow-200 rounded-lg text-[12px] font-mono text-yellow-800 h-24 overflow-y-auto">
            {compressLog}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-foreground mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}

function MenuImageUploader({
  label, src, onUpload, onRemove
}: {
  label: string; src?: string; onUpload: (f: File) => void; onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-secondary/20 flex flex-col items-center text-center">
      <p className="text-[14px] font-semibold mb-3">{label}</p>
      {src ? (
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-secondary mb-3 border border-border/50 group">
          <img src={src} className="w-full h-full object-cover" alt={label} />
          <button 
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 md:group-hover:opacity-100 transition-opacity"
            title="Hapus gambar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-full aspect-[4/3] rounded-lg bg-secondary/50 mb-3 border border-dashed border-border/60 flex items-center justify-center">
          <span className="text-[12px] text-muted-foreground">Tanpa Gambar (Polos)</span>
        </div>
      )}
      <label className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-white border border-border px-3 py-2 text-[12px] font-medium cursor-pointer hover:bg-secondary transition">
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        {uploading ? "Mengunggah..." : (src ? "Ganti Gambar" : "Tambah Gambar")}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {src && (
        <button 
          onClick={onRemove}
          className="mt-2 text-[12px] text-destructive/80 hover:text-destructive md:hidden"
        >
          Hapus Gambar
        </button>
      )}
    </div>
  );
}
