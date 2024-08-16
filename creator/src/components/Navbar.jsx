import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTimes,
  FaTwitterSquare,
  FaYoutube,
} from "react-icons/fa";
import Logo from "./Logo";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import axios from "axios";
import { AiOutlineMenu, AiOutlineLogout, AiOutlineLogin } from "react-icons/ai";
import AuthForm from "./AuthForm";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  useEffect(() => {
    setToken(Cookies.get("token"));
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const logoutHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:55555/api/v1/auth/logout",
        {}, // Empty body as no data is needed
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Cookies.remove("token");
        window.location.replace("/auth"); // Redirect to login page
      }
    } catch (error) {
      console.error(
        "Logout Error:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to log out. Please try again.");
    }
  };

  const loginHandle = () => {
    setIsAuthFormOpen(true);
  };

  return (
    <div className="w-full fixed top-0 z-50 bg-white dark:bg-gray-800 shadow-md flex flex-row px-4 md:px-6 py-4 md:py-5 items-center justify-between gap-4">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-gray-800 dark:text-gray-200"
        onClick={toggleMenu}
      >
        <AiOutlineMenu className="text-xl" />
      </button>

      {/* Logo */}
      <Logo />

      {/* Social Links */}
      <div className="hidden lg:flex gap-2 text-xl">
        <Link to="/" className="text-red-600">
          <FaYoutube />
        </Link>
        <Link to="/" className="text-blue-600">
          <FaFacebook />
        </Link>
        <Link to="/" className="text-rose-600">
          <FaInstagram />
        </Link>
        <Link to="/" className="text-blue-600">
          <FaTwitterSquare />
        </Link>
      </div>

      {/* User Menu */}
      <div className="flex gap-4 items-center">
        {token ? (
          <button
            onClick={logoutHandle}
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200"
          >
            <AiOutlineLogout />
            Logout
          </button>
        ) : (
          <button
            onClick={loginHandle}
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200"
          >
            <AiOutlineLogin />
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="w-64 h-full bg-white dark:bg-gray-800 p-4">
            <button
              className="text-gray-800 dark:text-gray-200 absolute top-4 right-4"
              onClick={toggleMenu}
            >
              X
            </button>
            <Sidebar close={toggleMenu} />
          </div>
        </div>
      )}

      {/* Auth Form */}
      {isAuthFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gradient-to-r from-teal-100 to-blue-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg relative w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-800 dark:text-gray-200"
              onClick={() => setIsAuthFormOpen(false)}
            >
              <FaTimes className="text-2xl" />
            </button>
            <div className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-600 text-center ">
                User Authentication
              </h2>
              <AuthForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
