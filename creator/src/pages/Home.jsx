import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import AuthForm from "../components/AuthForm";
import Cookies from "js-cookie";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      window.location.replace("/");
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-teal-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 md:py-16 max-w-3xl mx-auto text-center">
        {/* Join Now Text */}
        <div className="hidden md:flex items-center gap-2 py-2 px-4 border-2 rounded-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-lg mb-6">
          <span className="text-gray-800 dark:text-gray-300 text-sm md:text-base">
            Discover a world of creativity and collaboration{" "}
          </span>
          <button
            onClick={openModal}
            className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-300"
          >
            Join Now
            <MdArrowForward className="text-lg" />
          </button>
        </div>

        {/* Main Content */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-6">
          Join Our Community of Inspiring Writers
        </h1>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto">
          Embrace your passion for writing and connect with a diverse community
          of writers. Our platform offers tools and support for every stage of
          your creative journey. Join us to unlock new opportunities and share
          your stories with the world.
        </p>
        <button
          onClick={openModal}
          className="bg-teal-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-colors duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Auth Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gradient-to-r from-teal-100 to-blue-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg relative w-full max-w-lg">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
            >
              <FaTimes className="text-2xl" />
            </button>
            <div className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-600 text-center ">
                User Authentication
              </h2>
              <AuthForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
