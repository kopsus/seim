"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Tag,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center space-x-3 text-white bg-[#B88E2F] px-4 py-3 rounded-lg transition-colors shadow-lg"
      : "flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors";
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
            <p className="text-xs text-[#B88E2F] mt-1 uppercase font-bold">
              Internal Area
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 mt-2 scrollbar-hide">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={getMenuClass("/dashboard")}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="text-xs text-gray-500 uppercase font-semibold px-4">
              Manajemen Data
            </p>
          </div>

          <Link
            href="/dashboard/product"
            onClick={onClose}
            className={getMenuClass("/dashboard/product")}
          >
            <Package size={18} />
            <span className="text-sm">Produk</span>
          </Link>
          <Link
            href="/dashboard/category"
            onClick={onClose}
            className={getMenuClass("/dashboard/category")}
          >
            <Layers size={18} />
            <span className="text-sm">Kategori</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="text-xs text-gray-500 uppercase font-semibold px-4">
              Operasional
            </p>
          </div>

          <Link
            href="/dashboard/order"
            onClick={onClose}
            className={getMenuClass("/dashboard/order")}
          >
            <ShoppingBag size={18} />
            <span className="text-sm">Order</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              3
            </span>
          </Link>
          {/* <Link
            href="/dashboard/promo"
            onClick={onClose}
            className={getMenuClass("/dashboard/promo")}
          >
            <Tag size={18} />
            <span className="text-sm">Promo</span>
          </Link> */}
          <Link
            href="/dashboard/jadwal-cod"
            onClick={onClose}
            className={getMenuClass("/dashboard/jadwal-cod")}
          >
            <Calendar size={18} />
            <span className="text-sm">Jadwal COD</span>
          </Link>

          <div className="border-t border-gray-800 my-4" />

          {/* <Link
            href="/dashboard/laporan"
            onClick={onClose}
            className={getMenuClass("/dashboard/laporan")}
          >
            <FileText size={18} />
            <span className="text-sm">Laporan</span>
          </Link> */}
          <Link
            href="/dashboard/user"
            onClick={onClose}
            className={getMenuClass("/dashboard/user")}
          >
            <Users size={18} />
            <span className="text-sm">Pengguna</span>
          </Link>
          {/* <Link
            href="/dashboard/pengaturan"
            onClick={onClose}
            className={getMenuClass("/dashboard/pengaturan")}
          >
            <Settings size={18} />
            <span className="text-sm">Pengaturan</span>
          </Link> */}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-800">
          <button className="flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full px-4 py-3 rounded-lg transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
