"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import ModalAddCategory from "@/components/dashboard/category/ModalAddCategory";
import ModalEditCategory from "@/components/dashboard/category/ModalEditCategory";
import ModalDeleteCategory from "@/components/dashboard/category/ModalDeleteCategory";

export default function ManajemenKategoriPage() {
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const dummyCategories = [
    {
      id: 1,
      nama_kategori: "Sneakers",
      deskripsi:
        "Sepatu bertali dengan sol karet yang nyaman untuk aktivitas kasual dan olahraga ringan.",
      created_at: "2026-04-29T12:36:23.492Z",
    },
    {
      id: 2,
      nama_kategori: "Casual",
      deskripsi:
        "Sepatu santai untuk gaya sehari-hari tanpa tali atau slip-on.",
      created_at: "2026-04-30T09:15:10.000Z",
    },
    {
      id: 3,
      nama_kategori: "Sport",
      deskripsi:
        "Sepatu khusus yang dirancang untuk performa olahraga intens (lari, basket, dll).",
      created_at: "2026-05-01T14:20:00.000Z",
    },
  ];

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

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

      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 mb-6">
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
      </div>

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
              {dummyCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500">#{category.id}</td>

                  <td className="px-6 py-4">
                    <span className="font-bold text-white">
                      {category.nama_kategori}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {category.deskripsi || (
                      <span className="italic text-gray-600">
                        Tidak ada deskripsi
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {formatDate(category.created_at)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-gray-400 hover:text-[#B88E2F] transition-colors"
                        title="Edit Kategori"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Hapus Kategori"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalAddCategory
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
      />
      <ModalEditCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
      />
      <ModalDeleteCategory
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
