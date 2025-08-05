import { Middleware } from "@reduxjs/toolkit";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  setWebSocketConnection,
  addChat,
  addMessage,
  WebSocketMessage,
  Message,
  setSelectedChat,
  transferChatToHuman,
  transferChatToAI,
  addMessagesBatch,
  assignChatToUser,
  chatAssignUpdate,
  chatToHuman,
  chatToAi,
} from "../slices/chatSlice";

const websocketMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (connectWebSocket.match(action)) {
    const url = action.payload;
    const state = store.getState();

    // Don't connect if already connecting
    if (state.chat.isConnecting) {
      return result;
    }

    // Close existing connection if any
    if (state.chat.ws) {
      state.chat.ws.close();
    }

    try {
      console.log("Attempting WebSocket connection to:", url);

      // Set connecting state
      store.dispatch(
        setWebSocketConnection({
          ws: null,
          isConnected: false,
          isConnecting: true,
        })
      );

      const ws = new WebSocket(url);

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        console.error("WebSocket connection timeout");
        ws.close();
        store.dispatch(
          setWebSocketConnection({
            ws: null,
            isConnected: false,
            isConnecting: false,
          })
        );
      }, 10000); // 10 second timeout

      ws.onopen = () => {
        console.log("WebSocket connection established");
        clearTimeout(connectionTimeout);
        store.dispatch(
          setWebSocketConnection({
            ws,
            isConnected: true,
            isConnecting: false,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);

          if (Array.isArray(raw)) {
            raw.forEach((chat) => store.dispatch(addChat(chat)));
            return;
          }

          const message: WebSocketMessage = raw;
          switch (message.type) {
            case "chat_open":
              if (Array.isArray(message.messages)) {
                store.dispatch(
                  addMessagesBatch({
                    chatId: message.chat_id,
                    messages: message.messages.map((msg) => ({
                      ...msg,
                      chat_id: message.chat_id,
                    })),
                  })
                );
              } else {
                console.warn("Expected messages to be an array in chat_open");
              }
              break;


            case "new_message": {
              const newMsg = message as Message; // type-safe cast
              store.dispatch(addMessage(newMsg));
              break;
            }

            case "to_ai": {
              const assignedMessage = message as typeof message & {
                chat_id: string; 
              };

              const { chat_id } = assignedMessage;

              store.dispatch(chatToAi({
                chatId: chat_id, 
              }));

              break;
            }

          case "add_chat": {
              const addChatMessage = message as typeof message & {
                id: string;
                page_name: string;
                page_type: string;
                customer_name: string;
                is_human: boolean;
                assigned_to: number | null;
                assigned_to_ln?: string | null;
                assigned_to_fn?: string | null;
                unread_count: number;
                last_message_at?: string;
              };

              const {
                id,
                page_name,
                page_type,
                customer_name,
                is_human,
                assigned_to,
                assigned_to_fn,
                assigned_to_ln,
                unread_count,
                last_message_at,
              } = addChatMessage;

              store.dispatch(
                addChat({
                  id,
                  page_name,
                  page_type,
                  customer_name,
                  is_human,
                  assigned_to,
                  assigned_to_fn,
                  assigned_to_ln,
                  unread_count,
                  last_message_at,
                })
              );

              break;
            }


            case "to_human": {
              const assignedMessage = message as typeof message & {
                chat_id: string; 
                assigned_to: number | null;
                assigned_to_fn?: string | null;
                assigned_to_ln?: string | null;
              };

              const { chat_id, assigned_to, assigned_to_fn, assigned_to_ln } = assignedMessage;

              store.dispatch(chatToHuman({
                chatId: chat_id,  
                assignedTo: assigned_to,
                assignedToFirstName: assigned_to_fn,
                assignedToLastName: assigned_to_ln
              }));

              break;
            }

            case "assign_to": {

              const assignedMessage = message as typeof message & {
                id: string;
                assigned_to: number | null;
                assigned_to_fn?: string | null;
                assigned_to_ln?: string | null;
              };

              const { id, assigned_to, assigned_to_fn, assigned_to_ln } = assignedMessage;

              store.dispatch(chatAssignUpdate({
                chatId: id,
                assignedTo: assigned_to,
                assignedToFirstName: assigned_to_fn,
                assignedToLastName: assigned_to_ln
              }));
              break;
            }

            default:
              console.warn("Unknown WebSocket message type:", message.type);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };


      ws.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        clearTimeout(connectionTimeout);
        store.dispatch(
          setWebSocketConnection({ ws: null, isConnected: false })
        );

        // Attempt to reconnect after 3 seconds if it wasn't a manual close
        if (event.code !== 1000 && event.code !== 1001) {
          console.log("Attempting to reconnect in 3 seconds...");
          setTimeout(() => {
            store.dispatch(connectWebSocket(url));
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        clearTimeout(connectionTimeout);
        store.dispatch(
          setWebSocketConnection({ ws: null, isConnected: false })
        );
      };
    } catch (err) {
      console.error("WebSocket connection failed:", err);
      store.dispatch(setWebSocketConnection({ ws: null, isConnected: false }));
    }
  }

  const getChatPageType = (state, chatId) => {
    return state.chat.chats[chatId]?.page_type || null;
  };

  if (disconnectWebSocket.match(action)) {
    const state = store.getState();
    if (state.chat.ws) {
      state.chat.ws.close(1000, "User disconnected"); // Normal closure
    }
  }

  if (sendMessage.match(action)) {
    const { chatId, content } = action.payload;
    const state = store.getState();
    const { ws, isConnected } = state.chat;
    const pageType = getChatPageType(state, chatId);

    if (ws && isConnected && ws.readyState === WebSocket.OPEN) {
      const message = {
        chat_id: chatId,
        content,
        page_type: pageType
      };

      try {
        ws.send(JSON.stringify({
          type: "send_message",
          chat_id: message.chat_id,
          content: message.content,
          page_type: pageType
        }));
      } catch (sendError) {
        console.error("Error sending WebSocket message:", sendError);
      }
    } else {
      console.warn("WebSocket not connected, message not sent");
    }
  }


  if (setSelectedChat.match(action)) {
    const chatId = action.payload;
    const state = store.getState();
    const { ws, isConnected } = state.chat;
    const pageType = getChatPageType(state, chatId);

    if (chatId && ws && isConnected && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: "chat_open", chat_id: chatId, page_type: pageType }));
        console.log("Sent 'chat open' for chat:", chatId);
      } catch (err) {
        console.error("Failed to send 'chat_open':", err);
      }
    }
  }


  if (transferChatToHuman.match(action)) {
    const chatId = action.payload;
    const state = store.getState();
    const { ws, isConnected } = state.chat;
    const pageType = getChatPageType(state, chatId);

    if (chatId && ws && isConnected && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: "to_human", chat_id: chatId, page_type: pageType }));
        console.log("Sent 'mark_read' for chat:", chatId);
      } catch (err) {
        console.error("Failed to send 'mark_read':", err);
      }
    }
  }


  if (transferChatToAI.match(action)) {
    const chatId = action.payload;
    const state = store.getState();
    const { ws, isConnected } = state.chat;
    const pageType = getChatPageType(state, chatId);

    if (chatId && ws && isConnected && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: "to_ai", chat_id: chatId, page_type: pageType }));
        console.log("Sent 'mark_read' for chat:", chatId);
      } catch (err) {
        console.error("Failed to send 'mark_read':", err);
      }
    }
  }

  if (assignChatToUser.match(action)) {
    const { chatId, userId } = action.payload;
    const state = store.getState();
    const { ws, isConnected } = state.chat;
    const pageType = getChatPageType(state, chatId);

    if (chatId && ws && isConnected && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: "assign_to",
          chat_id: chatId,
          user_id: userId,
          page_type: pageType
        }));
        console.log("Sent 'assign_to' for chat:", chatId, "to user:", userId);
      } catch (err) {
        console.error("Failed to send 'assign_to':", err);
      }
    }
  }

  return result;
};

export default websocketMiddleware;
