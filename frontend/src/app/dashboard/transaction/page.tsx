"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { getImageUrl } from "@/utils/getImageUrl";
import { formatRupiah } from "@/utils/formatRupiah";

// Import untuk useCartStore dan Ikon
import { useCartStore } from "@/store/useCartStore";
import {
  Loader2,
  PackageOpen,
  Minus,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function TransactionPage() {
  // ==========================================
  // 1. STATE KATALOG
  // ==========================================
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch & Sort Produk
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: 1,
        limit: 50,
      };

      if (selectedCategory !== "all") {
        params.categoryId = selectedCategory;
      }

      const response = await axiosInstance.get("/products", { params });
      const fetchedProducts = response.data.data;

      // Logika Sorting
      if (sortBy === "Termurah") {
        fetchedProducts.sort(
          (a: any, b: any) =>
            Number(a.harga_diskon || a.harga) -
            Number(b.harga_diskon || b.harga),
        );
      } else if (sortBy === "Termahal") {
        fetchedProducts.sort(
          (a: any, b: any) =>
            Number(b.harga_diskon || b.harga) -
            Number(a.harga_diskon || a.harga),
        );
      } else if (sortBy === "Terbaru") {
        fetchedProducts.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, sortBy]);

  // Trigger fetchProducts saat kategori atau sorting berubah
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0); // Memberikan jeda (tick) agar React selesai me-render terlebih dahulu

    return () => clearTimeout(timer); // Membersihkan timer jika komponen di-unmount
  }, [fetchProducts]);

  // ==========================================
  // 2. STATE & LOGIKA POS KASIR
  // ==========================================
  const { items, increaseQuantity, decreaseQuantity, removeItem, clearCart } =
    useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Menghitung total harga keranjang
  const totalHarga = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handlePosCheckout = async () => {
    if (items.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    if (
      !window.confirm(
        "Selesaikan transaksi ini? Pastikan pelanggan sudah membayar.",
      )
    )
      return;

    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => ({
          productId: String(item.id),
          size: String(item.size),
          quantity: item.quantity,
        })),
      };

      // Memanggil endpoint khusus POS Kasir
      await axiosInstance.post("/orders/pos/checkout", payload);

      alert("Transaksi berhasil diselesaikan! Stok otomatis terpotong.");
      clearCart();
    } catch (error: any) {
      console.error("POS Checkout Error:", error);
      alert(
        error.response?.data?.message || "Gagal memproses transaksi kasir.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 3. RENDER UI
  // ==========================================
  return (
    <div className="w-full mx-auto px-4 md:px-6 py-8 min-h-[70vh]">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">
        Menu Transaksi Kasir
      </h2>

      {/* Grid Utama: Kiri (Katalog), Kanan (Keranjang) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative">
        {/* ========================================== */}
        {/* KOLOM KIRI: KATALOG PRODUK (lg:col-span-2) */}
        {/* ========================================== */}
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
            <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 md:px-5 py-1.5 md:py-2 font-medium rounded-full text-xs md:text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#B88E2F] text-white"
                    : "bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800"
                }`}
              >
                Semua
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`px-4 md:px-5 py-1.5 md:py-2 font-medium rounded-full text-xs md:text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id.toString()
                      ? "bg-[#B88E2F] text-white"
                      : "bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800"
                  }`}
                >
                  {cat.nama_kategori}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 self-end md:self-auto">
              <span className="text-xs md:text-sm text-gray-400">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1A1A1A] text-white text-xs md:text-sm border border-gray-800 rounded-lg px-2 md:px-3 py-1.5 md:py-2 focus:outline-none focus:border-[#B88E2F] cursor-pointer"
              >
                <option value="Terbaru">Terbaru</option>
                <option value="Termurah">Termurah</option>
                <option value="Termahal">Termahal</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#B88E2F] animate-spin mb-4" />
              <p className="text-gray-400 text-sm animate-pulse">
                Menyiapkan katalog produk...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 bg-[#1A1A1A] rounded-2xl border border-gray-800 border-dashed">
              <PackageOpen size={64} className="text-gray-600 mb-4" />
              <p className="text-white font-bold text-lg">Produk Kosong!</p>
              <p className="text-gray-400 text-sm mt-1 text-center max-w-sm">
                Maaf, belum ada produk untuk kategori ini atau sedang habis
                terjual.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.nama_produk}
                  price={Number(product.harga)}
                  priceDiscount={Number(product.harga_diskon)}
                  sizes={product.sizes || []}
                  condition={product.kondisi}
                  imageUrl={getImageUrl(product.foto)}
                  badge={product.status === "SOLD" ? "SOLD OUT" : product.badge}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN: KERANJANG KASIR (lg:col-span-1) */}
        {/* ========================================== */}
        <div className="lg:col-span-1">
          {/* Membuat keranjang tetap di layar (sticky) saat di-scroll */}
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-gray-800 flex flex-col sticky top-24 max-h-[calc(100vh-8rem)]">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-4 flex items-center gap-2">
              Keranjang Kasir
              <span className="bg-[#B88E2F] text-white text-xs px-2 py-0.5 rounded-full ml-auto">
                {items.length} Item
              </span>
            </h3>

            {/* Daftar Barang */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-6 custom-scrollbar pr-2 min-h-[300px]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <PackageOpen size={40} className="mb-2 opacity-50" />
                  <p className="text-sm">Belum ada barang dipilih</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${index}`}
                    className="flex flex-col bg-[#0A0A0A] p-3 rounded-xl border border-gray-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="pr-2">
                        <p className="text-sm font-bold text-white line-clamp-2 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Size:{" "}
                          <span className="font-bold text-[#B88E2F]">
                            {item.size}
                          </span>
                        </p>
                      </div>
                      <p className="text-sm font-medium text-white whitespace-nowrap">
                        {formatRupiah(item.price)}
                      </p>
                    </div>

                    {/* Tombol Plus/Minus Kasir */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800/50">
                      <div className="flex items-center bg-[#1A1A1A] border border-gray-700 rounded-lg">
                        <button
                          onClick={() => decreaseQuantity(item.id, item.size)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-bold w-8 text-center text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id, item.size)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Ringkasan & Tombol Bayar */}
            <div className="border-t border-gray-800 pt-4 mt-auto">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm text-gray-400 font-medium">
                  Total Harga
                </span>
                <span className="text-2xl font-bold text-[#B88E2F]">
                  {formatRupiah(totalHarga)}
                </span>
              </div>

              <button
                onClick={handlePosCheckout}
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-green-900/20 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <CheckCircle size={18} /> Selesaikan Transaksi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
