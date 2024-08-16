import Link from "next/link";
import Image from "next/image";

const UserInfo = ({ user, use }) => {
  // Define the styles based on the 'use' prop
  const baseStyles = "border border-gray-300 rounded-full overflow-hidden";
  let avatarSize, nameTextStyle, usernameTextStyle;

  switch (use) {
    case "BlogCarousel":
      avatarSize = "w-14 h-14";
      nameTextStyle =
        "text-base font-semibold text-gray-800 dark:text-gray-200 pl-1";
      usernameTextStyle = "text-sm text-gray-600 dark:text-gray-400";
      break;
    case "BlogPostCard":
      avatarSize = "w-8 h-8";
      nameTextStyle = "text-sm font-semibold text-xs font-mono";
      usernameTextStyle = "text-xs font-mono";
      break;
    case "ReadPost":
    default:
      avatarSize = "w-10 h-10";
      nameTextStyle =
        "text-base font-medium text-gray-800 dark:text-gray-200 pl-2";
      usernameTextStyle = "text-sm text-gray-600 dark:text-gray-400";
      break;
  }

  return (
    <div className={`relative flex items-center gap-1 ${baseStyles}`}>
      <div className={`${avatarSize} ${baseStyles} bg-white`}>
        <Link href={`/${user._id}/creator`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user?.avatar}`}
            width={avatarSize.split(" ")[0]}
            height={avatarSize.split(" ")[1]}
            className="object-cover w-full h-full"
            alt="User Avatar"
          />
        </Link>
      </div>
      <Link href={`/${user._id}/creator`}>
        <div>
          <p className={nameTextStyle}>{user.name}</p>
          <p className={usernameTextStyle}>@{user.username}</p>
        </div>
      </Link>
    </div>
  );
};

export default UserInfo;
