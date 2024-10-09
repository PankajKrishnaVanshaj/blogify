import React, { useState, useEffect } from "react";
import { FaEllipsisV, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { deleteConversation, toggleUserBlock } from "@/services/message.api";
import { useAuth } from "@/context/AuthContext";

const ConversationOptions = ({ conversation, fetchConversations }) => {
  const { user } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const receiver = conversation?.participants.find((p) => p._id !== user._id);
  const userIdToBlock = receiver?._id;

  useEffect(() => {
    if (user?.blockedUsers) {
      setIsBlocked(
        user.blockedUsers.some(
          (blockedUser) => blockedUser.user === userIdToBlock
        )
      );
    }
  }, [user, userIdToBlock]);

  const handleDeleteConversation = async () => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      try {
        await deleteConversation(conversation._id);
        fetchConversations();
        toast.success("Conversation deleted");
      } catch (error) {
        toast.error("Failed to delete conversation");
      }
    }
  };

  const toggleBlockUnblock = async () => {
    try {
      await toggleUserBlock(userIdToBlock);
      setIsBlocked(!isBlocked);
      toast.success(
        `${isBlocked ? "Unblocked" : "Blocked"} ${receiver?.name || "user"}`
      );
    } catch (error) {
      toast.error("Failed to update block status");
    }
  };

  return (
    <div className="relative z-10">
      <FaEllipsisV
        className="text-gray-600 cursor-pointer"
        size={20}
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions((prev) => !prev);
        }}
      />
      {showOptions && (
        <>
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowOptions(false)} // Close dialog on background click
          ></div>

          {/* Dialog box */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
              {/* Close button */}
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowOptions(false)}
              >
                <FaTimes size={18} />
              </button>

              <ul>
                <li
                  className="px-4 py-2 hover:bg-red-100 cursor-pointer text-red-500 text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation();
                    setShowOptions(false);
                  }}
                >
                  Delete Conversation
                </li>
                <li
                  className="px-4 py-2 mt-2 hover:bg-yellow-100 cursor-pointer text-yellow-500 text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBlockUnblock();
                    setShowOptions(false);
                  }}
                >
                  {isBlocked ? "Unblock User" : "Block User"}
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationOptions;
