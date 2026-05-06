"use client";

import { Search, Filter, Eye } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";

export default function ManajemenPesananPage() {
  const dummyOrders = [
    {
      id: "ord-8f7a-1234",
      total_harga: 1599000,
      metode_pembayaran: "TRANSFER",
      status_order: "MENUNGGU_KONFIRMASI",
      created_at: "2026-05-06T10:15:00.000Z",
      customer: {
        nama: "Budi Santoso",
        no_whatsapp: "081234567890",
      },
    },
    {
      id: "ord-2b3c-5678",
      total_harga: 549000,
      metode_pembayaran: "COD",
      status_order: "PENDING",
      created_at: "2026-05-06T09:30:00.000Z",
      customer: {
        nama: "Siti Aminah",
        no_whatsapp: "089876543210",
      },
    },
    {
      id: "ord-9d8e-9012",
      total_harga: 1100000,
      metode_pembayaran: "TRANSFER",
      status_order: "SELESAI",
      created_at: "2026-05-05T14:20:00.000Z",
      customer: {
        nama: "Andi Saputra",
        no_whatsapp: "085612345678",
      },
    },
    {
      id: "ord-1a2b-3456",
      total_harga: 449000,
      metode_pembayaran: "COD",
      status_order: "BATAL",
      created_at: "2026-05-04T16:45:00.000Z",
      customer: {
        nama: "Dewi Lestari",
        no_whatsapp: "087798765432",
      },
    },
  ];

  // Fungsi untuk memformat tanggal beserta jam
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fungsi untuk menentukan warna badge berdasarkan status
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

  return (
    <div className="w-full relative">
      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Pesanan</h1>
          <p className="text-sm text-gray-400 mt-1">
            Pantau transaksi masuk, verifikasi pembayaran, dan perbarui status
            pesanan.
          </p>
        </div>
      </div>

      {/* 2. AREA PENCARIAN DAN FILTER */}
      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama atau No. WhatsApp pelanggan..."
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#B88E2F] transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm">
            <option value="">Semua Metode</option>
            <option value="TRANSFER">Transfer</option>
            <option value="COD">COD</option>
          </select>
          <select className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm">
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="MENUNGGU_KONFIRMASI">Menunggu Konfirmasi</option>
            <option value="SELESAI">Selesai</option>
            <option value="BATAL">Batal</option>
          </select>
          <button className="bg-[#0A0A0A] border border-gray-800 hover:border-gray-600 text-white p-2 rounded-lg transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* 3. TABEL DATA PESANAN */}
      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden">
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
                <th scope="col" className="px-6 py-4 font-medium text-nowrap">
                  Waktu Pesan
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
              {dummyOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                >
                  <td className="px-6 py-4 text-nowrap">
                    <span className="font-mono text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 border border-gray-700">
                      {order.id.substring(0, 8)}...
                    </span>
                  </td>

                  <td className="px-6 py-4 text-nowrap">
                    <p className="font-bold text-white mb-0.5">
                      {order.customer.nama}
                    </p>
                    <span className="text-xs text-gray-500">
                      {order.customer.no_whatsapp}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {formatDateTime(order.created_at)}
                  </td>

                  <td className="px-6 py-4 text-nowrap">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {order.metode_pembayaran}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-white font-medium">
                    {formatRupiah(order.total_harga)}
                  </td>

                  <td className="px-6 py-4 text-nowrap">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusBadge(order.status_order)}`}
                    >
                      {order.status_order.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors"
                      title="Proses / Lihat Detail"
                    >
                      <Eye size={16} className="mr-2" />
                      <span className="text-xs font-medium">Detail</span>
                    </button>
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
