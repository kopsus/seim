"use client";

import axiosInstance from "@/lib/axios";
import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ModalDeleteUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export default function ModalDeleteUser({
  isOpen,
  onClose,
  user,
  onSuccess,
}: ModalDeleteUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axiosInstance.delete(`/users/${user.id}`);
      onSuccess();
      handleClose();
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Gagal menghapus Pengguna. Terjadi kesalahan pada server.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Hapus Akun Pengguna?
          </h2>
          <p className="text-gray-400 text-sm mb-1">
            Anda yakin ingin menghapus akun staf ini?
          </p>
          <p className="text-white font-bold mb-6 text-lg">{user.username}</p>
          {errorMessage ? (
            <div className="text-xs text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 w-full mb-2 text-left">
              <strong>Penghapusan Gagal:</strong> {errorMessage}
            </div>
          ) : (
            <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 w-full mb-2">
              Perhatian: Tindakan ini tidak dapat dibatalkan.
            </p>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#121212] flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-lg font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-3 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
