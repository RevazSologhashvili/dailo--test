/* eslint-disable */
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

// Interfaces
export interface Chat {
  id: string;
  page_name: string;
  page_type: string;
  customer_name: string;
  is_human: boolean;
  assigned_to: number | null;
  assigned_to_ln?: string | null;
  assigned_to_fn?: string | null;
  unread_count: number;
  last_message?: string;
  last_message_time?: string;
  last_message_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id?: string;
  chat_id: string;
  content: string;
  sender_type?: "client" | "ai" | "human";
  comment_link?: string;
  comment_text?: string;
  sender_name?: string;
  timestamp?: string;
  is_read?: boolean;
  message_type?: "text" | "image" | "file";
  attachments?: {
    "id": number,
     "url": string,
     "content_type": string,
     "name": string
  }[]
}

export type WebSocketMessage =
  | ({ type: "new_message" } & Message)
  | {
      // Corrected definition for "assigned_to" messages
      type: "assign_to";
      id: string; // The chat ID
      assigned_to: number | null;
      assigned_to_fn?: string | null;
      assigned_to_ln?: string | null;
      success?: boolean; // Include if your backend always sends it
    }

    | {
      type: "to_ai";
      chatId: string;
    }
    | {
      type: "to_human";
      chat_id: string;
      assigned_to: number | null;
      assigned_to_fn: string | null;
      assigned_to_ln: string | null;
    }

  | {
      // General type for messages with a 'data' property that contains a Chat object
      // This is for "chat_created", "chat_updated", "chat_assigned", "chat_transferred"
      type: "chat_created" | "chat_updated" | "chat_assigned" | "chat_transferred" | "add_chat";
      data: Chat;
    }
  | {
      type: "chat_open";
      chat_id: string;
      messages: Message[];
    };

export type ChatFilter = "human" | "ai";
export type AssignmentFilter = "unassigned" | "my_chats" | "others";

interface ChatState {
  chats: Record<string, Chat>;
  messages: Record<string, Message[]>;
  selectedChatId: string | null;
  activeFilter: ChatFilter;
  assignmentFilter: AssignmentFilter[];
  searchQuery: string;
  isConnected: boolean;
  isAsideOpen: boolean;
  ws: WebSocket | null;
  isConnecting: boolean;
  connectionError: string | null;
  currentUserId?: number | null;
}

