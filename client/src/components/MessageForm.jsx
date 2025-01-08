import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { BiMessageRoundedDetail } from "react-icons/bi";

import { sendMessage } from "@/api/message.api";

const MessageForm = ({ receiver = {} }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState(""); // Message content state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  // Toggle dialog open/close
  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) resetForm(); // Reset form when closing the dialog
  };

  // Reset message form content and error
  const resetForm = () => {
    setMessageContent("");
    setErrorMessage("");
  };

  // Handle form submission to send a message
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user || !user._id) {
      setErrorMessage("Please log in to send a message.");
      return;
    }

    // Validate message content
    if (!messageContent.trim()) {
      setErrorMessage("Message cannot be empty.");
      return;
    }

    try {
      const response = await sendMessage(receiver._id, messageContent.trim());

      // Handle success response
      console.log("Message sent:", response.data);
      toggleDialog(); // Close dialog after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Failed to send the message. Please try again.");
    }
  };

  return (
    <div>
      {/* Button to open dialog */}
      <button
        onClick={toggleDialog}
        className="border border-primary text-primary px-6 py-1.5 rounded-md hover:bg-primary hover:text-white transition-colors"
        aria-label="Send a message"
      >
        <BiMessageRoundedDetail size={29} />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4 md:mx-auto space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Message {receiver?.name || "Recipient"}
              </h2>
              <button
                onClick={toggleDialog}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close message dialog"
              >
                &times;
              </button>
            </div>

            {/* Modal Content - Message Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Type your message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)} // Update message content
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary placeholder-gray-400"
                  aria-label="Message content"
                ></textarea>
              </div>

              {/* Error message for login or empty content */}
              {errorMessage && (
                <p className="text-red-500 text-sm mb-4" role="alert">
                  {errorMessage}
                </p>
              )}

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={toggleDialog}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  type="button"
                  aria-label="Cancel message"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageForm;
