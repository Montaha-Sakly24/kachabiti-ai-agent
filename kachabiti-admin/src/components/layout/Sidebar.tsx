"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, BookOpen, LogOut, Inbox, Package } from "lucide-react";
import { clearToken } from "@/lib/auth";
import { inboxApi, ordersApi } from "@/lib/api";
import BotToggle from "@/components/layout/BotToggle";

const links = [
  { href: "/playground", label: "Playground", icon: MessageCircle },
  { href: "/faqs", label: "Base de connaissances", icon: BookOpen },
  { href: "/inbox", label: "Boîte de réception", icon: Inbox },
  { href: "/orders", label: "Commandes", icon: Package },
];

const POLL_MS = 15000;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadCounts() {
      try {
        const data = await inboxApi.list();
        setPendingCount(new Set(data.map((q) => `${q.channel}:${q.sender_id}`)).size);
      } catch {
        // silencieux : le badge reste juste à son ancienne valeur
      }

      try {
        const orders = await ordersApi.list();
        setOrderCount(orders.length);
      } catch {
        // idem
      }
    }

    loadCounts();
    const interval = setInterval(loadCounts, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  const badgeCount: Record<string, number | null> = {
    "/inbox": pendingCount,
    "/orders": orderCount,
  };

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside className="w-64 shrink-0 border-r border-woven-line bg-sand-deep flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="px-6 py-7 border-b border-woven-line flex flex-col items-center">
        <Image
          src="/kachabiti-logo.png"
          alt="Kachabiti"
          width={383}
          height={271}
          className="w-28 h-auto"
          priority
        />
        <p className="text-[11px] text-coffee-soft tracking-wide mt-2">
          Panneau d&apos;administration
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          const count = badgeCount[href];
          const showBadge = typeof count === "number" && count > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-terracotta text-sand"
                  : "text-coffee-soft hover:bg-woven hover:text-coffee"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              <span className="flex-1">{label}</span>
              {showBadge && (
                <span
                  className={`text-[11px] font-medium rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                    active ? "bg-sand text-terracotta" : "bg-brick text-sand"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-woven-line space-y-3">
        <BotToggle />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-coffee-soft hover:bg-woven hover:text-brick transition-colors w-full"
        >
          <LogOut size={17} strokeWidth={2} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
