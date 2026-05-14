"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ZoomIn,
  Maximize,
  Calendar,
  ShieldCheck,
  Award,
  Tag,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { getImageUrl } from "@/utils/getImageUrl";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // HARUS DI ATAS useEffect autoplay
  const flipbookPages = products.map((product, index) => {
    const leftImage = getImageUrl(product.foto ? [product.foto[0]] : []);

    const rightImage = getImageUrl(
      product.foto && product.foto.length > 1
        ? [product.foto[1]]
        : [product.foto[0]],
    );

    return {
      id: product.id,
      left: {
        title:
          product.nama_produk.length > 15
            ? product.nama_produk.substring(0, 15) + ".."
            : product.nama_produk,
        subtitle: product.kategori?.nama_kategori || "Koleksi Pilihan",
        badge: product.badge || product.status,
        image: leftImage,
        pageNum: String(index * 2 + 1).padStart(2, "0"),
      },
      right: {
        image: rightImage,
        pageNum: String(index * 2 + 2).padStart(2, "0"),
      },
    };
  });

  // AUTO SLIDER
  useEffect(() => {
    if (flipbookPages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === flipbookPages.length - 1 ? 0 : prev + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [flipbookPages.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === flipbookPages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? flipbookPages.length - 1 : prev - 1,
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 text-[#B88E2F] animate-spin mb-4" />
        <p className="text-gray-400 font-medium tracking-wider animate-pulse">
          Memuat Katalog Majalah SEIM...
        </p>
      </div>
    );
  }

  if (flipbookPages.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <p className="text-gray-400">
          Belum ada produk yang tersedia saat ini.
        </p>
      </div>
    );
  }

  const currentSpread = flipbookPages[currentIndex];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col min-h-full px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest leading-tight">
            Kualitas Langit
          </h2>
          <h3 className="text-lg md:text-xl text-gray-400 uppercase tracking-widest leading-tight">
            Harga Bumi
          </h3>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-gray-400">
          <div className="flex items-center bg-[#1A1A1A] px-4 py-2 rounded-lg border border-gray-800 text-sm">
            <span className="mr-3">Katalog Terbaru</span>
            <Calendar size={16} />
          </div>
          <span className="text-sm font-medium">
            {currentIndex + 1} / {flipbookPages.length}
          </span>
          <div className="flex items-center space-x-3">
            <button className="hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <button className="hover:text-white transition-colors">
              <ZoomIn size={18} />
            </button>
            <button className="hover:text-white transition-colors">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Area Flipbook Inti */}
      <div className="relative flex items-center justify-center w-full mb-12 group">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 md:-left-6 z-10 bg-[#1A1A1A] p-3 md:p-4 rounded-full border border-gray-800 text-white shadow-xl md:opacity-0 md:group-hover:opacity-100 transition-all ${
            currentIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#B88E2F]"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="w-full bg-[#EBE7DF] rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden relative border border-[#D1CCC0] min-h-100 md:min-h-125">
          <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col border-b md:border-b-0 md:border-r border-[#D1CCC0] shadow-[inset_-15px_0_15px_-15px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tighter mb-1 uppercase">
              {currentSpread.left.title}
            </h1>
            <h2 className="text-xl md:text-2xl text-[#1A1A1A] font-semibold tracking-widest mb-6 uppercase">
              {currentSpread.left.subtitle}
            </h2>

            {currentSpread.left.badge && (
              <span className="inline-block bg-[#B88E2F] text-white text-xs font-bold px-3 py-1 rounded-sm w-max mb-8 shadow-md uppercase">
                {currentSpread.left.badge}
              </span>
            )}

            <div className="relative w-full flex-1 min-h-50">
              <Image
                key={`left-${currentSpread.left.image}-${currentIndex}`}
                src={currentSpread.left.image}
                alt="Sepatu Kiri"
                fill
                className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-transform duration-500"
                unoptimized={process.env.NODE_ENV === "development"}
              />
            </div>

            <div className="text-center text-xs text-gray-500 mt-6 font-medium tracking-widest uppercase">
              Halaman {currentSpread.left.pageNum}
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col shadow-[inset_15px_0_15px_-15px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative w-full flex-1 min-h-62.5">
              <Image
                key={`right-${currentSpread.right.image}-${currentIndex}`}
                src={currentSpread.right.image}
                alt="Sepatu Kanan"
                fill
                className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-transform duration-500 scale-110"
                unoptimized={process.env.NODE_ENV === "development"}
              />
            </div>
            <div className="text-center text-xs text-gray-500 mt-6 font-medium tracking-widest uppercase">
              Halaman {currentSpread.right.pageNum}
            </div>
          </div>
        </div>

        <button
          onClick={nextSlide}
          disabled={currentIndex === flipbookPages.length - 1}
          className={`absolute right-0 md:-right-6 z-10 bg-[#1A1A1A] p-3 md:p-4 rounded-full border border-gray-800 text-white shadow-xl md:opacity-0 md:group-hover:opacity-100 transition-all ${
            currentIndex === flipbookPages.length - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#B88E2F]"
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Value Proposition Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-800 mt-auto">
        <div className="flex items-center space-x-4">
          <div className="text-[#B88E2F]">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase">
              Second Item Mulus
            </p>
            <p className="text-xs text-gray-500">100% Original</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-[#B88E2F]">
            <Award size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase">
              Kualitas Langit
            </p>
            <p className="text-xs text-gray-500">Barang Pilihan</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-[#B88E2F]">
            <Tag size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase">Harga Bumi</p>
            <p className="text-xs text-gray-500">Harga Bersahabat</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-[#B88E2F]">
            <RefreshCcw size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase">Garansi</p>
            <p className="text-xs text-gray-500">Uang Kembali 3 Hari</p>
          </div>
        </div>
      </div>
    </div>
  );
}
