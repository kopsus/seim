"use client";

import { X, Upload } from "lucide-react";

interface ModalTambahProdukProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalTambahProduk({
  isOpen,
  onClose,
}: ModalTambahProdukProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Kotak Modal */}
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Tambah Sepatu Baru</h2>
          <button
            onClick={onClose} // Panggil fungsi onClose saat (X) diklik
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Area Isi Formulir */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            {/* Baris 1: Nama & Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nike Air Force 1"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]">
                  <option value="">-- Pilih Kategori --</option>
                  <option value="1">Sneakers</option>
                  <option value="2">Casual</option>
                  <option value="3">Sport</option>
                </select>
              </div>
            </div>

            {/* Baris 2: Harga, Ukuran & Kondisi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="500000"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ukuran (Size) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 42"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 95% Like New"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
            </div>

            {/* Baris 3: Status & Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Status Produk
                </label>
                <select className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]">
                  <option value="READY">READY</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Badge (Opsional)
                </label>
                <select className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]">
                  <option value="">Tidak ada badge</option>
                  <option value="NEW">NEW</option>
                  <option value="SOLD OUT">SOLD OUT</option>
                </select>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Deskripsi Produk <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Tuliskan deskripsi detail tentang sepatu ini..."
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] resize-none"
              ></textarea>
            </div>

            {/* Upload File Multiple */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Foto Produk (Bisa lebih dari satu){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center bg-[#0A0A0A] hover:bg-[#121212] transition-colors cursor-pointer relative">
                <Upload className="mx-auto text-gray-500 mb-3" size={32} />
                <p className="text-sm text-gray-400 mb-1">
                  Klik atau seret gambar ke area ini
                </p>
                <p className="text-xs text-gray-600">
                  Format: JPG, PNG (Maks. 2MB per file)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer Modal */}
        <div className="p-6 border-t border-gray-800 bg-[#121212] rounded-b-2xl flex justify-end space-x-4 mt-auto">
          <button
            onClick={onClose} // Panggil fungsi onClose saat Batal diklik
            className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button className="px-6 py-2.5 rounded-lg font-medium bg-[#B88E2F] hover:bg-[#9A7526] text-white transition-colors">
            Simpan Produk
          </button>
        </div>
      </div>
    </div>
  );
}
