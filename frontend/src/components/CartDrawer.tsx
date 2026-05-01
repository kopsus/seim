import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cartItems = [
    {
      id: 1,
      name: "Air Retro High Black White",
      size: 42,
      price: 599000,
      quantity: 1,
      imageUrl:
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    },
    {
      id: 2,
      name: "Vans Old Skool Black",
      size: 43,
      price: 449000,
      quantity: 1,
      imageUrl:
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
    },
  ];

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-60 z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-100 bg-[#0A0A0A] border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Keranjang Saya</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex space-x-4">
              <div className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-white leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2">Size {item.size}</p>
                <div className="font-bold text-[#B88E2F] text-sm mb-2">
                  {formatRupiah(item.price)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-[#1A1A1A] border border-gray-800 rounded-lg">
                    <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm text-white px-3">
                      {item.quantity}
                    </span>
                    <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#121212]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="text-2xl font-bold text-white">
              {formatRupiah(totalPrice)}
            </span>
          </div>
          <Link href="/checkout" onClick={onClose}>
            <button className="w-full bg-[#B88E2F] hover:bg-[#9A7526] text-white font-bold py-3.5 rounded-xl transition-colors">
              Checkout ({cartItems.length})
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
