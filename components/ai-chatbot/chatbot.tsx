"use client";

import { type CoreMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { AiOutlineSend } from "react-icons/ai";
import { Theme } from "../theme";

import ReactMarkdown from 'react-markdown'

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
      <div className="overflow-y-auto p-0 flex-1 min-h-96"> 
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
              <ReactMarkdown>
                {m.content as string}
              </ReactMarkdown>
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
        <div className="relative flex w-full flex-row grow overflow-hidden p-2 border-gray-300 rounded-2xl shadow-xl bg-white focus-within:outline-blue-300">
          <input
            className="w-full bg-transparent resize-none px-4 focus-within:outline-none border-none dark:text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" className="mx-2">
            <AiOutlineSend className="w-6 h-6 text-gray-600" />
          </button>
          <Theme className="text-black"/>
        </div>
      </form>
    </div>
  );
}