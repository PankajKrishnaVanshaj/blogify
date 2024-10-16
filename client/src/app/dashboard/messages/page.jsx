"use client";
import React, { useState, useEffect } from "react";
import ConversationList from "./_components/ConversationList";
import ConversationView from "./_components/ConversationView";
import { fetchConversations } from "@/api/message.api";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetchConversations();
        setConversations(response.data);
      } catch (err) {
        setError(`Error fetching conversations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        handleConversationClick={setSelectedConversation}
        loading={loading}
        error={error}
      />
      <ConversationView selectedConversation={selectedConversation} />
    </div>
  );
};

export default Messages;
