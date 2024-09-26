"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import FollowButton from "@/components/FollowButton";
import PostStats from "@/components/PostStats";
import UserInfo from "@/components/UserInfo";
import Suggestion from "@/components/Suggestion";

const ReadPost = ({ params }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:55555/api/v1/posts/post/${params.creator}`
      );
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching post data:", error);
      setError("Failed to fetch post data");
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="py-4 px-0 w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Main Content */}
        <div className="col-span-3 p-4">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800 line-clamp-3">
            {post.title.length > 85
              ? `${post.title.slice(0, 85)}...`
              : post.title}
          </h1>
          <p className="mt-2 text-sm font-thin text-gray-700">
            Category:{" "}
            <span className="text-primary font-mono">{post.category}</span>
          </p>

          {/* Sticky Section */}
          <div className="sticky top-0 bg-white z-50 shadow-lg py-2 px-4 rounded-lg overflow-x-auto">
            <div className="flex justify-between items-center gap-4">
              <span>
                <UserInfo user={post.user} />
              </span>
              <FollowButton userId={post.user} />
              <PostStats post={post} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-2">
          <div className="h-72 w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner}`}
              alt="Post image"
              width={548}
              height={288}
              priority={true}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <h1 className="p-4 text-xl md:text-2xl font-extrabold text-gray-800 dark:text-gray-200">
        {post.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="col-span-3">
          <p
            className="text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </div>

        <div className="flex flex-col justify-evenly ">
          <div className="rounded-lg shadow-lg h-full"> Ads Area </div>
          <div className="rounded-lg shadow-lg h-full"> Ads Area </div>
          <div className="rounded-lg shadow-lg h-full"> Ads Area </div>
        </div>
      </div>

      <hr className="mt-20 mx-16 border border-primary" />
      <div className="mt-8 px-0 w-full">
        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2 p-4">
          Suggestions for you
        </h2>
        <Suggestion category={post.category} />
      </div>
    </div>
  );
};

export default ReadPost;
