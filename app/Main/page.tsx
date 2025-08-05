"use client";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NotSelected from "../components/NotSelected";
import Chatarea from "../components/Chatarea";
import { useAppSelector, useAppDispatch } from "../store/index";
import { Providers } from "../components/Providers";
import { useEffect } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
  setCurrentUserId,
} from "../store/slices/chatSlice";
import { useUser } from "../context/UserContext";


export default function Page() {


  return (
    <Providers>
      <ChatLayout />
    </Providers>
  );
}

function ChatLayout() {
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector((state) => state.chat.isConnected);
  const isAsideOpen = useAppSelector((state) => state.chat.isAsideOpen);
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  const { user } = useUser();

useEffect(() => {
  if (user) {
    dispatch(setCurrentUserId(user?.id)); // Rehydrate Redux after refresh
  }
}, [user?.id]);

  // Connect once on mount
  useEffect(() => {
    console.log("🌐 Connecting to WebSocket...");
    dispatch(connectWebSocket("wss://test.dailo.ai/ws"));

    return () => {
      console.log("🧹 Cleaning up WebSocket connection...");
      dispatch(disconnectWebSocket());
    };
  }, [dispatch]);

  return (
      <div className="h-screen bg-gray-900 text-white font-sans">
        {!isConnected && (
          <div className="absolute top-0 left-0 h-screen w-screen bg-black/30 backdrop-blur-md flex items-center justify-center text-white text-center py-2 text-md z-50">
            Connecting to server...
          </div>
        )}

        <Sidebar />
        <div
          className={`transition-all duration-300 h-screen flex flex-col ${isAsideOpen ? "ml-64" : "ml-0"
            }`}
        >
          <Header />
          <main className="flex-1 flex items-center justify-center w-full bg-[#212120] overflow-hidden">
            {selectedChatId ? <Chatarea /> : <NotSelected />}
          </main>
        </div>
      </div>
  );
}
