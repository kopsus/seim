"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const product = {
    id: productId,
    name: "Air Retro High Black White",
    price: 599000,
    size: 42,
    condition: "95% Like New",
    category: "Sneakers",
    stock: 1,
    rating: 4.8,
    reviews: 23,
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.size,
      imageUrl: product.imageUrl,
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

  const waText = encodeURIComponent(
    `Halo SEIM, saya tertarik dengan sepatu ${product.name} (Size ${product.size}) seharga ${formatRupiah(product.price)}. Apakah stoknya masih ada?`,
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-8">
        <Link
          href="/"
          className="hover:text-white transition-colors flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Katalog
        </Link>
        <span>/</span>
        <span className="text-gray-500">{product.category}</span>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sisi Kiri: Gambar Produk */}
        <div className="md:w-1/2 bg-gray-900 flex flex-col items-center justify-center relative min-h-100">
          <span className="absolute z-10 top-6 left-6 bg-[#B88E2F] text-white text-xs font-bold px-3 py-1 rounded">
            NEW
          </span>
          <div className="relative w-full h-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Sisi Kanan: Detail Informasi */}
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>

          <div className="grid grid-cols-2 gap-4 mb-8 text-gray-300 mt-6">
            <div>
              <span className="text-gray-500">Size:</span> {product.size}
            </div>
            <div>
              <span className="text-gray-500">Kondisi:</span>{" "}
              {product.condition}
            </div>
          </div>

          <div className="text-4xl font-bold text-white mb-8">
            {formatRupiah(product.price)}
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center transition-all ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-[#B88E2F] hover:bg-[#9A7526] text-white"
              }`}
            >
              {isAdded ? (
                <CheckCircle size={20} className="mr-2" />
              ) : (
                <ShoppingCart size={20} className="mr-2" />
              )}
              {isAdded ? "Berhasil Ditambahkan!" : "Tambah ke Keranjang"}
            </button>

            {/* Link langsung ke WhatsApp Kasir */}
            <a
              href={`https://wa.me/6281234567890?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0A0A0A] hover:bg-gray-900 text-white font-bold py-4 border border-gray-700 rounded-xl flex items-center justify-center transition-colors"
            >
              <MessageCircle size={20} className="mr-2" />
              Chat Penjual (WhatsApp)
            </a>
          </div>

          {/* Badge Kepercayaan */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-6">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="text-[#B88E2F] mb-1" size={24} />
              <span className="text-xs text-gray-400">Barang Original</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="text-[#B88E2F] mb-1" size={24} />
              <span className="text-xs text-gray-400">Kualitas Terjamin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
