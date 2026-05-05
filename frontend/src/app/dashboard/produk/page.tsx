"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import ModalTambahProduk from "@/components/dashboard/ModalTambahProduk";
import ModalDetailProduk from "@/components/dashboard/ModalDetailProduk";
import ModalEditProduk from "@/components/dashboard/ModalEditProduk";
import { Product } from "@/types/product";

export default function ManajemenProdukPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const dummyProducts: Product[] = [
    {
      id: 7,
      kategori_id: 2,
      nama_produk: "Sepatu NB",
      deskripsi: "Sepatu OG Convers",
      kondisi: "New",
      size: "40",
      harga: "10000000",
      status: "READY",
      badge: "Promo",
      foto: [
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/19/373fcf82-b274-4d62-bd85-5d5ee1c4c3fc.jpg.webp",
      ],
      created_at: "2026-05-01T07:39:50.837Z",
      updated_at: "2026-05-01T07:39:50.837Z",
      kategori: {
        id: 2,
        nama_kategori: "Sneakers",
        deskripsi: "Khusu Category Sepatu Sneakers",
        created_at: "2026-04-29T12:36:23.492Z",
        updated_at: "2026-04-29T12:36:23.492Z",
      },
    },
  ];

  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Produk</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kelola katalog sepatu, harga, dan ketersediaan stok.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-[#B88E2F] hover:bg-[#9A7526] text-white px-5 py-2.5 rounded-lg font-medium transition-colors w-full md:w-auto"
        >
          <Plus size={18} className="mr-2" />
          Tambah Produk
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
            placeholder="Cari nama sepatu..."
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#B88E2F] transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm">
            <option value="">Semua Kategori</option>
            <option value="sneakers">Sneakers</option>
            <option value="casual">Casual</option>
            <option value="sport">Sport</option>
          </select>
          <select className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm">
            <option value="">Semua Status</option>
            <option value="READY">Ready</option>
            <option value="SOLD">Sold</option>
          </select>
          <button className="bg-[#0A0A0A] border border-gray-800 hover:border-gray-600 text-white p-2 rounded-lg transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0A0A0A] text-gray-300 border-b border-gray-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Produk
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Size
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Harga
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                        <Image
                          src={product.foto[0]}
                          alt={product.nama_produk}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white mb-0.5">
                          {product.nama_produk}
                        </p>
                        <span className="text-xs text-gray-500">
                          {product.kategori.nama_kategori}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{product.size}</td>

                  <td className="px-6 py-4 text-white font-medium">
                    {formatRupiah(Number(product.harga))}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        product.status === "READY"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetail(product)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-[#B88E2F] transition-colors"
                        title="Edit Produk"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Hapus Produk"
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

      <ModalTambahProduk
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ModalDetailProduk
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
      />
      <ModalEditProduk
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
