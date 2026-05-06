// src/app/dashboard/pengguna/page.tsx
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import ModalAddUser from "@/components/dashboard/user/ModalAddUser";
import ModalEditUser from "@/components/dashboard/user/ModalEditUser";
import ModalDeleteUser from "@/components/dashboard/user/ModalDeleteUser";

export default function ManajemenPenggunaPage() {
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State untuk menyimpan data pengguna yang dipilih
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const dummyUsers = [
    {
      id: 1,
      username: "tegar_setio",
      role: "ADMIN",
      created_at: "2025-06-15T08:00:00.000Z",
    },
    {
      id: 2,
      username: "ilham_dev",
      role: "ADMIN",
      created_at: "2025-11-01T10:30:00.000Z",
    },
    {
      id: 3,
      username: "kasir_satu",
      role: "KASIR",
      created_at: "2026-01-20T14:15:00.000Z",
    },
    {
      id: 4,
      username: "kasir_magang",
      role: "KASIR",
      created_at: "2026-04-10T09:00:00.000Z",
    },
  ];

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

  // Fungsi Action Handler
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
      {/* 1. HEADER HALAMAN */}
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

      {/* 2. AREA PENCARIAN & FILTER */}
      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          {/* Placeholder diubah agar sesuai dengan input pencarian username */}
          <input
            type="text"
            placeholder="Cari username staf..."
            className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#B88E2F] transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-[#0A0A0A] text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B88E2F] text-sm">
            <option value="">Semua Peran</option>
            <option value="ADMIN">Admin</option>
            <option value="KASIR">Kasir</option>
          </select>
        </div>
      </div>

      {/* 3. TABEL DATA PENGGUNA */}
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
              {dummyUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800 hover:bg-[#0A0A0A]/50 transition-colors"
                >
                  {/* Kolom ID Integer */}
                  <td className="px-6 py-4 text-gray-500">#{user.id}</td>

                  {/* Kolom Username */}
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

                  {/* Kolom Role */}
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                  {/* Kolom Tanggal */}
                  <td className="px-6 py-4 text-xs">
                    {formatDate(user.created_at)}
                  </td>

                  {/* Kolom Aksi */}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalAddUser
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
      />
      <ModalEditUser
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
      />
      <ModalDeleteUser
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
