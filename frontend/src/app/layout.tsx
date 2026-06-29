import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- BAGIAN METADATA YANG DISESUAIKAN ---
export const metadata: Metadata = {
  title: "SEIM Store | Shoes & Apparel",
  description:
    "Toko sepatu, sneakers, dan apparel terbaik dengan harga bersaing. Temukan sepatu impianmu dan belanja dengan aman, mudah, serta terpercaya di SEIM Store.",
  keywords: [
    "sepatu",
    "sneakers",
    "seim store",
    "sepatu",
    "toko sepatu jakarta",
  ],
  authors: [{ name: "SEIM Store" }],
  openGraph: {
    title: "SEIM Store | Shoes & Apparel",
    description: "Toko sepatu sneakers terlengkap. Cek katalog kami sekarang!",
    url: "https://seimstore.cloud", // Ganti dengan domain asli Anda nanti jika sudah ada
    siteName: "SEIM Store",
    images: [
      {
        url: "/logo.jpeg", // Pastikan Anda menaruh file logo.jpeg di dalam folder public/
        width: 800,
        height: 600,
        alt: "SEIM Store Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};
// ----------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id" // Ubah "en" menjadi "id" karena website kita berbahasa Indonesia
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        {children}
      </body>
    </html>
  );
}
