import { MapPin, Phone, Clock } from "lucide-react";

export default function KontakPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Hubungi Kami
        </h1>
        <p className="text-gray-400">
          Punya pertanyaan seputar produk atau pesanan? Jangan ragu untuk
          menghubungi kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 flex items-start space-x-4">
            <div className="bg-[#0A0A0A] p-3 rounded-xl text-[#B88E2F]">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Gerai Offline SEIM</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Jl. Merdeka No. 123, Kecamatan Kebasen,
                <br />
                Kabupaten Banyumas, Jawa Tengah 53172
              </p>
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 flex items-start space-x-4">
            <div className="bg-[#0A0A0A] p-3 rounded-xl text-[#B88E2F]">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">WhatsApp (Admin)</h3>
              <p className="text-sm text-gray-400">0812-3456-7890</p>
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 flex items-start space-x-4">
            <div className="bg-[#0A0A0A] p-3 rounded-xl text-[#B88E2F]">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Jam Operasional</h3>
              <p className="text-sm text-gray-400">
                Senin - Sabtu: 09:00 - 20:00 WIB
                <br />
                Minggu: Tutup
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">
            Kirim Pesan Bantuan
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama"
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                No. WhatsApp / Email
              </label>
              <input
                type="text"
                placeholder="Untuk balasan kami"
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Pesan Anda
              </label>
              <textarea
                rows={4}
                placeholder="Tuliskan pertanyaan atau keluhan Anda..."
                className="w-full bg-[#0A0A0A] text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B88E2F] transition-colors resize-none"
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full bg-[#B88E2F] hover:bg-[#9A7526] text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
