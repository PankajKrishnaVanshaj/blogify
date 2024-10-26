import React, { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import ConversationOptions from "./ConversationOptions";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

const ConversationList = ({
  selectedConversation,
  handleConversationClick,
  conversations = [], // Default empty array to prevent errors
  loading,
  error,
  fetchConversations,
}) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket(); // Access socket and online users from context
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize the filtered conversations for performance
  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const otherParticipant = conversation.participants?.find(
        (participant) => participant?._id !== user?._id
      );
      return otherParticipant?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, user]);

  // Check if a participant is online
  const isUserOnline = (userId) => onlineUsers.includes(userId);

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

      {/* Loading, Error, and Conversation List */}
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
              const isOnline = isUserOnline(otherParticipant?._id);

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
                    <p
                      className={`font-semibold ${
                        isOnline ? "text-primary font-serif" : "text-black "
                      }`}
                    >
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
