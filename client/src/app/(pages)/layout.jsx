"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollButtons from "@/components/ScrollButtons";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  const path = usePathname();
  const isDashboardPath = path.startsWith("/dashboard");

  return (
    <>
      {!isDashboardPath && (
        <AuthProvider>
          <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
            <Navbar />
            <ScrollButtons />
            <Toaster position="top-center" richColors />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
      )}
    </>
  );
}
