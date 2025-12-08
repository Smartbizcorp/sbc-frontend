import { redirect } from "next/navigation";

/**
 * Page d'entrée de la zone admin.
 *
 * On ne duplique pas la logique ici :
 * - Pas d'appel API
 * - Pas de lecture de localStorage
 *
 * On se contente de rediriger proprement vers le dashboard admin.
 * La sécurité reste assurée par :
 *   - la protection côté backend (/api/admin/… vérifie le rôle ADMIN)
 *   - l'usage du cookie httpOnly pour l'authentification
 */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
