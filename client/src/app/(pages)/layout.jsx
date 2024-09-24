"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  const path = usePathname();
  const isDashboardPath = path.startsWith("/dashboard");

  return (
    <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
      {/* {!isDashboardPath && <Navbar />} */}
      <Navbar />
      <Toaster position="top-center" richColors />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
