"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Faq } from "@/lib/types";

const PAGE_SIZE = 8;

type Props = {
  faqs: Faq[];
  onView: (id: string) => void;
  onEdit: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
};

export default function FaqTable({ faqs, onView, onEdit, onDelete }: Props) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(faqs.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount, page]);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = faqs.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="border border-woven-line rounded-lg overflow-hidden bg-sand">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand-deep border-b border-woven-line text-left text-coffee-soft text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-medium w-[38%]">Question</th>
              <th className="px-5 py-3 font-medium">Réponse</th>
              <th className="px-5 py-3 font-medium w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((faq, i) => (
              <tr
                key={faq.id}
                className={i !== pageItems.length - 1 ? "border-b border-woven-line" : ""}
              >
                <td className="px-5 py-3.5 align-top text-coffee" dir="auto">
                  <span className="line-clamp-2">{faq.question}</span>
                </td>
                <td className="px-5 py-3.5 align-top text-coffee-soft" dir="auto">
                  <span className="line-clamp-2">{faq.answer}</span>
                </td>
                <td className="px-5 py-3.5 align-top">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(faq.id)}
                      className="p-1.5 text-coffee-soft hover:text-coffee transition-colors"
                      aria-label="Consulter"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(faq)}
                      className="p-1.5 text-coffee-soft hover:text-terracotta transition-colors"
                      aria-label="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(faq)}
                      className="p-1.5 text-coffee-soft hover:text-brick transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-woven-line text-coffee-soft disabled:opacity-30 hover:bg-woven transition-colors"
            aria-label="Page précédente"
          >
            <ChevronLeft size={15} />
          </button>

          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm border transition-colors ${
                n === page
                  ? "bg-terracotta text-sand border-terracotta"
                  : "border-woven-line text-coffee-soft hover:bg-woven"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-woven-line text-coffee-soft disabled:opacity-30 hover:bg-woven transition-colors"
            aria-label="Page suivante"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
