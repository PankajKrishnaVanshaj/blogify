import Bookmark from "@/components/Bookmark";
import Notifications from "@/components/Notifications";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="shadow-md px-4 py-2 flex justify-between items-center rounded-lg mt-2 bg-white">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-primary">
          {user?.avatar && (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user?.avatar}`}
              width={100}
              height={100}
              priority={true}
              className="object-cover w-full h-full"
              alt="User Avatar"
            />
          )}
        </div>
        <div className="ml-2  text-primary leading-none">
          <p className="font-extrabold ">{user?.name}</p>
          <p className="font-mono ">@{user?.username}</p>
        </div>
      </div>

      <nav className="flex space-x-4">
        <Bookmark />
        <Notifications />
      </nav>
    </header>
  );
};

export default Header;
