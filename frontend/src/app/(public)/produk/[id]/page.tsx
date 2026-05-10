"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  Loader2,
  PackageX,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import axiosInstance from "@/lib/axios";
import { getImageUrl } from "@/utils/getImageUrl";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  // --- STATE DATA API ---
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil detail produk dari backend
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  // Handler Tambah ke Keranjang
  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.nama_produk,
      price: Number(product.harga),
      size: Number(product.size),
      imageUrl: getImageUrl(product.foto),
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // --- TAMPILAN LOADING ---
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#B88E2F] animate-spin mb-4" />
        <p className="text-gray-400 font-medium animate-pulse">
          Menarik data sepatu dari rak...
        </p>
      </div>
    );
  }

  // --- TAMPILAN JIKA PRODUK TIDAK DITEMUKAN ---
  if (!product) {
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <PackageX size={64} className="text-gray-700 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Sepatu Tidak Ditemukan
        </h2>
        <p className="text-gray-400 mb-6">
          Mungkin sepatu ini sudah dihapus atau URL tidak valid.
        </p>
        <Link
          href="/katalog"
          className="bg-[#B88E2F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A7526]"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // Persiapan Variabel Tampilan
  const isSoldOut = product.status === "SOLD";
  const displayBadge = isSoldOut ? "SOLD OUT" : product.badge;
  const categoryName = product.kategori?.nama_kategori || "Sneakers";
  const processedImageUrl = getImageUrl(product.foto);

  const waText = encodeURIComponent(
    `Halo SEIM, saya tertarik dengan sepatu ${product.nama_produk} (Size ${product.size}) seharga ${formatRupiah(Number(product.harga))}. Apakah stoknya masih ada?`,
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-8">
        <Link
          href="/katalog"
          className="hover:text-white transition-colors flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" /> Katalog
        </Link>
        <span>/</span>
        <span className="text-gray-500">{categoryName}</span>
        <span>/</span>
        <span className="text-white truncate max-w-37.5 md:max-w-none">
          {product.nama_produk}
        </span>
      </div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sisi Kiri: Gambar Produk */}
        <div className="md:w-1/2 bg-[#0A0A0A] flex flex-col items-center justify-center relative min-h-75 md:min-h-125">
          {displayBadge && (
            <span
              className={`absolute z-10 top-6 left-6 text-white text-xs font-bold px-3 py-1 rounded shadow-md ${isSoldOut ? "bg-red-600" : "bg-[#B88E2F]"}`}
            >
              {displayBadge}
            </span>
          )}
          <div className="relative w-full h-full p-8">
            <Image
              src={processedImageUrl}
              alt={product.nama_produk}
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
              priority
              unoptimized={process.env.NODE_ENV === "development"}
            />
          </div>
        </div>

        {/* Sisi Kanan: Detail Informasi */}
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {product.nama_produk}
          </h1>

          {/* Menampilkan deskripsi jika ada */}
          {product.deskripsi && (
            <p className="text-gray-400 text-sm mt-2 mb-4 leading-relaxed line-clamp-3">
              {product.deskripsi}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8 text-gray-300 mt-4 bg-[#121212] p-4 rounded-xl border border-gray-800">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-bold">
                Size
              </span>
              <span className="font-medium text-white">{product.size}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-bold">
                Kondisi
              </span>
              <span className="font-medium text-white">{product.kondisi}</span>
            </div>
          </div>

          <div className="text-4xl font-bold text-[#B88E2F] mb-8">
            {formatRupiah(Number(product.harga))}
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center transition-all ${
                isSoldOut
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : isAdded
                    ? "bg-green-600 text-white"
                    : "bg-[#B88E2F] hover:bg-[#9A7526] text-white shadow-lg shadow-[#B88E2F]/20"
              }`}
            >
              {isSoldOut ? (
                <>Maaf, Sepatu Sudah Terjual</>
              ) : isAdded ? (
                <>
                  <CheckCircle size={20} className="mr-2" /> Berhasil
                  Ditambahkan!
                </>
              ) : (
                <>
                  <ShoppingCart size={20} className="mr-2" /> Tambah ke
                  Keranjang
                </>
              )}
            </button>

            {/* Link langsung ke WhatsApp Kasir */}
            <a
              href={`https://wa.me/6281234567890?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0A0A0A] hover:bg-[#121212] text-white font-bold py-4 border border-gray-700 hover:border-gray-500 rounded-xl flex items-center justify-center transition-colors"
            >
              <MessageCircle size={20} className="mr-2 text-green-500" />
              Tanya via WhatsApp
            </a>
          </div>

          {/* Badge Kepercayaan */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-6">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="text-[#B88E2F] mb-1" size={24} />
              <span className="text-xs text-gray-400">100% Original</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="text-[#B88E2F] mb-1" size={24} />
              <span className="text-xs text-gray-400">Kondisi Sesuai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
