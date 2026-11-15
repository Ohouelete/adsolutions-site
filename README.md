# AD SOLUTIONS — site vitrine (version KTUI)

Site d'AD SOLUTIONS construit avec **KTUI** (Keenthemes, l'éditeur de Metronic) et **Tailwind CSS v4**.
Le thème de base est celui de KTUI (gris zinc, mode sombre, police Inter), avec au choix l'orange AD SOLUTIONS ou le bleu d'origine de KTUI.

## Prérequis

Node.js (installé dans `~/.local/node` sur la machine de développement) :

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm install
```

## Développer

```bash
npm run dev      # recompile le CSS à chaque modification
python3 -m http.server 5174 --bind 127.0.0.1   # dans un autre terminal, puis http://localhost:5174
```

## Mettre en ligne

```bash
npm run build    # copie KTUI, Lenis et la police, compile la 3D (esbuild), génère les pages (menu et services) puis le CSS
```

Ensuite, déposer sur l'hébergement : `index.html`, `realisations.html`, `methode.html`, `offres.html`, `a-propos.html`, `faq.html`, `services/`, `assets/` et `logos/`. Ni `node_modules/` ni `src/` ne sont nécessaires
en ligne.

## Structure

| Fichier / dossier | Rôle |
| --- | --- |
| `index.html` | La page, écrite avec les composants KTUI et les classes Tailwind |
| `src/app.css` | Point d'entrée Tailwind : thème KTUI officiel (`styles/vars.css`), composants KTUI, puis mise en page et animations |
| `assets/css/app.css` | CSS compilé (généré, ne pas modifier à la main) |
| `assets/js/ktui.min.js` | JavaScript de KTUI (copié depuis `node_modules` par `npm run vendor`) |
| `assets/js/site.js` | Pilote les composants KTUI, formulaires → WhatsApp, animations |
| `assets/fonts/` | Inter, police par défaut de KTUI (copiée depuis `@fontsource-variable/inter`) |
| `scripts/vendor.mjs` | Copie le JS de KTUI et la police dans `assets/` |
| `realisations.html`, `methode.html`, `offres.html`, `a-propos.html`, `faq.html` | Une page par rubrique du menu (générées, ne pas modifier à la main) |
| `services/*.html` | Une page par service du sous-menu (générées, ne pas modifier à la main) |
| `scripts/build-pages.mjs` | `npm run pages` : génère toutes les pages. Les pages du menu reprennent les sections d'`index.html` et les enrichissent |
| `scripts/build-services.mjs` | Génère `services/*.html` : contenu des pages dans `SERVICES`, habillage (en-tête, pied de page, devis, menus) repris d'`index.html`. Utilisé par `build-pages.mjs` : relancer `npm run pages` puis `npm run css` après toute modification de l'un ou de l'autre |

Versions figées dans `package.json` : `@keenthemes/ktui` 1.2.7, `tailwindcss` et `@tailwindcss/cli` 4.3.3, `three` 0.187.0,
`lenis` 1.3.27, `esbuild` 0.28.2.

## Thèmes

- **Couleur** : « Orange AD » (par défaut) ou « Bleu KTUI » (le thème d'origine de KTUI). L'orange est défini dans
  `src/app.css` (`html[data-accent="orange"]`) : il remplace la couleur primaire de KTUI et la palette bleue qu'utilisent ses
  badges et alertes. Les gris et le mode sombre restent ceux de KTUI. Choix mémorisé dans `localStorage` (`ad-accent`).
- **Mode** : clair (par défaut), sombre, **Espresso** ou système. Clair / sombre / système passent par KTThemeSwitch (`kt-theme`) ;
  Espresso est le mode sombre de KTUI avec des jetons café (`html.dark[data-tone="espresso"]`, choix mémorisé dans `ad-mode`) :
  bruns profonds, texte crème, orange doré, paillettes cuivrées qui scintillent et reflet qui balaie la page.
- Les deux réglages sont dans le menu « Apparence » de l'en-tête (icône soleil / lune).

Aucune couleur n'est codée en dur dans la page : tout passe par les jetons KTUI (`bg-primary`, `text-mono`,
`bg-muted`, `border-border`…), si bien que chaque composant suit automatiquement la couleur et le mode choisis.

## Composants KTUI utilisés

| Composant | Où |
| --- | --- |
| Dropdown | Méga-menu « Services » (au survol), menu « Apparence » (couleur et mode) |
| Theme Switch | Clair / sombre / système (clé `kt-theme`), avec transition en cercle |
| Drawer | Menu mobile, études de cas (Thalia's Traiteur, Marck-Land, le blog) |
| Modal + Stepper | « Démarrer un projet » : assistant en 3 étapes qui prépare un message WhatsApp |
| Modal | Palette de commandes (Ctrl K / ⌘ K), mentions légales, confidentialité |
| Tabs + Toggle Group | Offres (sites web, applications, maintenance) |
| Accordion | FAQ |
| Toast | Confirmation après un formulaire ou une copie |
| Clipboard, Tooltip | Copier le téléphone ou l'e-mail, infobulles |
| Card, Badge, Button, Input, Textarea, Radio, Alert, Progress, Kbd, Separator, Link | Partout |

## Effets « premium »

- **Fonds des sections, une seule famille** (`src/app.css`) : anneaux concentriques de Gradient Magic (« Dark Backgrounds »,
  4e ligne) sur toutes les sections, en alternance grands anneaux n° 50 (`gm-rings-l`) / anneaux moyens n° 51 (`gm-rings-m`).
  Dosage : encre du thème ~3 % (5 % en sombre), touche d'orange sur un anneau.
- **Séparations de sections** (`src/app.css`, « Sections délimitées ») : chaque motif s'arrête net à sa section ; à chaque
  limite, un double filet sur toute la largeur, un trait orange central de 2 px, un losange orange au centre, un halo
  orange et une légère ombre qui descendent dans la section, et une croix « + » à chaque croisement avec les rails verticaux. Cartes : repères d'angle discrets, orange au survol (`liquid-glass.css`).
  Sous chaque filet, une étiquette numérotée « 05 — SERVICES » (compteur CSS + attribut `data-label` de chaque section).
  Rails verticaux en règle graduée (trait tous les 24 px, repère long tous les 120 px), filet permanent sous l'en-tête,
  contour des cartes plus net (« Délimitations renforcées » dans `src/app.css`).
  « Délimitations partout » : badges de section encadrés de filets orange, filet à losange sous les titres centrés, cadres
  d'illustration doublés d'un pointillé décollé (maquette, vitrine, comparateur, mur de technologies), séparations en
  pointillé dans les cartes, croix sous l'en-tête aux rails, colonnes et mot-symbole du pied de page délimités.
  Cadre « plan technique » de chaque section (grands écrans, `.gm-sec::after`) : règle graduée sous la séparation (trait tous
  les 40 px, repère orange tous les 200 px), lignes de repère en pointillé en haut et en bas du contenu, croix aux croisements
  avec les rails, plaque « AD · 05 / 13 » en bas à droite (à mettre à jour si le nombre de sections change). Titres alignés à
  gauche soulignés d'un trait orange prolongé d'un filet.
- **Verre noir transparent** (`assets/css/liquid-glass.css`, CSS natif chargé après `app.css`, sans compilation) : les
  surfaces (cartes, FAQ, blocs à fond plein, vitrine du hero) deviennent du noir transparent, sans flou ni reflet,
  détachées du fond par de petites ombres (`--glass-shadow`, `--glass-shadow-sm`). Boutons,
  badges, champs, menus et fenêtres ne changent pas. Opacité réglable avec `--glass-black` (clair et sombre).
  Pour désactiver : retirer sa ligne `<link>` dans `index.html`.
- **Vitrine du hero** : à droite du titre, des maquettes génériques de ce que nous livrons (une interface web et une application
  mobile avec paiement Mobile Money), dessinées en HTML/CSS (classes `hs-*` et `hero-phone__*`), sans projet client.
  Les technologies restent juste en dessous (défilement de logos) et dans la section « Technologies ».
  La scène est posée en oblique (perspective 3D, profondeurs différentes pour le téléphone, les étiquettes et les notifications)
  et s'incline vers la souris avec un mouvement lissé (`#hero-tilt` dans `site.js`). Les étiquettes, les notifications et les
  cartes flottantes sont en « verre liquide » (`.lglass` : flou et saturation de l'arrière-plan, liseré lumineux, reflet qui suit la souris).
- **Symbole AD en 3D** (`src/hero3d.js` → `assets/js/hero3d.js`, Three.js compilé par esbuild) : plus affiché dans le hero.
  Le script s'active sur tout élément `id="hero3d"` ; pour le réutiliser, ajouter cet élément et
  `<script src="assets/js/hero3d.js" defer></script>` avant `</body>`.
- **« Un projet prend vie »** : section de défilement scénarisé (à la manière des pages produit d'Apple). Elle reste à l'écran
  pendant qu'une application se construit : maquette filaire du tableau de bord (`dbw-*`) → code ligne par ligne →
  tableau de bord KTUI fini (`db-*` : menu latéral, indicateurs, graphique des ventes, dernières commandes), en noir transparent, avec un balayage lumineux.
- **Défilement fluide** : Lenis (`assets/js/lenis.min.js`), désactivé si le visiteur demande moins d'animations. Les zones qui
  défilent seules (fenêtres, tiroirs, palette) portent `data-lenis-prevent` ; le défilement de la page est suspendu quand une
  fenêtre KTUI est ouverte.
- **Chorégraphie** : les blocs n'apparaissent pas tous pareil (`data-reveal="scale"`, `"left"`, `"clip"`).

## Fonds et composants par section

Fonds : motifs de **Gradient Magic** (gradientmagic.com), recolorés avec les jetons du thème (`.gm-*` dans `src/app.css`).
Composants : bibliothèques de l'annuaire **designengineer.tools**, réécrits en CSS/JS natif et habillés avec KTUI.

| Section | Fond Gradient Magic | Composants |
| --- | --- | --- |
| Hero | Subtle Grid (maillage) + Lens Flare | Aceternity Spotlight · Magic UI Orbiting Circles, Animated List, Animated Shiny Text, Animated Gradient Text, Shimmer Button, Avatar Circles · React Bits Logo Loop |
| Réalisations | Subtle Grid (grille double) | Aceternity 3D Card, Focus Cards · Magic UI Safari, Neon Gradient Card, Magic Card |
| Services | Subtle Grid (maillage) | Magic UI Bento Grid, Magic Card, Safari, iPhone, Animated List, Number Ticker, Animated Beam, Terminal · curseurs multijoueur |
| Technologies | Future Stripes | Magic UI 3D Marquee |
| Pourquoi nous | Subtle Grid (grille double) | React Bits Scroll Reveal · Aceternity Compare · Magic UI Number Ticker |
| Méthode | Simple Circles | Aceternity Timeline + Tracing Beam |
| Offres | Lens Flare + Subtle Grid | Magic UI Border Beam, Shimmer Button · KTUI Toggle Group + Tabs |
| Audit gratuit | Subtle Grid (maillage) | Aceternity Lamp · Magic UI Border Beam |
| À propos | Simple Circles | Aceternity Card Hover Effect · arc animé Cotonou → Québec (World Map) |
| FAQ | Future Stripes | KTUI Accordion + Magic Card |
| Contact | Simple Circles | Magic UI Ripple, Shimmer Button |

Toutes les animations se coupent si le visiteur demande moins d'animations (`prefers-reduced-motion`).

## Ce qui reste à compléter

Chercher `TODO` :

- `assets/js/site.js` : `WHATSAPP_NUMBER` et `RECRUTEMENT_EMAIL` ;
- `index.html` : prix des offres, téléphone et e-mail, RCCM et IFU, mentions légales (adresse, directeur de la publication,
  hébergeur) ;
- étude de cas du blog : nom exact du blog (la carte affiche « Le Blog »).
