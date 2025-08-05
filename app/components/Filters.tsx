"use client";
import { Search } from "lucide-react";
import { useChatSelectors, useChatActions } from "../hooks/useChatActions"; // adjust path if needed

export default function Filters() {
  const {
    searchQuery,
    activeFilter,
    assignmentFilter,
    humanChatCount: humanCount,
  } = useChatSelectors();

  const { setSearchQuery, setActiveFilter, toggleAssignmentFilter } = useChatActions();

  
  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          placeholder="Search Conversation"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-all"
        />
      </div>

      <div className="flex gap-2 items-center justify-center w-full text-sm mb-4">
        <button
          name="Human Category"
          title="Human Category"
          className={`w-1/2 rounded-md px-4 py-2 ${
            activeFilter === "human" ? "bg-green-700" : "bg-gray-800"
          }`}
          onClick={() => setActiveFilter("human")}
        >
          Human ({humanCount})
        </button>
        <button
        name="AI Category"
        title="AI Category"
          className={`w-1/2 rounded-md px-4 py-2 ${
            activeFilter === "ai"
              ? "bg-[linear-gradient(rgb(0,219,195),rgb(33,150,243))]"
              : "bg-gray-800"
          }`}
          onClick={() => setActiveFilter("ai")}
        >
          AI 
        </button>
      </div>

     {activeFilter !== "ai" && (
  <div className="flex items-center gap-2 text-xs">
    <button
     name="Filter Unassigned"
     title="Filter Unassigned"
      className={`px-3 py-1 rounded-md transition-all text-gray-400/60 ${
        assignmentFilter.includes("unassigned")
          ? "text-white"
          : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800"
      }`}
      onClick={() => toggleAssignmentFilter("unassigned")}
    >
      Unassigned
    </button>
    <button
      name="Filter My Chats"
     title="Filter My Chats"
      className={`px-3 py-1 rounded-md transition-all text-gray-400/60 ${
        assignmentFilter.includes("my_chats")
          ? "text-white"
          : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800"
      }`}
      onClick={() => toggleAssignmentFilter("my_chats")}
    >
      My Chats
    </button>
    <button
       name="Filter Others"
     title="Filter Others"
      className={`px-3 py-1 rounded-md transition-all text-gray-400/60 ${
        assignmentFilter.includes("others")
          ? "text-white"
          : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800"
      }`}
      onClick={() => toggleAssignmentFilter("others")}
    >
      Others
    </button>
  </div>
)}

    </>
  );
}