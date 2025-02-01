"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Helper function to generate unique IDs for messages.
const generateUniqueId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface Abstract {
  id: number;
  title: string;
  content: string;
}

const ChatPage = () => {
  // Extract the initial query from the URL (e.g., ?initial=...)
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get("initial") || "";

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [abstracts, setAbstracts] = useState<Abstract[]>([]);

  // Function to add a message and simulate a bot response along with article abstract retrieval.
  const initiateChat = (question: string) => {
    // Add the user's message.
    const userMessage: Message = {
      id: generateUniqueId(),
      text: question,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate a bot response and retrieval of article abstracts.
    setTimeout(() => {
      const botMessage: Message = {
        id: generateUniqueId(),
        text: "This is a simulated bot response based on your query.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);

      // Simulated abstracts data (replace with your RAG service call)
      const simulatedAbstracts: Abstract[] = [
        {
          id: 1,
          title: "Abstract 1: Recent Advances in Arthroplasty",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet...",
        },
        {
          id: 2,
          title: "Abstract 2: Impact of Robotics in Joint Replacement",
          content:
            "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis...",
        },
      ];
      setAbstracts(simulatedAbstracts);
    }, 1000);
  };

  // Clear previous chat history and automatically initiate the chat if an initial query exists.
  useEffect(() => {
    setMessages([]);
    if (initialQuestion) {
      initiateChat(initialQuestion);
    }
  }, [initialQuestion]);

  // Handler for sending additional messages.
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    initiateChat(chatInput);
    setChatInput("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel: Chat Interface */}
      <div className="flex flex-col flex-1 border-r border-gray-300 bg-white shadow-sm">
        {/* Simplified Professional Header */}
        <div className="p-4 border-b border-gray-300 bg-white">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            ArthroBot Chat
          </h2>
        </div>
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">
              Your conversation will appear here...
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md p-4 rounded-md border ${
                    message.sender === "user"
                      ? "bg-blue-50 border-blue-200 text-gray-800"
                      : "bg-gray-100 border-gray-200 text-gray-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>
        {/* Message Input */}
        <form onSubmit={handleSend} className="flex p-4 border-t border-gray-300 bg-white">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Button
            type="submit"
            className="p-3 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
      {/* Right Panel: Article Abstracts */}
      <div className="flex flex-col flex-1 p-6 overflow-y-auto bg-gray-100">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Article Abstracts
        </h2>
        {abstracts.length === 0 ? (
          <p className="text-gray-500 text-center">
            Abstracts will be displayed here based on your query...
          </p>
        ) : (
          abstracts.map((abstract) => (
            <div
              key={abstract.id}
              className="mb-4 p-4 bg-white rounded-md shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {abstract.title}
              </h3>
              <p className="text-gray-600">{abstract.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatPage;
