"use client";

import ChatMessage from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { DefaultChatTransport, UIMessage } from "ai";
import {
  Bot,
  Expand,
  Minimize,
  Send,
  Sparkles,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
  /.cloud$/,
  ".site"
);

const initialMessages: UIMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I can search across your notes, retrieve the relevant context, and summarize it into a direct answer.",
      },
    ],
  },
];

export function AIChatButton() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatOpen(true)} variant="outline" size="lg">
        <Sparkles className="size-4" />
        Ask AI
      </Button>
      <AIChatBox open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const token = useAuthToken();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/api/chat`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    messages: initialMessages,
    maxSteps: 3,
  });

  const isProcessing = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "auto",
      });
      composerRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, messages]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage({ text: input });
      setInput("");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      onSubmit(event);
    }
  }

  if (!open || typeof document === "undefined") return null;

  const lastMessageIsUser = messages[messages.length - 1].role === "user";

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close AI assistant"
        className="fixed inset-0 z-40 bg-[rgba(16,12,9,0.38)] backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className={cn(
          "surface-card animate-in slide-in-from-right-10 fixed top-20 right-3 bottom-3 z-50 flex flex-col overflow-hidden rounded-[2rem] border duration-300 sm:right-4 lg:top-24 lg:bottom-4 2xl:right-16",
          isExpanded
            ? "w-[min(calc(100vw-1.5rem),40rem)]"
            : "w-[min(calc(100vw-1.5rem),30rem)]"
        )}
      >
        <div className="border-b border-border/70 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-[1rem] bg-primary/12 p-3 text-primary">
                <Bot className="size-5" />
              </div>
              <div>
                <p className="eyebrow">Notes assistant</p>
                <h3 className="mt-1 text-xl font-semibold">
                  Ask across your saved context
                </h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                  Search, summarize, and reconnect ideas from your note archive.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-muted-foreground"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize /> : <Expand />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMessages(initialMessages)}
                className="text-muted-foreground"
                title="Clear chat"
                disabled={isProcessing}
              >
                <Trash />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={scrollAreaRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {status === "submitted" && lastMessageIsUser && <Loader />}
          {status === "error" && <ErrorMessage />}
        </div>

        <form
          className="border-t border-border/70 px-4 py-4 sm:px-5"
          onSubmit={onSubmit}
        >
          <div className="surface-soft flex gap-3 rounded-[1.5rem] border p-3">
            <Textarea
              ref={composerRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a decision, meeting, or note..."
              className="max-h-[120px] min-h-[84px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              maxLength={1000}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isProcessing}
              className="self-end"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
}

function Loader() {
  return (
    <div className="surface-soft ml-2 flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground">
      <div className="bg-primary size-1.5 animate-pulse rounded-full" />
      <div className="bg-primary size-1.5 animate-pulse rounded-full delay-150" />
      <div className="bg-primary size-1.5 animate-pulse rounded-full delay-300" />
      Searching your notes
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="rounded-[1rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
      Something went wrong. Please try again.
    </div>
  );
}
