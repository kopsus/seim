"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface ModalEditUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess?: () => void;
}

export default function ModalEditUser({
  isOpen,
  onClose,
  user,
  onSuccess,
}: ModalEditUserProps) {
  const [formData, setFormData] = useState({
    username: "",
    role: "KASIR",
    newPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      const timer = setTimeout(() => {
        setFormData({
          username: user.username || "",
          role: user.role || "KASIR",
          newPassword: "",
        });
        setErrorMsg("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!formData.username) {
      setErrorMsg("Username tidak boleh kosong.");
      return;
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      setErrorMsg("Password baru minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        username: formData.username,
        role: formData.role,
      };

      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      await axiosInstance.put(`/users/${user.id}`, payload);

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Gagal update pengguna:", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
      );
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

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#121212] rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Edit Pengguna</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password Baru{" "}
                <span className="text-xs text-gray-600">(Opsional)</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Kosongkan jika tidak ingin mengubah password"
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Hak Akses (Role) <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F]"
              >
                <option value="KASIR">KASIR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#121212] rounded-b-2xl flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg font-medium bg-[#B88E2F] hover:bg-[#9A7526] text-white transition-colors flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
