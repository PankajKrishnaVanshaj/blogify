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
import Translator from "./Translator";

const ReadPost = ({ params }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    getPostDetails();

    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selected = selection.toString().trim();
      if (selected) {
        setSelectedText(selected);
      } else {
        setSelectedText("");
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("touchend", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("touchend", handleTextSelection);
    };
  }, [params.creator]); // Add dependency for re-fetching if params change

  const getPostDetails = async () => {
    try {
      const postId = params.creator;
      const postData = await getPostById(postId);
      setPost(postData);
      setError(null); // Clear error on success
    } catch (error) {
      setError("Failed to fetch post data");
    }
  };

  const handleStopSpeaking = () => {
    setSelectedText("");
  };

  if (error) {
    return (
      <div className="p-4 text-red-500" role="alert">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4" aria-live="polite">
        Loading...
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="py-4 px-0 w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
        <ScrollButtons />
        <div className="col-span-1 md:col-span-3 p-4">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800">
            {post.title.length > 85
              ? `${post.title.slice(0, 85)}...`
              : post.title}
          </h1>
          <div className="flex justify-between mt-2 text-sm font-thin text-primary flex-wrap gap-2">
            <span>
              Category:{" "}
              <span className="text-secondary font-mono">{post.category}</span>
            </span>
            <span className="hidden md:block">
              <span className="text-secondary">
                <time dateTime={post.createdAt}>{TimeAgo(post.createdAt)}</time>{" "}
              </span>
              ||{" "}
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </span>
          </div>
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
        <div className="col-span-1 md:col-span-2 flex justify-center items-center">
          <figure className="h-72 w-full overflow-hidden rounded-lg shadow-sm hover:shadow-primary">
            <Image
              src={`${baseUrl}/${post.banner || "blogify.png"}`}
              alt={post.title || "Blog Post Banner"}
              width={1200}
              height={675}
              priority={true} // Explicitly set to true for clarity
              className="object-cover w-full h-full"
            />
          </figure>
        </div>
      </div>
      <header className="p-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-black">
          {post.title}
        </h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <main className="col-span-3">
          <article
            className="text-black prose prose-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </main>
        <aside className="flex flex-col justify-evenly">
          <div className="rounded-lg shadow-lg h-full">Ads Area</div>
          <div className="rounded-lg shadow-lg h-full">Ads Area</div>
          <div className="rounded-lg shadow-lg h-full">Ads Area</div>
        </aside>
      </div>

      <TextToVoice
        text={selectedText || post.content}
        onStop={handleStopSpeaking}
      />
      <Translator text={selectedText || post.content} />

      <hr className="mt-20 mx-16 border border-primary" />
      <section className="mt-8 px-0 w-full">
        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2 p-4">
          Suggestions for you
        </h2>
        <Suggestion category={post.category} />
      </section>
    </div>
  );
};

export default ReadPost;
