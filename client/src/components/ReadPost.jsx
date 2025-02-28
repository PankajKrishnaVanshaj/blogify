"use client";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import sanitizeHtml from "sanitize-html";
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
        setSelectedText(""); // Clear if no text selected
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

  // Memoize sanitized content to avoid re-sanitizing on every render
  const sanitizedContent = useMemo(() => {
    if (!post?.content) return "";
    return sanitizeHtml(post.content, {
      allowedTags: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "s",
        "sub",
        "sup",
        "mark",
        "small",
        "del",
        "ins",
        "ul",
        "ol",
        "li",
        "dl",
        "dt",
        "dd",
        "a",
        "img",
        "figure",
        "figcaption",
        "blockquote",
        "pre",
        "code",
        "div",
        "section",
        "article",
        "aside",
        "header",
        "footer",
        "main",
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "th",
        "td",
        "caption",
        "span",
        "br",
        "hr",
        "abbr",
        "cite",
        "q",
        "video",
        "audio",
        "source",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel", "title"],
        img: [
          "src",
          "alt",
          "width",
          "height",
          "title",
          "loading",
          "srcset",
          "sizes",
        ],
        div: ["class", "id"],
        span: ["class", "id"],
        section: ["class", "id"],
        article: ["class", "id"],
        aside: ["class", "id"],
        header: ["class", "id"],
        footer: ["class", "id"],
        main: ["class", "id"],
        abbr: ["title"],
        table: ["class", "id"],
        th: ["scope", "colspan", "rowspan"],
        td: ["colspan", "rowspan"],
        video: ["src", "controls", "width", "height", "poster", "preload"],
        audio: ["src", "controls", "preload"],
        source: ["src", "type"],
        "*": ["data-*"],
      },
      allowedIframeHostnames: [],
      selfClosing: ["img", "br", "hr"],
    });
  }, [post?.content]); // Only re-sanitize if content changes

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

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blogify.pankri.com";

  return (
    <div className="py-4 px-0 w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ScrollButtons />
        <div className="col-span-3 p-4">
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
              <UserInfo user={post.user} />
              <FollowButton userId={post.user} />
              <PostStats post={post} />
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <figure className="h-72 w-full overflow-hidden rounded-lg mb-4 shadow-sm hover:shadow-primary">
            <Image
              src={`${baseUrl}/${post.banner || "blogify.png"}`}
              alt={post.title}
              width={1200}
              height={675}
              priority
              srcSet={`
                ${baseUrl}/${post.banner || "blogify.png"}?w=1200 1200w,
                ${baseUrl}/${post.banner || "blogify.png"}?w=800 800w,
                ${baseUrl}/${post.banner || "blogify.png"}?w=400 400w
              `}
              sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
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
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </main>
        <aside className="flex flex-col justify-evenly">
          <div className="rounded-lg shadow-lg h-full">Ads Area</div>
          <div className="rounded-lg shadow-lg h-full">Ads Area</div>
          <div className="rounded-lg shadow-lg h-full">Ads Area</div>
        </aside>
      </div>

      <TextToVoice
        text={selectedText || sanitizedContent}
        onStop={handleStopSpeaking}
      />
      <Translator text={selectedText || sanitizedContent} />

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
