"use client";
import React, { useState, useRef, useEffect } from "react";
import { Message as MessageType } from "../store/slices/chatSlice";
import Image from "next/image";
import Link from "next/link";
import { useChatSelectors } from "../hooks/useChatActions";
import linkifyHtml from "linkify-html";
import DOMPurify from 'dompurify';
import { Play, Pause, X } from 'lucide-react';

// Image Modal Component
const ImageModal = ({ src, alt, isOpen, onClose }) => {
  // useEffect(() => {
  //   const handleEscape = (e) => {
  //     if (e.key === 'Escape') onClose();
  //   // Messenger-style Audio Player Component

  //   if (isOpen) {
  //     document.addEventListener('keydown', handleEscape);
  //     document.body.style.overflow = 'hidden';
  //   }

  //   return () => {
  //     document.removeEventListener('keydown', handleEscape);
  //     document.body.style.overflow = 'unset';
  //   };
  // }}, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
const MessengerAudioPlayer = ({ src, type }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    const newTime = clickPercent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickPercent * 100);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Generate static waveform bars (only once)
  const [waveformHeights] = useState(() => 
    Array.from({ length: 30 }, () => Math.random() * 16 + 6)
  );

  const waveformBars = waveformHeights.map((height, i) => {
    const isActive = (i / 30) * 100 <= progress;
    return (
      <div
        key={i}
        className={`w-0.5 rounded-full ${
          isActive ? 'bg-white' : 'bg-white/40'
        }`}
        style={{ height: `${height}px` }}
      />
    );
  });

  return (
    <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-sm">
      <audio ref={audioRef} src={src} preload="metadata">
        {type && <source src={src} type={type} />}
      </audio>
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200 flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white ml-0.5" />
        )}
      </button>

      {/* Waveform Visualization */}
      <div className="flex-1 flex flex-col gap-2">
        <div 
          className="flex items-end justify-between gap-0.5 h-6 cursor-pointer"
          onClick={handleProgressClick}
        >
          {waveformBars}
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between text-xs text-white/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default function Message({ message }: { message: MessageType }) {
  const [selectedImage, setSelectedImage] = useState(null);
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
  

{message.attachments && message.attachments.length > 0 && (
  <div className="mt-3 space-y-2">
    {message.attachments.map((attachment) => {
      const fileType = attachment.content_type || ""; // Use mime_type if available
      const isImage = fileType.startsWith("image/");
      const isAudio = fileType.startsWith("audio/");
      const isOther = !isImage && !isAudio;

      return (
        <div key={attachment.id} className="rounded overflow-hidden">
          {isImage && (
            <Image
              src={attachment.url}
              alt={attachment.name || "Image"}
              width={300}
              height={200}
              className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage({ src: attachment.url, alt: attachment.name || "Image" })}
            />
          )}

          {isAudio && (
            <MessengerAudioPlayer 
              src={attachment.url} 
              type={fileType} 
            />
          )}

          {isOther && (
            // <a
            //   href={attachment.url}
            //   download
            //   className="text-blue-400 hover:underline"
            // >
            //   {attachment.name || "Download Attachment"}
            // </a>
        <a
  href={`/apis/download?url=${encodeURIComponent(attachment.url)}`}
  className="text-blue-400 hover:underline"
>
  {attachment.name || "Download Attachment"}
</a>


          )}
        </div>
      );
    })}
  </div>
)}




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

      {/* Image Modal */}
      <ImageModal 
        src={selectedImage?.src}
        alt={selectedImage?.alt}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}