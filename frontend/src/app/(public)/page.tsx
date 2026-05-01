import ProductCard from "@/components/ProductCard";

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Air Retro High Grey",
    price: 599000,
    size: 42,
    condition: "95%",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    badge: "NEW" as const,
  },
  {
    id: 2,
    name: "New Balance 2002R",
    price: 549000,
    size: 43,
    condition: "93%",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    badge: "NEW" as const,
  },
  {
    id: 3,
    name: "Vans Old Skool Black",
    price: 449000,
    size: 43,
    condition: "90%",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    badge: null,
  },
  {
    id: 4,
    name: "Converse Chuck 70",
    price: 429000,
    size: 42,
    condition: "90%",
    imageUrl:
      "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    badge: "SOLD OUT" as const,
  },
];

export default function HomePage() {
  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">
        Katalog Produk
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 w-full">
        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button className="px-4 md:px-5 py-1.5 md:py-2 bg-[#B88E2F] text-white font-medium rounded-full text-xs md:text-sm whitespace-nowrap">
            Semua
          </button>
          <button className="px-4 md:px-5 py-1.5 md:py-2 bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 font-medium rounded-full text-xs md:text-sm transition-colors whitespace-nowrap">
            Sneakers
          </button>
          <button className="px-4 md:px-5 py-1.5 md:py-2 bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 font-medium rounded-full text-xs md:text-sm transition-colors whitespace-nowrap">
            Casual
          </button>
          <button className="px-4 md:px-5 py-1.5 md:py-2 bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 font-medium rounded-full text-xs md:text-sm transition-colors whitespace-nowrap">
            Sport
          </button>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          <span className="text-xs md:text-sm text-gray-400">Urutkan:</span>
          <select className="bg-[#1A1A1A] text-white text-xs md:text-sm border border-gray-800 rounded-lg px-2 md:px-3 py-1.5 md:py-2 focus:outline-none focus:border-[#B88E2F]">
            <option>Terbaru</option>
            <option>Termurah</option>
            <option>Termahal</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {DUMMY_PRODUCTS.map((product) => (
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
    </div>
  );
}
