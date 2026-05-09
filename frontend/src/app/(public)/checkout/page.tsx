"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Store,
  Upload,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/utils/formatRupiah";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER" | "COD">(
    "TRANSFER",
  );
  const [codDate, setCodDate] = useState("");

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      if (validationErrors.receipt) {
        setValidationErrors((prev) => ({ ...prev, receipt: "" }));
      }
    }
  };

  const totalProduk = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalHarga = totalProduk;

  const handleBuatPesanan = async () => {
    setValidationErrors({});

    if (!name || !phone || !address) {
      alert("Mohon lengkapi data diri Anda.");
      return;
    }
    if (paymentMethod === "COD" && !codDate) {
      setValidationErrors({ codDate: "Mohon pilih tanggal pengambilan COD." });
      return;
    }
    if (paymentMethod === "TRANSFER" && !receiptFile && !pendingOrderId) {
      setValidationErrors({ receipt: "Mohon unggah bukti transfer Anda." });
      return;
    }

    if (paymentMethod === "TRANSFER" && receiptFile) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (receiptFile.size > MAX_FILE_SIZE) {
        setValidationErrors({
          receipt: "Ukuran gambar terlalu besar. Maksimal 5MB.",
        });
        return;
      }
      if (!receiptFile.type.startsWith("image/")) {
        setValidationErrors({
          receipt: "File yang diunggah harus berupa gambar (JPG/PNG).",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let currentOrderId = pendingOrderId;

      if (!currentOrderId) {
        const productIds = items.map((item) => Number(item.id));

        const checkoutData = {
          customerName: name,
          customerWhatsapp: phone,
          customerAddress: address,
          paymentMethod: paymentMethod,
          codDate: paymentMethod === "COD" ? codDate : undefined,
          productIds: productIds,
        };

        const responseCheckout = await axiosInstance.post(
          "/orders/checkout",
          checkoutData,
        );

        currentOrderId = responseCheckout.data.data.id;

        setPendingOrderId(currentOrderId);
      }

      if (paymentMethod === "TRANSFER" && receiptFile && currentOrderId) {
        const formData = new FormData();
        formData.append("receipt", receiptFile);

        await axiosInstance.post(
          `/orders/${currentOrderId}/upload-receipt`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      alert("Pesanan berhasil dibuat! Admin akan segera memverifikasi.");
      setPendingOrderId(null);
      clearCart();
      router.push("/");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.log("Validasi backend gagal, menampilkan error ke form UI...");

        if (error.response.data?.errors) {
          const backendErrors = error.response.data.errors;
          const newErrors: Record<string, string> = {};

          backendErrors.forEach((err: any) => {
            if (!newErrors[err.field]) {
              newErrors[err.field] = err.message;
            }
          });

          setValidationErrors(newErrors);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          alert(
            error.response.data?.message ||
              "Data tidak valid, mohon periksa kembali.",
          );
        }
      } else {
        console.error("Terjadi masalah sistem:", error.message);
        alert(
          "Terjadi kesalahan sistem. Jika Anda sudah mengunggah bukti, silakan hubungi admin.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag size={64} className="text-gray-800 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Keranjang Kosong</h2>
        <Link
          href="/katalog"
          className="bg-[#B88E2F] text-white px-8 py-3 rounded-full font-bold mt-4"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/katalog"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Kembali Belanja
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">
              Data Pengiriman
            </h2>
            <div className="space-y-4">
              {/* BARU: Tampilkan pesan error di bawah input jika ada */}
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className={`w-full bg-[#0A0A0A] text-white border rounded-xl px-4 py-3 outline-none ${validationErrors.customerName ? "border-red-500" : "border-gray-800 focus:border-[#B88E2F]"}`}
                />
                {validationErrors.customerName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {validationErrors.customerName}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nomor WhatsApp (Aktif)"
                  className={`w-full bg-[#0A0A0A] text-white border rounded-xl px-4 py-3 outline-none ${validationErrors.customerWhatsapp ? "border-red-500" : "border-gray-800 focus:border-[#B88E2F]"}`}
                />
                {validationErrors.customerWhatsapp && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {validationErrors.customerWhatsapp}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat Lengkap / Catatan"
                  className={`w-full bg-[#0A0A0A] text-white border rounded-xl px-4 py-3 outline-none resize-none ${validationErrors.customerAddress ? "border-red-500" : "border-gray-800 focus:border-[#B88E2F]"}`}
                />
                {validationErrors.customerAddress && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {validationErrors.customerAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">
              Metode Pembayaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("TRANSFER")}
                className={`flex items-start p-4 border rounded-xl transition-all ${paymentMethod === "TRANSFER" ? "border-[#B88E2F] bg-[#B88E2F]/10" : "border-gray-800 bg-[#0A0A0A]"}`}
              >
                <CreditCard
                  className={`mr-3 ${paymentMethod === "TRANSFER" ? "text-[#B88E2F]" : "text-gray-500"}`}
                />
                <div className="text-left">
                  <h3
                    className={`font-bold ${paymentMethod === "TRANSFER" ? "text-[#B88E2F]" : "text-white"}`}
                  >
                    Transfer Bank
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Bayar via bank dan upload bukti
                  </p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-start p-4 border rounded-xl transition-all ${paymentMethod === "COD" ? "border-[#B88E2F] bg-[#B88E2F]/10" : "border-gray-800 bg-[#0A0A0A]"}`}
              >
                <Store
                  className={`mr-3 ${paymentMethod === "COD" ? "text-[#B88E2F]" : "text-gray-500"}`}
                />
                <div className="text-left">
                  <h3
                    className={`font-bold ${paymentMethod === "COD" ? "text-[#B88E2F]" : "text-white"}`}
                  >
                    COD di Gerai
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Ambil & bayar langsung di toko
                  </p>
                </div>
              </button>
            </div>

            {paymentMethod === "COD" && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <label className="text-sm text-gray-400 mb-2 block">
                  Pilih Tanggal Pengambilan
                </label>
                <input
                  type="date"
                  value={codDate}
                  onChange={(e) => setCodDate(e.target.value)}
                  className={`bg-[#0A0A0A] text-white border rounded-lg px-4 py-2 outline-none ${validationErrors.codDate ? "border-red-500" : "border-gray-800 focus:border-[#B88E2F]"}`}
                />
                {validationErrors.codDate && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {validationErrors.codDate}
                  </p>
                )}
              </div>
            )}

            {paymentMethod === "TRANSFER" && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-sm text-white font-bold mb-1">
                  Transfer ke Rekening SEIM:
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  BCA 1234-5678-90 a/n SEIM STORE
                </p>

                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl bg-[#0A0A0A] cursor-pointer ${validationErrors.receipt ? "border-red-500" : "border-gray-700 hover:border-[#B88E2F]"}`}
                >
                  {receiptPreview ? (
                    <div className="relative w-full h-full p-2">
                      <Image
                        src={receiptPreview}
                        alt="Bukti"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <Upload className="text-gray-500 mb-2" />
                      <span className="text-xs text-gray-500">
                        Klik untuk upload bukti transfer
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {validationErrors.receipt && (
                  <p className="text-red-500 text-xs mt-1 ml-1 text-center">
                    {validationErrors.receipt}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6">Ringkasan</h2>
            {/* Tampilkan pesan jika ada error umum yang tidak menempel di input field tertentu */}
            {validationErrors["productIds.0"] && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 text-xs p-3 rounded-xl mb-4">
                Ada masalah dengan produk di keranjang Anda. Mohon muat ulang
                halaman.
              </div>
            )}

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="text-white">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-800 pt-4 flex justify-between">
                <span className="text-gray-300 font-bold">Total</span>
                <span className="text-xl font-bold text-[#B88E2F]">
                  {formatRupiah(totalHarga)}
                </span>
              </div>
            </div>
            <button
              disabled={isSubmitting}
              onClick={handleBuatPesanan}
              className="w-full bg-[#B88E2F] hover:bg-[#9A7526] text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Buat Pesanan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
