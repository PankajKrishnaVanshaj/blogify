"use client";
import { useAuth } from "@/context/AuthContext";
import { IoBookmarksOutline } from "react-icons/io5";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";

const AccountCount = () => {
  const { user } = useAuth();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
      <Card
        icon={<SlUserFollow />}
        title="Followers"
        value={user?.followers?.length}
      />
      <Card
        icon={<SlUserFollowing />}
        title="Following"
        value={user?.following?.length}
      />
      <Card
        icon={<IoBookmarksOutline />}
        title="Bookmarks"
        value={user?.bookMarks?.length}
      />
      <Card
        icon={<MdOutlineNotificationsActive />}
        title="Notifications"
        value={user?.notifications?.length}
      />
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="flex items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
    <div className="text-3xl text-primary mr-4">{icon}</div>
    <div>
      <p className="font-bold text-gray-800">{title}</p>
      <p className="text-2xl text-gray-600">{value}</p>
    </div>
  </div>
);

export default AccountCount;