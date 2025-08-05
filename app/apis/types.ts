export type SenderType = "ai" | "customer" | "agent";

export interface Chat {
  id: string;
  page_name: string;
  page_type: string;
  customer_name: string;
  is_human: boolean;
  assigned_to: number | null;
  unread_count: number;
  last_message: string;
  last_message_time: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  sender_type: SenderType;
  timestamp: string;
  is_read: boolean;
}
