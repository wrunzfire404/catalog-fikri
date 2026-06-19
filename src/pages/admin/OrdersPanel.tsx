import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder, type Order } from "@/lib/store";
import { formatRupiah } from "@/lib/products";
import { Printer, CheckCircle, Clock, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrdersPanel() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  const toggleStatus = async (order: Order) => {
    const newStatus = order.status === "paid" ? "unpaid" : "paid";
    // Optimistic UI update
    setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
    try {
      await updateOrderStatus(order.id, newStatus);
    } catch (e) {
      alert("Gagal memperbarui status pesanan");
      loadOrders(); // Revert
    }
  };

  const handleDelete = async (order: Order) => {
    if (!window.confirm(`Yakin ingin menghapus pesanan ${order.invoice_no} secara permanen?`)) {
      return;
    }
    
    // Optimistic UI update
    setOrders(orders.filter((o) => o.id !== order.id));
    
    try {
      await deleteOrder(order.id);
    } catch (e) {
      alert("Gagal menghapus pesanan");
      loadOrders(); // Revert
    }
  };

  const handlePrint = (order: Order) => {
    // Arahkan ke halaman invoice dengan membawa data pesanan persis seperti checkout
    navigate("/invoice", {
      state: {
        cart: order.cart_items,
        customer: order.customer_info,
        invoiceNo: order.invoice_no,
        status: order.status || "unpaid",
        isAdmin: true,
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

  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    return (
      o.invoice_no.toLowerCase().includes(query) ||
      o.customer_info.nama.toLowerCase().includes(query) ||
      o.customer_info.noWa.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari invoice, nama customer, atau No. WA..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition shadow-sm"
        />
      </div>
      <div className="bg-white rounded-xl shadow-card border border-border/40 overflow-hidden">
        
        {/* Tampilan Mobile (Card) */}
        <div className="block sm:hidden divide-y divide-border/50">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-[14px]">
              Pesanan tidak ditemukan.
            </div>
          ) : (
            filteredOrders.map((order) => {
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
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handlePrint(order)}
                  className="grid place-items-center w-10 h-10 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition"
                  title="Cetak PDF"
                >
                  <Printer className="w-[18px] h-[18px]" />
                </button>
                <button
                  onClick={() => toggleStatus(order)}
                  className={`grid place-items-center w-10 h-10 rounded-full transition ${
                    order.status === "paid"
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                  }`}
                  title={order.status === "paid" ? "Tandai Belum Lunas" : "Tandai Lunas"}
                >
                  {order.status === "paid" ? <CheckCircle className="w-[18px] h-[18px]" /> : <Clock className="w-[18px] h-[18px]" />}
                </button>
                <button
                  onClick={() => handleDelete(order)}
                  className="grid place-items-center w-10 h-10 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition"
                  title="Hapus Pesanan"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          );
        })
      )}
      </div>

      {/* Tampilan Desktop (Table) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-secondary/50 border-b border-border text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-semibold w-40">No. Invoice</th>
              <th className="px-5 py-4 font-semibold">Tanggal</th>
              <th className="px-5 py-4 font-semibold">Customer</th>
              <th className="px-5 py-4 font-semibold text-center">Status</th>
              <th className="px-5 py-4 font-semibold text-center">Item</th>
              <th className="px-5 py-4 font-semibold text-right">Total</th>
              <th className="px-5 py-4 font-semibold text-center w-40">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-[14px]">
                  Pesanan tidak ditemukan.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
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
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status === "paid" ? "Lunas" : "Belum Lunas"}
                    </span>
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
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleStatus(order)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                          order.status === "paid"
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                        title={order.status === "paid" ? "Batalkan Lunas" : "Tandai Lunas"}
                      >
                        {order.status === "paid" ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handlePrint(order)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold transition"
                        title="Lihat & Cetak PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition"
                        title="Hapus Pesanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
