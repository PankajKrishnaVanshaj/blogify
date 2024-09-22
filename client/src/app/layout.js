import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PK Blogify",
  description:
    "PK Blogify is a dynamic social media blog platform designed to bring creators, writers, and readers together in one engaging space. Share your thoughts, publish compelling articles, and explore diverse topics across various categories. Whether you're here to follow your favorite bloggers, discover trending posts, or engage in meaningful discussions, PK Blogify offers a seamless and interactive experience tailored to the modern storyteller",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
            <Navbar /> <Toaster position="top-center" richColors />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
