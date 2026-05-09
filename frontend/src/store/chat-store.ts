"use client";

import { create } from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
};

type ChatState = {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  createConversation: () => string;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateLastAssistantMessage: (conversationId: string, nextContent: string) => void;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const firstConversationId = uid();

export const useChatStore = create<ChatState>((set) => ({
  conversations: [
    {
      id: firstConversationId,
      title: "New conversation",
      messages: [],
      updatedAt: new Date().toISOString()
    }
  ],
  activeConversationId: firstConversationId,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  createConversation: () => {
    const id = uid();
    set((state) => ({
      conversations: [
        {
          id,
          title: "New conversation",
          messages: [],
          updatedAt: new Date().toISOString()
        },
        ...state.conversations
      ],
      activeConversationId: id
    }));
    return id;
  },
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const nextMessages = [...c.messages, message];
        const firstUser = nextMessages.find((m) => m.role === "user");
        return {
          ...c,
          title: firstUser ? firstUser.content.slice(0, 40) : c.title,
          messages: nextMessages,
          updatedAt: new Date().toISOString()
        };
      })
    })),
  updateLastAssistantMessage: (conversationId, nextContent) =>
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const next = [...c.messages];
        for (let i = next.length - 1; i >= 0; i -= 1) {
          if (next[i].role === "assistant") {
            next[i] = { ...next[i], content: nextContent };
            break;
          }
        }
        return { ...c, messages: next, updatedAt: new Date().toISOString() };
      })
    }))
}));
