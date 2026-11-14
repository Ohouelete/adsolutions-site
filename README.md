# AD SOLUTIONS — site vitrine

Site d'AD SOLUTIONS, agence de création de sites web au Bénin.
Site statique (HTML, CSS, JavaScript) : aucune dépendance, aucune étape de compilation.

## Lancer le site en local

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur **depuis ce dossier** :

```bash
cd adsolutions-site
python3 -m http.server 5173 --bind 127.0.0.1
```

puis aller sur http://localhost:5173.

## Structure

| Fichier / dossier | Rôle |
| --- | --- |
| `index.html` | Accueil : hero, réalisations, services, pourquoi nous, audit gratuit |
| `services.html` | Services 01 → 08, technologies, méthode en 5 étapes |
| `realisations.html` | Toutes les réalisations |
| `realisations/*.html` | Une étude de cas par projet (Thalia's Traiteur, Marck-Land, le blog) |
| `offres.html` | AD START, AD BUSINESS, AD PREMIUM, AD APPS, maintenance |
| `a-propos.html` | Présentation, valeurs, recrutement |
| `contact.html` | Formulaire de projet, FAQ, audit gratuit |
| `mentions-legales.html`, `confidentialite.html` | Pages légales |
| `404.html` + `.htaccess` | Page « introuvable » (`.htaccess` la branche sur les hébergements Apache / cPanel) |
| `styles.css` | Styles, basés sur la charte « Nuit & Orange » (couleurs, typo, rayons) |
| `script.js` | Menu mobile, formulaires → WhatsApp, offres d'emploi, animations (commun à toutes les pages) |
| `logos/` | Logos officiels (SVG, texte vectorisé : ne pas modifier) |
| `fonts/` | Clash Display, Satoshi (Fontshare, licence gratuite y compris usage commercial) et JetBrains Mono, hébergées localement |
| `realisations/` | Études de cas et captures d'écran des sites réalisés (1200 × 750) |

**En-tête et pied de page** : ils sont recopiés à l'identique dans chaque page (pas d'étape de compilation).
Pour modifier un lien du menu ou du pied de page, faire la même modification dans toutes les pages
(une recherche/remplacement sur `*.html` et `realisations/*.html` suffit). Les pages de `realisations/`
utilisent des chemins en `../`, et `404.html` des chemins absolus (`/styles.css`), car elle peut être affichée à n'importe quelle adresse.

Les boutons d'offre des autres pages mènent à `contact.html?offre=…` : le type de projet est alors présélectionné dans le formulaire.

## Parcours

La structure s'inspire des meilleurs sites d'agences web et logicielles du catalogue websitevice.com
(catégories *agency*, *business*, *corporate*) : Amply, GojiLabs, Ask Phill, Refokus, Bunsen, Agota, Grafit.

- Sur toutes les pages : **bandeau d'annonce** orange (audit gratuit), menu (Réalisations, Services, Offres, À propos,
  bouton « Démarrer un projet »), puis en bas un bloc nuit **« Parlons de votre projet »** et le pied de page.
- **Accueil** : hero « Nous créons votre site web / app mobile / app web / e-boutique de A à Z » avec la vraie réalisation
  Thalia's Traiteur, bandeaux croisés, réalisations, services 01 → 08 (aperçu qui suit la souris), pourquoi nous
  (comparatif page Facebook / site, chiffres clés), audit gratuit.
- **Services** : les 8 services, les technologies (bandeaux + 6 familles + 3 critères), la méthode en 5 étapes (cartes empilées).
- **Réalisations** et **études de cas** : contexte, besoin, réponse, ce qui a été livré, projet suivant.
- **Offres** : les trois formules, l'encart AD APPS (applications sur devis) et la maintenance.
- **À propos** : présentation, valeurs, recrutement.
- **Contact** : formulaire → WhatsApp, FAQ, audit gratuit.

## Ce qui reste à compléter

Chercher `TODO` (et les pastilles « à compléter » des pages légales) :