const initialState: ChatState = {
  chats: {},
  messages: {},
  selectedChatId: null,
  activeFilter: "human",
  assignmentFilter: ["unassigned", "my_chats", "others"],
  searchQuery: "",
  isConnected: false,
  isAsideOpen: true,
  ws: null,
  isConnecting: false,
  connectionError: null,
  currentUserId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentUserId: (state, action: PayloadAction<number>) => {
      state.currentUserId = action.payload;
    },

  chatToAi: (state, action) => {
  const { chatId } = action.payload;

  if (state.chats[chatId]) {
    state.chats[chatId].is_human = false;
    state.chats[chatId].assigned_to = null; 
    state.chats[chatId].assigned_to_fn = null;
    state.chats[chatId].assigned_to_ln = null;
    state.chats[chatId].updated_at = new Date().toISOString();
  }
},

chatToHuman: (state, action) => {
  const { chatId, assignedTo, assignedToFirstName, assignedToLastName } = action.payload;

  if (state.chats[chatId]) {
    state.chats[chatId].is_human = true;
    state.chats[chatId].assigned_to = assignedTo;
    state.chats[chatId].assigned_to_fn = assignedToFirstName;
    state.chats[chatId].assigned_to_ln = assignedToLastName;
    state.chats[chatId].updated_at = new Date().toISOString();
  }
},

  chatAssignUpdate: (state, action) => {
  const { chatId, assignedTo, assignedToFirstName, assignedToLastName } = action.payload;

  if (state.chats[chatId]) {
    // Use Immer's direct mutation approach
    state.chats[chatId].assigned_to = assignedTo;
    state.chats[chatId].assigned_to_fn = assignedToFirstName;
    state.chats[chatId].assigned_to_ln = assignedToLastName;
    state.chats[chatId].updated_at = new Date().toISOString();
  }
},

    toggleAssignmentFilter: (state, action: PayloadAction<AssignmentFilter>) => {
  const filter = action.payload;
  const index = state.assignmentFilter.indexOf(filter);

  if (index > -1) {
    // Deselect it
    if (state.assignmentFilter.length > 1) {
      state.assignmentFilter.splice(index, 1);
    }
  } else {
    // Add it
    state.assignmentFilter.push(filter);
  }
},

    assignChatToUser: (state, action: PayloadAction<{ chatId: string; userId: number;}>) => {
      const { chatId, userId } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId] = {
          ...state.chats[chatId],
          assigned_to: userId,
          
        };
      }
    },

    // Single message receiver
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      console.log(message)
      // Initialize the array if it doesn't exist yet

      if (!state.messages[message.chat_id]) {
        state.messages[message.chat_id] = [];
      }

      // Prevent duplicate message by id (if id exists)
      if (
        message.id &&
        state.messages[message.chat_id].some((m) => m.id === message.id)
      ) {
        return;
      }

      // Add the new message
      state.messages[message.chat_id].push(message);

      // Update chat metadata if chat exists
      if (state.chats[message.chat_id]) {
        const chat = state.chats[message.chat_id];
        const isUnread =
          message.sender_type === 'client' &&
          state.selectedChatId !== message.chat_id;

        state.chats[message.chat_id] = {
          ...chat,
          last_message: message.content,
          last_message_time: message.timestamp,
          updated_at: message.timestamp,
          unread_count: isUnread ? chat.unread_count + 1 : chat.unread_count,
        };
      }
    },

    addMessagesBatch: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;

      state.messages[chatId] = [];

      // Sort messages by timestamp
      const sortedMessages = [...messages].sort((a, b) =>
        new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime()
      );

      state.messages[chatId].push(...sortedMessages);

      if (state.chats[chatId] && sortedMessages.length > 0) {
        const chat = state.chats[chatId];
        const lastMessage = sortedMessages[sortedMessages.length - 1];

        const unreadCount = sortedMessages.filter(
          (msg) => msg.sender_type === 'client' && state.selectedChatId !== chatId
        ).length;

        state.chats[chatId] = {
          ...chat,
          last_message: lastMessage.content,
          last_message_time: lastMessage.timestamp,
          updated_at: lastMessage.timestamp || chat.updated_at,
          unread_count: unreadCount,
        };
      }
    },

    setConnectionState: (state, action: PayloadAction<{
      isConnected: boolean;
      isConnecting: boolean;
      error?: string | null;
    }>) => {
      state.isConnected = action.payload.isConnected;
      state.isConnecting = action.payload.isConnecting;
      state.connectionError = action.payload.error || null;
    },

    setWebSocketConnection: (state, action: PayloadAction<{
      ws: WebSocket | null;
      isConnected: boolean;
      isConnecting?: boolean;
    }>) => {
      state.ws = action.payload.ws;
      state.isConnected = action.payload.isConnected;
      state.isConnecting = action.payload.isConnecting || false;
      if (action.payload.isConnected) {
        state.connectionError = null;
      }
    },

    setSelectedChat: (state, action: PayloadAction<string | null>) => {
      const chatId = action.payload;

      // Mark chat as read
      if (chatId && state.chats[chatId]) {
        const chat = state.chats[chatId];
        if (chat.unread_count > 0) {
          state.chats[chatId] = { ...chat, unread_count: 0 };
        }

        const chatMessages = state.messages[chatId] || [];
        state.messages[chatId] = chatMessages.map(msg =>
          !msg.is_read && msg.sender_type === "client"
            ? { ...msg, is_read: true }
            : msg
        );
      }

      state.selectedChatId = chatId;
    },

    setActiveFilter: (state, action: PayloadAction<ChatFilter>) => {
      state.activeFilter = action.payload;
      state.selectedChatId = null;

      if (action.payload == 'ai') {
        state.assignmentFilter= [];
      }
      else if (action.payload === 'human') {
        state.assignmentFilter = ["unassigned", "my_chats", "others"];
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    toggleAside: (state) => {
      state.isAsideOpen = !state.isAsideOpen;
    },

    // addChat: (state, action: PayloadAction<any>) => {
    //   const chat = action.payload;

    //   state.chats[chat.id] = {
    //     ...chat,
    //     last_message: chat.last_message || "",
    //     last_message_time: chat.last_message_at || chat.updated_at || chat.created_at,
    //     updated_at: chat.last_message_at || chat.updated_at || chat.created_at,
    //     created_at: chat.created_at || new Date().toISOString(),
    //   };

    //   if (!state.messages[chat.id]) {
    //     state.messages[chat.id] = [];
    //   }
    // },
addChat: (state, action: PayloadAction<Chat>) => {
  const chat = action.payload;

  state.chats[chat.id] = {
    ...chat,
    is_human: chat.is_human,
    last_message_time: chat.last_message_at || chat.updated_at || chat.created_at,
  };

  if (!state.messages[chat.id]) {
    state.messages[chat.id] = [];
  }
},


    updateChat: (state, action: PayloadAction<{ chatId: string; updates: Partial<Chat> }>) => {
      const { chatId, updates } = action.payload;

      if (!state.chats[chatId]) return;

      const current = state.chats[chatId];

      const normalized: Partial<Chat> = {
        ...updates,
        last_message_time: updates.last_message_at || updates.updated_at || current.last_message_time,
        updated_at: updates.updated_at || updates.last_message_at || current.updated_at,
      };

      state.chats[chatId] = { ...current, ...normalized };
    },

    markChatAsRead: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;

      if (state.chats[chatId] && state.chats[chatId].unread_count > 0) {
        state.chats[chatId] = { ...state.chats[chatId], unread_count: 0 };
      }

      const chatMessages = state.messages[chatId] || [];
      state.messages[chatId] = chatMessages.map(msg =>
        !msg.is_read && msg.sender_type === "client"
          ? { ...msg, is_read: true }
          : msg
      );
    },

    transferChatToHuman: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
        state.chats[chatId] = { ...state.chats[chatId], is_human: true };
    },

    transferChatToAI: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
        state.chats[chatId] = { ...state.chats[chatId], is_human: false };
    },

    connectWebSocket: (state, action: PayloadAction<string>) => {},

    disconnectWebSocket: (state) => {
      if (state.ws) {
        state.ws.close();
      }
      state.ws = null;
      state.isConnected = false;
    },

    sendMessage: (state, action: PayloadAction<{ chatId: string; content: string }>) => {},

    // WebSocket event handlers
    handleWebSocketMessage: (state, action: PayloadAction<WebSocketMessage>) => {},
  },
});

