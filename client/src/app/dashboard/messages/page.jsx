"use client";
import React, { useState } from "react";

const initialMockMessages = [
  { id: 1, name: "John Doe", messages: ["Hey, how's it going?"] },
  {
    id: 2,
    name: "Jane Smith",
    messages: ["Don't forget the meeting tomorrow!"],
  },
  { id: 3, name: "Michael Brown", messages: ["Let's catch up soon!"] },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chats, setChats] = useState(initialMockMessages);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      // Add new message to the selected chat
      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, messageInput] }
          : chat
      );
      setChats(updatedChats);
      setMessageInput(""); // Clear input field
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar with conversation list */}
      <div className="lg:w-1/3 w-full p-3 shadow-sm shadow-primary bg-gradient-to-r from-pink-100 via-blue-50 to-orange-50 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`px-2 py-1.5 rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-blue-50 ${
                selectedChat?.id === chat.id
                  ? "bg-gradient-to-r from-orange-200 via-blue-200 to-pink-200 border-2 border-secondary"
                  : "bg-white border"
              }`}
              onClick={() => handleChatClick(chat)}
            >
              <p className="font-semibold">{chat.name}</p>
              <p className="text-sm text-gray-600">
                {chat.messages[chat.messages.length - 1]}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat view panel */}
      <div className="lg:w-2/3 w-full shadow-sm shadow-tertiary bg-gradient-to-r from-pink-50 via-blue-50 to-orange-50 rounded-xl lg:ml-3">
        {selectedChat ? (
          <>
            <h2 className="text-xl font-bold mb-2 py-2 px-4">
              Conversation with {selectedChat.name}
            </h2>
            <div className="p-3 bg-white min-h-[650px] mx-2 mb-2 rounded-xl border flex flex-col justify-between">
              <div className="flex-grow overflow-y-auto">
                {/* Display chat messages */}
                {selectedChat.messages.map((message, index) => (
                  <p
                    key={index}
                    className="bg-tertiary w-fit px-2 py-1 my-1 rounded-lg"
                  >
                    {message}
                  </p>
                ))}
              </div>

              {/* Input field and send button */}
              <div className="flex mt-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-grow p-2 border-2 rounded-lg border-tertiary"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 px-5 py-2 bg-primary text-white rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-full">
            <p className="text-center">
              Select a conversation to view the messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