- `script.js` : `WHATSAPP_NUMBER` et `RECRUTEMENT_EMAIL` ;
- `contact.html` : téléphone et e-mail de contact ; `offres.html` : prix des offres ;
- toutes les pages : RCCM et IFU du pied de page ;
- `mentions-legales.html` : adresse, RCCM, IFU, téléphone, directeur de la publication, hébergeur ;
- **Réalisations** : liens du portfolio Marck-Land et du blog, nom exact du blog, et captures d'écran
  (dans `index.html`, `realisations.html` et l'étude de cas). Tant qu'un lien vaut `#`, le bouton « Voir le site » est masqué automatiquement.

## Publier une offre d'emploi

Ajouter un objet dans la liste `OFFRES_EMPLOI` en haut de `script.js` (un modèle est en commentaire).
Liste vide = la section affiche « Aucune offre » avec un lien de candidature spontanée.

## Effets visuels

Inspirés des bibliothèques listées sur designengineer.tools, réécrits en CSS/JS natif (aucune dépendance) :

| Effet | Inspiration | Où |
| --- | --- | --- |
| Grille « carreaux » : carreaux qui s'allument sous la souris, traînée, repères « + » | Magic UI · Animated Grid Pattern, Aceternity · Background Boxes, grilles de Vercel | Hero |
| Rayons, aurore, faisceaux, grain | React Bits · Light Rays, Soft Aurora, Beams, Noise | Hero, Contact |
| Titres qui apparaissent mot à mot avec un flou | React Bits · Blur Text / Split Text | Tous les titres |
| Mot du titre qui change lettre par lettre | Fancy Components · Text Rotate | Hero |
| Texte brillant | React Bits · Shiny Text | Pastille du hero |
| Chiffres qui roulent | NumberFlow | Hero, chiffres clés |
| Carte inclinée + reflet | React Bits · Tilted Card, Glare Hover | Captures de réalisations |
| Bandeaux croisés dont la vitesse suit le défilement | React Bits · Scroll Velocity | Sous le hero |
| Sur-titres et URL qui se « décodent » | React Bits · Decrypted Text, Fancy · Scramble In | Sur-titres, URL |
| Lettres qui roulent au survol | Fancy Components · Letter Swap Hover | Menu, liens |
| Menu en pastille avec indicateur glissant | React Bits · Pill Nav | En-tête |
| Tuiles avec bordure lumineuse qui suit la souris | React Bits · Magic Bento, Spotlight Card | Technologies, Offres, Valeurs |
| Aperçu illustré qui suit la souris | Fancy Components · Image Trail, Codrops « hover reveal » | Services |
| Bandeaux de technologies | Magic UI · Marquee, React Bits · Scroll Velocity | Technologies |
| Fonds « Basic Grid », « Dark » (facettes) et « Lens Flare », recolorés | Gradient Magic (gradientmagic.com) | Technologies, Audit, encart AD APPS |
| Texte qui s'allume au défilement | React Bits · Scroll Reveal | « Pourquoi un vrai site » |
| Cartes qui s'empilent | Fancy Components · Stacking Cards | Méthode |
| Bordure tournante | React Bits · Star Border | Bouton principal, offre vedette |
| Surligneur animé | Fancy Components · Text Highlighter | À propos |
| Boutons aimantés, étincelles au clic | React Bits · Magnet, Click Spark | Boutons d'action |
| Curseur « Visiter » | Cursify | Captures de réalisations |

Tous les effets se coupent si le visiteur a activé « réduire les animations », et les effets de souris sont désactivés sur téléphone.

## Charte graphique

- Couleurs : nuit `#0F1B2D`, orange `#F26B1D` (accent), sable `#F4F2EE`.
- Deux thèmes (bouton soleil / lune, choix mémorisé) :
  - **Sombre** (par défaut) : fond nuit, accents orange.
  - **Clair « Sable & Encre »** : 60 % sable et blanc, 30 % encre (le bleu nuit du logo), 10 % orange réservé à l'action.
    Le contact et le pied de page restent des « îlots » nuit (classe `.island`).
- Texte sur orange : toujours nuit, jamais blanc. Orange utilisé comme texte : `#B4470A` sur fond clair, `#F58A4B` sur fond nuit.
- Titres en Clash Display, texte en Satoshi, sur-titres et détails techniques en JetBrains Mono.
- Motif signature : les deux équerres du logo, déclinées partout :
  - autour des captures de réalisations (`.corners`) ;
  - devant chaque sur-titre ;
  - sur les pictogrammes (`.ico`) : un carré à filet fin, équerre encre en haut à gauche, équerre orange en bas à droite.
    Les pictogrammes remplacent les numéros « 01, 02… » ;
  - lignes de cote entre les sections, comme sur un plan d'architecte.
- Fonds en « carreaux » (grille fine), jamais en points.
- Animations désactivées automatiquement si le visiteur a choisi « réduire les animations ».

## Mise en ligne

Envoyer le contenu du dépôt à la racine de l'hébergement (`public_html`, `www`…), avec `index.html` directement à la racine.
