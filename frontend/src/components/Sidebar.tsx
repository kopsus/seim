// src/components/Sidebar.tsx
"use client"; // Wajib ditambahkan karena kita menggunakan hook usePathname

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import hook untuk membaca URL aktif
import {
  Home,
  Library,
  Layers,
  Tag,
  HelpCircle,
  Info,
  Phone,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}: SidebarProps) {
  // Ambil rute URL saat ini (contoh: '/' atau '/katalog')
  const pathname = usePathname();

  // Fungsi bantuan untuk menentukan warna tombol
  // Jika rute saat ini sama dengan rute menu, berikan warna emas. Jika tidak, warna transparan.
  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center space-x-3 text-white bg-[#B88E2F] px-4 py-3 rounded-lg transition-colors shadow-lg"
      : "flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors";
  };

  const getSubMenuClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center space-x-3 text-[#B88E2F] font-bold px-4 py-2 rounded-lg transition-colors bg-[#B88E2F]/10"
      : "flex items-center space-x-3 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`w-64 h-screen bg-[#121212] text-white flex flex-col border-r border-gray-800 fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:z-30`}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold italic tracking-wider">SEIM</h1>
            <p className="text-xs text-gray-400 mt-1 uppercase">
              Second Import
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 mt-4">
          <Link href="/" onClick={onClose} className={getMenuClass("/")}>
            <Home size={20} />
            <span className="font-medium">Beranda</span>
          </Link>

          <Link
            href="/katalog"
            onClick={onClose}
            className={getMenuClass("/katalog")}
          >
            <Library size={20} />
            <span className="font-medium">Katalog</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="text-xs text-gray-500 uppercase font-semibold px-4">
              Kategori
            </p>
          </div>

          <Link
            href="/kategori/sneakers"
            onClick={onClose}
            className={getSubMenuClass("/kategori/sneakers")}
          >
            <Layers size={18} />
            <span className="text-sm">Sneakers</span>
          </Link>
          <Link
            href="/kategori/casual"
            onClick={onClose}
            className={getSubMenuClass("/kategori/casual")}
          >
            <Layers size={18} />
            <span className="text-sm">Casual</span>
          </Link>
          <Link
            href="/kategori/sport"
            onClick={onClose}
            className={getSubMenuClass("/kategori/sport")}
          >
            <Layers size={18} />
            <span className="text-sm">Sport</span>
          </Link>

          <div className="border-t border-gray-800 my-4" />

          <Link
            href="/promo"
            onClick={onClose}
            className={getSubMenuClass("/promo")}
          >
            <Tag size={18} />
            <span className="text-sm">Promo</span>
          </Link>
          <Link
            href="/cara-order"
            onClick={onClose}
            className={getSubMenuClass("/cara-order")}
          >
            <HelpCircle size={18} />
            <span className="text-sm">Cara Order</span>
          </Link>
          <Link
            href="/tentang-kami"
            onClick={onClose}
            className={getSubMenuClass("/tentang-kami")}
          >
            <Info size={18} />
            <span className="text-sm">Tentang Kami</span>
          </Link>
          <Link
            href="/kontak"
            onClick={onClose}
            className={getSubMenuClass("/kontak")}
          >
            <Phone size={18} />
            <span className="text-sm">Kontak</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
