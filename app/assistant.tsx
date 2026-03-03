"use client";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";

// Generate a unique thread ID per browser session, persisted in localStorage
// Using localStorage (not sessionStorage) so the conversation survives Magento page navigations
function getThreadId(): string {
  const key = "tankbot-thread-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `widget-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// Custom adapter that calls our Python Cloud Run agent
const tankbotAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    // Extract the last user message text
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    let messageText = "";
    if (typeof lastUserMsg?.content === "string") {
      messageText = lastUserMsg.content;
    } else if (Array.isArray(lastUserMsg?.content)) {
      messageText = lastUserMsg.content
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("\n");
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messageText,
        threadId: getThreadId(),
      }),
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`Agent returned ${response.status}`);
    }

    const data = await response.json();

    return {
      content: [{ type: "text" as const, text: data.reply }],
    };
  },
};

export const Assistant = () => {
  const runtime = useLocalRuntime(tankbotAdapter);

  // THE COMMUNICATOR: Tells Magento to resize the iframe
  useEffect(() => {
    let closeTimer: ReturnType<typeof setTimeout>;
    let lastState: boolean | null = null;

    const observer = new MutationObserver(() => {
      const isModalOpen = document.querySelector('[role="dialog"]') !== null;

      if (isModalOpen === lastState) return;
      lastState = isModalOpen;

      if (isModalOpen) {
        clearTimeout(closeTimer);
        window.parent.postMessage({ type: 'TANKBOT_RESIZE', isOpen: true }, '*');
      } else {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          window.parent.postMessage({ type: 'TANKBOT_RESIZE', isOpen: false }, '*');
        }, 400);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearTimeout(closeTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <AssistantModal />
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
};