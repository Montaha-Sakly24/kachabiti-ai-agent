"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Loader2, MapPin, User, Package, Ruler } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { timeAgo } from "@/lib/time";
import type { Order } from "@/lib/types";

const POLL_INTERVAL_MS = 15000;

const CHANNEL_ICON: Record<string, typeof MessageCircle> = {
  messenger: MessageCircle,
  whatsapp: Phone,
};

const CHANNEL_LABEL: Record<string, string> = {
  messenger: "Messenger",
  whatsapp: "WhatsApp",
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [handlingId, setHandlingId] = useState<number | null>(null);

  async function load() {
    try {
      const data = await ordersApi.list();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  async function handleMarkHandled(id: number) {
    setHandlingId(id);
    try {
      await ordersApi.markHandled(id);
      setOrders((prev) => prev?.filter((o) => o.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de marquer comme traitée.");
    } finally {
      setHandlingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-coffee-soft">
          {orders ? `${orders.length} commande${orders.length > 1 ? "s" : ""}` : "Chargement…"}
        </p>
      </div>

      {error && (
        <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5 mb-4">
          {error}
        </p>
      )}

      {!orders && !error && (
        <div className="flex items-center gap-2 text-coffee-soft text-sm py-10 justify-center">
          <Loader2 size={16} className="animate-spin" />
          Chargement…
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="text-center py-16 border border-dashed border-woven-line rounded-lg text-coffee-soft text-sm">
          Aucune commande pour l&apos;instant.
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => {
            const Icon = CHANNEL_ICON[o.channel] ?? MessageCircle;
            return (
              <div
                key={o.id}
                className="border border-woven-line rounded-lg bg-sand px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 text-xs text-coffee-soft">
                    <Icon size={13} />
                    <span>{CHANNEL_LABEL[o.channel] ?? o.channel}</span>
                    <span>·</span>
                    <span>{timeAgo(o.created_at)}</span>
                  </div>

                  <button
                    onClick={() => handleMarkHandled(o.id)}
                    disabled={handlingId === o.id}
                    className="shrink-0 text-sm bg-olive text-sand rounded-full px-4 py-1.5 disabled:opacity-50"
                  >
                    {handlingId === o.id ? "…" : "Marquer traitée"}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-coffee">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-coffee-soft shrink-0" />
                    <span className="font-medium">{o.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-coffee-soft shrink-0" />
                    <span dir="ltr">{o.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin size={14} className="text-coffee-soft shrink-0" />
                    <span dir="auto">{o.address}</span>
                  </div>
                  {o.product_hint && (
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-coffee-soft shrink-0" />
                      <span dir="auto">
                        {o.product_hint}
                        {o.quantity ? ` · x${o.quantity}` : ""}
                      </span>
                    </div>
                  )}
                  {(o.height || o.weight) && (
                    <div className="flex items-center gap-2">
                      <Ruler size={14} className="text-coffee-soft shrink-0" />
                      <span>
                        {[o.height && `${o.height}`, o.weight && `${o.weight}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
