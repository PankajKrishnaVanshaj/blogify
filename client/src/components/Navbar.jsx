"use client";
import Logo from "./Logo";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "./Button";
import { CiMenuFries } from "react-icons/ci";
import Notifications from "./Notifications";
import Bookmark from "./Bookmark";
import MeInfo from "./MeInfo";
import SearchBar from "./SearchBar";
import AIChatBar from "./AIChatBar";

const MenuItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const MobileMenu = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-white cd z-50 transform ${
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
      <ul className="flex flex-col items-center justify-center h-full gap-8 text-2xl text-primary ">
        {MenuItems.map((item, index) => (
          <li key={index} onClick={() => setIsOpen(false)}>
            <Link href={item.href}>{item.name}</Link>
          </li>
        ))}
        <li onClick={() => setIsOpen(false)}>
          <Link href={"/sign-in"}>Sign in</Link>
        </li>
      </ul>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <nav className="relative flex flex-col md:flex-row w-full pt-3 items-center justify-between gap-4 md:gap-0 border-b-4 border-double px-0.5 rounded-xl">
      <div className="flex items-center justify-between w-full md:w-auto">
        <button
          aria-label="Open menu"
          className="block md:hidden text-3xl"
          onClick={() => setIsOpen(true)}
        >
          <CiMenuFries />
        </button>
        <div className="flex justify-center items-center flex-1 md:flex-none ">
          <Logo />
        </div>
        <div className="block md:hidden ml-auto">
          <div className="flex items-center gap-1 border border-primary text-primary rounded-full px-0.5 py-1 text-sm font-thin cursor-pointer">
            <SearchBar />
            Search/Chat
            <AIChatBar />
          </div>
        </div>
      </div>

      <div className="hidden md:flex gap-14 items-center">
        <ul className="flex gap-8 text-base text-primary">
          {MenuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden md:flex gap-5 items-center">
        <div
          className="flex items-center gap-1 border border-primary text-primary rounded-full px-0.5 py-1 text-sm font-thin cursor-pointer"
          style={{ minWidth: "100px" }} 
        >
          <SearchBar />
          <span>Search/Chat</span>
          <AIChatBar />
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          {token ? (
            <>
              <Bookmark />
              <Notifications />
              <MeInfo />
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                label="Sign in"
                styles="flex items-center justify-center bg-primary text-white dark:text-white px-4 py-1.5 rounded-full"
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
