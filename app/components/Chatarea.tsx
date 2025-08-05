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

  const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
}, [messages]);

  return (
    <>
      <div className="flex flex-col h-full px-4 bg-[#0d1421] w-full">
        <div className="flex-1 overflow-y-auto space-y-3 p-6 max-w-7xl mx-auto w-full scrollbar-thin-gray">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
            <MessageInput />
      </div>
    </>
  );
}
