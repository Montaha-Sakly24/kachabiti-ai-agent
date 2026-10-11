"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

type Props = {
  question: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export default function DeleteConfirmModal({ question, onConfirm, onClose }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
      setDeleting(false);
    }
  }

  return (
    <Modal title="Supprimer cette FAQ ?" onClose={onClose} maxWidth="max-w-md">
      <p className="text-sm text-coffee-soft mb-1">Tu es sur le point de supprimer :</p>
      <p className="text-sm text-coffee bg-sand-deep border border-woven-line rounded-md px-3.5 py-2.5 mb-5" dir="auto">
        {question}
      </p>
      <p className="text-sm text-coffee-soft mb-5">
        Le chatbot ne pourra plus utiliser cette réponse. Cette action est définitive.
      </p>

      {error && (
        <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleConfirm}
          disabled={deleting}
          className="inline-flex items-center gap-2 bg-brick text-sand text-sm rounded-full px-5 py-2.5 disabled:opacity-40 transition-opacity"
        >
          {deleting && <Loader2 size={14} className="animate-spin" />}
          Oui, supprimer
        </button>
        <button
          onClick={onClose}
          className="text-sm text-coffee-soft hover:text-coffee px-4 py-2.5"
        >
          Annuler
        </button>
      </div>
    </Modal>
  );
}
