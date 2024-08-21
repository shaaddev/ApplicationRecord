"use client";

import { type CoreMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { AiOutlineSend } from "react-icons/ai";

import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import { MemoizedReactMarkdown } from "./markdown";

export const maxDuration = 30; // in seconds

export function Chatbot() {
  const [messages, setMessages] = useState<CoreMessage[]>([
    // {
    //   role: "assistant",
    //   content:
    //     "I am Landy, your AI-powered job application assistant. How can I help you achieve your career goals today?",
    // },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch h-[250px]"> 
      <div className="flex-1 overflow-y-auto p-0"> 
        {messages.map((m, index) => (
          <div
            key={index}
            className={`${
              m.role === "assistant" ? "items-start" : "items-end"
            } mb-5`}
          >
            <div
              className={`${
                m.role === "assistant" ? "bg-lime-600 text-white dark:bg-white dark:text-black" : "bg-gray-200 dark:bg-gray-600 dark:text-white"
              } rounded-2xl p-2 break-words`}
            >
              <MemoizedReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
              >
                {m.content as string}
              </MemoizedReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: "user" },
          ];

          setMessages(newMessages);
          setInput("");

          const result = await continueConversation(newMessages);

          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
          }
        }}
        className="w-full max-w-md p-2 fixed bottom-0 left-0 right-0 mx-auto mb-8 flex items-center"
      >
        <input
          className="w-full border border-gray-300 rounded shadow-xl p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="ml-2">
          <AiOutlineSend className="w-6 h-6 text-gray-600" />
        </button>
      </form>
    </div>
  );
}