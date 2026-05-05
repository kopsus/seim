"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Store,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cod">(
    "transfer",
  );
  const [codDate, setCodDate] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const totalProduk = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const ongkir = 0;
  const totalHarga = totalProduk + ongkir;

  const handleBuatPesanan = () => {
    if (!name || !phone || !address) {
      alert("Mohon lengkapi Nama, No. WhatsApp, dan Alamat Anda.");
      return;
    }
    if (paymentMethod === "cod" && !codDate) {
      alert("Mohon pilih tanggal pengambilan untuk metode COD.");
      return;
    }

    const orderDetails = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} (Size: ${item.size}) - ${item.quantity}x ${formatRupiah(item.price)}`,
      )
      .join("%0A");

    let waMessage = `Halo SEIM, saya ingin membuat pesanan!%0A%0A`;
    waMessage += `*DATA PEMESAN*%0A`;
    waMessage += `Nama: ${name}%0A`;
    waMessage += `No. WA: ${phone}%0A`;
    waMessage += `Alamat: ${address}%0A%0A`;
    waMessage += `*DETAIL PESANAN*%0A${orderDetails}%0A%0A`;
    waMessage += `*TOTAL TAGIHAN: ${formatRupiah(totalHarga)}*%0A`;
    waMessage += `Metode Pembayaran: ${paymentMethod === "transfer" ? "Transfer Bank" : "COD di Gerai"}%0A`;

    if (paymentMethod === "cod") {
      waMessage += `Tanggal Pengambilan: ${codDate}%0A`;
    }

    waMessage += `%0AMohon konfirmasinya ya Min!`;

    const waNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Admin SEIM
    window.open(`https://wa.me/${waNumber}?text=${waMessage}`, "_blank");

    clearCart();
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag size={64} className="text-gray-800 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Keranjang Anda Kosong
        </h2>
        <p className="text-gray-400 mb-8">
          Anda belum menambahkan sepatu apa pun ke dalam keranjang.
        </p>
        <Link
          href="/katalog"
          className="bg-[#B88E2F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A7526] transition-colors"
        >
          Kembali Berbelanja
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tombol Kembali */}
      <div className="mb-6 md:mb-8">
        <Link
          href="/katalog"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Kembali Belanja
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BAGIAN KIRI: Form Data & Pembayaran */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">Data Pemesan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat pengiriman atau catatan untuk COD..."
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">
              Metode Pembayaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex items-start p-4 border rounded-xl transition-all text-left ${paymentMethod === "transfer" ? "border-[#B88E2F] bg-[#B88E2F]/10" : "border-gray-800 bg-[#0A0A0A] hover:border-gray-600"}`}
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

              <button
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-start p-4 border rounded-xl transition-all text-left ${paymentMethod === "cod" ? "border-[#B88E2F] bg-[#B88E2F]/10" : "border-gray-800 bg-[#0A0A0A] hover:border-gray-600"}`}
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
                  value={codDate}
                  onChange={(e) => setCodDate(e.target.value)}
                  className="w-full md:w-1/2 bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] color-scheme-dark"
                />
              </div>
            )}
          </div>
        </div>

        {/* BAGIAN KANAN: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-2 scrollbar-hide">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex space-x-4">
                  <div className="relative w-16 h-16 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Size {item.size} <span className="mx-1">•</span> Qty:{" "}
                      {item.quantity}
                    </p>
                    <div className="font-bold text-sm text-gray-300 mt-1">
                      {formatRupiah(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                  {ongkir === 0 ? "Gratis" : formatRupiah(ongkir)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">Total</span>
                <span className="text-2xl font-bold text-[#B88E2F]">
                  {formatRupiah(totalHarga)}
                </span>
              </div>
            </div>

            <button
              onClick={handleBuatPesanan}
              className="w-full bg-[#B88E2F] hover:bg-[#9A7526] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#B88E2F]/20"
            >
              Buat Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
