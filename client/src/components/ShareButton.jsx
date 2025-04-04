"use client";
import { BiShareAlt } from "react-icons/bi";
import { toast } from "sonner";

const ShareButton = ({ url, title, image, size = 24 }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Web Share API for supported browsers
        await navigator.share({
          title: title || "Share this link",
          url: url,
          text: image ? `Check out this post with an image: ${image}` : undefined, // Optional text with image URL
        });
        toast.success("Shared successfully!");
      } else {
        // Fallback: Copy to clipboard for unsupported browsers
        await navigator.clipboard.writeText(url);
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