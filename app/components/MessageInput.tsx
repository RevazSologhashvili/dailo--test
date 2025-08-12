"use client";
import React, { useState, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store";
import { sendMessage, sendIsTypingOn, sendIsTypingOff } from "../store/slices/chatSlice";
import { useUser } from "../context/UserContext";

export default function MessageInput() {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  const selectedChat = useAppSelector((state) =>
    selectedChatId ? state.chat.chats[selectedChatId] : null
  );

  const [newMessage, setNewMessage] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const typingSent = useRef(false);

  if (!selectedChat || !selectedChat.is_human) return null;

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    if (value.trim()) {
      if (!typingSent.current && selectedChatId) {
        dispatch(sendIsTypingOn({ chatId: selectedChatId }));
        typingSent.current = true;
      }

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        if (typingSent.current && selectedChatId) {
          dispatch(sendIsTypingOff({ chatId: selectedChatId }));
          typingSent.current = false;
        }
      }, 3000);
    } else {
      if (typingSent.current && selectedChatId) {
        dispatch(sendIsTypingOff({ chatId: selectedChatId }));
        typingSent.current = false;
      }
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId) return;

    dispatch(sendMessage({ chatId: selectedChatId, content: newMessage.trim() }));
    setNewMessage("");

    if (typingSent.current && selectedChatId) {
      dispatch(sendIsTypingOff({ chatId: selectedChatId }));
      typingSent.current = false;
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  const isMine = selectedChat.assigned_to === user.id;
  const assignedTo =
    !isMine && selectedChat.assigned_to
      ? selectedChat.assigned_to_fn + " " + selectedChat.assigned_to_ln
      : "";

  return (
    <>
      {isMine ? (
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-gray-700 flex bg-gray-900/40"
        >
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-grow rounded-xl bg-gray-800 text-white placeholder-gray-400 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            title="Send Button"
            name="Send Button"
            type="submit"
            disabled={!newMessage.trim()}
            className="ml-3 bg-gradient-to-r from-teal-400 to-blue-500 p-3 rounded-full text-white disabled:opacity-50 hover:opacity-90"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </form>
      ) : (
        <div className="text-center text-gray-400 py-4 border-t-[1px] border-gray-500/40">
          {assignedTo
            ? `Chat is assigned to ${assignedTo}. Use "Reassign to Me" to take over.`
            : `Chat is not assigned to anyone yet. Use "Assign to Me" to start chatting.`}
        </div>
      )}
    </>
  );
}
