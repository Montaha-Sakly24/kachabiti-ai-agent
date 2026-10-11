"use client";

import Modal from "@/components/ui/Modal";
import FaqForm from "@/components/faq/FaqForm";
import type { FaqInput } from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  initial?: FaqInput;
  onSubmit: (input: FaqInput) => Promise<void>;
  onClose: () => void;
};

export default function FaqFormModal({ mode, initial, onSubmit, onClose }: Props) {
  return (
    <Modal title={mode === "create" ? "Ajouter une FAQ" : "Modifier la FAQ"} onClose={onClose}>
      <FaqForm
        initial={initial}
        submitLabel={mode === "create" ? "Ajouter" : "Enregistrer"}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
