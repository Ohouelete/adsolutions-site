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
| `index.html` | Toutes les sections de la page |
| `styles.css` | Styles, basés sur la charte « Nuit & Orange » (couleurs, typo, rayons) |
| `script.js` | Menu mobile, formulaire → WhatsApp, offres d'emploi, animations |
| `logos/` | Logos officiels (SVG, texte vectorisé : ne pas modifier) |
| `fonts/` | Clash Display, Satoshi (Fontshare, licence gratuite y compris usage commercial) et JetBrains Mono, hébergées localement |
| `realisations/` | Captures d'écran des sites réalisés (1200 × 750) |

## Ordre des sections

La structure s'inspire des meilleurs sites d'agences web et logicielles du catalogue websitevice.com
(catégories *agency*, *business*, *corporate*) : Amply, GojiLabs, Ask Phill, Refokus, Bunsen, Agota, Grafit.

0. **Bandeau d'annonce** orange (audit gratuit), qui se replie au défilement.
1. **Hero** (fond nuit) : « Nous créons votre site web / app mobile / app web / e-boutique de A à Z », la vraie réalisation
   Thalia's Traiteur avec un téléphone d'illustration, puis la rangée « Déjà en ligne » (les 3 projets).
2. Bandeaux croisés : qualités et services.
3. **Réalisations** : projet phare (Thalia's Traiteur), Marck-Land, le blog, carte « Votre projet ici ».
4. **Services** : liste numérotée 01 → 08 (sites vitrines, e-commerce, applications web, applications mobiles, UI/UX,
   API et intégrations, hébergement et DevOps, maintenance). Au survol, un aperçu illustré suit la souris ;
   un clic présélectionne le bon type de projet dans le formulaire.
5. **Technologies** : deux bandeaux défilants, six familles (front, mobile, back-end, données, cloud, CMS et paiement)
   et les trois critères de choix (budget, délais, croissance).
6. **Pourquoi nous** : texte qui s'allume, comparatif page Facebook / AD SOLUTIONS, chiffres clés.
7. **Méthode** en 5 étapes (cartes empilées).
8. **Offres** : AD START, AD BUSINESS, AD PREMIUM, encart **AD APPS** (applications sur devis) et maintenance.
9. **Audit gratuit** (fond nuit) : formulaire qui envoie l'adresse à analyser sur WhatsApp.
10. À propos, FAQ, Recrutement.
11. **Contact** (fond nuit) : formulaire qui ouvre WhatsApp avec le message prêt.

## Ce qui reste à compléter

Chercher `TODO` dans le code :

- `script.js` : `WHATSAPP_NUMBER` et `RECRUTEMENT_EMAIL` ;
- `index.html` : téléphone et e-mail de contact, prix des offres, RCCM et IFU (pied de page) ;
- section **Réalisations** : liens du portfolio Marck-Land et du blog, nom exact du blog, et captures d'écran.
  Tant qu'un lien vaut `#`, le bouton « Voir le site » est masqué automatiquement.
  Pour une capture : déposer l'image dans `realisations/` et suivre le commentaire dans `index.html`.

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
