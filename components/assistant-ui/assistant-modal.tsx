"use client";

// 1. ADD 'X' TO THE IMPORTS
import { Droplet, X } from "lucide-react";
import { AssistantModalPrimitive } from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";

import { DragHandle } from "./drag-handle";

export const AssistantModal = () => {
  return (
    <AssistantModalPrimitive.Root>
      <AssistantModalPrimitive.Anchor className="fixed bottom-4 right-4 z-50">

        <AssistantModalPrimitive.Trigger asChild>
          <DragHandle>
            {/* Added 'group', 'relative', and the custom soft shadow */}
            <button className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-[#FFFF00] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-transform hover:scale-110 active:scale-95">

              {/* THE DROPLET (Visible when closed, spins & fades out when open) */}
              <Droplet
                fill="black"
                strokeWidth={0}
                className="absolute h-8 w-8 text-black transition-all duration-300 group-data-[state=open]:-rotate-90 group-data-[state=open]:scale-0 group-data-[state=open]:opacity-0"
              />

              {/* THE X (Hidden when closed, spins & fades in when open) */}
              <X
                strokeWidth={3}
                className="absolute h-8 w-8 text-black opacity-0 transition-all duration-300 group-data-[state=closed]:rotate-90 group-data-[state=closed]:scale-0 group-data-[state=open]:opacity-100 group-data-[state=open]:scale-100"
              />

            </button>
          </DragHandle>
        </AssistantModalPrimitive.Trigger>

      </AssistantModalPrimitive.Anchor>

      <AssistantModalPrimitive.Content
        side="top"
        align="end"
        sideOffset={16}
        className="z-50 h-[calc(100dvh-100px)] max-h-[600px] w-[calc(100vw-32px)] max-w-[400px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl flex flex-col"
      >
        <DragHandle className="w-full flex cursor-grab items-center justify-center border-b border-gray-100 bg-gray-50/50 py-2 active:cursor-grabbing">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </DragHandle>
        <div className="flex-1 overflow-hidden">
          <Thread />
        </div>
      </AssistantModalPrimitive.Content>

    </AssistantModalPrimitive.Root>
  );
};