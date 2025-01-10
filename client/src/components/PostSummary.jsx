"use client";
import { useState, useCallback } from "react";
import { PiBrain } from "react-icons/pi";
import { generateSummary as gemini } from "@/utils/SummaryGeminiAIModal";

const PostSummary = ({ PostContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);

  // Simulate summary generation with error handling
  const generateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let inputPrompt = `Summarize the following blog post in a clear, concise, and engaging manner. Focus on the main ideas, key takeaways, and essential points. Maintain the original tone and style of the content, and ensure the summary is easy to read and understand. Avoid unnecessary details and filler content, while highlighting the most important aspects. Here’s the blog post content: ${PostContent}`;

      const result = await gemini.sendMessage(inputPrompt);
      const summaryText = (await result.response.text())
        .replace("```json", "")
        .replace("```", "");
      setSummary(summaryText);
    } catch (error) {
      setError("Sorry, something went wrong while generating the summary.");
    } finally {
      setIsLoading(false);
    }
  }, [PostContent]);

  return (
    <div className="relative z-10">
      {/* Button to open the summary modal */}
      <button
        onClick={() => setIsOpen(true)} aria-label="summary generation ai"
        className="p-2 rounded-full text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out"
      >
        <PiBrain size={20} />
      </button>

      {/* Modal for summary generation */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="comment-form-title"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="relative bg-white rounded-lg w-full max-w-lg sm:w-3/4 md:w-1/2 lg:w-1/3 shadow-2xl transform transition-all duration-300 ease-in-out">
            <div className="flex justify-around p-5">
              {/* Show "Re-Generate Summary" or "Generate Summary" button */}
              <button
                onClick={generateSummary}
                disabled={isLoading}
                className="px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-150 ease-in-out disabled:bg-gray-400"
              >
                {isLoading
                  ? "Generating..."
                  : summary
                  ? "Re-Generate Summary"
                  : "Generate Summary"}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-full border border-pink-300 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-150 ease-in-out"
              >
                Close
              </button>
            </div>

            {/* Display error or summary */}
            <div className="text-black p-4">
              {error && (
                <div className="text-red-500 mb-4">
                  <p>{error}</p>
                </div>
              )}
              {!error && summary && (
                <p
                  className="leading-relaxed p-1 text-sm bg-pink-100 rounded-lg shadow-sm overflow-hidden break-words"
                  dangerouslySetInnerHTML={{
                    __html: summary,
                  }}
                />
              )}
              {/* If no summary and not loading, show message to generate summary */}
              {!summary && !isLoading && !error && (
                <p className="text-gray-500">
                  No summary available. Click "Generate Summary" to create one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostSummary;
