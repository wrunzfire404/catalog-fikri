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
      <div className="overflow-x-auto">
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
