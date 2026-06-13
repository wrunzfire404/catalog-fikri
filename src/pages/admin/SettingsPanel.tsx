import { useState } from "react";
import { Save, RotateCcw, ShieldCheck, KeyRound } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { saveAdminCreds, getAdminCreds, resetProductsToDefault, resetSettingsToDefault } from "@/lib/store";
import { type Settings } from "@/lib/products";

export default function SettingsPanel() {
  const { settings, saveSettings, refresh } = useStore();
  const [draft, setDraft] = useState<Settings>({ ...settings });
  const [saved, setSaved] = useState(false);

  // Creds
  const [creds, setCreds] = useState(() => getAdminCreds());
  const [showCreds, setShowCreds] = useState(false);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await saveSettings(draft);
    saveAdminCreds(creds.user, creds.pass);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <Field label="Tagline" value={draft.tagline} onChange={(v) => set("tagline", v)} />
          <Field label="Nomor WhatsApp" value={draft.waNumber} onChange={(v) => set("waNumber", v)} placeholder="628xxxxxxxxxx tanpa + atau 0" />
          <Field label="Alamat Toko" value={draft.address} onChange={(v) => set("address", v)} />
          <Field label="URL Google Maps" value={draft.mapsUrl} onChange={(v) => set("mapsUrl", v)} placeholder="https://maps.google.com/?q=..." />
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
      <div className="flex flex-col sm:flex-row gap-3">
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
