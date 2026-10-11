import type { Faq, FaqInput, PendingQuestion, Order } from "./types";
import { getToken, clearToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// Messages techniques connus → reformulés en langage clair pour un admin non-développeur
const FRIENDLY_MESSAGES: Record<string, string> = {
  "Internal Server Error": "Une erreur interne est survenue. Réessaie dans un instant.",
  "Not Found": "Cette information est introuvable.",
  "Forbidden": "Accès refusé.",
};

function toFriendlyMessage(detail: string): string {
  return FRIENDLY_MESSAGES[detail] ?? detail;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });
  } catch {
    // Le serveur ne répond pas du tout (coupure réseau, backend éteint, etc.)
    throw new Error(
      "Impossible de contacter le serveur. Vérifie ta connexion internet, ou réessaie dans un instant."
    );
  }

  if (response.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Ta session a expiré, merci de te reconnecter.");
  }

  if (!response.ok) {
    let detail = "Une erreur est survenue. Réessaie dans un instant.";
    try {
      const data = await response.json();
      if (data?.detail) detail = data.detail;
    } catch {
      // la réponse n'était pas du JSON, on garde le message par défaut
    }
    throw new Error(toFriendlyMessage(detail));
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Réponse du serveur illisible. Réessaie dans un instant.");
  }
}

export const authApi = {
  login: (username: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
};

export const faqApi = {
  list: () => request<Faq[]>("/api/faqs/"),
  get: (id: string) => request<Faq>(`/api/faqs/${id}`),
  create: (input: FaqInput) =>
    request<Faq>("/api/faqs/", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: FaqInput) =>
    request<Faq>(`/api/faqs/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<{ message: string }>(`/api/faqs/${id}`, {
      method: "DELETE",
    }),
};

export const chatApi = {
  send: (message: string) =>
    request<{ response: string }>("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

export const settingsApi = {
  getBot: () => request<{ enabled: boolean }>("/api/settings/bot"),
  setBot: (enabled: boolean) =>
    request<{ enabled: boolean }>("/api/settings/bot", {
      method: "PUT",
      body: JSON.stringify({ enabled }),
    }),
};

export const inboxApi = {
  list: () => request<PendingQuestion[]>("/api/inbox/"),
  reply: (id: number, reply: string) =>
    request<{ message: string }>(`/api/inbox/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ reply }),
    }),
  replyToSender: (channel: string, sender_id: string, reply: string) =>
    request<{ message: string; resolved: number }>("/api/inbox/reply-sender", {
      method: "POST",
      body: JSON.stringify({ channel, sender_id, reply }),
    }),
  dismissSender: (channel: string, sender_id: string) =>
    request<{ message: string; dismissed: number }>("/api/inbox/dismiss-sender", {
      method: "POST",
      body: JSON.stringify({ channel, sender_id }),
    }),
};

export const ordersApi = {
  list: () => request<Order[]>("/api/orders/"),
  markHandled: (id: number) =>
    request<{ message: string }>(`/api/orders/${id}/handled`, {
      method: "POST",
    }),
};
