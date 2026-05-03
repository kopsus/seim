"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-gray-100">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 w-full md:ml-64 relative flex flex-col min-h-screen transition-all duration-300">
        <DashboardHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

        <div className="p-4 md:p-8 bg-[#050505] flex-1">{children}</div>
      </main>
    </div>
  );
}
