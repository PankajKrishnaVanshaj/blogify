"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  const path = usePathname();
  const isDashboardPath = path.startsWith("/dashboard");

  // Function to retrieve token from URL and store it in localStorage
  const handleGoogleCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Clear the token from the URL (optional)
      window.history.replaceState({}, document.title, "/");

      // Redirect to dashboard or home page
      window.location.href = "/dashboard";
    }
  };

  // Call `handleGoogleCallback` on component mount if you’re on the auth route
  useEffect(() => {
    if (window.location.pathname === "/auth") {
      handleGoogleCallback();
    }
  }, []);

  return (
    <>
      {!isDashboardPath && (
        <AuthProvider>
          <div className="w-full flex flex-col min-h-screen px-1.5 md:px-8 2xl:px-24">
            <Navbar />
            <Toaster position="top-center" richColors />
            <div className="flex-1">{children}</div>
            {/* <Footer /> */}
          </div>
        </AuthProvider>
      )}
    </>
  );
}
