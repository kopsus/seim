import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  size: number;
  condition: string;
  imageUrl: string;
  badge?: "NEW" | "SOLD OUT" | null;
}

export default function ProductCard({
  id,
  name,
  price,
  size,
  condition,
  imageUrl,
  badge,
}: ProductCardProps) {
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-[#B88E2F] transition-all group flex flex-col">
      <div className="relative h-48 md:h-64 bg-gray-900 flex items-center justify-center overflow-hidden p-2 md:p-4">
        {badge && (
          <span
            className={`absolute top-2 left-2 md:top-4 md:left-4 text-[8px] md:text-[10px] font-bold px-2 py-1 rounded z-10 ${
              badge === "NEW"
                ? "bg-[#B88E2F] text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {badge}
          </span>
        )}

        <button className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-red-500 transition-colors z-10">
          <Heart size={18} className="md:w-5 md:h-5" />
        </button>

        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <Link
          href={`/produk/${id}`}
          className="block hover:text-[#B88E2F] transition-colors"
        >
          <h3 className="font-bold text-sm md:text-lg text-white mb-1 line-clamp-2 md:truncate">
            {name}
          </h3>
        </Link>
        <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
          Size {size} | {condition}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-sm md:text-xl text-white truncate mr-2">
            {formatRupiah(price)}
          </span>
          <button className="bg-gray-800 hover:bg-[#B88E2F] text-white p-1.5 md:p-2.5 rounded-lg transition-colors shrink-0">
            <ShoppingCart size={16} className="md:w-4.5 md:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
