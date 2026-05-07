"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { X } from "lucide-react";

interface ModalAddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalAddCategory({
  isOpen,
  onClose,
  onSuccess,
  setIsLoading,
}: ModalAddCategoryProps) {
  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  if (!isOpen) return null;

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/categories", {
        name: namaKategori,
        description: deskripsi,
      });

      setNamaKategori("");
      setDeskripsi("");

      onSuccess();
      onClose();
    } catch {
      alert("Gagal menambah kategori");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNamaKategori("");
    setDeskripsi("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Tambah Kategori Baru</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Sneakers"
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Deskripsi (Opsional)
              </label>
              <textarea
                rows={4}
                placeholder="Tuliskan deskripsi singkat kategori ini..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#121212] rounded-b-2xl flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            className="px-6 py-2.5 rounded-lg font-medium bg-[#B88E2F] hover:bg-[#9A7526] text-white transition-colors"
          >
            Simpan Kategori
          </button>
        </div>
      </div>
    </div>
  );
}
