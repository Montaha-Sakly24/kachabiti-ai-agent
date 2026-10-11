"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import FaqTable from "@/components/faq/FaqTable";
import FaqFormModal from "@/components/faq/FaqFormModal";
import FaqViewModal from "@/components/faq/FaqViewModal";
import DeleteConfirmModal from "@/components/faq/DeleteConfirmModal";
import { faqApi } from "@/lib/api";
import type { Faq } from "@/lib/types";

type ModalState =
  | { type: "create" }
  | { type: "edit"; faq: Faq }
  | { type: "view"; id: string }
  | { type: "delete"; faq: Faq }
  | null;

export default function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  function loadFaqs() {
    return faqApi
      .list()
      .then(setFaqs)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement."));
  }

  useEffect(() => {
    loadFaqs();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-coffee-soft">
          {faqs ? `${faqs.length} question${faqs.length > 1 ? "s" : ""}` : "Chargement…"}
        </p>
        <button
          onClick={() => setModal({ type: "create" })}
          className="inline-flex items-center gap-2 bg-terracotta text-sand text-sm rounded-full px-4 py-2"
        >
          <Plus size={15} />
          Ajouter une FAQ
        </button>
      </div>

      {error && (
        <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      {!faqs && !error && (
        <div className="flex items-center gap-2 text-coffee-soft text-sm py-10 justify-center">
          <Loader2 size={16} className="animate-spin" />
          Chargement des FAQ…
        </div>
      )}

      {faqs && faqs.length === 0 && (
        <div className="text-center py-16 border border-dashed border-woven-line rounded-lg text-coffee-soft text-sm">
          Aucune FAQ pour l&apos;instant. Ajoute la première pour nourrir le chatbot.
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <FaqTable
          faqs={faqs}
          onView={(id) => setModal({ type: "view", id })}
          onEdit={(faq) => setModal({ type: "edit", faq })}
          onDelete={(faq) => setModal({ type: "delete", faq })}
        />
      )}

      {modal?.type === "create" && (
        <FaqFormModal
          mode="create"
          onClose={() => setModal(null)}
          onSubmit={async (input) => {
            const created = await faqApi.create(input);
            setFaqs((prev) => (prev ? [created, ...prev] : [created]));
            setModal(null);
          }}
        />
      )}

      {modal?.type === "edit" && (
        <FaqFormModal
          mode="edit"
          initial={{ question: modal.faq.question, answer: modal.faq.answer }}
          onClose={() => setModal(null)}
          onSubmit={async (input) => {
            const updated = await faqApi.update(modal.faq.id, input);
            setFaqs((prev) => prev?.map((f) => (f.id === updated.id ? updated : f)) ?? null);
            setModal(null);
          }}
        />
      )}

      {modal?.type === "view" && (
        <FaqViewModal faqId={modal.id} onClose={() => setModal(null)} />
      )}

      {modal?.type === "delete" && (
        <DeleteConfirmModal
          question={modal.faq.question}
          onClose={() => setModal(null)}
          onConfirm={async () => {
            await faqApi.remove(modal.faq.id);
            setFaqs((prev) => prev?.filter((f) => f.id !== modal.faq.id) ?? null);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
