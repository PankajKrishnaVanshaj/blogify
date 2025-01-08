"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  const path = usePathname();
  const isDashboardPath = path.startsWith("/dashboard");

  // State to track if the component has mounted (hydrated)
  const [hasMounted, setHasMounted] = useState(false);

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
    // Mark component as mounted (hydrated) after the first render
    setHasMounted(true);

    if (window.location.pathname === "/auth") {
      handleGoogleCallback();
    }
  }, []);

  const globalJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PK Blogify",
    url: "https://blogify.pankri.com",
    description:
      "PK Blogify is a dynamic social media blog platform designed to bring creators, writers, and readers together in one engaging space. Share your thoughts, publish compelling articles, and explore diverse topics across various categories. Whether you're here to follow your favorite bloggers, discover trending posts, or engage in meaningful discussions, PK Blogify offers a seamless and interactive experience tailored to the modern storyteller.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://blogify.pankri.com/search?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // Only render the layout after the component is mounted (hydrated) to avoid hydration errors
  if (!hasMounted) {
    return null; // Don't render anything during SSR
  }

  return (
    <>
      {/* Apply global JSON-LD script dynamically */}
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalJsonLd),
          }}
        />
      </section>

      {/* Render Navbar, Toaster, and Footer only if not on the dashboard route */}
      {!isDashboardPath && (
        <AuthProvider>
          <div className="w-full flex flex-col min-h-screen px-1.5 md:px-8 2xl:px-24">
            <Navbar />
            <Toaster position="top-center" richColors />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
      )}
    </>
  );
}
