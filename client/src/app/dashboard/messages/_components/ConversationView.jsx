import React, { useState, useEffect, useCallback } from "react";
import { fetchMessages, sendMessage } from "@/Services/api/message.api";
import { useAuth } from "@/context/AuthContext";

const ConversationView = ({ selectedConversation }) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  // Get the receiver of the message
  const getReceiver = useCallback(() => {
    return selectedConversation?.participants.find((p) => p._id !== user._id);
  }, [selectedConversation, user]);

  // Fetch conversation messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?._id) return;
      try {
        const { data } = await fetchMessages(selectedConversation._id);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Handle message sending
  const handleSendMessage = async () => {
    const receiver = getReceiver();
    if (!messageInput.trim() || !receiver) return;

    try {
      await sendMessage(receiver._id, messageInput);
      setMessages([...messages, { sender: user._id, content: messageInput }]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="lg:w-2/3 w-full shadow-sm shadow-tertiary bg-gradient-to-r from-pink-50 via-blue-50 to-orange-50 rounded-xl lg:ml-3">
      {selectedConversation ? (
        <>
          <h2 className="text-xl font-bold mb-2 py-2 px-4">
            Conversation with {getReceiver()?.name || "Unknown User"}
          </h2>

          <div className="flex flex-col h-[575px] p-3 bg-white mx-2 mb-2 rounded-xl border">
            {/* Messages Section */}
            <div className="flex-grow overflow-y-auto mb-3 pr-2">
              {messages.length ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === user._id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <p
                      className={`px-2 py-0.5 my-0.5 rounded-lg w-fit break-words max-w-[70%] ${
                        msg.sender === user._id
                          ? "bg-pink-100 text-right"
                          : "bg-orange-100"
                      }`}
                    >
                      {msg.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No messages in this conversation.
                </p>
              )}
            </div>

            {/* Message Input Section */}
            <div className="flex px-4 mt-auto">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-grow p-2 border-2 rounded-lg border-primary bg-gradient-to-r from-pink-50 via-blue-50 to-orange-50 focus:outline-none"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 px-5 py-2 bg-primary text-white rounded-lg border border-tertiary hover:bg-primary-dark"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-full">
          <p className="text-center text-gray-500">
            Select a conversation to view the messages
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversationView;
