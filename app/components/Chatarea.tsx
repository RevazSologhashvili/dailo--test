

"use client";
import React, { useRef, useEffect } from "react";
import Message from "./Message";
import { useAppSelector } from "../store";
import MessageInput from "./MessageInput";

export default function Chatarea() {
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  const messages = useAppSelector((state) =>
    selectedChatId ? state.chat.messages[selectedChatId] || [] : []
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full px-4 bg-[#0d1421]">
      {/* Scrollable container with ref */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full scrollbar-thin-gray"
        style={{ minHeight: 0 }}
      >
        <div className="flex flex-col space-y-3">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {/* Spacer to allow extra scroll room */}
          <div style={{ height: "120px" }} />
        </div>
      </div>
      {/* Message input */}
      <MessageInput />
    </div>
  );
}

