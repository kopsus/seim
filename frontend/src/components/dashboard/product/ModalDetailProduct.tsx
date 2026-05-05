"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { Product } from "@/types/product";

interface ModalDetailProdukProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ModalDetailProduk({
  isOpen,
  onClose,
  product,
}: ModalDetailProdukProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#121212]">
          <h2 className="text-xl font-bold text-white">Detail Sepatu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row p-6 gap-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden p-4">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#B88E2F] text-white text-xs font-bold px-3 py-1 rounded z-10">
                  {product.badge}
                </span>
              )}
              <Image
                src={product.foto[0]}
                alt={product.nama_produk}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col">
            <span className="text-[#B88E2F] text-sm font-bold tracking-wider uppercase mb-2">
              {product.kategori.nama_kategori}
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">
              {product.nama_produk}
            </h1>
            <p className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-6">
              {formatRupiah(product.harga ? Number(product.harga) : 0)}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-gray-800">
                <p className="text-gray-500 mb-1">Ukuran (Size)</p>
                <p className="text-white font-bold text-lg">{product.size}</p>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-gray-800">
                <p className="text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full border ${
                    product.status === "READY"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-bold mb-2">Kondisi</h3>
              <p className="text-gray-400 text-sm">
                {product.kondisi || "95% Like New (Dummy)"}
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2">Deskripsi Produk</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.deskripsi ||
                  "Sepatu ini adalah barang bekas berkualitas tinggi yang telah disortir dan dicuci bersih. Nyaman digunakan untuk aktivitas sehari-hari maupun olahraga. Tidak ada cacat mayor pada bagian sol maupun jahitan."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
