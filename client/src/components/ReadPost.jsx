"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import FollowButton from "@/components/FollowButton";
import PostStats from "@/components/PostStats";
import UserInfo from "@/components/UserInfo";
import Suggestion from "@/components/Suggestion";
import TextToVoice from "@/components/TextToVoice";
import { getPostById } from "@/api/blogPost.api";
import { TimeAgo } from "@/components/TimeAgo";
import ScrollButtons from "./ScrollButtons";

const ReadPost = ({ params }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    getPostDetails();

    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selected = selection.toString();
      if (selected) {
        setSelectedText(selected);
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("touchend", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("touchend", handleTextSelection);
    };
  }, []);

  const getPostDetails = async () => {
    try {
      const postId = params.creator; // Ensure `params.creator` contains the correct post ID
      const postData = await getPostById(postId); // Use the imported function to get post data
      setPost(postData); // Set the post data from the response
    } catch (error) {
      // console.error("Error fetching post data:", error);
      setError("Failed to fetch post data");
    }
  };

  const handleStopSpeaking = () => {
    setSelectedText("");
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
        <ScrollButtons />

        <div className="col-span-3 p-4">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800">
            {post.title.length > 85
              ? `${post.title.slice(0, 85)}...`
              : post.title}
          </h1>
          <div className="flex justify-between mt-2 text-sm font-thin text-primary">
            <span>
              Category:{" "}
              <span className="text-secondary font-mono">{post.category}</span>
            </span>
            <span className="hidden md:block">
              {TimeAgo(post.createdAt)} ||{" "}
              <span className="text-secondary font-mono">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </span>
          </div>

          {/* Sticky Section */}
          <div className="sticky top-0 bg-white z-10 shadow-sm hover:shadow-primary py-2 px-4 mt-1.5 rounded-lg overflow-x-auto">
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
          <div className="h-72 w-full overflow-hidden rounded-lg mb-4 shadow-sm hover:shadow-primary">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner}`}
              alt="Post image"
              width={548}
              height={288}
              priority={true} // Important for LCP image
              loading="eager" // Load eagerly (same as priority)
              srcSet={`${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner}?w=800 800w, ${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner}?w=400 400w`}
              sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
      <h1 className="p-4 text-xl md:text-2xl font-extrabold text-black">
        {post.title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="col-span-3">
          <p
            className="text-black"
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

      {/* Text to Voice Component */}
      <TextToVoice
        text={selectedText || post.content}
        onStop={handleStopSpeaking}
      />

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
