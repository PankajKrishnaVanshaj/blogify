"use client";
import { logout } from "@/api/auth.api";
import Logo from "@/components/Logo";
import Link from "next/link";
import { toast } from "sonner";
import React, { useState } from "react";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaEdit,
  FaPlus,
  FaUserEdit,
  FaUserInjured,
} from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { MdOutlineAddToPhotos, MdOutlineWebStories } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";
import { VscFileMedia } from "react-icons/vsc";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [openSections, setOpenSections] = useState({});
  const [selectedLink, setSelectedLink] = useState("dashboard");

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      link: `/dashboard`,
    },
    {
      title: "Messages",
      icon: <BiSolidMessageAltDetail />,
      link: `/dashboard/messages`,
    },
    {
      title: "Users",
      icon: <FaUsers />,
      link: `/dashboard/users`,
    },
    {
      title: "Profile",
      icon: <FaUserInjured />,
      subItems: [
        {
          title: "Edit Profile",
          icon: <FaUserEdit />,
          link: `/dashboard/edit-profile`,
        },
      ],
    },
    {
      title: "Content",
      icon: <RiArticleFill />,
      subItems: [
        {
          title: "Media",
          icon: <VscFileMedia />,
          link: `/dashboard/media`,
        },
        {
          title: "All Blog Posts",
          icon: <FaEdit />,
          link: `/dashboard/all-blog-posts`,
        },
        {
          title: "Create Blog Post",
          icon: <FaPlus />,
          link: `/dashboard/create-blog-post`,
        },
        {
          title: "All Web Stories",
          icon: <MdOutlineWebStories />,
          link: `/dashboard/all-web-stories`,
        },
        {
          title: "Create Web Story",
          icon: <MdOutlineAddToPhotos />,
          link: `/dashboard/create-web-story`,
        },
      ],
    },
    {
      title: "Logout",
      icon: <FaSignOutAlt />,
      link: "#",
    },
  ];

  const toggleSection = (title) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  const handleLogout = async () => {
    try {
      const { success, message } = await logout();
      if (success) {
        toast.success("Logged out successfully!");
        router.push("/sign-in"); // Redirect to sign-in page after logout
      } else {
        toast.error(message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout. Please try again.");
    }
  };
  return (
    <aside className="w-60 h-screen shadow-lg bg-gradient-to-r from-pink-50 via-pink-100 to-pink-200 p-4 rounded-l-sm rounded-r-3xl my-2 flex flex-col">
      <div className="text-3xl font-extrabold ">
        <Logo />
      </div>
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleSection(item.title)}
                    className="w-full text-left flex items-center hover:bg-pink-100 transition-colors duration-300 p-2 rounded-xl block"
                  >
                    <span className="mr-3 text-primary">{item.icon}</span>
                    <span className="text-gray-700 font-semibold">
                      {item.title}
                    </span>
                  </button>
                  {openSections[item.title] && (
                    <ul className="pl-6 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.link}
                            onClick={() => handleLinkClick(subItem.link)}
                            className={`flex items-center hover:bg-pink-50 transition-colors duration-300 p-2 rounded-lg block ${
                              selectedLink === subItem.link ? "bg-gray-100" : ""
                            }`}
                          >
                            <span className="mr-3 text-primary">
                              {subItem.icon}
                            </span>
                            <span className="text-gray-600">
                              {subItem.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : item.title === "Logout" ? (
                <button
                  onClick={handleLogout}
                  className={`flex items-center hover:bg-pink-100 transition-colors duration-300 p-2 rounded-xl block`}
                >
                  <span className="mr-3 text-primary">{item.icon}</span>
                  <span className="text-gray-700 font-semibold">
                    {item.title}
                  </span>
                </button>
              ) : (
                <Link
                  href={item.link}
                  onClick={() => handleLinkClick(item.link)}
                  className={`flex items-center hover:bg-pink-100 transition-colors duration-300 p-2 rounded-xl block ${
                    selectedLink === item.link ? "bg-gray-100" : ""
                  }`}
                >
                  <span className="mr-3 text-primary">{item.icon}</span>
                  <span className="text-gray-700 font-semibold">
                    {item.title}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
