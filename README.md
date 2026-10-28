# AD SOLUTIONS — site vitrine

Site d'AD SOLUTIONS, agence de création de sites web au Bénin.
Site statique (HTML, CSS, JavaScript) : aucune dépendance, aucune étape de compilation.

## Lancer le site en local

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur :

```bash
python -m http.server 5173
```

puis aller sur http://localhost:5173.

## Structure

| Fichier / dossier | Rôle |
| --- | --- |
| `index.html` | Toutes les sections de la page |
| `styles.css` | Styles, basés sur la charte « Nuit & Orange » (couleurs, typo, rayons) |
| `script.js` | Menu mobile, formulaire → WhatsApp, offres d'emploi, animations |
| `logos/` | Logos officiels (SVG, texte vectorisé : ne pas modifier) |
| `fonts/` | Space Grotesk et JetBrains Mono, hébergées localement |

## Ce qui reste à compléter

Chercher `TODO` dans le code :

- `script.js` : `WHATSAPP_NUMBER` et `RECRUTEMENT_EMAIL` ;
- `index.html` : téléphone et e-mail de contact, prix des offres, RCCM et IFU (pied de page) ;
- section **Réalisations** : liens des sites (Thalias Traiteur, portfolio Marck-Land, blog) et captures d'écran
  (déposer les images dans un dossier `realisations/`, voir le commentaire dans `index.html`).

## Publier une offre d'emploi

Ajouter un objet dans la liste `OFFRES_EMPLOI` en haut de `script.js` (un modèle est en commentaire).
Liste vide = la section affiche « Aucune offre » avec un lien de candidature spontanée.

## Charte graphique

- Couleurs : nuit `#0F1B2D`, orange `#F26B1D` (accent seulement), sable `#F4F2EE`.
- Texte sur orange : toujours nuit, jamais blanc. Orange utilisé comme texte : `#A8410B`.
- Une seule section sur fond nuit par page (Contact). Un seul bouton orange par écran.
- Sur-titres en JetBrains Mono, précédés de `//`.

## Mise en ligne

Envoyer le contenu du dépôt à la racine de l'hébergement (`public_html`, `www`…), avec `index.html` directement à la racine.
