"use client";

import { useState, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { FaqInput } from "@/lib/types";

type Props = {
  initial?: FaqInput;
  onSubmit: (input: FaqInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
};

export default function FaqForm({ initial, onSubmit, onCancel, submitLabel }: Props) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await onSubmit({ question: question.trim(), answer: answer.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer cette FAQ.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="question" className="block text-sm text-coffee mb-1.5">
          Question
        </label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          dir="auto"
          autoFocus
          placeholder="كيفاش نطلب منتوج؟"
          className="w-full bg-sand-deep border border-woven-line rounded-md px-3.5 py-2.5 text-sm text-coffee placeholder:text-coffee-soft/60 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
      </div>

      <div>
        <label htmlFor="answer" className="block text-sm text-coffee mb-1.5">
          Réponse
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          dir="auto"
          rows={5}
          placeholder="تنجم تطلب المنتوج عن طريق..."
          className="w-full bg-sand-deep border border-woven-line rounded-md px-3.5 py-2.5 text-sm text-coffee placeholder:text-coffee-soft/60 focus:outline-none focus:ring-2 focus:ring-terracotta/40 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving || !question.trim() || !answer.trim()}
          className="inline-flex items-center gap-2 bg-terracotta text-sand text-sm rounded-full px-5 py-2.5 disabled:opacity-40 transition-opacity"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-coffee-soft hover:text-coffee px-4 py-2.5"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
