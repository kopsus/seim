// src/app/dashboard/page.tsx
export default function DashboardOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Ringkasan Bisnis</h1>

      {/* Kotak-kotak Statistik Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Total Produk</p>
          <p className="text-3xl font-bold text-white">128</p>
        </div>
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Pesanan (Hari Ini)</p>
          <p className="text-3xl font-bold text-white">45</p>
        </div>
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">
            Total Penjualan (Bulan Ini)
          </p>
          <p className="text-2xl font-bold text-[#B88E2F]">Rp 23.750.000</p>
        </div>
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Produk Terjual (Sold)</p>
          <p className="text-3xl font-bold text-white">96</p>
        </div>
      </div>
    </div>
  );
}
