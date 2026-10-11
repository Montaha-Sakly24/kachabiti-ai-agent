export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type FaqInput = {
  question: string;
  answer: string;
};

export type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

export type Channel = "messenger" | "whatsapp";

export type PendingQuestion = {
  id: number;
  channel: Channel;
  sender_id: string;
  sender_name?: string | null;
  message: string;
  created_at: string;
};

export type PendingConversation = {
  key: string;
  channel: Channel;
  sender_id: string;
  sender_name: string;
  messages: { id: number; message: string; created_at: string }[];
  latest_at: string;
};

export type Order = {
  id: number;
  channel: Channel;
  sender_id: string;
  sender_name?: string | null;
  customer_name: string;
  phone: string;
  address: string;
  height?: string | null;
  weight?: string | null;
  product_hint?: string | null;
  quantity?: string | null;
  created_at: string;
};
