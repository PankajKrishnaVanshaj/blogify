"use client";
import { Toaster } from "sonner";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";

export default function DashboardLayout({ children }) {
  const path = usePathname();
  const isDashboardPath = path.startsWith("/dashboard");

  if (!isDashboardPath) return null;

  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster />
        <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
          <div className="h-full flex flex-col">
            <Header />
            <div className="flex flex-grow">
              {/* Sidebar */}
              <div>
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="flex-grow p-2">{children}</div>
            </div>
          </div>
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}
