"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { chatApi } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const { response } = await chatApi.send(text);
      setMessages((prev) => [...prev, { role: "bot", content: response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le chatbot n'a pas répondu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] border border-woven-line rounded-lg bg-sand overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-coffee-soft">
            <p className="font-display italic text-xl text-coffee mb-1">
              Essaie le chatbot
            </p>
            <p className="text-sm max-w-sm">
              Pose-lui une question comme le ferait un client — sur les prix, la livraison, ou les modèles disponibles.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-terracotta text-sand rounded-br-sm"
                  : "bg-woven text-coffee rounded-bl-sm"
              }`}
              dir="auto"
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-woven text-coffee-soft rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Le bot réfléchit…
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="bg-brick/10 text-brick border border-brick/30 rounded-2xl px-4 py-2.5 text-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-woven-line bg-sand-deep px-4 py-3 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrire un message…"
          dir="auto"
          className="flex-1 bg-sand border border-woven-line rounded-full px-4 py-2.5 text-sm text-coffee placeholder:text-coffee-soft/70 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="shrink-0 w-10 h-10 rounded-full bg-terracotta text-sand flex items-center justify-center disabled:opacity-40 transition-opacity"
          aria-label="Envoyer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
