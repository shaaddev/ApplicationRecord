"use client";

import { useState, useTransition } from "react";
import type { CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import ReactMarkdown from "react-markdown";
import { ChatCircleDotsIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import { continueConversation } from "./actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const intro: ChatMessage = {
  id: "intro",
  role: "assistant",
  content: "Hi, I'm Landy. Ask me about tracking applications, resumes, or interview prep.",
};

function toCore(messages: ChatMessage[]): CoreMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([intro]);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const replyId = crypto.randomUUID();
    const history = [...messages, userMessage];
    setMessages([...history, { id: replyId, role: "assistant", content: "" }]);
    setInput("");

    startTransition(async () => {
      try {
        const stream = await continueConversation(toCore(history));
        for await (const chunk of readStreamableValue(stream)) {
          const content = String(chunk ?? "");
          setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content } : m)));
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === replyId ? { ...m, content: "Something went wrong. Try again." } : m,
          ),
        );
      }
    });
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button size="icon-lg" className="fixed right-5 bottom-5 z-30 rounded-full shadow-lg" />
        }
        aria-label="Chat with Landy"
      >
        <ChatCircleDotsIcon weight="fill" className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src="/landy.png" alt="" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <SheetTitle>Landy</SheetTitle>
              <SheetDescription>Job search assistant</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <MessageScrollerProvider autoScroll>
          <MessageScroller className="min-h-0 flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4 p-4">
                {messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <Message align={message.role === "user" ? "end" : "start"}>
                      {message.role === "assistant" ? (
                        <MessageAvatar>
                          <Avatar className="size-7">
                            <AvatarImage src="/landy.png" alt="" />
                            <AvatarFallback>L</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                      ) : null}
                      <MessageContent>
                        <Bubble variant={message.role === "user" ? "default" : "muted"}>
                          <BubbleContent className="text-sm [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-4 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-4">
                            {message.content ? (
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            ) : (
                              <Spinner className="my-1" />
                            )}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>

        <form onSubmit={send} className="border-t p-3">
          <InputGroup>
            <InputGroupInput
              placeholder="Ask Landy"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={pending}
              autoComplete="off"
              aria-label="Message"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="submit"
                size="icon-xs"
                variant="default"
                disabled={pending || !input.trim()}
                aria-label="Send"
              >
                {pending ? <Spinner /> : <PaperPlaneRightIcon weight="fill" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
}
