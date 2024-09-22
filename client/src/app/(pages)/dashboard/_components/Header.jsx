import Bookmark from "@/components/Bookmark";
import Notifications from "@/components/Notifications";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  // const { user } = useAuth();

  return (
    <header className="shadow-md px-4 py-2 flex justify-between items-center rounded-lg mt-2 bg-white">
      {/* User Section */}
      <div
        className={`w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300`}
      >
        {/* <span>{user?.msg?.name || "Guest"}</span> */}
      </div>

      {/* Navigation Section */}
      <nav className="flex space-x-4">
        <Bookmark />
        <Notifications />
      </nav>
    </header>
  );
};

export default Header;
