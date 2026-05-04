import { Ticket, Clock } from "lucide-react";

export default function PromoPage() {
  const promos = [
    {
      id: 1,
      title: "Diskon Awal Bulan",
      description:
        "Dapatkan potongan Rp 50.000 untuk semua sepatu Sneakers. Tanpa minimum pembelian!",
      code: "SEIMMAY50",
      validUntil: "15 Mei 2026",
    },
    {
      id: 2,
      title: "Gratis Ongkir Pulau Jawa",
      description:
        "Nikmati gratis ongkos kirim maksimal Rp 20.000 untuk pengiriman ke seluruh Pulau Jawa.",
      code: "FREEONGJAWA",
      validUntil: "31 Mei 2026",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Promo Spesial SEIM
        </h1>
        <p className="text-gray-400">
          Gunakan kode voucher di bawah ini saat kamu melakukan konfirmasi
          pesanan ke Kasir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="bg-[#1A1A1A] rounded-2xl border border-gray-800 p-6 flex flex-col relative overflow-hidden group hover:border-[#B88E2F] transition-colors"
          >
            {/* Dekorasi Bulatan di pinggir layaknya tiket */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#0A0A0A] rounded-full border-r border-gray-800 group-hover:border-[#B88E2F] transition-colors"></div>

            <div className="flex items-center mb-4 pl-4">
              <div className="bg-[#B88E2F]/20 p-3 rounded-xl text-[#B88E2F] mr-4">
                <Ticket size={28} />
              </div>
              <h2 className="text-xl font-bold text-white">{promo.title}</h2>
            </div>

            <p className="text-gray-400 text-sm mb-6 pl-4">
              {promo.description}
            </p>

            <div className="mt-auto pl-4 border-t border-gray-800 border-dashed pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Kode Voucher:</p>
                <span className="bg-[#0A0A0A] border border-gray-700 text-[#B88E2F] font-mono font-bold px-4 py-1.5 rounded-lg text-sm">
                  {promo.code}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 flex items-center justify-end mb-1">
                  <Clock size={12} className="mr-1" /> Berlaku Hingga
                </p>
                <p className="text-sm font-medium text-white">
                  {promo.validUntil}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
