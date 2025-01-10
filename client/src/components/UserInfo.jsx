import Link from "next/link";
import Image from "next/image";

const UserInfo = ({ user, use }) => {
  // Define styles based on the 'use' prop
  const styles = {
    BlogCarousel: {
      avatarSize: "w-7 h-7",
      nameText:
        "text-sm font-semibold text-black text-xs font-mono leading-none",
      usernameText: "text-xs font-mono leading-none",
      avatarWidth: 24,
      avatarHeight: 24,
    },
    BlogPostCard: {
      avatarSize: "w-8 h-8",
      nameText:
        "text-sm font-semibold text-black text-xs font-mono leading-tight",
      usernameText: "text-xs font-mono leading-none",
      avatarWidth: 32,
      avatarHeight: 32,
    },
    ReadPost: {
      avatarSize: "w-10 h-10",
      nameText: "text-base font-medium text-black pl-2 leading-tight",
      usernameText: "text-sm text-gray-600 dark:text-gray-400 leading-none",
      avatarWidth: 40,
      avatarHeight: 40,
    },
  };

  const { avatarSize, nameText, usernameText, avatarWidth, avatarHeight } =
    styles[use] || styles.ReadPost; // Default to ReadPost styles

  return (
    <div
      className={`relative flex items-center gap-1 rounded-full overflow-hidden `}
    >
      <div
        className={`${avatarSize} rounded-full overflow-hidden bg-white border border-gray-300`}
      >
        {user.avatar && (
          <Link href={`/${user._id}`}>
            <Image
              src={
                `${process.env.NEXT_PUBLIC_BASE_URL}/${user?.avatar}` ||
                "/pankri.png"
              }
              width={avatarWidth}
              height={avatarHeight}
              loading="lazy" // Lazy loading for non-critical avatars
              className="object-cover w-full h-full"
              alt="User Avatar"
            />
          </Link>
        )}
      </div>

      <Link href={`/${user._id}`}>
        <div className="pr-1">
          {user.name && <p className={nameText}>{user.name}</p>}
          {user.username && <p className={usernameText}>@{user.username}</p>}
        </div>
      </Link>
    </div>
  );
};

export default UserInfo;
