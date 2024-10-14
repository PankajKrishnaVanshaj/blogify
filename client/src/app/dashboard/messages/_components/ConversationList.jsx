import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ConversationOptions from "./ConversationOptions"; // Import the ConversationOptions component
import { useAuth } from "@/context/AuthContext";

const ConversationList = ({
  selectedConversation,
  handleConversationClick,
  conversations = [], // Default to an empty array to avoid undefined errors
  loading,
  error,
  fetchConversations,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Safely filter conversations and avoid errors with undefined/null values
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants?.find(
      (participant) => participant?._id !== user?._id
    );
    return otherParticipant?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="lg:w-1/3 w-full p-3 shadow-sm shadow-primary bg-gradient-to-r from-pink-100 via-blue-50 to-orange-50 rounded-xl lg:h-screen h-auto">
      <h2 className="text-xl font-bold mb-4">Messages</h2>

      {/* Search Bar */}
      <div className="flex items-center border rounded-lg overflow-hidden mb-3 shadow-md hover:shadow-lg transition-shadow duration-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow m-0.5 rounded-md p-1 border-2 border-primary focus:outline-primary"
          placeholder="Search users..."
        />
        <div className="flex items-center justify-center p-1.5 rounded-md bg-primary border-2 border-tertiary">
          <FaSearch className="text-white" size={20} />
        </div>
      </div>

      {/* Display loading or error messages */}
      {loading ? (
        <p className="text-gray-500">Loading conversations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="overflow-y-auto max-h-[80vh]">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants?.find(
                (participant) => participant?._id !== user?._id
              );

              return (
                <li
                  key={conversation._id}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-blue-50 ${
                    selectedConversation?._id === conversation._id
                      ? "bg-gradient-to-r from-orange-200 via-blue-200 to-pink-200 border-2 border-primary"
                      : "bg-white border"
                  }`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="flex-grow">
                    <p className="font-semibold">
                      {otherParticipant?.name || "Unnamed User"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage?.content || "No messages"}
                    </p>
                  </div>
                  <div className="ml-2 relative">
                    {/* Conversation Options */}
                    <ConversationOptions
                      conversation={conversation}
                      fetchConversations={fetchConversations}
                    />
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;
