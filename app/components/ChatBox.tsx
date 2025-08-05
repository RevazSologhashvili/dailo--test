"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Chat } from "../store/slices/chatSlice";
import { useChatActions, useChatSelectors } from "../hooks/useChatActions";

// Get initials from a full name (up to 2 letters)
const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
    .substring(0, 2);
};

// Format timestamps to a relative time string like "5s", "3m", "2h", "now"
const formatTimeAgo = (date: string, now: number): string => {
  if (!date) return "";

  const messageTime = new Date(date).getTime();
  if (isNaN(messageTime)) return "";

  // Calculate seconds difference, never negative
  const seconds = Math.max(0, Math.floor((now - messageTime) / 1000));

  if (seconds === 0) return "now";
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(months / 12);
  return `${years}y`;
};

const ChatBox = memo(function ChatBox({ chat }: { chat: Chat }) {
  const { selectedChat } = useChatSelectors();
  const { setSelectedChat } = useChatActions();

  // State to hold current timestamp, updated every second for live "time ago"
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Use last_message_time or updated_at as fallback
  const messageTime = chat.last_message_time || chat.updated_at || "";

  // Click handler to select this chat
  const handleClick = () => setSelectedChat(chat.id);

  // Icon path based on page_type (lowercased)
  const fromIcon = `/${chat.page_type?.toLowerCase()}.png`;

  // Get initials for assigned user (first + last name)
  const getAssignedUserInitials = (): string => {
    if (chat.assigned_to && chat.assigned_to_fn && chat.assigned_to_ln) {
      return getInitials(`${chat.assigned_to_fn} ${chat.assigned_to_ln}`);
    }
    return "";
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-gray-800 ${
        selectedChat?.id === chat.id
          ? "bg-gray-800 border border-teal-500"
          : "border-transparent border"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Customer initials circle */}
        <div className="relative w-10 h-10 font-medium flex items-center justify-center text-center bg-gray-600 rounded-full text-white shrink-0">
          {getInitials(chat.customer_name)}

          {/* Assigned user initials overlay */}
          {chat.assigned_to && (
            <div className="absolute right-0 bottom-0 w-5 h-5 ring-1 ring-gray-700 bg-teal-500 text-white text-xs flex items-center justify-center rounded-full">
              {getAssignedUserInitials()}
            </div>
          )}
        </div>

        {/* Chat info: customer name and page */}
        <div className="flex flex-col gap-1 flex-grow mx-3 overflow-hidden">
          <p className="font-medium text-sm truncate" title={chat.customer_name}>
            {chat.customer_name}
          </p>
          <span className="text-xs text-gray-400 flex items-center gap-2">
            <Image
              src={fromIcon}
              alt={chat.page_name}
              width={16}
              height={16}
              loading="lazy"
            />
            {chat.page_name}
          </span>
        </div>

        {/* Timestamp and unread count */}
        <div className="flex flex-col items-end space-y-1 shrink-0">
          <p className="text-xs text-gray-500">{formatTimeAgo(messageTime, now)}</p>
          {chat.is_human && chat.unread_count > 0 && (
            <p className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {chat.unread_count}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatBox;
