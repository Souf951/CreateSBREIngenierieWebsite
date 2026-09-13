# SBRE — refonte premium

## Audit de départ

Base : `cbbfb9b849aea6a18814f2a11e4e8284826467a9` (main).
React 18 / TypeScript / Vite 6 / Tailwind 4 / Motion. HashRouter, accueil monolithique (plus de 1 200 lignes), trois pages projet et composants de galerie. Déploiement Pages via Actions sur main ; base Vite `/CreateSBREIngenierieWebsite/`.

Les sources médias pèsent environ 107 Mo. L'accueil importait plusieurs séries de photos, des vidéos et de nombreux logos. Introduction de 5,2 secondes. Le bouton du formulaire ouvrait une messagerie sans transmettre les champs. Sitemap et métadonnées utilisaient un autre domaine et des chemins non pris en charge par HashRouter. Aucun lockfile ni contrôle automatique de PR dans la base analysée.

## Direction retenue

Vert SBRE #0a5c3d, vert sombre, blanc minéral ; grandes compositions typographiques, titres sobres et italique éditorial. Promesse : « Chaque détail. Sous contrôle. »

Parcours : accueil / expertises / situations / expériences projet / méthode / équipe / contact / FAQ. Conservation des trois routes projet. Le site ne multiplie pas les pages de service peu documentées.

Villa procédurale Three.js : fondations, structure, enveloppe vitrée, finitions bois ; ombres douces et légère réaction au pointeur. Introduction passable de 2,7 secondes, une fois par session. Pas d'introduction sur mobile, accès direct à une fiche ou préférence de réduction des animations. La photo remplace WebGL sur mobile, économie de données, réduction des animations ou échec de création/perte du contexte. Chargement dynamique de Three ; ratio de pixels limité à 1,5 ; arrêt du rendu lorsque la scène est immobile, hors écran ou onglet masqué. Pas de vidéo chargée dans le build.

## Crédibilité éditoriale

Les photographies originales de chantier et le portrait du directeur sont conservés. Les deux portraits générés sont explicitement fictifs/provisoires sur la page. Ils ne doivent pas être présentés comme des salariés réels. Les trois situations sont présentées comme une méthode et des résultats visés, pas comme des résultats clients attestés. Aucun délai récupéré, économie ni volume de réserves inventé. Les collaborations des projets existants restent dans les fiches.

Portraits créés avec l'outil de génération d'images intégré, puis optimisés en WebP :
- `src/media/chef-projet-provisoire.webp` : portrait fictif d'un chef de projet, environ 40 ans, chemise blanche, fond anthracite, lumière naturelle latérale, texture de peau réaliste, sans texte.
- `src/media/conducteur-provisoire.webp` : portrait fictif d'un conducteur de travaux, environ 34 ans, surchemise anthracite, même fond et même éclairage, sans texte.

## Fonctionnement et SEO

Le contact prépare un lien mailto avec tous les champs encodés ; le visiteur ouvre ensuite son brouillon et l'envoie. Aucun serveur de messagerie n'est prétendu. Le téléphone et l'adresse e-mail restent accessibles directement.

Accueil pré-rendu au build : contenu HTML disponible aux robots et sans JavaScript. Les liens pré-rendus utilisent la base GitHub Pages et les fragments du routeur. Canonical, sitemap, favicon et image de partage alignés sur l'adresse Pages du dépôt. Pas de CNAME ni de modification DNS. Si le domaine sbre-ingenierie.ch est ensuite raccordé à ce dépôt, mettre à jour ensemble base Vite, index.html, SEOHead, robots et sitemap. Les routes en fragment ne sont pas des pages indexables autonomes.

## Validation effectuée

- Images WebP : toutes vérifiées par décodage ; deux dérivés vides régénérés. Écriture atomique des futures optimisations.
- TypeScript strict : réussi.
- 10 tests React/jsdom : menu mobile, situations, routes projet, encodage et invalidation du brouillon, fallback mobile, sélection des phases, profils provisoires, intro mobile/reduced motion, durée/nettoyage intro desktop, stockage indisponible.
- Build Vite client + pré-rendu : réussi.
- Vérification des assets référencés, des URL Pages, des liens projet, du sitemap et du chunk 3D séparé : réussie.
- Production complète : environ 7,2 Mo sur disque, images comprises (ce n'est pas le poids du premier chargement).
- Bibliothèque 3D : environ 121 Ko gzip, chargée séparément sur les appareils éligibles. Pas de score Lighthouse revendiqué.

Limite : le navigateur de contrôle de cet environnement a refusé l'aperçu local (`ERR_BLOCKED_BY_CLIENT`). Aucune validation visuelle desktop/mobile ni mesure de fluidité sur appareil réel n'est revendiquée. Le modèle est une volumétrie architecturale procédurale, pas une vidéo photoréaliste pré-calculée. Vérifier le rendu final avant fusion.

## Livraison

Branche `feat/premium-architecture`. PR vers main, sans fusion automatique. `validate.yml` exécute typecheck, tests, build et vérification de sortie ; il joint le dossier dist en artifact. Le workflow Pages conserve son déclenchement sur main et utilise désormais l'installation figée et les contrôles avant déploiement.
