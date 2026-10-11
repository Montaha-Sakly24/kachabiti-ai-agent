"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Phone, Loader2, X } from "lucide-react";
import { inboxApi } from "@/lib/api";
import { groupConversations } from "@/lib/inbox";
import { timeAgo } from "@/lib/time";
import type { PendingQuestion } from "@/lib/types";
import ReplyModal from "@/components/inbox/ReplyModal";

const POLL_INTERVAL_MS = 10000;

const CHANNEL_ICON: Record<string, typeof MessageCircle> = {
  messenger: MessageCircle,
  whatsapp: Phone,
};

const CHANNEL_LABEL: Record<string, string> = {
  messenger: "Messenger",
  whatsapp: "WhatsApp",
};

export default function InboxList() {
  const [questions, setQuestions] = useState<PendingQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [confirmDismissKey, setConfirmDismissKey] = useState<string | null>(null);
  const [dismissing, setDismissing] = useState<string | null>(null);
  const previousCount = useRef<number | null>(null);

  async function handleDismiss(channel: string, senderId: string, key: string) {
    setDismissing(key);
    try {
      await inboxApi.dismissSender(channel, senderId);
      setQuestions((prev) => prev?.filter((q) => !(q.channel === channel && q.sender_id === senderId)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ignorer cette notification.");
    } finally {
      setDismissing(null);
      setConfirmDismissKey(null);
    }
  }

  const conversations = useMemo(
    () => (questions ? groupConversations(questions) : null),
    [questions]
  );
  const selected = conversations?.find((c) => c.key === selectedKey) ?? null;

  async function load() {
    try {
      const data = await inboxApi.list();

      if (previousCount.current !== null && data.length > previousCount.current) {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          const newest = data[0];
          new Notification(`Nouveau message — ${newest?.sender_name || newest?.sender_id || "client"}`, {
            body: newest?.message ?? "Un client attend une réponse.",
          });
        }
      }
      previousCount.current = data.length;

      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-coffee-soft">
          {conversations
            ? `${conversations.length} client${conversations.length > 1 ? "s" : ""} en attente`
            : "Chargement…"}
        </p>
      </div>

      {error && (
        <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      {!conversations && !error && (
        <div className="flex items-center gap-2 text-coffee-soft text-sm py-10 justify-center">
          <Loader2 size={16} className="animate-spin" />
          Chargement…
        </div>
      )}

      {conversations && conversations.length === 0 && (
        <div className="text-center py-16 border border-dashed border-woven-line rounded-lg text-coffee-soft text-sm">
          Aucune question en attente — le bot gère tout tout seul pour l&apos;instant 🎉
        </div>
      )}

      {conversations && conversations.length > 0 && (
        <div className="border border-woven-line rounded-lg overflow-hidden bg-sand">
          {conversations.map((c, i) => {
            const Icon = CHANNEL_ICON[c.channel] ?? MessageCircle;
            return (
              <div
                key={c.key}
                className={`px-5 py-4 flex items-start justify-between gap-4 ${
                  i !== conversations.length - 1 ? "border-b border-woven-line" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-coffee-soft mb-2">
                    <Icon size={13} />
                    <span>{CHANNEL_LABEL[c.channel] ?? c.channel}</span>
                    <span>·</span>
                    <span className="text-coffee font-medium">{c.sender_name}</span>
                    {c.messages.length > 1 && (
                      <span className="bg-woven text-coffee-soft rounded-full px-1.5 py-0.5 text-[11px]">
                        {c.messages.length} messages
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5">
                    {c.messages.map((m) => (
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

                <div className="shrink-0 flex items-center gap-2">
                  {confirmDismissKey === c.key ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-coffee-soft whitespace-nowrap">Ignorer ?</span>
                      <button
                        onClick={() => handleDismiss(c.channel, c.sender_id, c.key)}
                        disabled={dismissing === c.key}
                        className="text-brick font-medium"
                      >
                        {dismissing === c.key ? "…" : "Oui"}
                      </button>
                      <button
                        onClick={() => setConfirmDismissKey(null)}
                        className="text-coffee-soft"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirmDismissKey(c.key)}
                        title="Ignorer sans répondre"
                        className="p-2 text-coffee-soft hover:text-brick transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedKey(c.key)}
                        className="text-sm bg-terracotta text-sand rounded-full px-4 py-2"
                      >
                        Répondre
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <ReplyModal
          conversation={selected}
          onClose={() => setSelectedKey(null)}
          onSubmit={async (reply) => {
            await inboxApi.replyToSender(selected.channel, selected.sender_id, reply);
            setQuestions((prev) =>
              prev?.filter((q) => !(q.channel === selected.channel && q.sender_id === selected.sender_id)) ?? null
            );
            setSelectedKey(null);
          }}
        />
      )}
    </div>
  );
}
