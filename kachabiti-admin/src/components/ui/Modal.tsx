"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
};

export default function Modal({ title, onClose, children, maxWidth = "max-w-lg" }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 backdrop-blur-[2px] px-4">
      <div
        className={`w-full ${maxWidth} bg-sand border border-woven-line rounded-xl shadow-xl max-h-[85vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-woven-line shrink-0">
          <h2 className="font-display text-lg text-coffee">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-coffee-soft hover:text-coffee hover:bg-woven transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
