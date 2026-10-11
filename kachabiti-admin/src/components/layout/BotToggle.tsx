"use client";

import { useEffect, useRef, useState } from "react";
import { settingsApi } from "@/lib/api";

const POLL_MS = 30000;

export default function BotToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const saving = useRef(false);

  useEffect(() => {
    async function load() {
      if (saving.current) return; // ne pas écraser un changement en cours
      try {
        const data = await settingsApi.getBot();
        setEnabled(data.enabled);
      } catch {
        // on garde la dernière valeur connue
      }
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  async function toggle() {
    if (enabled === null || saving.current) return;

    const next = !enabled;
    saving.current = true;
    setError(null);
    setEnabled(next); // affichage immédiat

    try {
      const data = await settingsApi.setBot(next);
      setEnabled(data.enabled);
    } catch (err) {
      setEnabled(!next); // on annule si le serveur a refusé
      setError(err instanceof Error ? err.message : "Changement impossible.");
    } finally {
      saving.current = false;
    }
  }

  const isOn = enabled === true;
  const isOff = enabled === false;

  return (
    <div
      className={`rounded-lg border px-3.5 py-3 transition-colors ${
        isOff ? "border-brick/40 bg-brick/10" : "border-woven-line bg-sand"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-coffee">Chatbot</p>
          <p className={`text-xs ${isOff ? "text-brick" : "text-olive-deep"}`}>
            {enabled === null ? "…" : isOn ? "Actif" : "Désactivé"}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-label="Activer ou désactiver le chatbot"
          onClick={toggle}
          disabled={enabled === null}
          className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
            isOn ? "bg-olive" : "bg-coffee-soft/40"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-sand shadow transition-transform ${
              isOn ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isOff && (
        <p className="text-[11px] text-brick mt-2 leading-snug">
          Les clients ne reçoivent aucune réponse automatique. Leurs messages arrivent dans la boîte de réception.
        </p>
      )}

      {error && <p className="text-[11px] text-brick mt-2">{error}</p>}
    </div>
  );
}
