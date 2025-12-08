# Smart Business Corp Frontend (Next.js + Tailwind)

Frontend responsive et premium pour la plateforme d'investissement **Smart Business Corp**.

## 1) Installation locale

```bash
npm install
npm run dev
```

Le site sera disponible sur http://localhost:3000

Par défaut, il appelle l'API sur `http://localhost:4000`.
Tu peux surcharger l'URL de l'API avec une variable d'environnement :

- `NEXT_PUBLIC_API_URL` (ex: URL Render du backend).

### Exemple (Windows PowerShell)

```bash
$env:NEXT_PUBLIC_API_URL="https://TON-BACKEND.onrender.com"
npm run dev
```

## 2) Pages incluses

- `/` : landing page premium (logo, paliers, univers or & bleu nuit)
- `/login` : connexion
- `/login?mode=register` : création de compte
- `/dashboard` : tableau de bord (solde, paliers cliquables, liste d'investissements)

## 3) Intégration du logo

Place ton logo principal dans le dossier `public` avec le nom :

- `public/logo-smart-business-corp.png`

Le header, la page d'accueil et le splash écran mobile l'utilisent automatiquement.

## 4) Déploiement sur Vercel

1. Pousser ce dossier sur un repo GitHub.
2. Sur vercel.com, créer un nouveau projet à partir du repo.
3. Ajouter la variable d'environnement `NEXT_PUBLIC_API_URL` pour pointer vers ton backend en ligne.
4. Déployer.

Le site sera alors accessible publiquement, responsive mobile / tablette / desktop.
