"use client";

import axiosInstance from "@/lib/axios";
import { Loader2, Menu, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  onOpenMenu: () => void;
}

export default function DashboardHeader({ onOpenMenu }: DashboardHeaderProps) {
  const [profile, setProfile] = useState<{
    username: string;
    role: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");

        setProfile(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="flex items-center justify-between bg-[#0A0A0A] py-4 px-4 md:px-8 border-b border-gray-800 sticky top-0 z-20">
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

      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-800">
          <div className="hidden text-right md:block">
            {isLoading ? (
              <div className="flex items-center justify-center h-full pr-2">
                <Loader2 size={16} className="text-[#B88E2F] animate-spin" />
              </div>
            ) : profile ? (
              <>
                <p className="text-sm font-bold text-white leading-tight capitalize">
                  {profile.username}
                </p>
                <p className="text-xs text-[#B88E2F] uppercase">
                  {profile.role}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-white leading-tight">
                  Pengguna
                </p>
                <p className="text-xs text-gray-500">GUEST</p>
              </>
            )}
          </div>

          {/* Ikon User */}
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#B88E2F] border border-gray-700">
            {profile ? (
              <span className="font-bold text-sm uppercase">
                {profile.username.charAt(0)}
              </span>
            ) : (
              <UserCircle size={24} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
