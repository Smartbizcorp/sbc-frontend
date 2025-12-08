// src/api/client.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // pas JSON, on laisse data = null
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Erreur HTTP ${res.status} (${res.statusText})`;

    throw new Error(message);
  }

  return data as T;
}

// ✅ GET générique
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "include", // important pour envoyer le cookie sbc_token
  });

  return handleResponse<T>(res);
}

// ✅ POST générique (pas forcément utile tout de suite pour le dashboard)
export async function apiPost<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

// ✅ PATCH générique (pour changer le statut des retraits)
export async function apiPatch<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}
