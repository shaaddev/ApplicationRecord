"use client";

import { useState, useEffect, useRef } from "react";
import { CoreMessage } from "ai";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { ChevronsUpDownIcon, SendIcon } from "./icons";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

async function handleSendMessage(
  e: React.FormEvent,
  messages: CoreMessage[],
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>
) {
  e.preventDefault();

  const newMessages: CoreMessage[] = [
    ...messages,
    { role: "user", content: input },
  ];
  setMessages(newMessages);
  setInput("");

  const result = await continueConversation(newMessages);

  for await (const content of readStreamableValue(result)) {
    setMessages([
      ...newMessages,
      { role: "assistant", content: content as string },
    ]);
  }
}

export function ChatbotUI() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<CoreMessage[]>([
    // {
    //   role: "assistant",
    //   content:
    //     "I am Landy, your AI-powered job application assistant. How can I help you achieve your career goals today?",
    // },
  ]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className={`fixed bottom-0 right-0 w-full max-w-md bg-background border rounded-t-lg shadow-lg transition-all duration-300 ${
        isExpanded ? "h-[600px]" : "h-[80px]"
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 bg-lime-600 text-white rounded-t-lg cursor-pointer ${
          isExpanded ? "rounded-b-none" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/landy.png"
            width={32}
            height={32}
            alt="Landy"
            className="rounded-full"
            style={{ aspectRatio: "32/32", objectFit: "cover" }}
          />
          <h3 className="text-lg font-medium">Chat with Landy!</h3>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ChevronsUpDownIcon className="w-4 h-4" />
        </Button>
      </div>
      {isExpanded && (
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 ${
                  message.role === "assistant" ? "" : "flex-row-reverse"
                }`}
              >
                {message.role === "assistant" ? (
                  <Avatar>
                    <AvatarImage src="/landy.png" alt="Agent" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                ) : (
                  <FaUser className="h-8 w-8" />
                )}
                <div
                  className={`${
                    message.role === "assistant"
                      ? "bg-muted text-black dark:text-white"
                      : "bg-primary text-primary-foreground"
                  } rounded-lg px-4 py-3 max-w-[75%]`}
                >
                  <ReactMarkdown>{`${String(message.content)}`}</ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t px-6 pt-5">
            <form
              onSubmit={(e) =>
                handleSendMessage(e, messages, setMessages, input, setInput)
              }
              className="flex items-center gap-2"
            >
              <div className="relative max-h-60 flex flex-row w-full grow justify-between overflow-hidden bg-zinc-100 dark:bg-slate-800 px-6 rounded-full border focus:outline-1">
                <input
                  id="message"
                  placeholder="Type your message..."
                  className="max-h-[60px] flex-1 border-none focus-within:outline-none bg-transparent"
                  autoComplete="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
