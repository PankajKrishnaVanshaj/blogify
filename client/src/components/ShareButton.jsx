"use client";
import React, { useEffect, useRef, useState } from "react";
import { BiCopy, BiShareAlt } from "react-icons/bi";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditShareButton,
  PocketShareButton,
  EmailShareButton,
  VKShareButton,
  TumblrShareButton,
  FacebookMessengerShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  VKIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";
import { toast } from "sonner";

const ShareDialog = ({ url, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy URL. Please try again.");
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-x-auto">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative flex flex-col items-center gap-4 p-4 bg-white border rounded shadow-lg z-60">
        <div className="flex items-center gap-4">
          <FacebookShareButton url={url}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <TwitterShareButton url={url}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <LinkedinShareButton url={url}>
            <LinkedinIcon size={32} round={true} />
          </LinkedinShareButton>
          <WhatsappShareButton url={url}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
          <TelegramShareButton url={url}>
            <TelegramIcon size={32} round={true} />
          </TelegramShareButton>
          <RedditShareButton url={url}>
            <RedditIcon size={32} round={true} />
          </RedditShareButton>
          <PocketShareButton url={url}>
            <PocketIcon size={32} round={true} />
          </PocketShareButton>
          <EmailShareButton url={url}>
            <EmailIcon size={32} round={true} />
          </EmailShareButton>
          <VKShareButton url={url}>
            <VKIcon size={32} round={true} />
          </VKShareButton>
          <TumblrShareButton url={url}>
            <TumblrIcon size={32} round={true} />
          </TumblrShareButton>
          <FacebookMessengerShareButton url={url}>
            <FacebookMessengerIcon size={32} round={true} />
          </FacebookMessengerShareButton>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
        >
          <span className="bg-white px-3 py-1 rounded-full">{url}</span>
          <BiCopy size={24} />
          <span>Copy </span>
        </button>
      </div>
    </div>
  );
};

const ShareButton = ({ url, size }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareButtonRef = useRef(null);

  const toggleShareButton = () => {
    setIsOpen(!isOpen);
  };

  const closeShareButton = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target)
      ) {
        closeShareButton();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        closeShareButton();
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={shareButtonRef}>
      <button
        onClick={toggleShareButton}
        aria-label="Share"
        className="p-2 text-black rounded-full hover:bg-gray-200 transition-colors duration-200 "
      >
        <BiShareAlt size={size} />
      </button>
      {isOpen && <ShareDialog url={url} onClose={closeShareButton} />}
    </div>
  );
};

export default ShareButton;
