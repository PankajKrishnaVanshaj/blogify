"use client";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  const path = usePathname();
  const isDashboardPath = path.startsWith("/dashboard");

  return (
    <>
      {isDashboardPath && (
        <AuthProvider>
          <Toaster />
          <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
            <div className="h-full flex flex-col">
              <Header />
              <div className="flex flex-grow">
                {/* Sidebar */}
                <div className=" ">
                  <Sidebar />
                </div>

                {/* Main Content */}
                <div className="flex-grow p-2">{children}</div>
              </div>
            </div>
          </div>
        </AuthProvider>
      )}
    </>
  );
}
