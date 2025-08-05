"use client";
import React from "react";
import { Message as MessageType } from "../store/slices/chatSlice";
import Image from "next/image";
import Link from "next/link";
import { useChatSelectors } from "../hooks/useChatActions";
import linkifyHtml from "linkify-html";
import DOMPurify from 'dompurify';


export default function Message({ message }: { message: MessageType }) {
  const isAgent = message.sender_type === "human";
  const isCustomer = message.sender_type === "client";
  const isAI = message.sender_type === "ai"
  const containerAlign = isCustomer ? "justify-start" : "justify-end";
  const { selectedChat } = useChatSelectors();

  const senderType = isCustomer ? "Client" : isAgent ? "Human" : "AI";
  const bubbleColor = senderType === "Client" ? "bg-gray-700" :
    senderType === "AI" ? "bg-blue-600" :
    senderType === 'Human' ? "bg-teal-600" : "";

const getInitials = (name?: string | null): string => {
  if (!name) return ""; 
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .substring(0, 2);
};

const senderLabel = isAI ? "AI" : getInitials(message.sender_name);


  const isCommentAnswer = message.comment_link ? true : false;
  const comment_link = message.comment_link;
  const comment_social_img = selectedChat.page_type === "facebook" ? '/facebook.png' : "/instagram.png"
  const comment_content = message.comment_text;
const processMessage = (text: string) => {
  const linkified = linkifyHtml(text, {
    defaultProtocol: 'https',
    target: '_blank',
    rel: 'noreferrer',
    className: 'chat-link',
    validate: {
      email: true,
      phone: true,
      url: true
    },
    formatHref: {
      email: (href) => 'mailto:' + href,
      phone: (href) => 'tel:' + href.replace(/\s/g, '')
    }
  });
  
  return DOMPurify.sanitize(linkified, {
    ALLOWED_TAGS: ['a'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false
  });
};

  return (
    <>
      {isCommentAnswer && (
        <div className="w-full max-w-6xl my-4 mx-auto mb-4">
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center">
                  <Image width={12} height={12} src={comment_social_img} alt="Social network icon" />
                </div>
                <span className="text-gray-300 text-sm font-medium">Conversation started from post comment</span>
              </div>
              <Link 
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1" 
                target="_blank" 
                href={comment_link}
              >
                View Post
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>

            {/* Comment content */}
            <div className="space-y-2">              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(selectedChat.customer_name)}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm mb-1">{selectedChat.customer_name}</div>
                  <div className="text-gray-300 text-sm italic">
                    &quot;{comment_content}&quot;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex ${containerAlign} gap-4 my-2 ${isCustomer ? 'ml-0' : 'ml-auto'}`}>
        <div className={`px-3 py-2  rounded-xl ${isCustomer ? 'rounded-tl-sm ': 'rounded-tr-sm'} shadow-md min-w-52 max-w-[550px]  ${bubbleColor} break-words`}>
          {!isCustomer && (
            <div className="flex items-center gap-2 mb-1">
              {senderLabel !== "" && (
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-medium">
                {senderLabel}
              </div>
              )
              }
              <span className="text-[12px] font-medium">{message.sender_name}</span>
            </div>
          )}
          
          <p 
  className="text-white text-[14px]"
  dangerouslySetInnerHTML={{ __html: processMessage(message.content) }}
/>
          
          <div className="flex justify-end mt-2">
         <span className="text-[10px] text-gray-300 select-none">
  {(() => {
    const timestampDate = new Date(message.timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - timestampDate.getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (diffInMs > oneDayInMs) {
      return timestampDate.toLocaleString("default", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return timestampDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  })()}
</span>
          </div>
        </div>
      </div>
    </>
  );
}