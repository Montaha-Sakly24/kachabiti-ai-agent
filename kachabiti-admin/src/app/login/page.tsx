"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError(null);
    try {
      const { access_token } = await authApi.login(username.trim(), password);
      setToken(access_token);
      router.push("/playground");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/kachabiti-logo.png"
            alt="Kachabiti"
            width={383}
            height={271}
            className="w-28 h-auto"
            priority
          />
          <p className="text-sm text-coffee-soft mt-2">Panneau d&apos;administration</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-sand border border-woven-line rounded-xl p-6 space-y-4"
        >
          <div>
            <label htmlFor="username" className="block text-sm text-coffee mb-1.5">
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-sand-deep border border-woven-line rounded-md px-3.5 py-2.5 text-sm text-coffee focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-coffee mb-1.5">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-sand-deep border border-woven-line rounded-md px-3.5 py-2.5 text-sm text-coffee focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
          </div>

          {error && (
            <p className="text-sm text-brick bg-brick/10 border border-brick/30 rounded-md px-3.5 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full inline-flex items-center justify-center gap-2 bg-terracotta text-sand text-sm rounded-full px-5 py-2.5 disabled:opacity-40 transition-opacity"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
