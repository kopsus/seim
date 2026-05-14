"use client";

import { useState, useEffect } from "react";
import { X, Info, AlertTriangle, Tag } from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function AnnouncementModal() {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchAnnouncement = async () => {
        try {
          const hasSeen = sessionStorage.getItem("announcement_seen");

          if (hasSeen === "true") return;

          const response = await axiosInstance.get("/announcement");
          const data = response.data.data;

          if (data && data.is_active) {
            setAnnouncement(data);
            setIsOpen(true);
          }
        } catch (error) {
          console.error("Gagal mengambil pengumuman:", error);
        }
      };

      fetchAnnouncement();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("announcement_seen", "true");
  };

  if (!isOpen || !announcement) return null;

  let Icon = Info;
  let colorClass = "text-blue-500";
  let bgClass = "bg-blue-500/10 border-blue-500/20";

  if (announcement.type === "PROMO") {
    Icon = Tag;
    colorClass = "text-[#B88E2F]"; // Warna Emas SEIM
    bgClass = "bg-[#B88E2F]/10 border-[#B88E2F]/20";
  } else if (announcement.type === "WARNING") {
    Icon = AlertTriangle;
    colorClass = "text-red-500";
    bgClass = "bg-red-500/10 border-red-500/20";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Background Gelap */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Kotak Modal */}
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-300">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors p-1"
        >
          <X size={24} />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <div className={`p-4 rounded-full border ${bgClass} mb-6`}>
            <Icon size={40} className={colorClass} />
          </div>

          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wide">
            {announcement.title}
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8 text-sm">
            {announcement.content}
          </p>

          <button
            onClick={handleClose}
            className="w-full bg-[#0A0A0A] hover:bg-gray-900 border border-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Baik, Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
