"use client";

import { useState, FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { timeAgo } from "@/lib/time";
import type { PendingConversation } from "@/lib/types";

type Props = {
  conversation: PendingConversation;
  onClose: () => void;
  onSubmit: (reply: string) => Promise<void>;
};

const CHANNEL_LABEL: Record<string, string> = {
  messenger: "Messenger",
  whatsapp: "WhatsApp",
};

export default function ReplyModal({ conversation, onClose, onSubmit }: Props) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!reply.trim() || sending) return;

    setSending(true);
    setError(null);
    try {
      await onSubmit(reply.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.");
      setSending(false);
    }
  }

  return (
    <Modal title="Répondre au client" onClose={onClose}>
      <div className="mb-4 bg-woven rounded-md px-3.5 py-3">
        <p className="text-xs text-coffee-soft mb-2">
          {CHANNEL_LABEL[conversation.channel] ?? conversation.channel} · {conversation.sender_name}
        </p>
        <ul className="space-y-2">
          {conversation.messages.map((m) => (
            <li key={m.id} className="flex items-start justify-between gap-3">
              <p className="text-sm text-coffee" dir="auto">
                {m.message}
              </p>
              <span className="shrink-0 text-xs text-coffee-soft mt-0.5">
                {timeAgo(m.created_at)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          dir="auto"
          rows={4}
          autoFocus
          placeholder="Écris ta réponse…"
          className="w-full bg-sand border border-woven-line rounded-md px-3.5 py-2.5 text-sm text-coffee placeholder:text-coffee-soft/60 focus:outline-none focus:ring-2 focus:ring-terracotta/40 resize-none"
        />

        {error && (
          <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={sending || !reply.trim()}
            className="inline-flex items-center gap-2 bg-terracotta text-sand text-sm rounded-full px-5 py-2.5 disabled:opacity-40 transition-opacity"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Envoyer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-coffee-soft hover:text-coffee px-4 py-2.5"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
