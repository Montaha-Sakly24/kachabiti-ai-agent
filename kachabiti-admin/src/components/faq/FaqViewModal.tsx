"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { faqApi } from "@/lib/api";
import type { Faq } from "@/lib/types";

type Props = {
  faqId: string;
  onClose: () => void;
};

export default function FaqViewModal({ faqId, onClose }: Props) {
  const [faq, setFaq] = useState<Faq | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    faqApi
      .get(faqId)
      .then((data) => {
        if (!cancelled) setFaq(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "FAQ introuvable.");
      });
    return () => {
      cancelled = true;
    };
  }, [faqId]);

  return (
    <Modal title="Détail de la FAQ" onClose={onClose}>
      {!faq && !error && (
        <div className="flex items-center gap-2 text-coffee-soft text-sm py-6 justify-center">
          <Loader2 size={16} className="animate-spin" />
          Chargement…
        </div>
      )}

      {error && (
        <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5">
          {error}
        </p>
      )}

      {faq && (
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-coffee-soft mb-1.5">
              Question
            </p>
            <p className="text-sm text-coffee bg-sand-deep border border-woven-line rounded-md px-3.5 py-3" dir="auto">
              {faq.question}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-coffee-soft mb-1.5">
              Réponse
            </p>
            <p className="text-sm text-coffee bg-sand-deep border border-woven-line rounded-md px-3.5 py-3 whitespace-pre-wrap" dir="auto">
              {faq.answer}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
