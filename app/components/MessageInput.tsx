"use client";
import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store";
import { sendMessage } from "../store/slices/chatSlice";
import { useUser } from "../context/UserContext";

export default function MessageInput() {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  const selectedChat = useAppSelector((state) =>
    selectedChatId ? state.chat.chats[selectedChatId] : null
  );

  // Move state hook before conditional return!
  const [newMessage, setNewMessage] = useState("");

  // Now conditionally render only UI, but hooks already called
  if (!selectedChat || !selectedChat.is_human) {
    return null;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId) return;

    dispatch(
      sendMessage({ chatId: selectedChatId, content: newMessage.trim() })
    );

    setNewMessage("");
  };

  const isMine = selectedChat.assigned_to === user.id;
  const assignedTo = !isMine && selectedChat.assigned_to ? selectedChat.assigned_to_fn + " " + selectedChat.assigned_to_ln : "";

  return (
    <>
      {isMine ? (
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-gray-700 flex bg-gray-900/40 "
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
      ):
      <div className="text-center text-gray-400 py-4 border-t-[1px] border-gray-500/40">{assignedTo ? `Chat is assigned to ${assignedTo}. Use "Reassign to Me" to take over.` : `Chat is not assigned to anyone yet. Use "Aassign to Me" to start chatting.`}</div>
    }
    </>
  );
}
