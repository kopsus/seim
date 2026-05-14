import { Category } from "./category";

export type Product = {
  id: string;
  kategori_id: number;
  nama_produk: string;
  deskripsi: string;
  kondisi: string;
  sizes: string[];
  harga: string;
  status: string;
  badge?: "NEW" | "SOLD OUT" | null;
  foto: string[];
  created_at: string;
  updated_at: string;
  kategori: Category;
};
