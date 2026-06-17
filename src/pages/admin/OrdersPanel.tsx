import { useEffect, useState } from "react";
import { getOrders, type Order } from "@/lib/store";
import { formatRupiah } from "@/lib/products";
import { Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrdersPanel() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handlePrint = (order: Order) => {
    // Arahkan ke halaman invoice dengan membawa data pesanan persis seperti checkout
    navigate("/invoice", {
      state: {
        cart: order.cart_items,
        customer: order.customer_info,
        invoiceNo: order.invoice_no,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-muted-foreground animate-pulse">Memuat data pesanan...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-card border border-border/40">
        <p className="text-muted-foreground mb-2">Belum ada pesanan yang masuk.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-border/40 overflow-hidden">
      
      {/* Tampilan Mobile (Card) */}
      <div className="block sm:hidden divide-y divide-border/50">
        {orders.map((order) => {
          const date = new Date(order.created_at);
          const formattedDate = new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date);
          const totalItems = order.cart_items.reduce((acc, item) => acc + item.quantity, 0);

          return (
            <div key={order.id} className="p-4 flex items-center justify-between gap-3 hover:bg-secondary/20 transition">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {order.invoice_no}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{formattedDate}</span>
                </div>
                <h3 className="font-semibold text-[14px] text-foreground truncate">{order.customer_info.nama}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[12px] font-bold">{formatRupiah(order.total_price)}</span>
                  <span className="text-[11px] text-muted-foreground">• {totalItems} pcs</span>
                </div>
              </div>
              <button
                onClick={() => handlePrint(order)}
                className="shrink-0 grid place-items-center w-10 h-10 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition"
                title="Cetak PDF"
              >
                <Printer className="w-[18px] h-[18px]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Tampilan Desktop (Table) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-secondary/50 border-b border-border text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-semibold w-40">No. Invoice</th>
              <th className="px-5 py-4 font-semibold">Tanggal</th>
              <th className="px-5 py-4 font-semibold">Customer</th>
              <th className="px-5 py-4 font-semibold text-center">Item</th>
              <th className="px-5 py-4 font-semibold text-right">Total</th>
              <th className="px-5 py-4 font-semibold text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {orders.map((order) => {
              const date = new Date(order.created_at);
              const formattedDate = new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(date);
              
              const totalItems = order.cart_items.reduce((acc, item) => acc + item.quantity, 0);

              return (
                <tr key={order.id} className="hover:bg-secondary/20 transition">
                  <td className="px-5 py-4 font-mono font-medium text-primary">
                    {order.invoice_no}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{formattedDate}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-foreground">{order.customer_info.nama}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{order.customer_info.noWa}</div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex bg-secondary text-foreground px-2 py-1 rounded text-xs font-medium">
                      {totalItems} pcs
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-foreground text-right">
                    {formatRupiah(order.total_price)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handlePrint(order)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold transition"
                      title="Lihat & Cetak PDF"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
