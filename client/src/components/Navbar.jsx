"use client";
import Logo from "./Logo";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "./Button";
import { CiMenuFries } from "react-icons/ci";
import { MdNotificationsActive } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "axios";
import SearchBar from "./SearchBar";

const MenuItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const MobileMenu = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-white dark:bg-black z-50 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <button
        aria-label="Close menu"
        className="absolute top-4 right-4 text-3xl"
        onClick={() => setIsOpen(false)}
      >
        &times;
      </button>
      <ul className="flex flex-col items-center justify-center h-full gap-8 text-2xl text-black dark:text-white">
        {MenuItems.map((item, index) => (
          <li key={index} onClick={() => setIsOpen(false)}>
            <Link href={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(Cookies.get("token"));
  }, []);

  const logoutHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:55555/api/v1/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Cookies.remove("token");
        window.location.replace("/"); // Redirect to home page
      }
    } catch (error) {
      console.error(
        "Logout Error:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="relative flex flex-col md:flex-row w-full pt-3 items-center justify-between gap-4 md:gap-0 border-b-4 border-double px-3">
      <div className="flex items-center justify-between w-full md:w-auto">
        <button
          aria-label="Open menu"
          className="block md:hidden text-3xl"
          onClick={() => setIsOpen(true)}
        >
          <CiMenuFries />
        </button>
        <div className="flex justify-center items-center flex-1 md:flex-none">
          <Logo />
        </div>
        <div className="block md:hidden ml-auto">
          <SearchBar />
        </div>
      </div>

      <div className="hidden md:flex gap-14 items-center">
        <ul className="flex gap-8 text-base text-black dark:text-white">
          {MenuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden md:flex gap-4 items-center">
        <SearchBar />
        <MdNotificationsActive size={30} />
        <div className="flex gap-2 items-center cursor-pointer">
          {token ? (
            <Button
              onClick={logoutHandle}
              label="Log Out"
              styles="flex items-center justify-center bg-black dark:bg-rose-600 text-white dark:text-white px-4 py-1.5 rounded-full"
            />
          ) : (
            <Link href="/sign-in">
              <Button
                label="Sign in"
                styles="flex items-center justify-center bg-black dark:bg-rose-600 text-white dark:text-white px-4 py-1.5 rounded-full"
              />
            </Link>
          )}
        </div>
      </div>

      {isOpen && <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
    </nav>
  );
};

export default Navbar;
