// src/components/dashboard/ModalEditProduk.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Trash2, ImageIcon, AlertCircle } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { getImageUrl } from "@/utils/getImageUrl";

interface ModalEditProdukProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess: () => void;
}

export default function ModalEditProduk({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ModalEditProdukProps) {
  // --- STATE DATA FORM ---
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState("");
  const [badge, setBadge] = useState("");

  // --- STATE FOTO ---
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]); // Foto yang masih ada di server
  const [newPhotos, setNewPhotos] = useState<File[]>([]); // File fisik baru
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]); // Preview file baru

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync data saat modal dibuka
  useEffect(() => {
    if (isOpen && product) {
      const timer = setTimeout(() => {
        setCategoryId(product.kategori_id?.toString() || "");
        setName(product.nama_produk || "");
        setPrice(product.harga || "");
        setDescription(product.deskripsi || "");
        setCondition(product.kondisi || "New");
        setSize(product.size || "");
        setStatus(product.status || "READY");
        setBadge(product.badge || "");
        setExistingPhotos(product.foto || []); // Ambil foto dari database
        setNewPhotos([]);
        setNewPreviewUrls([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  // Fetch kategori untuk dropdown
  useEffect(() => {
    if (isOpen) {
      axiosInstance
        .get("/categories")
        .then((res) => setCategories(res.data.data));
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // --- HANDLER FOTO ---

  // Menghapus foto yang SUDAH ADA di server (Client-side dulu)
  const removeExistingImage = (pathToRemove: string) => {
    setExistingPhotos((prev) => prev.filter((path) => path !== pathToRemove));
  };

  // Menambah foto baru
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewPhotos((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setNewPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  // Membatalkan foto baru yang belum diupload
  const removeNewImage = (indexToRemove: number) => {
    setNewPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
    setNewPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // --- SUBMIT UPDATE ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("categoryId", categoryId);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("condition", condition);
      formData.append("size", size);
      formData.append("status", status);
      formData.append("badge", badge);

      // KIRIM INFORMASI FOTO YANG TERSISA
      // Kita kirim sebagai string JSON agar backend tahu foto mana saja yang jangan dihapus
      formData.append("retainedPhotos", JSON.stringify(existingPhotos));

      // KIRIM FOTO BARU (jika ada)
      if (newPhotos.length > 0) {
        newPhotos.forEach((photo) => {
          formData.append("photos", photo);
        });
      }

      await axiosInstance.put(`/products/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal update:", error);
      alert("Gagal memperbarui produk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-5xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#121212]">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Update Produk
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="flex flex-col md:flex-row gap-8">
            {/* BAGIAN FOTO */}
            <div className="md:w-1/3 flex flex-col gap-6">
              {/* Foto Saat Ini dengan Fitur Hapus */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <ImageIcon size={14} /> Foto Saat Ini ({existingPhotos.length}
                  )
                </label>

                {existingPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {existingPhotos.map((foto, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square bg-[#0A0A0A] rounded-xl overflow-hidden border border-gray-800 group"
                      >
                        <Image
                          src={getImageUrl([foto])}
                          alt="Current"
                          fill
                          className="object-cover"
                          unoptimized={process.env.NODE_ENV === "development"}
                        />
                        {/* TOMBOL HAPUS FOTO LAMA */}
                        <button
                          type="button"
                          onClick={() => removeExistingImage(foto)}
                          className="absolute inset-0 bg-red-600/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus foto ini"
                        >
                          <Trash2 size={20} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-gray-800 rounded-xl text-center text-gray-600 text-xs">
                    Semua foto lama dihapus.
                  </div>
                )}
              </div>

              {/* Tambah Foto Baru */}
              <div>
                <label className="block text-xs font-bold text-[#B88E2F] uppercase mb-3">
                  Unggah Foto Tambahan
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#B88E2F] rounded-xl bg-[#0A0A0A] cursor-pointer group transition-colors">
                  <Upload className="w-6 h-6 text-gray-500 group-hover:text-[#B88E2F] mb-2" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold">
                    Pilih File
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleNewImageChange}
                  />
                </label>

                {/* Preview Foto Baru */}
                {newPreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-[#B88E2F]/5 border border-[#B88E2F]/10 rounded-xl">
                    {newPreviewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-[#B88E2F]/20 group"
                      >
                        <Image
                          src={url}
                          alt="New Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <AlertCircle size={16} className="text-blue-500 mt-0.5" />
                <p className="text-[10px] text-gray-400">
                  Foto yang Anda hapus di atas akan benar-benar hilang dari
                  server setelah Anda menekan tombol Simpan Perubahan.
                </p>
              </div>
            </div>

            {/* BAGIAN FORM (Sama seperti sebelumnya) */}
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Harga
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* ... Field lainnya (Size, Condition, Status, Badge, Description) tetap sama ... */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Deskripsi
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] resize-none"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#121212] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white"
          >
            Batal
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="bg-[#B88E2F] hover:bg-[#9A7526] text-white px-8 py-2.5 rounded-lg font-bold flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
