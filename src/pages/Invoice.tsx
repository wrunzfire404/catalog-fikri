import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CheckCircle2, Download, MessageCircle, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { formatRupiah, type CartItem, type CustomerInfo, waCheckoutLink } from "@/lib/products";
import { useStore } from "@/context/StoreContext";

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { settings } = useStore();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoiceNo] = useState(() => {
    const date = new Date();
    return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
  });

  const cart = state?.cart as CartItem[] | undefined;
  const customer = state?.customer as CustomerInfo | undefined;

  useEffect(() => {
    // Jika tidak ada data keranjang, redirect ke home
    if (!cart || cart.length === 0 || !customer) {
      navigate("/", { replace: true });
    }
  }, [cart, customer, navigate]);

  if (!cart || !customer) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsGenerating(true);
      // Tunggu font/gambar load
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Kualitas HD
        useCORS: true,
        logging: false,
      });
      
      if (!canvas.width || !canvas.height) {
        throw new Error("Kalkulasi ukuran dokumen gagal (Width/Height 0).");
      }

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNo}.pdf`);
    } catch (err: any) {
      console.error("Gagal membuat PDF", err);
      // Fallback to window.print if it's a SecurityError or something
      if (err?.name === "SecurityError" || err?.message?.toLowerCase().includes("tainted")) {
        alert("Gagal men-download PDF karena masalah keamanan gambar. Sistem akan mencoba membuka mode Print bawaan.");
        window.print();
      } else {
        alert(`Gagal men-download PDF: ${err?.message || "Unknown error"}. Silakan coba mode Print bawaan.`);
        window.print();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKonfirmasiWA = () => {
    const link = waCheckoutLink(cart, customer, settings);
    window.open(link, "_blank", "noreferrer");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Kembali ke Beranda</span>
          </Link>
          <img src="/images/logo.png" alt={settings.shopName} className="h-8 object-contain mix-blend-multiply" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="text-center mb-8 space-y-3">
          <CheckCircle2 className="w-16 h-16 mx-auto text-[#25D366]" />
          <h1 className="text-2xl md:text-3xl font-bold font-serif">Pesanan Dibuat!</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Terima kasih telah berbelanja di {settings.shopName}. Silakan download invoice Anda dan lakukan konfirmasi pembayaran via WhatsApp.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isGenerating ? "Memproses PDF..." : "Download Invoice PDF"}
          </button>
          
          <button
            onClick={handleKonfirmasiWA}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#20bd5a] active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Konfirmasi Pembayaran ke WA
          </button>
        </div>

        <hr className="border-border/60 mb-10" />

        <h3 className="text-center font-semibold text-muted-foreground mb-4 flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          Preview Invoice
        </h3>

        {/* Invoice Preview Container (Scaled for Mobile View) */}
        <div className="overflow-x-auto pb-8 flex justify-center custom-scrollbar">
          <div className="shadow-2xl border border-border/50 bg-white" style={{ minWidth: "800px" }}>
            
            {/* INVOICE TEMPLATE (A4 format roughly) */}
            <div 
              ref={invoiceRef} 
              id="invoice-print-area"
              className="bg-white p-10 md:p-14 text-black font-sans w-[800px]"
            >
              {/* Header Invoice */}
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-3">
                  {/* Gunakan gambar logo asli dengan crossOrigin agar tidak tainting canvas */}
                  <img src="/images/logo.png" className="h-16 object-contain" alt="Logo" crossOrigin="anonymous" />
                  <div>
                    <h2 className="font-bold text-2xl tracking-tight">{settings.shopName}</h2>
                    <p className="text-sm text-gray-500 mt-1">{settings.waNumber}</p>
                    <p className="text-sm text-gray-500 max-w-[250px] leading-snug">{settings.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-bold font-serif text-gray-800 tracking-wider mb-2">INVOICE</h1>
                  <p className="text-sm font-semibold text-gray-600">NO: {invoiceNo}</p>
                  <p className="text-sm text-gray-500">Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-red-500 font-semibold mt-2 border border-red-200 bg-red-50 px-2 py-1 inline-block rounded">BELUM DIBAYAR</p>
                </div>
              </div>

              {/* Info Kustomer */}
              <div className="mb-10 bg-gray-50/80 p-5 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Tagihan Kepada:</p>
                <h3 className="text-lg font-bold text-gray-800">{customer.nama}</h3>
                <p className="text-sm text-gray-600 mt-1">{customer.noWa}</p>
                <p className="text-sm text-gray-600 max-w-[400px] leading-relaxed">
                  {customer.kecamatan}, {customer.kabupaten}, {customer.provinsi}
                </p>
                {customer.catatan && (
                  <p className="text-sm text-gray-600 mt-3 border-t border-gray-200 pt-3">
                    <span className="font-semibold">Catatan:</span> {customer.catatan}
                  </p>
                )}
              </div>

              {/* Tabel Produk */}
              <table className="w-full text-left border-collapse mb-10">
                <thead>
                  <tr className="border-b-2 border-gray-800">
                    <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider w-12">No</th>
                    <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider">Nama Produk</th>
                    <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider text-center w-24">Jumlah</th>
                    <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider text-right w-32">Harga Satuan</th>
                    <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider text-right w-36">Total Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-4 px-2 text-sm text-gray-600">{idx + 1}</td>
                      <td className="py-4 px-2 text-sm text-gray-800 font-medium">
                        {item.product.name}
                        {item.variant?.color && item.variant.color !== item.product.name && (
                          <span className="text-gray-500 font-normal block text-xs mt-0.5">Warna: {item.variant.color}</span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-600 text-center">{item.quantity}</td>
                      <td className="py-4 px-2 text-sm text-gray-600 text-right">{formatRupiah(item.product.price)}</td>
                      <td className="py-4 px-2 text-sm text-gray-800 font-semibold text-right">{formatRupiah(item.product.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Belanja */}
              <div className="flex justify-end mb-12">
                <div className="w-[300px] border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-600">Total Item</span>
                    <span className="text-sm font-bold text-gray-800">{totalItems} Pcs</span>
                  </div>
                  <div className="flex justify-between px-4 py-4 bg-gray-800 text-white">
                    <span className="font-bold">Total Belanja</span>
                    <span className="font-bold">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Instruksi Pembayaran */}
              {settings.paymentInfo && (
                <div className="border border-gray-200 bg-gray-50 p-5 rounded-lg text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  <p className="font-bold text-gray-800 mb-2 uppercase tracking-wide text-xs">Instruksi Pembayaran:</p>
                  {settings.paymentInfo}
                </div>
              )}

              {/* Catatan Ongkir */}
              <div className="mt-4 text-xs text-gray-500 text-center italic">
                * Total tagihan di atas belum termasuk Ongkos Kirim. Silakan hubungi admin via WhatsApp untuk perhitungan ongkos kirim.
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
