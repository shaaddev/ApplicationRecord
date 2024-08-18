'use client'

import { type CoreMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";

export const maxDuration = 30; // in seconds

export function Chatbot(){
  const [messages, setMessages] = useState<CoreMessage[]>([
    // {
    //   role: 'assistant',
    //   content: "I am your AI-powered job application assistant. How can I help you achieve your career goals today?",
    // },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  return(
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m, index) => (
        <div key={index} className={`${m.role === 'assistant' ? 'items-start' : 'items-end'}`}>
          <div className={`${m.role === 'assistant' ? 'bg-white dark:text-black' : 'bg-gray-600'} rounded-2xl p-2`}>
            {m.content as string}
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />

      <form
        onSubmit={async e => {
          e.preventDefault();
          
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user'}
          ];

          setMessages(newMessages);
          setInput('')

          const result = await continueConversation(newMessages);

          for await (const content of readStreamableValue(result)){
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              }
            ])
          }
        }}
      >
        <input 
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  )
}