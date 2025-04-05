"use client";
import { BiShareAlt } from "react-icons/bi";
import { toast } from "sonner";

const ShareButton = ({ url, title, size = 24 }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Web Share API for supported browsers
        await navigator.share({
          title: title || "Check out this post!", // Title is explicitly set first
          url: url, // URL comes after title
        });
        toast.success("Shared successfully!");
      } else {
        // Fallback: Copy to clipboard for unsupported browsers
        await navigator.clipboard.writeText(`${title || "Check out this post!"}: ${url}`);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Share failed:", errorMessage);
      toast.error("Failed to share the link.");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 text-black rounded-full hover:bg-gray-200 transition-colors duration-200"
      aria-label="Share this post"
    >
      <BiShareAlt size={size} />
    </button>
  );
};

export default ShareButton;