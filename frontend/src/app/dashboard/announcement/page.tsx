"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Save,
  Loader2,
  Info,
  AlertTriangle,
  Tag,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function AnnouncementPage() {
  // --- STATE FORM ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("INFO");
  const [isActive, setIsActive] = useState(false);

  // --- STATE UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: string;
    message: string;
  } | null>(null);

  // 1. Ambil data saat pertama kali dimuat
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axiosInstance.get("/announcement");
        const data = response.data.data;

        // Jika data sudah pernah dibuat di database, isi form-nya
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setType(data.type);
          setIsActive(data.is_active);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengumuman:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  // 2. Fungsi untuk menyimpan data
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    // Validasi sederhana
    if (!title || !content) {
      setNotification({
        type: "error",
        message: "Judul dan Isi Pengumuman wajib diisi.",
      });
      setIsSaving(false);
      return;
    }

    try {
      await axiosInstance.put("/announcement", {
        title,
        content,
        type,
        is_active: isActive,
      });

      setNotification({
        type: "success",
        message: "Pengumuman berhasil diperbarui dan disimpan!",
      });
    } catch (error) {
      console.error("Gagal menyimpan pengumuman:", error);
      setNotification({
        type: "error",
        message: "Gagal menyimpan perubahan. Coba lagi.",
      });
    } finally {
      setIsSaving(false);

      // Hilangkan notifikasi sukses setelah 3 detik
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#B88E2F] animate-spin mb-4" />
        <p className="text-gray-400">Memuat pengaturan pengumuman...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Megaphone className="mr-3 text-[#B88E2F]" size={28} />
          Manajemen Pengumuman
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Buat dan atur pengumuman penting (Promo, Info, atau Peringatan
          Penipuan) yang akan muncul di halaman depan pelanggan.
        </p>
      </div>

      {/* Area Notifikasi */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center ${
            notification.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          {notification.type === "success" ? (
            <Info className="mr-2" size={20} />
          ) : (
            <AlertTriangle className="mr-2" size={20} />
          )}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Form Utama */}
      <form
        onSubmit={handleSave}
        className="bg-[#1A1A1A] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-xl space-y-6"
      >
        {/* Toggle Aktif/Tidak Aktif */}
        <div className="flex items-center justify-between p-4 bg-[#121212] rounded-xl border border-gray-800">
          <div>
            <h3 className="text-white font-bold mb-1">Status Pengumuman</h3>
            <p className="text-xs text-gray-400">
              Nyalakan untuk menampilkannya di halaman pelanggan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              isActive ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Tipe Pengumuman */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">
              Tipe Pengumuman
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#B88E2F] appearance-none"
              >
                <option value="INFO">Informasi Umum</option>
                <option value="PROMO">Spesial Promo & Sale</option>
                <option value="WARNING">Peringatan (Keamanan/Penipuan)</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {type === "INFO" && (
                  <Info size={18} className="text-blue-500" />
                )}
                {type === "PROMO" && (
                  <Tag size={18} className="text-[#B88E2F]" />
                )}
                {type === "WARNING" && (
                  <AlertTriangle size={18} className="text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Kolom Judul */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">
              Judul Pengumuman
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Hati-Hati Penipuan!"
              className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
            />
          </div>
        </div>

        {/* Kolom Isi Pesan */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">
            Isi Pesan Detail
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Tuliskan pesan lengkap yang ingin Anda sampaikan kepada pelanggan di sini..."
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] resize-none"
          />
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4 flex justify-end border-t border-gray-800">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl font-bold bg-[#B88E2F] hover:bg-[#9A7526] text-white transition-colors flex items-center disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Simpan Pengumuman
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
