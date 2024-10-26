import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchMessages, sendMessage } from "@/api/message.api";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { TimeAgo } from "@/components/TimeAgo";

const ConversationView = ({ selectedConversation }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getReceiver = useCallback(() => {
    return selectedConversation?.participants.find((p) => p._id !== user._id);
  }, [selectedConversation, user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?._id) return;
      try {
        const { data } = await fetchMessages(selectedConversation._id);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  useEffect(() => {
    // Listen for new messages through socket
    if (socket && selectedConversation?._id) {
      socket.on("newMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      // Cleanup listener on component unmount
      return () => socket.off("newMessage");
    }
  }, [socket, selectedConversation]);

  const handleSendMessage = async () => {
    const receiver = getReceiver();
    if (!messageInput.trim() || !receiver || isSending) return;

    setIsSending(true);
    try {
      const newMessage = {
        sender: user._id,
        receiver: receiver._id,
        content: messageInput,
        createdAt: new Date().toISOString(),
      };

      await sendMessage(receiver._id, messageInput);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
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
                      className={`px-2 py-0.5 my-0.5 shadow-md rounded-lg w-fit break-words max-w-[70%] ${
                        msg.sender === user._id
                          ? "bg-pink-100 text-right"
                          : "bg-orange-100"
                      }`}
                    >
                      <span>{msg.content}</span>
                      <p className="text-xs text-gray-400">
                        {TimeAgo(msg.createdAt)}
                      </p>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No messages in this conversation.
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

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
                disabled={!messageInput.trim() || isSending}
                className={`ml-2 px-5 py-2 rounded-lg border ${
                  isSending
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
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
