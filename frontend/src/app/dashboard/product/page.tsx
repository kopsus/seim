"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import ModalAddProduk from "@/components/dashboard/product/ModalAddProduct";
import ModalDetailProduk from "@/components/dashboard/product/ModalDetailProduct";
import ModalEditProduk from "@/components/dashboard/product/ModalEditProduct";
import { Product } from "@/types/product";
import ModalDeleteProduk from "@/components/dashboard/product/ModalDeleteProduct";
import axiosInstance from "@/lib/axios";
import { getImageUrl } from "@/utils/getImageUrl";

export default function ManajemenProdukPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };

      if (searchQuery) params.search = searchQuery;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedCategory) params.categoryId = selectedCategory;

      const response = await axiosInstance.get("/products", { params });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  console.log("data products", products);

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#B88E2F] transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          {/* Dropdown Kategori Dinamis */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama_kategori}
              </option>
            ))}
          </select>

          {/* Dropdown Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm"
          >
            <option value="">Semua Status</option>
            <option value="READY">Ready</option>
            <option value="SOLD">Sold</option>
          </select>

          <button
            onClick={fetchProducts}
            className="bg-[#0A0A0A] border border-gray-800 hover:border-gray-600 text-[#B88E2F] hover:text-white p-2 rounded-lg transition-colors"
          >
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
              {/* 4. Kondisi Loading & Data Kosong */}
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="mt-2 text-xs">Memuat data produk...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500 italic"
                  >
                    Belum ada data produk.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
                          <Image
                            src={getImageUrl(product.foto)}
                            alt={product.nama_produk}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized={process.env.NODE_ENV === "development"}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white mb-0.5">
                            {product.nama_produk}
                            {product.badge && (
                              <span className="ml-2 px-1.5 py-0.5 bg-[#B88E2F] text-white text-[9px] rounded font-bold uppercase">
                                {product.badge}
                              </span>
                            )}
                          </p>
                          <span className="text-xs text-gray-500">
                            {product.kategori?.nama_kategori}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes?.map((s: any) => (
                          <span
                            key={s.id}
                            className={`px-2 py-0.5 rounded text-xs font-medium border ${
                              s.stock > 0
                                ? "bg-gray-800 border-gray-700 text-gray-200"
                                : "bg-red-500/10 border-red-500/20 text-red-500"
                            }`}
                          >
                            {s.size} ({s.stock})
                          </span>
                        ))}
                      </div>
                    </td>

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
                          onClick={() => handleDeleteProduct(product)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus Produk"
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

      {/* 6. Teruskan onSuccess={fetchProducts} ke Modal agar tabel refresh setelah aksi */}
      <ModalAddProduk
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
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
        onSuccess={fetchProducts}
      />
      <ModalDeleteProduk
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
