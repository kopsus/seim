// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

// 1. Membuat instance Axios
// Gantilah baseURL ini dengan alamat backend Anda jika berbeda (misal pakai port 5000 atau 8000)
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor untuk REQUEST (Sebelum data dikirim ke Backend)
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari Cookies
    const token = Cookies.get("token");

    // Jika token ada, selipkan ke dalam Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. Interceptor untuk RESPONSE (Setelah data diterima dari Backend)
axiosInstance.interceptors.response.use(
  (response) => {
    // Jika respon sukses, langsung kembalikan datanya
    return response;
  },
  (error) => {
    // Jika token kadaluarsa atau tidak valid (Error 401)
    if (error.response && error.response.status === 401) {
      console.error(
        "Token tidak valid atau kadaluarsa. Silakan login kembali.",
      );
      // Hapus token yang rusak/kadaluarsa
      Cookies.remove("token");
      // Opsional: Redirect paksa ke halaman login (bisa kita aktifkan nanti)
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
