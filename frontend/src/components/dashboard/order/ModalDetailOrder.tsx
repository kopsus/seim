"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, MapPin, CreditCard, Package } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";

interface ModalDetailOrderProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function ModalDetailOrder({
  isOpen,
  onClose,
  order,
}: ModalDetailOrderProps) {
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => {
        setNewStatus(order.status_order);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSaveStatus = () => {
    console.log(
      "Memanggil API: Mengubah status order",
      order.id,
      "menjadi:",
      newStatus,
    );
    // TODO: Fetch/Axios API di sini

    // Nanti setelah sukses, bisa munculkan notifikasi/toast
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-5xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#121212]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Detail Pesanan{" "}
              <span className="text-[#B88E2F] font-mono text-sm ml-2">
                #{order.id.substring(0, 8)}
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Dibuat pada: {formatDateTime(order.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 flex flex-col gap-6">
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-gray-800">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#B88E2F]" /> Informasi
                Pengiriman
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Nama Pelanggan</p>
                  <p className="text-white font-medium">
                    {order.customer?.nama}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">No. WhatsApp</p>
                  <p className="text-white font-medium">
                    {order.customer?.no_whatsapp}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 mb-1">Alamat Lengkap</p>
                  <p className="text-white font-medium leading-relaxed">
                    {order.customer?.alamat || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-gray-800">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#B88E2F]" /> Produk yang
                Dipesan
              </h3>

              <div className="flex flex-col gap-4">
                {order.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                      <Image
                        src={item.product?.foto?.[0] || "/dummy-shoe.jpg"}
                        alt={item.product?.nama_produk || "Sepatu"}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <p className="text-white font-bold text-sm mb-1">
                        {item.product?.nama_produk}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        Size: {item.product?.size}
                      </p>
                      <p className="text-[#B88E2F] font-bold text-sm">
                        {formatRupiah(item.harga_saat_beli)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3 flex flex-col gap-6">
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-gray-800">
              <h3 className="text-white font-bold mb-4">Ubah Status Pesanan</h3>

              <div className="flex flex-col gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#B88E2F] font-medium"
                >
                  <option value="PENDING">Pending (Menunggu Bayar)</option>
                  <option value="MENUNGGU_KONFIRMASI">
                    Menunggu Konfirmasi
                  </option>
                  <option value="SELESAI">Selesai / Dikirim</option>
                  <option value="BATAL">Batal</option>
                </select>

                <button
                  onClick={handleSaveStatus}
                  disabled={newStatus === order.status_order}
                  className="w-full py-2.5 rounded-lg font-medium text-white bg-[#B88E2F] hover:bg-[#9A7526] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simpan Status
                </button>
              </div>
            </div>

            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-gray-800">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#B88E2F]" /> Pembayaran
              </h3>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3 text-sm">
                <span className="text-gray-400">Metode</span>
                <span className="text-white font-bold uppercase">
                  {order.metode_pembayaran}
                </span>
              </div>

              {order.metode_pembayaran === "COD" && order.tanggal_cod && (
                <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3 text-sm">
                  <span className="text-gray-400">Rencana Ambil</span>
                  <span className="text-yellow-500 font-bold">
                    {formatDateTime(order.tanggal_cod)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-base">
                <span className="text-gray-300">Total Tagihan</span>
                <span className="text-[#B88E2F] font-bold text-lg">
                  {formatRupiah(order.total_harga)}
                </span>
              </div>
            </div>

            {order.metode_pembayaran === "TRANSFER" && (
              <div className="bg-[#0A0A0A] p-5 rounded-xl border border-gray-800">
                <h3 className="text-white font-bold mb-4">Bukti Transfer</h3>
                {order.bukti_tf_url ? (
                  <div className="relative w-full aspect-3/4 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    <Image
                      src={order.bukti_tf_url}
                      alt="Bukti Transfer"
                      fill
                      className="object-cover"
                    />
                    <a
                      href={order.bukti_tf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1.5 rounded backdrop-blur-md hover:bg-black transition-colors"
                    >
                      Lihat Penuh
                    </a>
                  </div>
                ) : (
                  <div className="w-full p-6 border-2 border-dashed border-gray-700 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">
                      Pelanggan belum mengunggah bukti pembayaran.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
