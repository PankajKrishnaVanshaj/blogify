"use client";
import { useState, useEffect } from "react";
import { FcNext, FcPrevious } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import UserInfo from "../UserInfo";
import { fetchAllPosts } from "@/api/blogPost.api";

const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const BlogCarousel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const duration = 59 * 60 * 1000;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === posts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, duration);
    return () => clearInterval(interval);
  }, [currentIndex, posts.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsArray = await fetchAllPosts();
        const shuffledPosts = shuffleArray(postsArray);
        setPosts(shuffledPosts.slice(0, 5)); // Get 5 random posts
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const currentBlog = posts[currentIndex];
  if (!currentBlog) return <p>No posts available</p>;

  return (
    <div className="">
      <div className="relative h-96 rounded-lg overflow-hidden">
        {/* Replace div with Image component */}
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${currentBlog.banner}`}
          alt={currentBlog.title}
          width={1200}
          height={675}
          className="h-full w-full object-cover"
          priority={true} // Prioritize loading for carousel (above-the-fold content)
        />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 rounded-b-2xl px-2">
          <h1 className="font-semibold text-lg text-primary text-center hover:underline hover:scale-105 duration-300 cursor-pointer line-clamp-1">
            <Link href={`/${currentBlog._id}/post`}>
              {currentBlog.title.slice(0, 100) + "..."}
            </Link>
          </h1>
          <p
            className="flex-1 overflow-hidden text-white text-sm text-justify line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: currentBlog.content
                ? currentBlog.content.slice(0, 275) + "..."
                : "",
            }}
          ></p>
        </div>

        {/* Navigation buttons */}
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 focus:outline-none"
          aria-label="Previous"
          onClick={prevSlide}
        >
          <FcPrevious size={30} />
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 focus:outline-none"
          aria-label="Next"
          onClick={nextSlide}
        >
          <FcNext size={30} />
        </button>

        {/* Date and UserInfo */}
        <div className="absolute top-2 right-2 hidden md:block bg-white px-2 py-1 rounded-full font-mono font-bold shadow-md shadow-primary bg-opacity-30 text-xs">
          {new Date(currentBlog.createdAt).toLocaleDateString()}
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-white pr-2 cursor-pointer shadow-md shadow-primary hover:scale-105 duration-300 bg-opacity-30">
          {currentBlog.createdBy && (
            <UserInfo user={currentBlog.createdBy} use="BlogCarousel" />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCarousel;
