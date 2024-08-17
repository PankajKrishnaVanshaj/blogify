import React from "react";
import Image from "next/image";
import { IoBookmarks, IoEye, IoShareSocialSharp } from "react-icons/io5";
import Link from "next/link";
import UserInfo from "./UserInfo";
import ShareButton from "./ShareButton";

const BlogPostCard = ({ post }) => {
  const {
    _id = "",
    title = "No Title",
    content = "",
    createdAt = new Date(),
    views = 0,
    banner = "",
  } = post || {};

  const postUrl = `/${_id}`;

  return (
    <div className="h-60 border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="flex my-1 items-center">
        <div className="flex-shrink-0 mx-1">
          <Link href={postUrl}>
            {banner && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${banner}`}
                alt={title}
                width={160}
                height={160}
                priority={true}
                className="object-cover rounded-lg h-40 w-40"
              />
            )}
          </Link>
        </div>
        <div className="mx-1 flex-1">
          <Link href={postUrl}>
            <h1 className="text-xl font-semibold mb-1 text-gray-900">
              {title.length > 50 ? `${title.slice(0, 50)}...` : title}
            </h1>
          </Link>
          <p className="text-gray-700 text-sm">
            {content.length > 140 ? `${content.slice(0, 140)}...` : content}
            <Link href={postUrl}>
              <b className="font-bold"> Read More...</b>
            </Link>
          </p>
        </div>
      </div>

      <hr className="my-3 mx-20 border-gray-300" />
      <div className="px-6 flex items-center justify-between text-sm text-gray-600">
        {post?.user && <UserInfo user={post.user} use={"BlogPostCard"} />}
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1">
            <IoEye className="text-gray-500" />
            <span>{views}</span>
          </span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          <span className="flex items-center space-x-1">
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_BASE_URL}/${_id}`}
              size={18}
            />
          </span>
          <span className="flex items-center space-x-1">
            <IoBookmarks className="text-gray-500" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
