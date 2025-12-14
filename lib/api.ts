// frontend/lib/api.ts

// URL de base de l’API Express
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type ApiErrorShape = {
  success?: boolean;
  message?: string;
  error?: string;
  detail?: string;
};

/**
 * Helper générique pour appeler l’API backend
 * - gère API_BASE_URL
 * - envoie toujours le cookie (credentials: "include")
 * - normalise les erreurs
 */
async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    credentials: "include", // 🔐 important pour le cookie sbc_token
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data: ApiErrorShape | any = null;
  try {
    // Certaines réponses (204, etc.) n'ont pas de JSON
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.detail)) ||
      `Erreur API (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

/* ===================================================== */
/*  Helpers génériques (GET/POST/PATCH/DELETE)           */
/* ===================================================== */

export function apiGet<T = any>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "GET" });
}

export function apiPost<T = any>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T = any>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T = any>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "DELETE",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/* ===================================================== */
/*  Types                                                */
/* ===================================================== */

export type RegisterInput = {
  fullName: string;
  phone: string;
  email?: string; // optionnel
  waveNumber: string;
  password: string;

  // 🔐 sécurité
  securityQuestion: string;
  securityAnswer: string;

  // ✅ CGU obligatoire
  acceptCgu: true; // important: le backend attend literal true
};

export type RegisterResponse =
  | { success: true; userId: number }
  | { success: false; message?: string };

export type LoginInput = { phone: string; password: string };

export type LoginResponse =
  | {
      success: true;
      user: { id: number; fullName: string; phone: string; role: string };
    }
  | { success: false; message?: string };

/* ===================================================== */
/*  Helpers “haut niveau” (auth + investissements)       */
/* ===================================================== */

// 🔐 REGISTER  → POST /api/register
export function register(input: RegisterInput) {
  return apiPost<RegisterResponse>("/api/register", input);
}

// 🔐 LOGIN  → POST /api/login
export function login(input: LoginInput) {
  return apiPost<LoginResponse>("/api/login", input);
}

// 🔐 LOGOUT  → POST /api/logout
export function logout() {
  return apiPost("/api/logout", {});
}

// 👤 Dashboard client  → GET /api/dashboard
export function getDashboard() {
  return apiGet("/api/dashboard");
}

// 📈 Mes investissements (client)  → GET /api/investments
export function getMyInvestments() {
  return apiGet("/api/investments");
}

// 🚀 Créer un investissement  → POST /api/investments
export function createInvestment(amountXOF: number) {
  return apiPost("/api/investments", { amountXOF });
}
