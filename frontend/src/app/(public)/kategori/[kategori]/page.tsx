// src/app/(public)/kategori/[kategori]/page.tsx
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// DATA PALSU: Kita tambahkan field 'category' agar bisa disaring (filter)
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Air Retro High Grey",
    price: 599000,
    size: 42,
    condition: "95%",
    category: "Sneakers",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/product-1/2019/8/7/814705/814705_348b0d5e-6cd4-4561-965b-2505caabea8d_1280_1280.jpg.webp",
    badge: "NEW" as const,
  },
  {
    id: 2,
    name: "New Balance 2002R",
    price: 549000,
    size: 43,
    condition: "93%",
    category: "Sport",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/product-1/2019/8/7/814705/814705_348b0d5e-6cd4-4561-965b-2505caabea8d_1280_1280.jpg.webp",
    badge: "NEW" as const,
  },
  {
    id: 3,
    name: "Vans Old Skool Black",
    price: 449000,
    size: 43,
    condition: "90%",
    category: "Casual",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/product-1/2019/8/7/814705/814705_348b0d5e-6cd4-4561-965b-2505caabea8d_1280_1280.jpg.webp",
    badge: null,
  },
  {
    id: 4,
    name: "Converse Chuck 70",
    price: 429000,
    size: 42,
    condition: "90%",
    category: "Sneakers",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/product-1/2019/8/7/814705/814705_348b0d5e-6cd4-4561-965b-2505caabea8d_1280_1280.jpg.webp",
    badge: "SOLD OUT" as const,
  },
];

// Di Next.js 15+, params adalah Promise
interface CategoryPageProps {
  params: Promise<{ kategori: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // 1. Ekstrak parameter 'kategori' dari URL
  const resolvedParams = await params;
  const urlCategory = resolvedParams.kategori; // contoh: 'sneakers' atau 'casual'

  // 2. Format teks untuk judul (mengubah huruf pertama jadi kapital)
  const categoryTitle =
    urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);

  // 3. Filter data produk agar hanya yang sesuai kategori yang tampil
  // Kita gunakan .toLowerCase() agar tidak terjadi error karena perbedaan huruf besar/kecil
  const filteredProducts = DUMMY_PRODUCTS.filter(
    (product) => product.category.toLowerCase() === urlCategory.toLowerCase(),
  );

  return (
    <div className="w-full">
      {/* Tombol Kembali & Judul */}
      <div className="mb-6 md:mb-8">
        <Link
          href="/katalog"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Semua Katalog
        </Link>
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Kategori: <span className="text-[#B88E2F]">{categoryTitle}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Menampilkan {filteredProducts.length} produk untuk kategori ini.
        </p>
      </div>

      {/* Tampilan Grid Produk */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              size={product.size}
              condition={product.condition}
              imageUrl={product.imageUrl}
              badge={product.badge}
            />
          ))}
        </div>
      ) : (
        // Jika kategori tidak memiliki produk (Kosong)
        <div className="w-full h-64 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center bg-[#121212]">
          <p className="text-gray-400 font-medium">
            Belum ada sepatu di kategori ini.
          </p>
        </div>
      )}
    </div>
  );
}
