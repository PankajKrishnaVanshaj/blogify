"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BiShareAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IoCopyOutline } from 'react-icons/io5';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp, FaPinterestP, FaEnvelope, FaRedditAlien, FaTelegramPlane } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { toast } from 'sonner';

// Helper function to create share URLs
const createShareUrl = (platform, url, title = '') => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title.trim());

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    threads: `https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
  };

  return shareUrls[platform] || '#';
};

// Define platforms with icons (unchanged)
const platforms = [
  { name: "Pinterest", icon: FaPinterestP, key: "pinterest" },
  { name: "Twitter", icon: FaTwitter, key: "twitter" },
  { name: "Facebook", icon: FaFacebookF, key: "facebook" },
  { name: "LinkedIn", icon: FaLinkedinIn, key: "linkedin" },
  { name: "Threads", icon: FaThreads, key: "threads" },
  { name: "Telegram", icon: FaTelegramPlane, key: "telegram" },
  { name: "Reddit", icon: FaRedditAlien, key: "reddit" },
  { name: "WhatsApp", icon: FaWhatsapp, key: "whatsapp" },
];

// ShareModal Component
const ShareModal = ({ isOpen, onClose, url, title }) => {
  const modalContentRef = useRef(null);
  const closeButtonRef = useRef(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Could not copy link.');
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close share dialog"
        >
          <IoMdClose size={24} />
        </button>

        <h2 id="share-dialog-title" className="text-xl font-semibold mb-5 text-center text-gray-800">
          Share 
        </h2>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
          {platforms.map(({ key, name, icon: Icon }) => (
            <a
              key={key}
              href={createShareUrl(key, url, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-md"
              aria-label={`Share on ${name}`}
            >
              <span className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 mb-1 transition-colors">
                <Icon size={22} />
              </span>
              <span className="text-xs">{name}</span>
            </a>
          ))}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-md"
            aria-label="Copy link to clipboard"
          >
            <span className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 mb-1 transition-colors">
              <IoCopyOutline size={22} />
            </span>
            <span className="text-xs">Copy Link</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ShareButton Component
const ShareButton = ({ url, title, size = 24 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!url) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-black rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Open share options"
      >
        <BiShareAlt size={size} />
      </button>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={url}
        title={title}
      />
    </>
  );
};

export default ShareButton;