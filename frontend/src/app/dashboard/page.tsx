"use client";

import Link from "next/link";
import {
  DollarSign,
  Clock,
  PackageCheck,
  PackageSearch,
  ArrowRight,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";

export default function DashboardUtamaPage() {
  const dashboardStats = {
    totalPendapatan: 15500000,
    pesananMenunggu: 5,
    sepatuTerjual: 24,
    sepatuReady: 112,
  };

  const recentOrders = [
    {
      id: "ord-8f7a-1234",
      nama_pelanggan: "Budi Santoso",
      total_harga: 1599000,
      status: "MENUNGGU_KONFIRMASI",
      waktu: "Hari ini, 10:15 WIB",
    },
    {
      id: "ord-2b3c-5678",
      nama_pelanggan: "Siti Aminah",
      total_harga: 549000,
      status: "PENDING",
      waktu: "Hari ini, 09:30 WIB",
    },
    {
      id: "ord-9d8e-9012",
      nama_pelanggan: "Andi Saputra",
      total_harga: 1100000,
      status: "SELESAI",
      waktu: "Kemarin, 14:20 WIB",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "MENUNGGU_KONFIRMASI":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SELESAI":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="w-full relative space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Ringkasan Dasbor</h1>
        <p className="text-sm text-gray-400 mt-1">
          Selamat datang kembali! Berikut adalah ringkasan bisnis Anda hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <DollarSign size={28} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Pendapatan</p>
            <h3 className="text-xl font-bold text-white">
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

      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Pesanan Terbaru</h2>
          <Link
            href="/dashboard/order"
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
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                >
                  <td className="px-6 py-4 text-nowrap">
                    <span className="font-mono text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 border border-gray-700">
                      {order.id.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white text-nowrap">
                    {order.nama_pelanggan}
                  </td>
                  <td className="px-6 py-4 text-xs">{order.waktu}</td>
                  <td className="px-6 py-4 font-medium text-white">
                    {formatRupiah(order.total_harga)}
                  </td>
                  <td className="px-6 py-4 text-nowrap">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusBadge(order.status)}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
