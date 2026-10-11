import type { PendingConversation, PendingQuestion } from "./types";
import { parseDate } from "./time";

export function groupConversations(questions: PendingQuestion[]): PendingConversation[] {
  const map = new Map<string, PendingConversation>();

  for (const q of questions) {
    const key = `${q.channel}:${q.sender_id}`;
    const entry = { id: q.id, message: q.message, created_at: q.created_at };
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        key,
        channel: q.channel,
        sender_id: q.sender_id,
        sender_name: q.sender_name || q.sender_id,
        messages: [entry],
        latest_at: q.created_at,
      });
      continue;
    }

    existing.messages.push(entry);
    if (parseDate(q.created_at) > parseDate(existing.latest_at)) {
      existing.latest_at = q.created_at;
      existing.sender_name = q.sender_name || q.sender_id;
    }
  }

  const groups = Array.from(map.values());

  // Messages du plus ancien au plus récent (ordre naturel d'une conversation)
  for (const group of groups) {
    group.messages.sort(
      (a, b) => parseDate(a.created_at).getTime() - parseDate(b.created_at).getTime()
    );
  }

  // Conversations les plus récemment actives en premier
  return groups.sort(
    (a, b) => parseDate(b.latest_at).getTime() - parseDate(a.latest_at).getTime()
  );
}
