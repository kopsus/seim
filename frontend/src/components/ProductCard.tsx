"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/utils/formatRupiah";

interface ProductCardProps {
  id: string; // Diubah jadi string menyesuaikan UUID Prisma
  name: string;
  price: number;
  sizes: any[]; // Menerima array ukuran dari backend
  condition: string;
  imageUrl: string;
  badge?: string | null; // Diperluas agar bisa menerima text badge apa saja
}

export default function ProductCard({
  id,
  name,
  price,
  sizes,
  condition,
  imageUrl,
  badge,
}: ProductCardProps) {
  // Menggabungkan semua ukuran yang stoknya lebih dari 0 untuk ditampilkan
  const availableSizes =
    sizes && sizes.length > 0
      ? sizes
          .filter((s) => s.stock > 0)
          .map((s) => s.size)
          .join(", ")
      : "Habis";

  return (
    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-[#B88E2F] transition-all group flex flex-col">
      <Link
        href={`/produk/${id}`}
        className="relative h-48 md:h-64 bg-gray-900 flex items-center justify-center overflow-hidden"
      >
        {badge && (
          <span
            className={`absolute top-2 left-2 md:top-4 md:left-4 text-[8px] md:text-[10px] font-bold px-2 py-1 rounded z-10 ${
              badge === "NEW"
                ? "bg-[#B88E2F] text-white"
                : badge === "SOLD OUT"
                  ? "bg-red-600 text-white"
                  : "bg-gray-600 text-white"
            }`}
          >
            {badge}
          </span>
        )}

        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <Link
          href={`/produk/${id}`}
          className="block hover:text-[#B88E2F] transition-colors"
        >
          <h3 className="font-bold text-sm md:text-lg text-white mb-1 line-clamp-2 md:truncate">
            {name}
          </h3>
        </Link>

        {/* Menampilkan deretan ukuran */}
        <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 truncate">
          Size: <span className="text-gray-300">{availableSizes || "-"}</span> |{" "}
          {condition}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-sm md:text-xl text-white truncate mr-2">
            {formatRupiah(price)}
          </span>

          {/* Tombol Keranjang diarahkan ke Detail Produk agar user pilih size dulu */}
          <Link href={`/produk/${id}`}>
            <button
              className="bg-gray-800 hover:bg-[#B88E2F] text-white p-1.5 md:p-2.5 rounded-lg transition-colors shrink-0"
              title="Pilih Ukuran"
            >
              <ShoppingCart size={16} className="md:w-4.5 md:h-4.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
