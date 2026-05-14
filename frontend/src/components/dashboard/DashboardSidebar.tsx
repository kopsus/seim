"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  LogOut,
  X,
  Megaphone,
} from "lucide-react";
import Cookies from "js-cookie";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          );
          const decoded = JSON.parse(jsonPayload);
          setUserRole(decoded.role);
        } catch {
          console.error("Gagal membaca role pengguna");
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center space-x-3 text-white bg-[#B88E2F] px-4 py-3 rounded-lg transition-colors shadow-lg"
      : "flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors";
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      Cookies.remove("token");
      router.push("/login");
    }
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
              {userRole === "KASIR" ? "Kasir Area" : "Admin Area"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 mt-2 custom-scrollbar">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={getMenuClass("/dashboard")}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          {userRole === "ADMIN" && (
            <>
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
              <Link
                href="/dashboard/announcement"
                onClick={onClose}
                className={getMenuClass("/dashboard/announcement")}
              >
                <Megaphone size={18} />
                <span className="text-sm">Pengumuman</span>
              </Link>
            </>
          )}

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
          </Link>

          {userRole === "ADMIN" && (
            <>
              <div className="border-t border-gray-800 my-4" />
              <Link
                href="/dashboard/user"
                onClick={onClose}
                className={getMenuClass("/dashboard/user")}
              >
                <Users size={18} />
                <span className="text-sm">Pengguna</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full px-4 py-3 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
