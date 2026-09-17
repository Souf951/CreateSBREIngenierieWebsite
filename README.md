# SBRE Ingénierie

Site React / Vite, publié sur GitHub Pages. Refonte et audit : [docs/PREMIUM-REFONTE.md](docs/PREMIUM-REFONTE.md).

## Développement

Node 20 ou version LTS compatible, pnpm 10.32.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
node scripts/verify-build.mjs
pnpm preview
```

Le build pré-rend l'accueil en HTML et conserve le routage par fragment compatible GitHub Pages. L'aperçu est disponible sous `/CreateSBREIngenierieWebsite/`.

## Contenu

- Accueil : `src/app/components/HomePage.tsx`
- Projets et situations : `src/app/components/premium/content.ts`
- Architecture : `Architecture.tsx` et `BuildingScene.tsx` dans le même dossier
- Styles : `src/styles/premium.css`
- Photos originales : `src/imports` ; dérivés web : `src/media`

Les portraits des deux collaborateurs et les situations sont explicitement illustratifs. Remplacer les portraits et documenter les résultats avant toute revendication de référence réelle.

## Publication

Les PR sont vérifiées sans modifier le site public. La fusion dans main déclenche le workflow Pages existant. Le domaine personnalisé n'est pas modifié par cette refonte.

Projet d'origine : https://www.figma.com/design/QcUUBWLxt70oLVwHZWsSq4/Create-SBRE-Ingenierie-Website
