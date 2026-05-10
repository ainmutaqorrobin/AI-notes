import { cn } from "@/lib/utils";
import { Bot, User2 } from "lucide-react";
import { UIMessage } from "ai";
import Markdown from "./markdown";

interface ChatMessageProps {
  message: UIMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
  const currentStep = message.parts[message.parts.length - 1];

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2",
        message.role === "user" ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {message.role === "assistant" ? (
          <>
            <Bot className="size-3.5 text-primary" />
            Assistant
          </>
        ) : (
          <>
            <User2 className="size-3.5" />
            You
          </>
        )}
      </div>

      <div
        className={cn(
          "prose prose-neutral dark:prose-invert max-w-full break-words rounded-[1.45rem] border px-4 py-3 text-sm leading-7 shadow-[0_12px_28px_-22px_rgba(var(--shadow-color)/0.45)] [&_*]:break-words",
          message.role === "user"
            ? "max-w-[88%] bg-primary border-primary/30 text-primary-foreground prose-headings:text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground"
            : "surface-soft max-w-[94%] border-border/80"
        )}
      >
        {currentStep?.type === "text" && (
          <Markdown>{currentStep.text}</Markdown>
        )}
        {currentStep?.type === "tool-invocation" && (
          <div className="italic">Searching notes...</div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
