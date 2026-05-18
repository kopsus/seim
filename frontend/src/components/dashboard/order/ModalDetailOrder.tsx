"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  Phone,
  User,
  Package,
  CreditCard,
  ExternalLink,
  Calendar,
  Download,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { getImageUrl } from "@/utils/getImageUrl";
import axiosInstance from "@/lib/axios";
import html2canvas from "html2canvas";

interface ModalDetailOrderProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onSuccess: () => void;
}

export default function ModalDetailOrder({
  isOpen,
  onClose,
  order,
  onSuccess,
}: ModalDetailOrderProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null); // Referensi untuk menangkap struk HTML

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    const confirmMsg = `Yakin ingin mengubah status pesanan ini menjadi ${newStatus}?`;
    if (!window.confirm(confirmMsg)) return;

    setIsUpdating(true);
    try {
      await axiosInstance.put(`/orders/${order.id}/status`, {
        status: newStatus,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Terjadi kesalahan saat memperbarui status pesanan.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Fungsi untuk mengubah elemen HTML Struk menjadi Gambar PNG
  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      // html2canvas mengambil 'screenshot' dari elemen
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Agar hasil gambarnya HD
        backgroundColor: "#ffffff", // Background struk warna putih
      });

      const image = canvas.toDataURL("image/png");

      // Membuat simulasi klik download
      const link = document.createElement("a");
      link.href = image;
      link.download = `Struk_SEIM_${order.id.split("-")[0]}.png`;
      link.click();
    } catch (error) {
      console.error("Gagal membuat struk", error);
      alert(
        "Gagal men-download struk. Pastikan perangkat Anda mendukung canvas.",
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* ========================================================
        AREA STRUK DIGITAL TERSEMBUNYI (Hanya untuk di-download) 
        Kita geser jauh dari layar (-9999px) agar tidak merusak UI Modal
        ========================================================
      */}
      <div className="absolute -left-2499.75 top-0">
        <div
          ref={receiptRef}
          className="bg-white text-black p-6 w-87.5 font-mono text-sm leading-relaxed"
        >
          {/* Header Struk */}
          <div className="text-center mb-4 border-b-2 border-black border-dashed pb-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest">
              SEIM STORE
            </h2>
            <p className="text-xs mt-1">Original Shoes & Apparel</p>
            <p className="text-xs">Jl. Sneaker No. 1, Jakarta</p>
          </div>

          {/* Info Transaksi */}
          <div className="mb-4 text-xs space-y-1 border-b-2 border-black border-dashed pb-4">
            <p>
              <span className="font-bold">Order ID:</span>{" "}
              {order.id.split("-")[0]}
            </p>
            <p>
              <span className="font-bold">Tanggal:</span>{" "}
              {formatDate(order.created_at || new Date().toISOString())}
            </p>
            <p>
              <span className="font-bold">Pelanggan:</span>{" "}
              {order.customer?.nama}
            </p>
            <p>
              <span className="font-bold">WhatsApp:</span>{" "}
              {order.customer?.no_whatsapp}
            </p>
            <p>
              <span className="font-bold">Metode:</span>{" "}
              {order.metode_pembayaran}
            </p>
          </div>

          {/* Detail Item */}
          <div className="mb-4">
            <p className="font-bold text-xs mb-2">DETAIL PESANAN :</p>
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between mb-3 text-xs">
                <div className="w-2/3 pr-2">
                  <p className="font-bold uppercase leading-tight">
                    {item.product?.nama_produk}
                  </p>
                  <p className="text-[10px]">
                    Size: {item.size || "-"} | {item.product?.kondisi}
                  </p>
                </div>
                <div className="w-1/3 text-right">
                  <p>{formatRupiah(Number(item.harga_saat_beli))}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Tagihan */}
          <div className="border-t-2 border-black border-dashed pt-4 mb-6">
            <div className="flex justify-between font-bold text-sm">
              <p>TOTAL TAGIHAN</p>
              <p>{formatRupiah(Number(order.total_harga))}</p>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <p>STATUS</p>
              <p className="uppercase">
                {order.status_order === "PENDING"
                  ? "BELUM LUNAS"
                  : "LUNAS (PROSES)"}
              </p>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="text-center text-xs">
            <p className="font-bold italic">Terima Kasih!</p>
            <p className="mt-1">Pesanan Anda sedang kami siapkan.</p>
            <p className="mt-1">IG: @seim.store | WA: 08123456789</p>
          </div>
        </div>
      </div>
      {/* ======================================================== */}

      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#121212]">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Detail Pesanan
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-1">
                ID: {order.id}
              </p>
            </div>

            {/* TOMBOL DOWNLOAD STRUK DI HEADER (Muncul Jika PROSES/SELESAI) */}
            {(order.status_order === "DIPROSES" ||
              order.status_order === "SELESAI") && (
              <button
                onClick={handleDownloadReceipt}
                className="hidden md:flex items-center gap-2 ml-4 bg-[#B88E2F]/20 text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-[#B88E2F]/30"
              >
                <Download size={14} /> Cetak Struk
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Tombol Cetak Struk untuk Mobile */}
          {(order.status_order === "DIPROSES" ||
            order.status_order === "SELESAI") && (
            <button
              onClick={handleDownloadReceipt}
              className="md:hidden flex items-center justify-center gap-2 w-full bg-[#B88E2F]/20 text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors border border-[#B88E2F]/30"
            >
              <Download size={18} /> Download Struk Pembelian
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartu Informasi Pelanggan */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-gray-800">
              <h3 className="text-sm font-bold text-[#B88E2F] mb-4 uppercase tracking-wider flex items-center gap-2">
                <User size={16} /> Informasi Pelanggan
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs">Nama Lengkap</p>
                    <p className="text-white font-medium">
                      {order.customer?.nama}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs">No. WhatsApp</p>
                    <p className="text-white font-medium">
                      {order.customer?.no_whatsapp}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs">Alamat Pengiriman</p>
                    <p className="text-white font-medium leading-relaxed">
                      {order.customer?.alamat}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Informasi Pembayaran */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-gray-800">
              <h3 className="text-sm font-bold text-[#B88E2F] mb-4 uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={16} /> Informasi Pembayaran
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Metode Pembayaran</span>
                  <span
                    className={`font-bold ${order.metode_pembayaran === "TRANSFER" ? "text-blue-500" : "text-purple-500"}`}
                  >
                    {order.metode_pembayaran}
                  </span>
                </div>

                {order.metode_pembayaran === "COD" && order.tanggal_cod && (
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar size={14} /> Tanggal COD
                    </span>
                    <span className="text-white">
                      {formatDate(order.tanggal_cod)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Total Tagihan</span>
                  <span className="text-[#B88E2F] font-bold text-lg">
                    {formatRupiah(Number(order.total_harga))}
                  </span>
                </div>

                {order.metode_pembayaran === "TRANSFER" &&
                order.bukti_tf_url ? (
                  <div className="pt-2">
                    <span className="text-gray-400 block mb-2 text-xs">
                      Bukti Transfer:
                    </span>
                    <a
                      href={getImageUrl([order.bukti_tf_url])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs bg-blue-500/10 text-blue-500 px-3 py-2 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      <ExternalLink size={14} /> Cek Bukti Transfer
                    </a>
                  </div>
                ) : order.metode_pembayaran === "TRANSFER" &&
                  !order.bukti_tf_url ? (
                  <div className="pt-2">
                    <span className="text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded">
                      Belum mengunggah bukti transfer
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Tabel Daftar Produk */}
          <div>
            <h3 className="text-sm font-bold text-[#B88E2F] mb-3 uppercase tracking-wider flex items-center gap-2">
              <Package size={16} /> Produk Dipesan
            </h3>
            <div className="bg-[#0A0A0A] rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#121212] text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Produk</th>
                    <th className="px-4 py-3 font-medium text-center">Size</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Harga Satuan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {order.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-900 rounded overflow-hidden border border-gray-800">
                          <Image
                            src={getImageUrl(item.product?.foto)}
                            alt={item.product?.nama_produk || "Produk"}
                            fill
                            className="object-cover"
                            unoptimized={process.env.NODE_ENV === "development"}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {item.product?.nama_produk}
                          </p>
                          <p className="text-xs text-gray-500">
                            Kondisi: {item.product?.kondisi}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-[#B88E2F]">
                        {item.size || "-"}
                      </td>
                      <td className="px-4 py-3 text-white text-right font-medium">
                        {formatRupiah(Number(item.harga_saat_beli))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer: Area Ubah Status */}
        <div className="p-5 border-t border-gray-800 bg-[#121212] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Status Saat Ini:</span>
            <span className="px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded uppercase tracking-wider">
              {order.status_order}
            </span>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {order.status_order === "PENDING" && (
              <>
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus("DIPROSES")}
                  className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Proses Pesanan
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus("BATAL")}
                  className="flex-1 md:flex-none px-4 py-2 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-500 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Batalkan
                </button>
              </>
            )}

            {order.status_order === "DIPROSES" && (
              <>
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus("SELESAI")}
                  className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Tandai Selesai
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus("BATAL")}
                  className="flex-1 md:flex-none px-4 py-2 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-500 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Batalkan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
