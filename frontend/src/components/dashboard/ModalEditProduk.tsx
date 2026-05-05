"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { Product } from "@/types/product";

interface ModalEditProdukProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ModalEditProduk({
  isOpen,
  onClose,
  product,
}: ModalEditProdukProps) {
  const [formData, setFormData] = useState({
    nama_produk: "",
    kategori_id: "",
    harga: "",
    size: "",
    kondisi: "",
    status: "READY",
    badge: "",
    deskripsi: "",
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && product) {
      const timer = setTimeout(() => {
        setFormData({
          nama_produk: product.nama_produk || "",
          kategori_id: product.kategori?.id?.toString() || "1",
          harga: product.harga?.toString() || "",
          size: product.size || "",
          kondisi: product.kondisi || "",
          status: product.status || "READY",
          badge: product.badge || "",
          deskripsi: product.deskripsi || "",
        });

        setExistingPhotos(Array.isArray(product.foto) ? product.foto : []);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    e.target.value = "";
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
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
          <h2 className="text-xl font-bold text-white">Edit Produk</h2>
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
                  name="nama_produk"
                  value={formData.nama_produk}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="kategori_id"
                  value={formData.kategori_id}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                >
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
                  name="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ukuran (Size) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kondisi"
                  value={formData.kondisi}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Status Produk
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                >
                  <option value="READY">READY</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Badge (Opsional)
                </label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                >
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
                name="deskripsi"
                rows={4}
                value={formData.deskripsi}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Foto Produk
              </label>

              {existingPhotos.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Foto Saat Ini:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {existingPhotos.map((url, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative rounded-lg overflow-hidden border border-gray-700 aspect-square bg-gray-900 flex items-center justify-center opacity-70"
                      >
                        <Image
                          src={url}
                          alt={`Existing ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center bg-[#0A0A0A] hover:bg-[#121212] transition-colors cursor-pointer relative mb-4 mt-2">
                <Upload className="mx-auto text-gray-500 mb-3" size={32} />
                <p className="text-sm text-gray-400 mb-1">
                  Klik untuk menambahkan foto baru
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
                <div>
                  <p className="text-xs text-green-500 mb-2">
                    Foto Baru yang Ditambahkan:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {previewUrls.map((url, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative group rounded-lg overflow-hidden border border-green-700 aspect-square bg-gray-900 flex items-center justify-center"
                      >
                        <Image
                          src={url}
                          alt={`New Preview ${index}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
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
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
