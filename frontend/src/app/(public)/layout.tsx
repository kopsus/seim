"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AnnouncementModal from "@/components/dashboard/AnnouncementModal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-gray-100">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <AnnouncementModal />

      <main className="flex-1 w-full md:ml-64 relative flex flex-col min-h-screen transition-all duration-300">
        <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
