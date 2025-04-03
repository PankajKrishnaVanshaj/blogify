"use client";
import { Toaster } from "sonner";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { usePathname, useRouter } from "next/navigation"; // Add useRouter
import { useEffect, useState } from "react"; // Add useEffect and useState
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { isAuthenticated } from "@/api/auth.api"; // Import isAuthenticated

export default function DashboardLayout({ children }) {
  const path = usePathname();
  const router = useRouter(); // Initialize useRouter
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Track auth check status
  const isDashboardPath = path.startsWith("/dashboard");

  // If not a dashboard path, return null (no layout rendered)
  if (!isDashboardPath) return null;

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          console.log("User not authenticated, redirecting to /sign-in");
          router.push("/sign-in"); // Redirect to sign-in if not authenticated
        } else {
          console.log("User authenticated, rendering dashboard");
        }
      } catch (error) {
        console.error("Error checking authentication:", error.message);
        router.push("/sign-in"); // Redirect on error as a fallback
      } finally {
        setIsAuthChecked(true); // Mark auth check as complete
      }
    };

    checkAuth();
  }, [router]); // Dependency on router to ensure it runs once per mount

  // Render nothing until auth check is complete
  if (!isAuthChecked) {
    return null; // Or a loading spinner if preferred
  }

  // Render the dashboard layout if authenticated
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