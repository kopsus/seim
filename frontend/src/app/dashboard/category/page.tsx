"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import ModalAddCategory from "@/components/dashboard/category/ModalAddCategory";
import ModalEditCategory from "@/components/dashboard/category/ModalEditCategory";
import ModalDeleteCategory from "@/components/dashboard/category/ModalDeleteCategory";
import axiosInstance from "@/lib/axios";

export default function ManajemenKategoriPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Kategori</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kelola daftar kategori sepatu untuk memudahkan pencarian pelanggan.
          </p>
        </div>
        <button
          onClick={() => setIsTambahModalOpen(true)}
          className="flex items-center justify-center bg-[#B88E2F] hover:bg-[#9A7526] text-white px-5 py-2.5 rounded-lg font-medium transition-colors w-full md:w-auto"
        >
          <Plus size={18} className="mr-2" />
          Tambah Kategori
        </button>
      </div>

      {/* <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama kategori..."
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#B88E2F] transition-colors text-sm"
          />
        </div>
      </div> */}

      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0A0A0A] text-gray-300 border-b border-gray-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium w-16">
                  ID
                </th>
                <th scope="col" className="px-6 py-4 font-medium w-48">
                  Nama Kategori
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Deskripsi
                </th>
                <th scope="col" className="px-6 py-4 font-medium w-40">
                  Tanggal Dibuat
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-right w-24"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="mt-2 text-xs">Memuat data...</p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500 italic"
                  >
                    Belum ada data kategori.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">#{cat.id}</td>
                    <td className="px-6 py-4 font-bold text-white">
                      {cat.nama_kategori}
                    </td>
                    <td className="px-6 py-4">{cat.deskripsi || "-"}</td>
                    <td className="px-6 py-4 text-xs">
                      {formatDate(cat.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#B88E2F]"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalAddCategory
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onSuccess={fetchCategories}
        setIsLoading={setIsLoading}
      />

      <ModalEditCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onSuccess={fetchCategories}
        setIsLoading={setIsLoading}
      />

      <ModalDeleteCategory
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
