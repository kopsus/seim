"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, Store } from "lucide-react";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cod">(
    "transfer",
  );

  const orderItems = [
    {
      id: 1,
      name: "Air Retro High Black White",
      size: 42,
      price: 599000,
      imageUrl:
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    },
    {
      id: 2,
      name: "Vans Old Skool Black",
      size: 43,
      price: 449000,
      imageUrl:
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    },
  ];

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const totalProduk = orderItems.reduce((total, item) => total + item.price, 0);
  const ongkir = 0;
  const totalHarga = totalProduk + ongkir;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Katalog
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Kotak Data Pemesan */}
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">Data Pemesan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  No. WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={3}
                  placeholder="Masukkan alamat pengiriman atau catatan untuk COD..."
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Kotak Metode Pembayaran */}
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">
              Metode Pembayaran
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opsi Transfer Bank */}
              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex items-start p-4 border rounded-xl transition-all text-left ${
                  paymentMethod === "transfer"
                    ? "border-[#B88E2F] bg-[#B88E2F]/10"
                    : "border-gray-800 bg-[#0A0A0A] hover:border-gray-600"
                }`}
              >
                <div
                  className={`mt-0.5 mr-3 ${paymentMethod === "transfer" ? "text-[#B88E2F]" : "text-gray-500"}`}
                >
                  {paymentMethod === "transfer" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <CreditCard size={20} />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold ${paymentMethod === "transfer" ? "text-[#B88E2F]" : "text-white"}`}
                  >
                    Transfer Bank
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Lakukan pembayaran ke rekening kami. Konfirmasi manual oleh
                    kasir.
                  </p>
                </div>
              </button>

              {/* Opsi COD */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-start p-4 border rounded-xl transition-all text-left ${
                  paymentMethod === "cod"
                    ? "border-[#B88E2F] bg-[#B88E2F]/10"
                    : "border-gray-800 bg-[#0A0A0A] hover:border-gray-600"
                }`}
              >
                <div
                  className={`mt-0.5 mr-3 ${paymentMethod === "cod" ? "text-[#B88E2F]" : "text-gray-500"}`}
                >
                  {paymentMethod === "cod" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Store size={20} />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold ${paymentMethod === "cod" ? "text-[#B88E2F]" : "text-white"}`}
                  >
                    COD di Gerai
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Bayar langsung di toko pada tanggal yang dipilih.
                  </p>
                </div>
              </button>
            </div>

            {paymentMethod === "cod" && (
              <div className="mt-6 pt-6 border-t border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-bold text-white mb-2">
                  Pilih Tanggal Pengambilan (COD)
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Silakan tentukan kapan Anda akan mengambil sepatu di gerai
                  kami.
                </p>

                <input
                  type="date"
                  className="w-full md:w-1/2 bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] color-scheme-dark"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-4 mb-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative w-16 h-16 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400">Size {item.size}</p>
                    <div className="font-bold text-sm text-gray-300 mt-1">
                      {formatRupiah(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rincian Harga */}
            <div className="border-t border-gray-800 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Produk</span>
                <span className="text-white font-medium">
                  {formatRupiah(totalProduk)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Ongkir</span>
                <span className="text-white font-medium">
                  {ongkir === 0 ? "Rp 0" : formatRupiah(ongkir)}
                </span>
              </div>
            </div>

            {/* Total Akhir */}
            <div className="border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">Total</span>
                <span className="text-2xl font-bold text-[#B88E2F]">
                  {formatRupiah(totalHarga)}
                </span>
              </div>
            </div>

            {/* Tombol Eksekusi */}
            <button className="w-full bg-[#B88E2F] hover:bg-[#9A7526] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#B88E2F]/20">
              Buat Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
