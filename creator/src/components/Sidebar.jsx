import { Link, useLocation } from "react-router-dom";
import { IoMdSettings, IoMdCreate } from "react-icons/io";
import {
  MdDashboard,
  MdAnalytics,
  MdContentPaste,
  MdPeople,
} from "react-icons/md";

const sidebarItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
  { name: "Analytics", path: "/analytics", icon: <MdAnalytics /> },
  { name: "Users", path: "/users", icon: <MdPeople /> },
  { name: "Contents", path: "/contents", icon: <MdContentPaste /> },
  { name: "Create Post", path: "/create-post", icon: <IoMdCreate /> },
  { name: "Settings", path: "/settings", icon: <IoMdSettings /> },
];

const Sidebar = ({ close }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 p-4 md:p-6 shadow-md">
      <button
        onClick={close}
        className="text-gray-800 dark:text-gray-300 mb-6 self-end text-2xl hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        &times;
      </button>
      <nav className="flex flex-col flex-grow gap-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`
              flex items-center gap-4 p-3 rounded-lg
              transition-colors duration-300 ease-in-out
              ${
                item.path === currentPath
                  ? "bg-pink-500 text-white dark:bg-pink-600"
                  : "hover:bg-teal-100 dark:hover:bg-gray-700 hover:text-teal-600 dark:hover:text-teal-400 text-gray-800 dark:text-gray-300"
              }
            `}
            onClick={close}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
