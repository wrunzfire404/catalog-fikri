import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Download, MessageCircle, FileText, ArrowLeft, Loader2, Printer } from "lucide-react";
import { formatRupiah, type CartItem, type CustomerInfo, waCheckoutLink } from "@/lib/products";
import { useStore } from "@/context/StoreContext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { settings } = useStore();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoiceNo] = useState(() => {
    if (state?.invoiceNo) return state.invoiceNo;
    const date = new Date();
    return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
  });

  const cart = state?.cart as CartItem[] | undefined;
  const customer = state?.customer as CustomerInfo | undefined;
  const status = state?.status as "unpaid" | "paid" | undefined;
  const isAdmin = state?.isAdmin as boolean | undefined;

  useEffect(() => {
    if (!cart || cart.length === 0 || !customer) {
      navigate("/", { replace: true });
    }
  }, [cart, customer, navigate]);

  if (!cart || !customer) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handlePrintAdmin = () => {
    // Mode admin: pecah ke ukuran A4 secara fisik dengan rapi
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadPDFCustomer = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsGenerating(true);
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      if (!canvas.width || !canvas.height) {
        throw new Error("Kalkulasi dokumen gagal");
      }

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdfWidth = 210; // Lebar standar kertas A4 dalam mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight] // Kertas fleksibel mengikuti panjang konten tanpa memotong
      });
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNo}.pdf`);
    } catch (err: any) {
      console.error("Gagal membuat PDF", err);
      alert("Gagal men-download PDF. Silakan coba metode Print bawaan browser.");
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKonfirmasiWA = () => {
    const link = waCheckoutLink(cart, customer, settings);
    window.open(link, "_blank", "noreferrer");
  };

  return (
    <div className="min-h-screen print:min-h-0 bg-background text-foreground pb-24 md:pb-12 print:pb-0 print:bg-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/60 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">{isAdmin ? "Kembali ke Admin Panel" : "Kembali ke Beranda"}</span>
          </Link>
          <img src="/images/logo.png" alt={settings.shopName} className="h-8 object-contain mix-blend-multiply" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12 print:py-0 print:px-0 print:max-w-none">
        <div className="text-center mb-8 space-y-3 print:hidden">
          <CheckCircle2 className="w-16 h-16 mx-auto text-[#25D366]" />
          <h1 className="text-2xl md:text-3xl font-bold font-serif">Pesanan Dibuat!</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Terima kasih telah berbelanja di {settings.shopName}. Silakan download invoice Anda dan lakukan konfirmasi pembayaran via WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 print:hidden">
          {isAdmin ? (
            <button
              onClick={handlePrintAdmin}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
            >
              <Printer className="w-5 h-5" />
              Cetak Invoice (A4)
            </button>
          ) : (
            <button
              onClick={handleDownloadPDFCustomer}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isGenerating ? "Memproses PDF..." : "Download Invoice PDF"}
            </button>
          )}
          
          <button
            onClick={handleKonfirmasiWA}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#20bd5a] active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Konfirmasi Pembayaran ke WA
          </button>
        </div>

        <hr className="border-border/60 mb-10 print:hidden" />

        <h3 className="text-center font-semibold text-muted-foreground mb-4 flex items-center justify-center gap-2 print:hidden">
          <FileText className="w-4 h-4" />
          Preview Invoice
        </h3>

        {/* Invoice Preview Container */}
        <div className="w-full pb-8">
          <div className="w-full max-w-[800px] shadow-2xl bg-white mx-auto rounded-xl overflow-hidden print:overflow-visible print:shadow-none print:max-w-full print:border-none" style={{ border: "1px solid #e5e7eb" }}>
            
            {/* INVOICE TEMPLATE */}
            <div 
              ref={invoiceRef} 
              id="invoice-print-area"
              className="p-5 sm:p-10 font-sans w-full print:p-0 print:m-0"
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <img src="/images/logo.png" className="h-12 sm:h-16 object-contain" alt="Logo" crossOrigin="anonymous" />
                  <div>
                    <h2 className="font-bold text-xl sm:text-2xl tracking-tight" style={{ color: "#000000" }}>{settings.shopName}</h2>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: "#6b7280" }}>{settings.waNumber}</p>
                    <p className="text-xs sm:text-sm max-w-[250px] leading-snug" style={{ color: "#6b7280" }}>{settings.address}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-wider mb-2" style={{ color: "#1f2937" }}>INVOICE</h1>
                  <p className="text-xs sm:text-sm font-semibold" style={{ color: "#4b5563" }}>NO: {invoiceNo}</p>
                  <p className="text-xs sm:text-sm" style={{ color: "#6b7280" }}>Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {status === "paid" ? (
                    <p className="text-[10px] sm:text-xs font-bold mt-2 px-3 py-1 inline-block rounded" style={{ color: "#15803d", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>SUDAH DIBAYAR</p>
                  ) : (
                    <p className="text-[10px] sm:text-xs font-semibold mt-2 px-2 py-1 inline-block rounded" style={{ color: "#ef4444", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>BELUM DIBAYAR</p>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 rounded-lg break-inside-avoid" style={{ backgroundColor: "#f9fafb", border: "1px solid #f3f4f6" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#6b7280" }}>Tagihan Kepada:</p>
                <h3 className="text-lg font-bold" style={{ color: "#1f2937" }}>{customer.nama}</h3>
                <p className="text-sm mt-1" style={{ color: "#4b5563" }}>{customer.noWa}</p>
                <p className="text-sm max-w-[400px] leading-relaxed" style={{ color: "#4b5563" }}>
                  {customer.kecamatan}, {customer.kabupaten}, {customer.provinsi}
                </p>
                {customer.catatan && (
                  <p className="text-sm mt-3 pt-3" style={{ color: "#4b5563", borderTop: "1px solid #e5e7eb" }}>
                    <span className="font-semibold">Catatan:</span> {customer.catatan}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto print:overflow-visible w-full mb-6">
                <table className="w-full text-left border-collapse min-w-[500px] print:min-w-0">
                  <thead>
                    <tr>
                      <th className="py-2 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider w-8 sm:w-12" style={{ color: "#1f2937", borderBottom: "2px solid #1f2937" }}>No</th>
                      <th className="py-2 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: "#1f2937", borderBottom: "2px solid #1f2937" }}>Nama Produk</th>
                      <th className="py-2 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-center w-16 sm:w-24" style={{ color: "#1f2937", borderBottom: "2px solid #1f2937" }}>Jumlah</th>
                      <th className="py-2 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-right w-24 sm:w-32" style={{ color: "#1f2937", borderBottom: "2px solid #1f2937" }}>Harga</th>
                      <th className="py-2 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-right w-28 sm:w-36" style={{ color: "#1f2937", borderBottom: "2px solid #1f2937" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={idx} className="break-inside-avoid" style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td className="py-2 px-2 text-xs sm:text-sm" style={{ color: "#4b5563" }}>{idx + 1}</td>
                        <td className="py-2 px-2 text-xs sm:text-sm font-medium" style={{ color: "#1f2937" }}>
                          {item.product.name}
                          {item.variant?.color && item.variant.color !== item.product.name && (
                            <span className="font-normal inline-block ml-1" style={{ color: "#6b7280" }}>
                              (Warna: {item.variant.color})
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-xs sm:text-sm text-center" style={{ color: "#4b5563" }}>{item.quantity}</td>
                        <td className="py-2 px-2 text-xs sm:text-sm text-right" style={{ color: "#4b5563" }}>{formatRupiah(item.product.price)}</td>
                        <td className="py-2 px-2 text-xs sm:text-sm font-semibold text-right" style={{ color: "#1f2937" }}>{formatRupiah(item.product.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex sm:justify-end mb-8 sm:mb-10 break-inside-avoid">
                <div className="w-full sm:w-[300px] rounded-lg overflow-hidden print:overflow-visible" style={{ border: "1px solid #e5e7eb" }}>
                  <div className="flex justify-between px-4 py-3" style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <span className="text-xs sm:text-sm font-semibold" style={{ color: "#4b5563" }}>Total Item</span>
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#1f2937" }}>{totalItems} Pcs</span>
                  </div>
                  <div className="flex justify-between px-4 py-4" style={{ backgroundColor: "#1f2937", color: "#ffffff" }}>
                    <span className="text-sm sm:text-base font-bold">Total Belanja</span>
                    <span className="text-sm sm:text-base font-bold">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {settings.paymentInfo && (
                <div className="p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed break-inside-avoid" style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <p className="font-bold mb-2 uppercase tracking-wide text-xs" style={{ color: "#1f2937" }}>Instruksi Pembayaran:</p>
                  {settings.paymentInfo}
                </div>
              )}

              <div className="mt-3 text-[10px] sm:text-xs text-center italic break-inside-avoid" style={{ color: "#6b7280" }}>
                * Total tagihan di atas belum termasuk Ongkos Kirim. Silakan hubungi admin via WhatsApp untuk perhitungan ongkos kirim.
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
