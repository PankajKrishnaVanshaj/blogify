import Link from "next/link";
import Image from "next/image";

const UserInfo = ({ user, use }) => {
  // Define the styles based on the 'use' prop
  const baseStyles = " rounded-full overflow-hidden";
  let avatarSize, nameTextStyle, usernameTextStyle;
  let avatarWidth, avatarHeight;

  switch (use) {
    case "BlogCarousel":
      avatarSize = "w-14 h-14";
      nameTextStyle =
        "text-base font-semibold text-gray-800 dark:text-gray-200 pl-1 leading-tight"; // Added line height
      usernameTextStyle =
        "text-sm text-gray-600 dark:text-gray-400 leading-tight"; // Added line height
      avatarWidth = 56; // 14 * 4 (Tailwind's 1 unit = 4px)
      avatarHeight = 56;
      break;
    case "BlogPostCard":
      avatarSize = "w-8 h-8";
      nameTextStyle = "text-sm font-semibold text-xs font-mono leading-tight"; // Added line height
      usernameTextStyle = "text-xs font-mono leading-tight"; // Added line height
      avatarWidth = 32; // 8 * 4
      avatarHeight = 32;
      break;
    case "ReadPost":
    default:
      avatarSize = "w-10 h-10";
      nameTextStyle =
        "text-base font-medium text-gray-800 dark:text-gray-200 pl-2 leading-tight"; // Added line height
      usernameTextStyle =
        "text-sm text-gray-600 dark:text-gray-400 leading-tight"; // Added line height
      avatarWidth = 40; // 10 * 4
      avatarHeight = 40;
      break;
  }

  return (
    <div className={`relative flex items-center gap-1 ${baseStyles}`}>
      <div
        className={`${avatarSize} ${baseStyles} bg-white border border-gray-300`}
      >
        <Link href={`/${user._id}/creator`}>
          <Image
            src={"/pankri.png"}
            width={avatarWidth}
            height={avatarHeight}
            priority={true}
            className="object-cover w-full h-full "
            alt="User Avatar"
          />
        </Link>
      </div>
      <Link href={`/${user._id}/creator`}>
        <div className="pr-2">
          <p className={nameTextStyle}>{user.name}</p>
          <p className={usernameTextStyle}>@{user.username}</p>
        </div>
      </Link>
    </div>
  );
};

export default UserInfo;
