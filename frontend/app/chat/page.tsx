"use client";
import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Plus, Sparkles } from 'lucide-react';
import { useChatStore } from '../../src/store/chat-store';
import { ThemeToggle } from '../../src/components/theme-toggle';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    createConversation,
    addMessage,
    updateLastAssistantMessage
  } = useChatStore();

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || conversations[0],
    [activeConversationId, conversations]
  );

  async function send() {
    if (!input.trim() || !activeConversation) return;
    const userMsg = {
      id: `${Date.now()}-u`,
      role: 'user' as const,
      content: input,
      createdAt: new Date().toISOString()
    };
    const assistantMsg = {
      id: `${Date.now()}-a`,
      role: 'assistant' as const,
      content: '',
      createdAt: new Date().toISOString()
    };

    addMessage(activeConversation.id, userMsg);
    addMessage(activeConversation.id, assistantMsg);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...activeConversation.messages, userMsg] })
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        updateLastAssistantMessage(activeConversation.id, `Error: ${data?.error || 'Streaming failed'}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          if (!event.startsWith('data:')) continue;
          const payload = event.replace(/^data:\s?/, '');
          if (!payload) continue;

          let token = '';
          try {
            token = JSON.parse(payload);
          } catch {
            token = payload;
          }

          if (token === '[DONE]') continue;
          assembled += token;
          updateLastAssistantMessage(activeConversation.id, assembled);
        }
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch {
      updateLastAssistantMessage(activeConversation.id, 'Error contacting server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-[300px_1fr]">
      <aside className="glass border-r border-white/10 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-semibold">NovaMind AI</h1>
          <ThemeToggle />
        </div>
        <button
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-2 text-sm text-white"
          onClick={() => createConversation()}
          type="button"
        >
          <Plus size={16} /> New Chat
        </button>

        <div className="space-y-2">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConversation(c.id)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                c.id === activeConversation?.id ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
              }`}
              type="button"
            >
              {c.title}
            </button>
          ))}
        </div>
      </aside>

      <section className="relative p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-4 pb-32">
          {activeConversation?.messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
              <div className="mb-2 flex items-center gap-2 text-sky-300">
                <Sparkles size={18} />
                <span className="text-sm">NovaMind Assistant</span>
              </div>
              <h2 className="text-2xl font-semibold">What can I help you build today?</h2>
              <p className="mt-2 text-sm text-slate-300">Ask about coding, career, interview prep, docs, or strategy.</p>
            </motion.div>
          )}

          {activeConversation?.messages.map((m) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 shadow-xl ${m.role === 'user' ? 'ml-auto max-w-[80%] bg-gradient-to-r from-violet-600 to-blue-600 text-white' : 'glass max-w-[85%]'}`}
            >
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{m.content || (loading ? '...' : '')}</ReactMarkdown>
              </div>
            </motion.article>
          ))}
          <div ref={endRef} />
        </div>

        <div className="fixed bottom-5 left-0 right-0 px-4 md:left-[300px] md:px-8">
          <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-white/20 bg-black/50 p-3 backdrop-blur-xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
              placeholder="Ask NovaMind anything..."
            />
            <button onClick={send} disabled={loading} className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-sm text-white disabled:opacity-60">
              {loading ? 'Streaming...' : 'Send'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
