"use client";

import { useEffect, useState } from "react";
import { Search, Bell, ShoppingCart, Menu } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useCartStore } from "@/store/useCartStore";

interface HeaderProps {
  onOpenMenu: () => void;
}

export default function Header({ onOpenMenu }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between bg-[#0A0A0A] py-4 px-4 md:px-8 border-b border-gray-800 sticky top-0 z-20">
        <div className="flex items-center flex-1 max-w-xl">
          <button
            onClick={onOpenMenu}
            className="mr-4 text-gray-400 hover:text-white transition-colors md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari sepatu..."
              className="w-full bg-[#1A1A1A] text-gray-300 rounded-full py-2.5 pl-10 pr-4 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#B88E2F] border border-gray-800 transition-all"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 ml-4">
          <button className="text-gray-400 hover:text-white transition-colors relative hidden sm:block">
            <Bell size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0A0A0A]"></span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="text-gray-400 hover:text-white transition-colors relative"
          >
            <ShoppingCart size={22} />
            {/* Tampilkan badge HANYA jika ada barang di keranjang */}
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#B88E2F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#0A0A0A]">
                {totalItems}
              </span>
            )}
          </button>

          {/* <button className="text-gray-400 hover:text-white transition-colors">
            <User size={22} />
          </button> */}
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
