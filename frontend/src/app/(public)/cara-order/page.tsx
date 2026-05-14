import Link from "next/link";
import {
  Search,
  ShoppingCart,
  CreditCard,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function CaraOrderPage() {
  const steps = [
    {
      id: 1,
      title: "Cari Sepatu Impianmu",
      description:
        "Jelajahi halaman Katalog kami. Gunakan fitur filter untuk mencari berdasarkan kategori (Sneakers, Casual, Sport) atau ukuran yang pas untuk kakimu.",
      icon: <Search size={24} className="text-white" />,
    },
    {
      id: 2,
      title: "Masukkan ke Keranjang & Checkout",
      description:
        "Klik tombol keranjang pada sepatu yang kamu inginkan. Setelah selesai memilih, buka keranjang di pojok kanan atas dan klik tombol 'Checkout'.",
      icon: <ShoppingCart size={24} className="text-white" />,
    },
    {
      id: 3,
      title: "Isi Data & Pilih Metode Pembayaran",
      description:
        "Lengkapi nama, nomor WhatsApp aktif, dan alamat lengkap. Pilih apakah kamu ingin Transfer Bank atau menggunakan fitur COD (Bayar di Gerai).",
      icon: <CreditCard size={24} className="text-white" />,
    },
    {
      id: 4,
      title: "Tunggu Konfirmasi Kasir",
      description:
        "Pesananmu akan masuk ke sistem kami. Tim Kasir kami akan segera menghubungi via WhatsApp untuk konfirmasi ketersediaan dan total tagihan.",
      icon: <CheckCircle2 size={24} className="text-white" />,
    },
    {
      id: 5,
      title: "Sepatu Dikirim / Ambil di Gerai",
      description:
        "Jika Transfer, sepatu akan langsung kami kirim dengan aman. Jika COD, silakan datang ke gerai SEIM pada tanggal yang telah kamu pilih.",
      icon: <Truck size={24} className="text-white" />,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Header Halaman */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Cara Melakukan Order
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Belanja sepatu *Second Item Mulus* berkualitas di SEIM sangatlah mudah
          dan aman. <br className="hidden md:block" />
          Ikuti panduan sederhana di bawah ini.
        </p>
      </div>

      {/* Konten Timeline / Langkah-langkah */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col md:flex-row bg-[#1A1A1A] p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-[#B88E2F] transition-colors"
          >
            {/* Bagian Ikon & Nomor */}
            <div className="flex items-center md:items-start mb-4 md:mb-0 md:mr-8 shrink-0">
              <div className="w-14 h-14 bg-[#B88E2F] rounded-xl flex items-center justify-center shadow-lg shadow-[#B88E2F]/20 relative">
                {step.icon}
                <span className="absolute -top-2 -right-2 bg-gray-900 text-[#B88E2F] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border border-[#B88E2F]">
                  {step.id}
                </span>
              </div>
            </div>

            {/* Bagian Teks */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Call to Action (Ajakan Bertindak) */}
      <div className="mt-12 text-center bg-[#0A0A0A] p-8 rounded-2xl border border-dashed border-gray-800">
        <p className="text-gray-300 mb-6">
          Sudah paham cara ordernya? Yuk langsung berburu sepatu incaranmu!
        </p>
        <Link href="/katalog">
          <button className="bg-[#B88E2F] hover:bg-[#9A7526] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
            Mulai Belanja Sekarang
          </button>
        </Link>
      </div>
    </div>
  );
}
