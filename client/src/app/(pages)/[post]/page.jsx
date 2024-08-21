"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import FollowButton from "@/components/FollowButton";
import PostStats from "@/components/PostStats";
import UserInfo from "@/components/UserInfo";

const ReadPost = ({ params }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:55555/api/v1/posts/post/${params.post}`
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
    <div className="p-4 h-screen w-full overflow-auto">
      <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4">
        <div className="col-span-3 p-4">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800">
            {post.title.length > 85
              ? `${post.title.slice(0, 85)}...`
              : post.title}
          </h1>
          <div className="flex justify-between gap-3 overflow-x-auto my-4 shadow-lg py-1 px-2 rounded-lg bg-white dark:bg-gray-900 sticky top-0">
            <UserInfo user={post.user} />
            <FollowButton user={post.user} />
            <PostStats post={post} />
          </div>
        </div>
        <div className="col-span-2 h-72 w-full overflow-hidden rounded-lg">
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

      <h1 className="p-4 text-xl md:text-2xl font-extrabold text-gray-800 dark:text-gray-200">
        {post.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="col-span-2 overflow-auto">
          <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg shadow-lg">{/* <PopularPosts /> */}</div>
          <div className="rounded-lg shadow-lg">{/* <PopularCreator /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default ReadPost;
