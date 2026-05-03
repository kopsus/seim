// src/app/(public)/page.tsx

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
      {/* 
        Ini adalah area kerangka sementara. 
        Nanti kita akan membangun desain visual buku terbuka (flipbook) 
        dan banner promo di sini sesuai gambar desain.
      */}
      <div className="border-2 border-dashed border-gray-800 rounded-2xl w-full h-96 flex flex-col items-center justify-center bg-[#121212]">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 text-center">
          Selamat Datang di SEIM
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Area ini disiapkan untuk visual Banner Utama
        </p>
      </div>
    </div>
  );
}
