import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  chatAssignUpdate,
  setSelectedChat,
  setActiveFilter,
  setCurrentUserId,
  setSearchQuery,
  toggleAside,
  addChat,
  updateChat,
  addMessage,
  markChatAsRead,
  transferChatToHuman,
  transferChatToAI,
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  selectFilteredChats,
  selectSelectedChat,
  selectSelectedChatMessages,
  selectHumanChatCount,
  selectAIChatCount,
  selectUnassignedChatCount,
  selectMyChatCount,
  selectOthersChatCount,
  selectTotalUnreadCount,
  selectIsConnected,
  selectIsAsideOpen,
  selectActiveFilter,
  selectAssignmentFilter,
  selectCurrentUserId,
  selectSearchQuery,
  ChatFilter,
  AssignmentFilter,
  Chat,
  Message,
  assignChatToUser,
  toggleAssignmentFilter,
  chatToAi,
  chatToHuman,
} from "../store/slices/chatSlice";

export const useChatActions = () => {
  const dispatch = useAppDispatch();

  return {
   chatToAi: useCallback(
      (chatId: string) => {
        dispatch(chatToAi({ chatId })); 
      },
      [dispatch]
    ),

    chatToHuman: useCallback(
      (
        chatId: string,
        assignedTo: number | null,
        assignedToFirstName?: string | null,
        assignedToLastName?: string | null
      ) => {
        dispatch(chatToHuman({ 
          chatId, 
          assignedTo, 
          assignedToFirstName, 
          assignedToLastName 
        }));
      },
      [dispatch]
    ),

    chatAssignUpdate: useCallback(
      (
        chatId: string,
        assignedTo: number | null,
        assignedToFirstName?: string | null,
        assignedToLastName?: string | null
      ) => {
        dispatch(chatAssignUpdate({ chatId, assignedTo, assignedToFirstName, assignedToLastName }));
      },
      [dispatch]
    ),

    assignChatToUser: useCallback(
      (chatId: string, userId: number) => {
        dispatch(assignChatToUser({ chatId, userId }));
      },
      [dispatch]
    ),

    setSelectedChat: useCallback(
      (chatId: string | null) => {
        dispatch(setSelectedChat(chatId));
      },
      [dispatch]
    ),

    setActiveFilter: useCallback(
      (filter: ChatFilter) => {
        dispatch(setActiveFilter(filter));
      },
      [dispatch]
    ),

toggleAssignmentFilter: useCallback(
  (filter: AssignmentFilter) => {
    dispatch(toggleAssignmentFilter(filter));
  },
  [dispatch]
),

    setCurrentUserId: useCallback(
      (userId: number) => {
        dispatch(setCurrentUserId(userId));
      },
      [dispatch]
    ),

    setSearchQuery: useCallback(
      (query: string) => {
        dispatch(setSearchQuery(query));
      },
      [dispatch]
    ),

    toggleAside: useCallback(() => {
      dispatch(toggleAside());
    }, [dispatch]),

    connectWebSocket: useCallback(
      (url: string) => {
        dispatch(connectWebSocket(url));
      },
      [dispatch]
    ),

    disconnectWebSocket: useCallback(() => {
      dispatch(disconnectWebSocket());
    }, [dispatch]),

    addChat: useCallback(
      (chat: Chat) => {
        dispatch(addChat(chat));
      },
      [dispatch]
    ),

    updateChat: useCallback(
      (chatId: string, updates: Partial<Chat>) => {
        dispatch(updateChat({ chatId, updates }));
      },
      [dispatch]
    ),

    addMessage: useCallback(
      (message: Message) => {
        dispatch(addMessage(message));
      },
      [dispatch]
    ),

    markChatAsRead: useCallback(
      (chatId: string) => {
        dispatch(markChatAsRead(chatId));
      },
      [dispatch]
    ),

    transferChatToHuman: useCallback(
      (chatId: string) => {
        dispatch(transferChatToHuman(chatId));
        dispatch(setActiveFilter("human"));
        dispatch(setSelectedChat(chatId));
      },
      [dispatch]
    ),

    transferChatToAI: useCallback(
      (chatId: string) => {
        dispatch(transferChatToAI(chatId));
        dispatch(setActiveFilter("ai"));
        dispatch(setSelectedChat(chatId));
      },
      [dispatch]
    ),

    sendMessage: useCallback(
      (chatId: string, content: string) => {
        dispatch(sendMessage({ chatId, content }));
      },
      [dispatch]
    ),
  };
};


export const useChatSelectors = () => {
  const filteredChats = useAppSelector(selectFilteredChats);
  const selectedChat = useAppSelector(selectSelectedChat);
  const selectedChatMessages = useAppSelector(selectSelectedChatMessages);
  const humanChatCount = useAppSelector(selectHumanChatCount);
  const aiChatCount = useAppSelector(selectAIChatCount);
  const unassignedChatCount = useAppSelector(selectUnassignedChatCount);
  const myChatCount = useAppSelector(selectMyChatCount);
  const othersChatCount = useAppSelector(selectOthersChatCount);
  const totalUnreadCount = useAppSelector(selectTotalUnreadCount);
  const isConnected = useAppSelector(selectIsConnected);
  const isAsideOpen = useAppSelector(selectIsAsideOpen);
  const activeFilter = useAppSelector(selectActiveFilter);
  const assignmentFilter = useAppSelector(selectAssignmentFilter);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const searchQuery = useAppSelector(selectSearchQuery);

  return {
    filteredChats,
    selectedChat,
    selectedChatMessages,
    humanChatCount,
    aiChatCount,
    unassignedChatCount,
    myChatCount,
    othersChatCount,
    totalUnreadCount,
    isConnected,
    isAsideOpen,
    activeFilter,
    assignmentFilter,
    currentUserId,
    searchQuery,
  };
};