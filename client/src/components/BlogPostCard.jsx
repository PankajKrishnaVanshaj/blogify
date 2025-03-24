import React from "react";
import Image from "next/image";
import { IoEye } from "react-icons/io5";
import Link from "next/link";
import UserInfo from "./UserInfo";
import ShareButton from "./ShareButton";
import BookMarkStatus from "./BookMarkStatus";

const BlogPostCard = ({ post }) => {
  const {
    _id = "",
    title = "No Title",
    content = "",
    createdAt = new Date(),
    views = 0,
    banner = "",
    createdBy,
  } = post || {};

  const postUrl = `/${_id}/post`;
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const truncatedTitle = title.length > 60 ? `${title.slice(0, 60)}...` : title;
  const truncatedContent =
    content.length > 104 ? `${content.slice(0, 104)}...` : content;

  return (
    <div className="h-48 border border-gray-200 rounded-lg shadow-sm hover:shadow-primary overflow-hidden">
      <div className="flex my-1 items-center justify-between">
        <div className="flex-shrink-0 mx-1">
          <Link href={postUrl}>
            {banner && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${banner}`}
                alt={title}
                width={160}
                height={160}
                loading="lazy" // Lazy loading for banner image
                className="object-cover rounded-lg h-28 w-28 hover:scale-105 transition-transform duration-300"
              />
            )}
          </Link>
        </div>
        <div className="mx-1 flex-1">
          <Link href={postUrl}>
            <h1 className="text-xl font-semibold mb-1 text-gray-900 hover:text-primary line-clamp-2">
              {truncatedTitle}
            </h1>
          </Link>
          <p className="text-gray-700 text-sm line-clamp-2">
            <span
              dangerouslySetInnerHTML={{
                __html: truncatedContent,
              }}
            />
            <Link href={postUrl}>
              <b className="font-bold text-primary hover:underline">
                Read More...
              </b>
            </Link>
          </p>
        </div>
      </div>

      <hr className="my-3 mx-20 border-gray-300" />
      <div className="px-6 flex items-center justify-between text-sm text-gray-600">
        {createdBy && <UserInfo user={createdBy} use="BlogPostCard" />}
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1">
            <IoEye className="text-gray-500" />
            <span>{views}</span>
          </span>
          <span>{formattedDate}</span>
          <span className="flex items-center space-x-1">
            <ShareButton
              url={`https://blogify.pankri.com/${_id}/post`}
              size={18}
            />
          </span>
          <span className="flex items-center space-x-1">
            <BookMarkStatus post={post._id} size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
