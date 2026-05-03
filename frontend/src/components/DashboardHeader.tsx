// src/components/DashboardHeader.tsx
"use client";

import { Bell, Menu, UserCircle } from "lucide-react";

interface DashboardHeaderProps {
  onOpenMenu: () => void;
}

export default function DashboardHeader({ onOpenMenu }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-[#0A0A0A] py-4 px-4 md:px-8 border-b border-gray-800 sticky top-0 z-20">
      {/* Kiri: Tombol Hamburger (HP) & Judul Halaman */}
      <div className="flex items-center">
        <button
          onClick={onOpenMenu}
          className="mr-4 text-gray-400 hover:text-white transition-colors md:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-bold text-white hidden sm:block">
          Dashboard Admin
        </h2>
      </div>

      {/* Kanan: Notifikasi & Profil */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0A0A0A]"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-gray-800">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold text-white leading-tight">Bagas</p>
            <p className="text-xs text-[#B88E2F]">ADMIN</p>
          </div>
          <UserCircle size={32} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
