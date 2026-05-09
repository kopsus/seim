"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import axiosInstance from "@/lib/axios";

import ModalDetailOrder from "@/components/dashboard/order/ModalDetailOrder";

export default function ManajemenPesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };
      if (searchQuery) params.search = searchQuery;
      if (selectedStatus) params.status = selectedStatus;

      const response = await axiosInstance.get("/orders", { params });
      setOrders(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleViewDetail = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Mengembalikan warna untuk 4 status utama
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "DIPROSES":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SELESAI":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "BATAL":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Pesanan</h1>
          <p className="text-sm text-gray-400 mt-1">
            Pantau pesanan masuk, verifikasi pembayaran, dan atur pengiriman.
          </p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama atau WhatsApp pembeli..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#B88E2F] transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          {/* Opsi dropdown disesuaikan ke 4 status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="DIPROSES">Diproses</option>
            <option value="SELESAI">Selesai</option>
            <option value="BATAL">Batal</option>
          </select>
          <button
            onClick={fetchOrders}
            className="bg-[#0A0A0A] border border-gray-800 hover:border-gray-600 text-[#B88E2F] hover:text-white p-2 rounded-lg transition-colors"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0A0A0A] text-gray-300 border-b border-gray-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Order ID & Tanggal
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Pelanggan
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Metode
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Total Harga
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="mt-2 text-xs">Memuat data pesanan...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500 italic"
                  >
                    Belum ada data pesanan.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="font-mono text-xs text-white mb-1 truncate w-32"
                        title={order.id}
                      >
                        #{order.id.split("-")[0]}...
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {formatDate(order.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">
                        {order.customer?.nama}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customer?.no_whatsapp}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <span
                        className={`px-2 py-1 text-[10px] rounded font-bold ${order.metode_pembayaran === "TRANSFER" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}
                      >
                        {order.metode_pembayaran}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {formatRupiah(Number(order.total_harga))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-[9px] font-bold rounded-full border ${getStatusBadge(order.status_order)}`}
                      >
                        {order.status_order}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#B88E2F] text-gray-300 hover:text-white rounded border border-gray-800 hover:border-[#B88E2F] transition-colors text-xs font-medium"
                      >
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalDetailOrder
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        onSuccess={fetchOrders}
      />
    </div>
  );
}
