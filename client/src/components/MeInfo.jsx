"use client";
import { useAuth } from "@/context/AuthContext";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaTachometerAlt } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";

const MeInfo = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/sign-in";
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300 shadow-lg">
          {user?.msg?.avatar && (
            <Image
              src={user?.msg?.avatar}
              width={100}
              height={100}
              priority={true}
              className="object-cover w-full h-full"
              alt="User Avatar"
            />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200">
          <div className="p-4 border-b border-gray-200">
            <div className="text-lg font-semibold text-gray-800">
              {user?.msg?.name}
            </div>
            <div className="text-sm text-primary">{user?.msg?.email}</div>
          </div>

          <div
            onClick={closeMenu}
            className="p-2 transition duration-150 rounded-lg flex items-center cursor-pointer"
          >
            <Link
              href={"/dashboard"}
              className="flex items-center w-full text-left hover:bg-red-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
            >
              <FaTachometerAlt className="mr-2" />
              <span className="font-medium">Go Dashboard</span>
            </Link>
          </div>
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left text-red-600 hover:bg-red-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
            >
              <RiLogoutCircleRLine className="mr-2" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeInfo;