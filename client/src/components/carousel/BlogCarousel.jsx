"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FcNext, FcPrevious } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";

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
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:55555/api/v1/posts/get-all-posts"
        );

        const postsArray = Array.isArray(response.data.posts)
          ? response.data.posts
          : [];
        const shuffledPosts = shuffleArray(postsArray);
        setPosts(shuffledPosts.slice(0, 5)); // Get 5 random posts
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Safeguard against undefined currentBlog
  const currentBlog = posts[currentIndex];
  if (!currentBlog) return <p>No posts available</p>;

  return (
    <div className="">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 rounded-b-2xl px-2 ">
          <h1 className="font-semibold text-lg text-white text-center hover:underline hover:scale-105 duration-300 cursor-pointer">
            <Link href={`/${currentBlog._id}`}>
              {currentBlog.title.slice(0, 90) + "..."}
            </Link>
          </h1>
          <p className="flex-1 overflow-hidden text-gray-500 text-sm text-justify">
            {currentBlog.content.slice(0, 255) + "..."}
          </p>
        </div>
        <div
          className="h-full w-full bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/${currentBlog.banner})`,
          }}
        />
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 focus:outline-none"
          onClick={prevSlide}
        >
          <FcPrevious size={30} />
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 focus:outline-none"
          onClick={nextSlide}
        >
          <FcNext size={30} />
        </button>
        <div className="absolute top-2 right-2 hidden md:block bg-white px-2 py-1 rounded-full font-mono font-bold shadow-md shadow-blue-600 bg-opacity-30 text-xs">
          {new Date(currentBlog.createdAt).toLocaleDateString()}
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-white pr-2 cursor-pointer shadow-md shadow-blue-600 hover:scale-105 duration-300 bg-opacity-30">
          <div className="w-8 h-8 border border-gray-300 bg-white rounded-full overflow-hidden">
            <Link href={`/${currentBlog.user._id}`}>
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${currentBlog.user?.avatar}`}
                width={50}
                height={50}
                className="object-cover w-full h-full"
                alt="User Avatar"
              />
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <Link href={`/${currentBlog.user._id}/creator`}>
              <p className="text-sm font-semibold">{currentBlog.user.name}</p>
              <p className="text-xs font-mono">@{currentBlog.user.username}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCarousel;