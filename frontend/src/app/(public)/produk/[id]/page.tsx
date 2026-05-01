import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  Box,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = {
    id: params.id,
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

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

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
        <div className="md:w-1/2 bg-gray-900 p-8 flex flex-col items-center justify-center relative min-h-100">
          <span className="absolute top-6 left-6 bg-[#B88E2F] text-white text-xs font-bold px-3 py-1 rounded">
            NEW
          </span>

          <div className="relative w-full h-80">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>

          <div className="flex items-center space-x-2 mb-6">
            <Star className="text-[#B88E2F] fill-[#B88E2F]" size={18} />
            <span className="text-[#B88E2F] font-bold">{product.rating}</span>
            <span className="text-gray-500">({product.reviews} ulasan)</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-gray-300">
            <div>
              <span className="text-gray-500">Size:</span> {product.size}
            </div>
            <div>
              <span className="text-gray-500">Kondisi:</span>{" "}
              {product.condition}
            </div>
            <div>
              <span className="text-gray-500">Kategori:</span>{" "}
              {product.category}
            </div>
            <div>
              <span className="text-gray-500">Stok:</span> {product.stock}
            </div>
          </div>

          <div className="text-4xl font-bold text-white mb-8">
            {formatRupiah(product.price)}
          </div>

          <div className="flex flex-col space-y-3 mb-8">
            <button className="w-full bg-[#B88E2F] hover:bg-[#9A7526] text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors">
              <ShoppingCart size={20} className="mr-2" />
              Tambah ke Keranjang
            </button>
            <button className="w-full bg-[#0A0A0A] hover:bg-gray-900 text-white font-bold py-4 border border-gray-700 rounded-xl flex items-center justify-center transition-colors">
              <MessageCircle size={20} className="mr-2" />
              Chat Penjual (WhatsApp)
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-gray-800 pt-6">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="text-[#B88E2F] mb-1" size={24} />
              <span className="text-xs text-gray-400">Barang Original</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="text-[#B88E2F] mb-1" size={24} />
              <span className="text-xs text-gray-400">Kualitas Terjamin</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Box className="text-[#B88E2F] mb-1" size={24} />
              <span className="text-xs text-gray-400">Packaging Aman</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
