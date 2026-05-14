"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Tag, Package, CheckCircle, Info } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { getImageUrl } from "@/utils/getImageUrl";

interface ModalDetailProdukProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function ModalDetailProduk({
  isOpen,
  onClose,
  product,
}: ModalDetailProdukProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setActiveImageIndex(0);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);
  if (!isOpen || !product) return null;

  const getStatusBadge = (status: string) => {
    if (status === "READY")
      return "bg-green-500/10 text-green-500 border-green-500/20";
    if (status === "SOLD")
      return "bg-red-500/10 text-red-500 border-red-500/20";
    return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#121212]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Detail Produk
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-[#0A0A0A] rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center p-4">
              <Image
                src={getImageUrl(
                  product.foto ? [product.foto[activeImageIndex]] : [],
                )}
                alt={product.nama_produk}
                fill
                className="object-cover"
                unoptimized={process.env.NODE_ENV === "development"}
              />

              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#B88E2F] text-white text-xs font-bold uppercase rounded shadow-lg">
                  {product.badge}
                </div>
              )}
            </div>

            {product.foto && product.foto.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {product.foto.map((fotoStr: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 shrink-0 bg-[#0A0A0A] rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImageIndex === index
                        ? "border-[#B88E2F]"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <Image
                      src={getImageUrl([fotoStr])}
                      alt={`${product.nama_produk} - ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:w-1/2 flex flex-col gap-6">
            <div>
              <p className="text-[#B88E2F] text-sm font-bold tracking-wider mb-1">
                {product.kategori?.nama_kategori || "Tanpa Kategori"}
              </p>
              <h1 className="text-3xl font-bold text-white mb-2">
                {product.nama_produk}
              </h1>
              <p className="text-2xl font-medium text-gray-300">
                {formatRupiah(Number(product.harga))}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                  <Tag size={14} /> Kondisi
                </p>
                <p className="text-white font-medium">
                  {product.kondisi || "-"}
                </p>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                  <Package size={14} /> Ukuran & Stok
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((s: any) => (
                      <span
                        key={s.id}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          s.stock > 0
                            ? "bg-gray-800 border-gray-700 text-gray-200"
                            : "bg-red-500/10 border-red-500/20 text-red-500"
                        }`}
                      >
                        {s.size} (Stok: {s.stock})
                      </span>
                    ))
                  ) : (
                    <span className="text-white font-medium">-</span>
                  )}
                </div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-gray-800 md:col-span-2 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                    <CheckCircle size={14} /> Status Ketersediaan
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full border mt-1 ${getStatusBadge(product.status)}`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2 flex items-center gap-1.5 font-medium">
                <Info size={16} /> Deskripsi Produk
              </p>
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-gray-800 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {product.deskripsi || "Tidak ada deskripsi untuk produk ini."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
