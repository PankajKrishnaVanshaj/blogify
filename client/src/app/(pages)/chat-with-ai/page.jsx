"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuSendHorizontal } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import runChat from "@/utils/ChatGeminiAIModal";

// Create a Suspense boundary only for the search params part
const SearchParamsWrapper = ({ children }) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

const ChatWithAI = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [input, setInput] = useState(query || "");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Check localStorage for saved messages and load them
    const storedMessages = JSON.parse(localStorage.getItem("messages"));
    if (storedMessages) {
      setMessages(storedMessages);
    }

    // document.body.style.overflow = "hidden";
    // return () => {
    //   document.body.style.overflow = "auto";
    // };
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    if (messages.length > 0) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      alert("Please type a message before sending.");
      return;
    }

    setLoading(true);
    setInput("");

    // Add user input to the message list
    const newMessages = [...messages, { type: "user", text: trimmedInput }];
    setMessages(newMessages);

    const prompt = `
    You are a highly knowledgeable and friendly conversational AI assistant. Your role is to provide clear, actionable, and insightful answers to user questions. You should explain concepts thoroughly and in a way that’s easy to follow, while maintaining a warm, engaging, and conversational tone. Always strive to make your answers feel like a friendly conversation, offering additional context and value where necessary. 

    Here’s how you should structure your responses:
    1. **Warm Greeting:** Begin your response with a friendly and engaging greeting.
    2. **Concise Summary:** Offer a concise summary of the answer, giving the user a quick overview. Use **bold** for emphasis.
    3. **Detailed Explanation:** Provide a deeper explanation, breaking it down step by step or using bullet points when appropriate. 
       - **Use HTML for Clarity:** Include HTML elements such as <b>, <i>, <ul>, <li>, <br>, and <a> to enhance the readability and structure of your answers.
       - **Break Complex Concepts into Simpler Parts:** If a topic is complex, break it down into simpler ideas with bullet points or numbered lists for better understanding.
    4. **Personalized Tone:** Make sure your response feels personalized, and if applicable, offer additional examples or actionable suggestions.
    5. **Useful Resources:** When relevant, provide links to external resources or references to deepen the user’s understanding, using <a href="URL">link text</a>.
    6. **Encouraging Exploration:** Finish with an encouraging statement, inviting the user to ask further questions or explore more.

    The user input will be: 
    ${trimmedInput}

    Here’s the format for your response:

    <p>
        <b>Hello there!</b> I’m so glad you asked about this! Let me walk you through the answer: <br><br>
        <i>Quick Summary:</i> <b>${trimmedInput}</b> <br><br>
        <b>In-Depth Explanation:</b> Here’s a detailed breakdown of the concept:
        <ul>
            <li><b>Main Point 1:</b> Explanation with examples</li>
            <li><b>Main Point 2:</b> Further elaboration, providing helpful context</li>
            <li><b>Main Point 3:</b> Additional resources or insights, if relevant</li>
        </ul>
        <br>
        <b>Additional Tips:</b> You might also want to check out this link for more details: <a href="URL">Learn more here</a>.<br><br>
        <b>Feel free to ask if you have more questions!</b> I’m happy to help you dive even deeper into this topic.
    </p>
`;

    try {
      const rawResponse = await runChat(prompt);

      // Add raw AI response to the message list but don't display immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: rawResponse },
      ]);
      setLoading(false);

      // Trigger the typing effect for the AI response
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleClearInput = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the chat? This will remove all messages and reset the chat history."
      )
    ) {
      setInput("");
      setMessages([]);

      // Remove messages from localStorage
      localStorage.removeItem("messages");
    }
  };

  return (
    <div className="grid grid-cols-12 h-[87vh] my-1.5">
      <div className="hidden lg:block col-span-2 p-4 rounded-md bg-gray-100 shadow-md">
        <div className="text-center">Left Ads</div>
      </div>

      <div className="col-span-12 lg:col-span-8 flex flex-col bg-white rounded-md shadow-lg mx-1 h-full">
        <div className="flex-grow overflow-y-auto p-2 space-y-4 bg-gray-50 m-2 rounded-lg shadow-inner h-[calc(100vh-200px)]">
          {/* Render User Input */}
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`py-1 px-4 rounded-lg shadow-md w-fit ${
                  message.type === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-white text-left mr-auto"
                }`}
              >
                <p
                  className="text-black"
                  dangerouslySetInnerHTML={{
                    __html: message.text,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-gray-600 text-center py-8 px-4">
              <h3 className="text-xl font-bold mb-4 text-center text-primary">
                No messages yet
              </h3>
              <p className="text-center mb-5 text-lg">
                It's time to start a conversation! 🤖
              </p>
              <p >
                Chat with AI and ask anything you're curious about. The
                possibilities are endless!
              </p>
              <p className="text-primary mt-2">
                Try asking, "What's the weather like today?" or "Tell me a fun
                fact!"
              </p>
            </div>
          )}
        </div>

        <div className="py-1 mb-2">
          <div className="flex items-center gap-2 mx-2">
            <button
              onClick={handleClearInput}
              className="bg-primary text-white hover:bg-gray-300 hover:text-primary px-3 py-1.5 rounded-lg flex items-center justify-center focus:ring-2 focus:ring-primary transition-all duration-300"
            >
              <RiDeleteBin6Line size={24} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border border-gray-300 rounded-2xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              placeholder="Ask your question..."
            />

            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-primary text-white hover:bg-gray-300 hover:text-primary px-3 py-1.5 rounded-lg flex items-center justify-center focus:ring-2 focus:ring-primary transition-all duration-300"
            >
              <LuSendHorizontal size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block col-span-2 p-4 rounded-md bg-gray-100 shadow-md">
        <div className="text-center">Right Ads</div>
      </div>
    </div>
  );
};

export default function ChatWithAIPage() {
  return (
    <SearchParamsWrapper>
      <ChatWithAI />
    </SearchParamsWrapper>
  );
}
