import { Category } from "./category";

export type Product = {
  id: number;
  kategori_id: number;
  nama_produk: string;
  deskripsi: string;
  kondisi: string;
  size: string;
  harga: string;
  status: string;
  badge: string;
  foto: string[];
  created_at: string;
  updated_at: string;
  kategori: Category;
};
