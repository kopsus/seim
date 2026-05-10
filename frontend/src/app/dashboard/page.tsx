"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Clock,
  PackageCheck,
  PackageSearch,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import axiosInstance from "@/lib/axios";

export default function DashboardUtamaPage() {
  // State untuk menyimpan data statistik dari backend
  const [dashboardStats, setDashboardStats] = useState({
    totalPendapatan: 0,
    pesananMenunggu: 0,
    sepatuTerjual: 0,
    sepatuReady: 0,
  });

  // State untuk menyimpan pesanan terbaru
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // State Loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Memanggil 2 API sekaligus agar lebih cepat (Stats dan 5 Pesanan Terbaru)
        const [statsResponse, ordersResponse] = await Promise.all([
          axiosInstance.get("/dashboard/stats"),
          axiosInstance.get("/orders", { params: { page: 1, limit: 5 } }),
        ]);

        // 1. Set Data Statistik
        const statsData = statsResponse.data.data;
        setDashboardStats({
          totalPendapatan: statsData.totalRevenue,
          pesananMenunggu: statsData.pendingOrders,
          sepatuTerjual: statsData.soldProducts,
          sepatuReady: statsData.readyProducts,
        });

        // 2. Set Data Pesanan Terbaru
        setRecentOrders(ordersResponse.data.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format Tanggal untuk tabel
  const formatDate = (dateString: string) => {
    return (
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString)) + " WIB"
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "MENUNGGU_KONFIRMASI":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SELESAI":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "BATAL":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#B88E2F] animate-spin mb-4" />
        <p className="text-gray-400 font-medium animate-pulse">
          Menyiapkan ringkasan bisnis Anda...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Ringkasan Dasbor</h1>
        <p className="text-sm text-gray-400 mt-1">
          Selamat datang kembali! Berikut adalah ringkasan bisnis Anda hari ini.
        </p>
      </div>

      {/* --- KARTU STATISTIK --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <DollarSign size={28} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Pendapatan</p>
            <h3
              className="text-xl font-bold text-white truncate max-w-30"
              title={formatRupiah(dashboardStats.totalPendapatan)}
            >
              {formatRupiah(dashboardStats.totalPendapatan)}
            </h3>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
            <Clock size={28} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Menunggu Proses</p>
            <h3 className="text-2xl font-bold text-white">
              {dashboardStats.pesananMenunggu}{" "}
              <span className="text-sm font-normal text-gray-500">Pesanan</span>
            </h3>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <PackageCheck size={28} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Sepatu Terjual</p>
            <h3 className="text-2xl font-bold text-white">
              {dashboardStats.sepatuTerjual}{" "}
              <span className="text-sm font-normal text-gray-500">Pasang</span>
            </h3>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#B88E2F]/10 flex items-center justify-center shrink-0">
            <PackageSearch size={28} className="text-[#B88E2F]" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Stok Tersedia</p>
            <h3 className="text-2xl font-bold text-white">
              {dashboardStats.sepatuReady}{" "}
              <span className="text-sm font-normal text-gray-500">Pasang</span>
            </h3>
          </div>
        </div>
      </div>

      {/* --- TABEL PESANAN TERBARU --- */}
      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Pesanan Terbaru</h2>
          {/* Ubah href jika rute tabel order Anda berbeda, misalnya /dashboard/pesanan */}
          <Link
            href="/dashboard/orders"
            className="text-sm text-[#B88E2F] hover:text-[#9A7526] font-medium flex items-center transition-colors"
          >
            Lihat Semua <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0A0A0A] text-gray-300 border-b border-gray-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Pelanggan
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Waktu
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Total
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-nowrap">
                      <span className="font-mono text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 border border-gray-700">
                        {order.id.split("-")[0]}...
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white text-nowrap">
                      {order.customer?.nama || "Pelanggan"}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {formatRupiah(Number(order.total_harga))}
                    </td>
                    <td className="px-6 py-4 text-nowrap">
                      <span
                        className={`px-2.5 py-1 text-[9px] font-bold rounded-full border ${getStatusBadge(order.status_order)}`}
                      >
                        {order.status_order.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
