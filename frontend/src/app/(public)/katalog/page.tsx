"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import axiosInstance from "@/lib/axios";
import { getImageUrl } from "@/utils/getImageUrl";
import { Loader2, PackageOpen } from "lucide-react";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export default function KatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("Terbaru");

  const [isLoading, setIsLoading] = useState(true);

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

      if (sortBy === "Termurah") {
        fetchedProducts.sort(
          (a: any, b: any) => Number(a.harga) - Number(b.harga),
        );
      } else if (sortBy === "Termahal") {
        fetchedProducts.sort(
          (a: any, b: any) => Number(b.harga) - Number(a.harga),
        );
      } else {
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-0 py-8 min-h-[70vh]">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">
        Katalog Produk
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 w-full">
        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
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
            Menyiapkan sepatu terbaik untuk Anda...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-[#1A1A1A] rounded-2xl border border-gray-800 border-dashed">
          <PackageOpen size={64} className="text-gray-600 mb-4" />
          <p className="text-white font-bold text-lg">Yah, sepatunya kosong!</p>
          <p className="text-gray-400 text-sm mt-1 text-center max-w-sm">
            Maaf, kami belum memiliki produk untuk kategori ini atau produk
            sedang habis terjual.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="mt-6 px-6 py-2 bg-transparent border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white rounded-lg text-sm font-bold transition-colors"
          >
            Lihat Semua Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.nama_produk}
              price={Number(product.harga)}
              size={Number(product.size)}
              condition={product.kondisi}
              imageUrl={getImageUrl(product.foto)}
              badge={product.status === "SOLD" ? "SOLD OUT" : product.badge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
