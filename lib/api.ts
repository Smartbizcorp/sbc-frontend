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
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T = any>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T = any>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/* ===================================================== */
/*  Helpers “haut niveau” (auth + investissements)       */
/*  → adaptent aux routes de ton backend Express         */
/* ===================================================== */

// 🔐 REGISTER  → POST /api/register
// Tu peux passer tous les champs requis (fullName, phone, waveNumber, password, etc.)
export function register(input: any) {
  return apiPost("/api/register", input);
}

// 🔐 LOGIN  → POST /api/login
// Le backend attend { phone, password }
export function login(input: { phone: string; password: string }) {
  return apiPost("/api/login", input);
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
// amountXOF doit être l’un des paliers autorisés
export function createInvestment(amountXOF: number) {
  return apiPost("/api/investments", { amountXOF });
}
