"use client";

import { useState, useEffect, use } from "react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft, Loader2, PackageOpen } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { getImageUrl } from "@/utils/getImageUrl";

interface CategoryPageProps {
  params: Promise<{ kategori: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);

  const urlCategory = decodeURIComponent(resolvedParams.kategori);

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [categoryTitle, setCategoryTitle] = useState(
    urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1),
  );

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        const catResponse = await axiosInstance.get("/categories");
        const categories = catResponse.data.data;

        const matchedCategory = categories.find(
          (cat: any) =>
            cat.nama_kategori.toLowerCase() === urlCategory.toLowerCase(),
        );

        if (matchedCategory) {
          setCategoryTitle(matchedCategory.nama_kategori);

          const prodResponse = await axiosInstance.get("/products", {
            params: { categoryId: matchedCategory.id, limit: 100 },
          });

          setProducts(prodResponse.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data kategori/produk:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [urlCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-0 py-8 min-h-[70vh]">
      <div className="mb-6 md:mb-8">
        <Link
          href="/katalog"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Semua Katalog
        </Link>
        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
          Kategori: <span className="text-[#B88E2F]">{categoryTitle}</span>
        </h2>

        {!isLoading && (
          <p className="text-sm text-gray-400 mt-1">
            Menampilkan {products.length} produk untuk kategori ini.
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#B88E2F] animate-spin mb-4" />
          <p className="text-gray-400 text-sm animate-pulse">
            Memuat koleksi {categoryTitle}...
          </p>
        </div>
      ) : products.length > 0 ? (
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
      ) : (
        <div className="w-full py-20 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center bg-[#1A1A1A]">
          <PackageOpen size={64} className="text-gray-600 mb-4" />
          <p className="text-white font-bold text-lg mb-1">
            Kategori ini masih kosong
          </p>
          <p className="text-gray-400 text-sm text-center max-w-sm">
            Saat ini belum ada sepatu yang tersedia untuk kategori{" "}
            {categoryTitle}. Silakan cek kembali nanti atau lihat kategori
            lainnya.
          </p>
          <Link
            href="/katalog"
            className="mt-6 px-6 py-2 bg-transparent border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white rounded-lg text-sm font-bold transition-colors"
          >
            Lihat Semua Sepatu
          </Link>
        </div>
      )}
    </div>
  );
}
