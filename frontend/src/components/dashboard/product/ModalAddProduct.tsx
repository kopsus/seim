"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface ModalAddProdukProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalAddProduk({
  isOpen,
  onClose,
  onSuccess,
}: ModalAddProdukProps) {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("New");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState("READY");
  const [badge, setBadge] = useState("");

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get("/categories");
          setCategories(response.data.data);
          if (response.data.data.length > 0) {
            setCategoryId(response.data.data[0].id.toString());
          }
        } catch (error) {
          console.error("Gagal mengambil kategori:", error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      setPhotos((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !categoryId || photos.length === 0) {
      alert("Mohon lengkapi Nama, Harga, Kategori, dan minimal 1 Foto!");
      return;
    }

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

      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      await axiosInstance.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      handleClose();
      onSuccess();
    } catch (error) {
      console.error("Error upload:", error);
      alert("Gagal menambahkan produk. Periksa kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCondition("New");
    setSize("");
    setStatus("READY");
    setBadge("");
    setPhotos([]);
    setPreviewUrls([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#121212]">
          <h2 className="text-xl font-bold text-white">Tambah Produk Baru</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Area Scrollable Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="flex flex-col md:flex-row gap-8">
            {/* KOLOM KIRI: Upload Gambar */}
            <div className="md:w-1/3 flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Foto Produk <span className="text-red-500">*</span>
                </label>

                {/* Kotak Upload Utama */}
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#B88E2F] rounded-xl bg-[#0A0A0A] hover:bg-[#121212] transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-[#B88E2F] mb-3" />
                    <p className="text-sm text-gray-400 group-hover:text-white">
                      <span className="font-semibold">Klik untuk unggah</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Grid Pratinjau Gambar */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-700 group"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover"
                      />
                      {/* Tombol Hapus Gambar */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KOLOM KANAN: Detail Produk */}
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Sepatu Vans Old Skool"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kategori <span className="text-red-500">*</span>
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
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Contoh: 500000"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ukuran (Size)
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Contoh: 40, 41, 42"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kondisi
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                >
                  <option value="New">New (Baru)</option>
                  <option value="Second">Second (Bekas)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                >
                  <option value="READY">READY</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Badge (Label Promo)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Contoh: Best Seller, Promo"
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan detail sepatu ini..."
                  className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] resize-none"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Tombol Simpan */}
        <div className="p-6 border-t border-gray-800 bg-[#121212] rounded-b-2xl flex justify-end space-x-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            disabled={isLoading}
            className="px-8 py-2.5 rounded-lg font-bold bg-[#B88E2F] hover:bg-[#9A7526] text-white transition-colors disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Simpan Produk"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