export const {
  setCurrentUserId,
  toggleAssignmentFilter,
  assignChatToUser,
  transferChatToAI,
  setSelectedChat,
  setActiveFilter,
  setSearchQuery,
  toggleAside,
  setWebSocketConnection,
  addChat,
  updateChat,
  addMessage,
  markChatAsRead,
  transferChatToHuman,
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  handleWebSocketMessage,
  setConnectionState,
  addMessagesBatch,
  chatAssignUpdate,
  chatToHuman,
  chatToAi
} = chatSlice.actions;

// Basic selectors
export const selectIsConnecting = (state: { chat: ChatState }) => state.chat.isConnecting;
export const selectConnectionError = (state: { chat: ChatState }) => state.chat.connectionError;
export const selectChats = (state: { chat: ChatState }) => state.chat.chats;
export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectSelectedChatId = (state: { chat: ChatState }) => state.chat.selectedChatId;
export const selectActiveFilter = (state: { chat: ChatState }) => state.chat.activeFilter;
export const selectAssignmentFilter = (state: { chat: ChatState }) => state.chat.assignmentFilter;
export const selectCurrentUserId = (state: { chat: ChatState }) => state.chat.currentUserId;
export const selectSearchQuery = (state: { chat: ChatState }) => state.chat.searchQuery;
export const selectIsConnected = (state: { chat: ChatState }) => state.chat.isConnected;
export const selectIsAsideOpen = (state: { chat: ChatState }) => state.chat.isAsideOpen;
export const selectWebSocket = (state: { chat: ChatState }) => state.chat.ws;

