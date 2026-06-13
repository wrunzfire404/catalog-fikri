import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, User, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { adminLogin } from "@/lib/store";
import { useStore } from "@/context/StoreContext";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { settings } = useStore();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (adminLogin(user.trim(), pass)) {
      onLogin();
    } else {
      setError("Username atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <img src="/images/pgrb-logo.png" alt={settings.shopName} className="h-9 object-contain" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">Masuk untuk mengelola toko {settings.shopName}</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl bg-white shadow-card border border-border/40 p-6 space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-foreground mb-1.5 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Masukkan username"
                  autoComplete="username"
                  className="w-full rounded-lg border border-border bg-white pl-10 pr-4 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-border bg-white pl-10 pr-10 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-destructive bg-destructive/5 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
            >
              Masuk
            </button>
          </form>

          <p className="text-center text-[12px] text-muted-foreground/70 mt-4">
            Default: <span className="font-mono">admin</span> / <span className="font-mono">pgrb2024</span>
          </p>
        </div>
      </main>
    </div>
  );
}
