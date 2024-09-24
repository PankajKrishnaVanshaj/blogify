import Bookmark from "@/components/Bookmark";
import Notifications from "@/components/Notifications";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const Header = () => {
  // const { user } = useAuth();
  return (
    <header className="shadow-md px-4 py-2 flex justify-between items-center rounded-lg mt-2 bg-white">
      {/* User Section */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300`}
        >
          {/* {user?.msg?.avatar && (
            <Image
              src={user?.msg?.avatar}
              width={100}
              height={100}
              priority={true}
              className="object-cover w-full h-full"
              alt="User Avatar"
            />
          )} */}
        </div>
        <span className="ml-2 font-extrabold text-primary">
          {/* {user?.msg?.name} */}
        </span>
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