// Fixed filtered chats selector
export const selectFilteredChats = createSelector(
  [selectChats, selectActiveFilter, selectAssignmentFilter, selectCurrentUserId, selectSearchQuery],
  (chats, activeFilter, assignmentFilter, currentUserId, searchQuery) => {
    console.log('Selector running with:', { 
      chatCount: Object.keys(chats).length, 
      activeFilter, 
      assignmentFilter, 
      currentUserId 
    });
    
    let filtered = Object.values(chats);
 
    // Apply human/ai filter
    filtered = filtered.filter((chat) =>
      activeFilter === "ai" ? !chat.is_human : chat.is_human
    );
    
    if (activeFilter !== "ai") {
      filtered = filtered.filter((chat) => {
        const isUnassigned = chat.assigned_to === null;
        const isMine = chat.assigned_to === currentUserId;
        const isOthers = chat.assigned_to !== null && chat.assigned_to !== currentUserId;

        const shouldInclude = (
          (assignmentFilter.includes("unassigned") && isUnassigned) ||
          (assignmentFilter.includes("my_chats") && isMine) ||
          (assignmentFilter.includes("others") && isOthers)
        );
        
        console.log(`Chat ${chat.id}: assigned_to=${chat.assigned_to}, shouldInclude=${shouldInclude}`);
        
        return shouldInclude;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (chat) =>
          chat.customer_name.toLowerCase().includes(query) ||
          chat.page_name.toLowerCase().includes(query)
      );
    }

    // Sort by time
    filtered.sort((a, b) => {
      const timeA = new Date(a.last_message_time || a.updated_at);
      const timeB = new Date(b.last_message_time || b.updated_at);
      return timeB.getTime() - timeA.getTime();
    });

    console.log('Filtered chats result:', filtered.length);
    return filtered;
  }
);


export const selectSelectedChat = createSelector(
  [selectChats, selectSelectedChatId],
  (chats, selectedChatId) => {
    return selectedChatId ? chats[selectedChatId] || null : null;
  }
);

export const selectSelectedChatMessages = createSelector(
  [selectMessages, selectSelectedChatId],
  (messages, selectedChatId) => {
    return selectedChatId ? messages[selectedChatId] || [] : [];
  }
);

export const selectHumanChatCount = createSelector(
  [selectChats],
  (chats) => Object.values(chats).filter((c) => c.is_human).length
);

export const selectAIChatCount = createSelector(
  [selectChats],
  (chats) => Object.values(chats).filter((c) => !c.is_human).length
);

// Assignment filter counts
export const selectUnassignedChatCount = createSelector(
  [selectChats, selectActiveFilter],
  (chats, activeFilter) => {
    const chatList = Object.values(chats);
    const filteredByType = activeFilter === "ai" 
      ? chatList.filter(c => !c.is_human) 
      : chatList.filter(c => c.is_human);
    return filteredByType.filter(c => c.assigned_to === null).length;
  }
);

export const selectMyChatCount = createSelector(
  [selectChats, selectActiveFilter, selectCurrentUserId],
  (chats, activeFilter, currentUserId) => {
    if (!currentUserId) return 0;
    const chatList = Object.values(chats);
    const filteredByType = activeFilter === "ai" 
      ? chatList.filter(c => !c.is_human) 
      : chatList.filter(c => c.is_human);
    return filteredByType.filter(c => c.assigned_to === currentUserId).length;
  }
);

export const selectOthersChatCount = createSelector(
  [selectChats, selectActiveFilter, selectCurrentUserId],
  (chats, activeFilter, currentUserId) => {
    if (!currentUserId) return 0;
    const chatList = Object.values(chats);
    const filteredByType = activeFilter === "ai" 
      ? chatList.filter(c => !c.is_human) 
      : chatList.filter(c => c.is_human);
    return filteredByType.filter(c => c.assigned_to !== null && c.assigned_to !== currentUserId).length;
  }
);

export const selectTotalUnreadCount = createSelector(
  [selectChats],
  (chats) => Object.values(chats).reduce((total, chat) => total + chat.unread_count, 0)
);

export default chatSlice.reducer;