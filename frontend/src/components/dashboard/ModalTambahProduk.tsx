"use client";

import { X, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ModalTambahProdukProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalTambahProduk({
  isOpen,
  onClose,
}: ModalTambahProdukProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleCloseModal = () => {
    setPreviewUrls([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={handleCloseModal}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Tambah Sepatu Baru</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nike Air Force 1"
                  className="w-full h-12 bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 h-12 focus:outline-none focus:border-[#B88E2F]">
                  <option value="">-- Pilih Kategori --</option>
                  <option value="1">Sneakers</option>
                  <option value="2">Casual</option>
                  <option value="3">Sport</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="500000"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 h-12 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ukuran (Size) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 42"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 h-12 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 95% Like New"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 h-12 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Status Produk
                </label>
                <select className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 h-12 focus:outline-none focus:border-[#B88E2F]">
                  <option value="READY">READY</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Badge (Opsional)
                </label>
                <select className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 h-12 focus:outline-none focus:border-[#B88E2F]">
                  <option value="">Tidak ada badge</option>
                  <option value="NEW">NEW</option>
                  <option value="SOLD OUT">SOLD OUT</option>
                </select>
              </div>
            </div>

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

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Foto Produk (Bisa lebih dari satu){" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center bg-[#0A0A0A] hover:bg-[#121212] transition-colors cursor-pointer relative mb-4">
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
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-gray-700 aspect-square bg-gray-900 flex items-center justify-center"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Hapus gambar"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#121212] rounded-b-2xl flex justify-end space-x-4 mt-auto">
          <button
            onClick={handleCloseModal}
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
