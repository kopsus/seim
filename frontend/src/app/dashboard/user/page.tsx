"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import axiosInstance from "@/lib/axios";

import ModalAddUser from "@/components/dashboard/user/ModalAddUser";
import ModalEditUser from "@/components/dashboard/user/ModalEditUser";
import ModalDeleteUser from "@/components/dashboard/user/ModalDeleteUser";

export default function ManajemenPenggunaPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;

      const response = await axiosInstance.get("/users", { params });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
          <Shield size={12} className="mr-1" /> ADMIN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
        <UserIcon size={12} className="mr-1" /> KASIR
      </span>
    );
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kelola akun staf dan atur hak akses Admin atau Kasir.
          </p>
        </div>

        <button
          onClick={() => setIsTambahModalOpen(true)}
          className="flex items-center justify-center bg-[#B88E2F] hover:bg-[#9A7526] text-white px-5 py-2.5 rounded-lg font-medium transition-colors w-full md:w-auto"
        >
          <Plus size={18} className="mr-2" />
          Tambah Pengguna
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari username staf..."
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#B88E2F] transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm"
          >
            <option value="">Semua Peran</option>
            <option value="ADMIN">Admin</option>
            <option value="KASIR">Kasir</option>
          </select>
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
                <th scope="col" className="px-6 py-4 font-medium">
                  Username
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Hak Akses (Role)
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Tanggal Dibuat
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#B88E2F] animate-spin mb-2" />
                      <p className="text-sm text-gray-500">
                        Memuat data pengguna...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">#{user.id}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-bold shrink-0">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-bold text-white mb-0.5">
                          {user.username}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                    <td className="px-6 py-4 text-xs">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 text-gray-400 hover:text-[#B88E2F] transition-colors"
                          title="Edit Pengguna"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus Pengguna"
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

      <ModalAddUser
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onSuccess={fetchUsers}
      />
      <ModalEditUser
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
      <ModalDeleteUser
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
