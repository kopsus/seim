import { Store, ShieldCheck, HeartHandshake } from "lucide-react";

export default function TentangKamiPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Tentang SEIM
        </h1>
        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-gray-800 text-gray-300 leading-relaxed space-y-4 text-sm md:text-base">
          <p>
            <strong className="text-white">SEIM (Second Import)</strong> lahir
            dari kecintaan kami terhadap kultur *sneakers* dan keinginan untuk
            memberikan akses sepatu berkualitas tinggi dengan harga yang jauh
            lebih terjangkau bagi semua kalangan.
          </p>
          <p>
            Kami menyadari bahwa memiliki sepatu *branded* original seringkali
            membutuhkan biaya yang besar. Oleh karena itu, SEIM hadir sebagai
            solusi cerdas. Kami menyeleksi ketat setiap pasang sepatu *second
            import* dari luar negeri, memastikan keaslian (100% Original), dan
            membersihkannya secara profesional hingga mencapai kondisi *Like
            New* (seperti baru).
          </p>
          <p>
            Visi kami sederhana:{" "}
            <span className="text-[#B88E2F] font-bold italic">
              Kualitas Langit, Harga Bumi
            </span>
            . Kami ingin kamu bisa melangkah dengan percaya diri menggunakan
            sepatu impianmu tanpa harus menguras dompet.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Kenapa Memilih SEIM?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 text-center flex flex-col items-center">
          <ShieldCheck size={40} className="text-[#B88E2F] mb-4" />
          <h3 className="font-bold text-white mb-2">Kurasi Ketat</h3>
          <p className="text-xs text-gray-400">
            Setiap sepatu melewati 3 tahap pengecekan keaslian dan kondisi fisik
            sebelum masuk katalog.
          </p>
        </div>
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 text-center flex flex-col items-center">
          <Store size={40} className="text-[#B88E2F] mb-4" />
          <h3 className="font-bold text-white mb-2">Gerai Offline</h3>
          <p className="text-xs text-gray-400">
            Selain online, kami memiliki gerai fisik yang bisa kamu kunjungi
            untuk mencoba langsung sepatu idamanmu.
          </p>
        </div>
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 text-center flex flex-col items-center">
          <HeartHandshake size={40} className="text-[#B88E2F] mb-4" />
          <h3 className="font-bold text-white mb-2">Pelayanan Ramah</h3>
          <p className="text-xs text-gray-400">
            Tim kami siap membantu merekomendasikan ukuran dan model yang paling
            cocok untuk gayamu.
          </p>
        </div>
      </div>
    </div>
  );
}
