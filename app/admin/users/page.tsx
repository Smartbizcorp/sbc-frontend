"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "../AdminNav";
import { apiGet } from "@/src/api/client";

type AdminUser = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  isActive: boolean;
  totalInvested: number;
  totalGains: number;
  totalWithdrawalsProcessed: number;
  walletBalance: number;
  lastSeenAt: string | null;
};

type AdminUsersResponse = {
  success: boolean;
  users: AdminUser[];
};

const formatXOF = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔐 Vérif ADMIN
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("sbc_user");

    if (!raw) {
      router.push("/login");
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (user.role !== "ADMIN") router.push("/dashboard");
    } catch {
      router.push("/login");
    }
  }, [router]);

  // 🔁 Chargement
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiGet<AdminUsersResponse>("/api/admin/users");
        if (!res.success) throw new Error("Réponse API non réussie.");

        setUsers(res.users);
      } catch (err: any) {
        console.error("Erreur admin users:", err);
        setError(
          err.message || "Erreur lors du chargement des utilisateurs."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="flex flex-col gap-8 md:gap-10">

      {/* NAVIGATION ADMIN */}
      <AdminNav />

      {/* HEADER */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-6 md:p-7 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg">
        <p className="text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
          Administration
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold mt-1">
          Gestion des utilisateurs
        </h1>
        <p className="text-xs md:text-sm text-sbc-muted leading-relaxed max-w-2xl mt-2">
          Liste complète des comptes, données financières agrégées et activité
          récente des utilisateurs.
        </p>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="text-xs text-sbc-muted">Chargement…</div>
      )}

      {/* ERREUR */}
      {!loading && error && (
        <div className="bg-red-900/30 border border-red-600/40 rounded-2xl p-4 text-red-300 text-xs shadow">
          {error}
        </div>
      )}

      {/* TABLEAU */}
      {!loading && !error && (
        <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-6 md:p-8 shadow-[0_18px_55px_rgba(0,0,0,0.85)]">
          {users.length === 0 ? (
            <p className="text-xs text-sbc-muted">
              Aucun utilisateur enregistré.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/30">
              <table className="w-full text-[11px] md:text-xs text-sbc-muted border-collapse">
                <thead>
                  <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                    <Th>ID</Th>
                    <Th>Nom</Th>
                    <Th>Téléphone</Th>
                    <Th>Email</Th>
                    <Th>Rôle</Th>
                    <Th>Créé le</Th>
                    <Th>Dernière connexion</Th>
                    <Th>Investi</Th>
                    <Th>Gains</Th>
                    <Th>Retraits traités</Th>
                    <Th>Solde wallet</Th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-sbc-border/40 hover:bg-sbc-bgSoft/40 transition"
                    >
                      <Td>{u.id}</Td>
                      <Td className="text-sbc-text">{u.fullName}</Td>
                      <Td>{u.phone}</Td>
                      <Td>{u.email || "-"}</Td>
                      <Td>{u.role}</Td>
                      <Td>
                        {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                      </Td>
                      <Td>
                        {u.lastSeenAt
                          ? new Date(u.lastSeenAt).toLocaleString("fr-FR")
                          : "-"}
                      </Td>
                      <Td className="text-sbc-gold font-semibold">
                        {formatXOF(u.totalInvested)}
                      </Td>
                      <Td className="text-sbc-gold font-semibold">
                        {formatXOF(u.totalGains)}
                      </Td>
                      <Td className="text-sbc-gold font-semibold">
                        {formatXOF(u.totalWithdrawalsProcessed)}
                      </Td>
                      <Td className="text-sbc-gold font-semibold">
                        {formatXOF(u.walletBalance)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* -------------------------------- */
/*       TABLE COMPONENTS UI        */
/* -------------------------------- */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-2 text-left font-medium text-[10px] md:text-[11px] border-b border-sbc-border/40 uppercase text-sbc-gold whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`p-2 border-b border-sbc-border/30 text-[11px] md:text-xs whitespace-nowrap ${className}`}
    >
      {children}
    </td>
  );
}
