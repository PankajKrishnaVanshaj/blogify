"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import { RiArticleFill } from "react-icons/ri";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const [selectedLink, setSelectedLink] = useState("dashboard");
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      link: `/dashboard`,
    },
    {
      title: "Profile",
      icon: <FaUser />,
      subItems: [
        {
          title: "Edit Profile",
          icon: <FaEdit />,
          link: `/dashboard/edit-profile`,
        },
      ],
    },
    {
      title: "Content",
      icon: <RiArticleFill />,
      subItems: [
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
        // {
        //   title: "All Web Stories",
        //   icon: <FaEdit />,
        //   link: `/dashboard/all-web-stories`,
        // },
        // {
        //   title: "Create Web Story",
        //   icon: <FaPlus />,
        //   link: `/dashboard/create-web-story`,
        // },
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

  return (
    <aside className="w-60 h-screen shadow-lg bg-gradient-to-r from-pink-50 via-pink-100 to-pink-200 p-4 rounded-l-sm rounded-r-3xl my-2 flex flex-col">
      <div className="text-3xl font-extrabold ">
        <Logo />
      </div>
      <nav>
        <ul className="space-y-4">
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
                    <ul className="pl-6 space-y-2">
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
