// app/home/page.tsx (or wherever your home component is located)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const chatPrompts: string[] = [
  "What are the key factors affecting outcomes in total knee arthroplasty?",
  "How does patient age impact recovery time after total hip replacement?",
  "What are the latest developments in robotic-assisted joint replacement?",
];

const Home = () => {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // Navigate to the chat page with the question as a URL parameter
      router.push(`/chat?initial=${encodeURIComponent(question)}`);
    }
  };

  const handleExampleClick = (prompt: string) => {
    router.push(`/chat?initial=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-8 w-[800px]">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-6xl font-medium bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
            ArthroBot
          </p>
          <p className="text-xl text-gray-600">
            An AI-Powered Literature Companion for Arthroplasty Research & Practice
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about arthroplasty research or practice..."
            className="flex-1 text-lg py-6"
          />
          <Button type="submit" size="lg" disabled={!question.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </form>

        <div className="flex flex-col gap-3">
          <p className="text-gray-600 text-center">Or start with a suggested topic:</p>
          <div className="flex gap-5 justify-center">
            {chatPrompts.map((prompt, index) => (
              <div
                onClick={() => handleExampleClick(prompt)}
                key={index}
                className="w-[250px] text-sm border border-1 hover:border-0 transition-all cursor-pointer 
                           hover:-translate-y-1 hover:bg-blue-100 rounded-lg p-4 leading-relaxed shadow"
              >
                {prompt}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
