/* ============================================================
   AD SOLUTIONS — génération des pages de services (services/*.html)
   Usage : node scripts/build-services.mjs   (ou npm run pages)

   L'habillage (en-tête, menu, pied de page, devis, menu mobile, études de cas, palette, mentions légales)
   est repris tel quel depuis index.html : modifiez index.html puis relancez ce script, les pages suivent.
   Le contenu de chaque page est dans SERVICES, plus bas.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = readFileSync(join(ROOT, "index.html"), "utf8");
const OUT = join(ROOT, "services");

// ---------- Petits outils ----------
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Typographie française : espace insécable avant ? ! : ; (le texte est échappé d'abord)
const fr = (t) => esc(t).replace(/ ([?!:;])/g, "&nbsp;$1");
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CHECK = '<svg class="mt-0.5 size-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ALERT = '<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16h.01"/></svg>';
const WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/></svg>';
const pad = (n) => String(n).padStart(2, "0");

// ---------- Habillage repris d'index.html ----------
const cut = (from, to, start = 0) => {
  const a = INDEX.indexOf(from, start); const b = INDEX.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error(`Repère introuvable dans index.html : ${from} … ${to}`);
  return [a, b];
};
const sectionIds = [...INDEX.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
// Les chemins relatifs remontent d'un dossier ; les ancres vers les sections de l'accueil pointent vers index.html
function rebase(html) {
  return html
    .replace(/\b(href|src)="(?!https?:|#|mailto:|tel:|data:|javascript:|\.\.\/)([^"]+)"/g, '$1="../$2"')
    .replace(/\bhref="#([a-z0-9-]+)"/g, (m, id) => (sectionIds.includes(id) ? `href="../index.html#${id}"` : m));
}
const [hs, he] = cut("<!DOCTYPE html>", "</head>");
const HEAD = rebase(INDEX.slice(hs, he))
  .replace(/<title>[\s\S]*?<\/title>\s*/, "")
  .replace(/\s*<meta name="description"[^>]*>/, "")
  .replace(/\s*<meta property="og:[^>]*>/g, "");
const [bs] = cut("<body>", "<main");
const mainOpen = INDEX.indexOf("<main", bs);
const mainOpenEnd = INDEX.indexOf(">", mainOpen) + 1;
const firstSection = INDEX.indexOf("    <!-- ====", mainOpenEnd);
const CHROME_TOP = rebase(INDEX.slice(bs, mainOpenEnd)).replace("<body>", '<body data-home="../">')
  // Sur une page de service, « Services » est la rubrique active du menu
  .replace('data-href="#services" class="nav-link ', 'data-href="#services" class="nav-link is-active ');
const MAIN_DECOR = INDEX.slice(mainOpenEnd, firstSection).trimEnd();
const CHROME_BOTTOM = rebase(INDEX.slice(INDEX.indexOf("</main>")));

// ---------- Contenu des pages ----------
const SERVICES = [
  {
    slug: "site-vitrine", name: "Sites vitrines", short: "Site vitrine", devis: "Site vitrine",
    title: "Création de site vitrine au Bénin",
    description: "Site vitrine sur mesure, rapide et pensé pour le téléphone : présentez votre activité, rassurez vos clients et recevez des demandes. Devis gratuit sous 24 h.",
    h1: "Un site vitrine qui inspire confiance et fait venir vos clients.",
    lead: "Vos futurs clients vous cherchent sur Google avant de vous appeler. Nous créons un site rapide, élégant et pensé pour le téléphone, qui présente votre activité, rassure et pousse à l'action : appel, message WhatsApp ou demande de devis.",
    ideal: "Commerces, cabinets, artisans, restaurants, hôtels, PME et associations",
    delay: "1 à 2 semaines dès réception de vos contenus (AD START, AD BUSINESS)",
    included: ["Design sur mesure, à votre image", "Parfait sur téléphone", "Bouton WhatsApp et appel direct", "Référencement Google de base", "Mise en ligne incluse"],
    painsTitle: "Sans site, vos clients vont chez le concurrent.",
    pains: [
      ["Introuvable sur Google", "Quand un client tape votre métier et votre ville, ce sont vos concurrents qui apparaissent, pas vous."],
      ["Une page Facebook qui ne rassure pas", "Pas d'adresse à votre nom, des publications noyées dans le fil, et des concurrents affichés juste à côté."],
      ["Toujours les mêmes questions", "Horaires, tarifs, adresse, services : sans site, vous répondez à la main, encore et encore."],
    ],
    featuresTitle: "Un site complet, prêt à travailler pour vous.",
    features: [
      ["Design sur mesure", "Une identité soignée, à l'image de votre entreprise : aucun modèle recyclé."],
      ["Pensé d'abord pour le téléphone", "La plupart de vos visiteurs arrivent depuis leur téléphone : tout y est lisible, rapide et facile à toucher."],
      ["Contact en un geste", "Boutons WhatsApp et appel, formulaire de contact, plan d'accès Google Maps."],
      ["Référencement Google soigné", "Structure claire, pages rapides, titres et descriptions travaillés pour être trouvé."],
      ["Adresse et e-mails à votre nom", "Votre nom de domaine et des e-mails professionnels, enregistrés à votre nom."],
      ["Rapide et sécurisé", "Certificat HTTPS, hébergement fiable et mise en ligne prise en charge."],
    ],
    useCases: ["Restaurant et traiteur", "Cabinet médical ou juridique", "Hôtel et tourisme", "Artisan et BTP", "École et formation", "Association et ONG", "Portfolio professionnel"],
    proof: ["cs-thalias", "cs-marck"],
    steps: [
      ["Échange", "Votre activité, vos clients, vos objectifs : par WhatsApp, téléphone, visio ou de vive voix."],
      ["Devis sous 24 h", "Pages, fonctions, prix et délai : une proposition claire, sans engagement."],
      ["Design puis développement", "Vous validez la maquette, puis nous construisons le site et vous le montrons au fur et à mesure."],
      ["Mise en ligne", "Tests sur téléphone et ordinateur, mise en ligne à votre nom, et une prise en main expliquée simplement."],
    ],
    price: { label: "Sur devis", note: "Deux formules pour les sites vitrines : AD START (une page) et AD BUSINESS (jusqu'à 5 pages, nom de domaine et e-mails pro pendant 1 an, 1 mois de maintenance offert).", offers: true },
    faq: [
      ["Combien de temps faut-il pour créer mon site ?", "Comptez en général 1 à 2 semaines pour un site AD START ou AD BUSINESS, dès réception de vos contenus (textes, photos, logo). Pour un site plus complet, le délai est fixé dans le devis."],
      ["Je n'ai ni textes ni photos, est-ce un problème ?", "Non. Nous vous aidons à rédiger les textes et pouvons utiliser des images adaptées à votre activité en attendant vos propres photos."],
      ["Mon site apparaîtra-t-il sur Google ?", "Oui. Nous soignons sa structure, sa vitesse, ses titres et ses descriptions, et nous le signalons à Google. La position dépend ensuite de la concurrence et du contenu : nous vous conseillons pour progresser."],
      ["Pourrai-je modifier mon site moi-même ?", "Selon la formule : AD PREMIUM inclut un espace d'administration pour modifier vos contenus. Sinon, les petites modifications sont prises en charge dans le cadre de la maintenance."],
      ["Le nom de domaine sera-t-il à mon nom ?", "Oui. Le nom de domaine, le site et vos contenus vous appartiennent ; tout est précisé dans le contrat."],
    ],
  },
  {
    slug: "e-commerce", name: "E-commerce", short: "Boutique en ligne", devis: "E-commerce",
    title: "Création de boutique en ligne avec paiement Mobile Money",
    description: "Boutique en ligne sur mesure : catalogue, panier, paiement MTN MoMo, Moov Money ou carte, suivi des commandes et espace d'administration. Devis gratuit sous 24 h.",
    h1: "Une boutique en ligne qui vend, même pendant que vous dormez.",
    lead: "Catalogue, panier, paiement Mobile Money ou carte, suivi des commandes : vos clients achètent en quelques gestes depuis leur téléphone, et vous gérez tout depuis un espace d'administration simple.",
    ideal: "Boutiques, marques, restaurants qui livrent et vendeurs sur les réseaux sociaux",
    delay: "Fixé dans le devis, selon le catalogue et les fonctions",
    included: ["Catalogue produits", "Paiement MTN MoMo, Moov Money et carte", "Suivi des commandes", "Espace d'administration", "3 mois de maintenance offerts (AD PREMIUM)"],
    painsTitle: "Vendre par messages vous coûte des ventes.",
    pains: [
      ["Dix messages pour une vente", "Prix, disponibilité, taille, adresse, paiement : chaque commande demande une longue conversation."],
      ["Des commandes qui se perdent", "Entre WhatsApp, les appels et le carnet, des commandes sont oubliées et des clients repartent déçus."],
      ["Pas de paiement à la commande", "Sans paiement immédiat, le client hésite, change d'avis ou ne paie jamais."],
    ],
    featuresTitle: "Tout ce qu'il faut pour vendre en ligne.",
    features: [
      ["Catalogue clair", "Photos, prix, variantes et stocks : vos produits présentés comme en vitrine."],
      ["Commande en quelques gestes", "Panier, choix de la livraison et paiement, sans créer de compte si vous le souhaitez."],
      ["Paiement local et international", "MTN MoMo, Moov Money, FedaPay, KKiaPay, et la carte bancaire via Stripe."],
      ["Suivi des commandes", "Payée, en préparation, livrée : vous et vos clients savez toujours où en est la commande."],
      ["Livraison et retrait", "Zones, frais et créneaux de livraison, ou retrait en boutique."],
      ["Espace d'administration", "Produits, commandes, clients et ventes, gérés depuis votre téléphone ou votre ordinateur."],
    ],
    useCases: ["Mode et accessoires", "Cosmétiques et beauté", "Alimentation et restauration", "Électronique", "Artisanat", "Vendeurs sur Instagram ou Facebook"],
    proof: ["cs-thalias"],
    steps: [
      ["Cadrage", "Vos produits, vos moyens de paiement, votre livraison : nous définissons ensemble la boutique idéale."],
      ["Devis sous 24 h", "Chaque fonction chiffrée, avec le délai et les frais des moyens de paiement retenus."],
      ["Maquettes puis boutique", "Vous validez le parcours d'achat, puis nous développons et vous montrons l'avancement."],
      ["Tests et lancement", "Paiements testés de bout en bout, mise en ligne, et prise en main de l'administration."],
    ],
    price: { label: "Sur devis", note: "Les boutiques en ligne relèvent de la formule AD PREMIUM : le prix dépend du catalogue, des moyens de paiement et de la livraison. 3 mois de maintenance offerts.", offers: true },
    faq: [
      ["Quels moyens de paiement pouvez-vous intégrer ?", "MTN MoMo et Moov Money, ainsi que les agrégateurs FedaPay et KKiaPay, et la carte bancaire via Stripe. Nous vous conseillons la combinaison la plus adaptée à vos clients."],
      ["Y a-t-il des frais sur les paiements ?", "Oui : chaque solution de paiement prélève une commission sur les transactions. Nous vous aidons à choisir la plus adaptée et indiquons ses frais dans le devis."],
      ["Pourrai-je ajouter mes produits moi-même ?", "Oui. L'espace d'administration vous permet d'ajouter, modifier et retirer vos produits, et de suivre vos commandes, sans compétence technique."],
      ["Combien de produits puis-je vendre ?", "Quelques produits ou un grand catalogue : la boutique est dimensionnée dans le devis selon vos besoins."],
      ["Comment se passe la livraison ?", "Nous configurons vos zones, vos frais et vos créneaux de livraison, ou le retrait en boutique. Vous gardez la main sur l'organisation."],
    ],
  },
  {
    slug: "application-web", name: "Applications web", short: "Application web", devis: "Application web",
    title: "Développement d'application web sur mesure",
    description: "Plateforme, espace client, tableau de bord, outil de gestion ou SaaS : application web sur mesure, cadrée avec vous et livrée par étapes. Devis gratuit sous 24 h.",
    h1: "L'outil sur mesure qui fait tourner votre activité.",
    lead: "Plateforme, espace client, tableau de bord, outil de gestion ou SaaS : nous concevons l'application web qui remplace vos fichiers Excel, vos carnets et vos allers-retours sur WhatsApp. Accessible partout, sur ordinateur comme sur téléphone.",
    ideal: "PME, startups, écoles, cliniques, associations et porteurs de projet SaaS",
    delay: "Fixé dans le devis, avec des livraisons par étapes",
    included: ["Atelier de cadrage offert", "Maquettes cliquables avant le code", "Livraisons par étapes", "Code source et données à votre nom"],
    painsTitle: "Vos outils actuels vous ralentissent.",
    pains: [
      ["Tout est éparpillé", "Fichiers Excel, carnets, groupes WhatsApp : personne n'a la même version, et l'information se perd."],
      ["Des heures en tâches répétitives", "Saisies en double, relances, calculs à la main : du temps qui ne sert pas votre activité."],
      ["Aucune vision claire", "Combien de ventes ce mois-ci, quels clients, quels retards ? Les réponses arrivent trop tard."],
    ],
    featuresTitle: "Une application pensée pour votre façon de travailler.",
    features: [
      ["Comptes et rôles", "Administrateurs, équipe, clients : chacun accède à ce qui le concerne, avec des droits précis."],
      ["Tableaux de bord", "Vos indicateurs clés, des graphiques lisibles et des exports en un clic."],
      ["Automatisations", "Notifications, relances et rapports qui partent tout seuls, au bon moment."],
      ["Paiements et abonnements", "Mobile Money, carte bancaire, facturation et abonnements pour les SaaS."],
      ["Connexion à vos outils", "API, e-mail, services de paiement et outils tiers : vos données circulent sans ressaisie."],
      ["Sécurité et sauvegardes", "Accès protégés, HTTPS et sauvegardes régulières de vos données."],
    ],
    useCases: ["Espace client", "Outil de gestion interne", "Plateforme de réservation", "Gestion scolaire", "SaaS par abonnement", "Marketplace"],
    proof: "own",
    steps: [
      ["Atelier de cadrage", "Vos utilisateurs, leurs besoins, les fonctions indispensables : un atelier offert pour poser des bases solides."],
      ["Devis par fonctionnalité", "Chaque fonction chiffrée, des technologies expliquées simplement, un planning de livraison."],
      ["Maquettes cliquables", "Vous testez les écrans avant la première ligne de code, et nous ajustons."],
      ["Développement par étapes", "Une première version utile rapidement, puis des livraisons régulières que vous testez."],
      ["Mise en ligne et suivi", "Hébergement, formation de vos équipes, et un interlocuteur qui reste à vos côtés."],
    ],
    price: { label: "Sur devis", note: "Chaque application est chiffrée fonctionnalité par fonctionnalité, après l'atelier de cadrage. Le paiement est échelonné, étape par étape." },
    faq: [
      ["Pourquoi une application web plutôt qu'un logiciel à installer ?", "Elle fonctionne partout, depuis un navigateur, sur ordinateur comme sur téléphone. Rien à installer, et chaque amélioration est disponible pour tous vos utilisateurs en même temps."],
      ["Qu'est-ce que l'atelier de cadrage ?", "Une séance de travail offerte pour comprendre votre activité, vos utilisateurs et vos priorités. Il permet de chiffrer précisément le projet et d'éviter les mauvaises surprises."],
      ["Peut-on commencer petit ?", "Oui, c'est même ce que nous recommandons : une première version avec l'essentiel, mise en ligne rapidement, puis des évolutions selon les retours de vos utilisateurs."],
      ["Le code et les données m'appartiennent-ils ?", "Oui. Une fois le paiement effectué, l'application, son code source et vos données vous appartiennent. Tout est précisé dans le contrat."],
      ["Quelles technologies utilisez-vous ?", "Celles qui conviennent au projet : React, Next.js, Vue, Node.js, NestJS, Laravel, Django, PostgreSQL… Nous expliquons nos choix dans le devis, en termes simples."],
    ],
  },
  {
    slug: "application-mobile", name: "Applications mobiles", short: "Application mobile", devis: "Application mobile",
    title: "Développement d'application mobile Android et iOS",
    description: "Application mobile Android et iOS, native ou multiplateforme : conception, développement, back-end, paiements et publication sur le Play Store et l'App Store. Devis gratuit.",
    h1: "Votre application, sur le téléphone de vos clients.",
    lead: "Android et iOS, natives ou multiplateformes : nous concevons, développons et publions votre application sur le Play Store et l'App Store, avec le back-end, les paiements et les notifications qui vont avec.",
    ideal: "Entreprises qui veulent fidéliser, services de livraison ou de réservation, startups",
    delay: "Fixé dans le devis, avec des versions de test à chaque étape",
    included: ["Android et iOS", "Publication sur les stores", "Notifications push", "Paiement Mobile Money", "Back-end et administration"],
    painsTitle: "Être sur le téléphone de vos clients change tout.",
    pains: [
      ["Vos clients vous oublient", "Entre deux achats, rien ne les ramène vers vous. Une application reste sur leur écran d'accueil."],
      ["Un site ne suffit pas toujours", "Commandes répétées, suivi en temps réel, géolocalisation, usage hors ligne : certains besoins demandent une application."],
      ["Publier sur les stores est technique", "Comptes développeur, règles d'Apple et de Google, validations : un parcours qui décourage."],
    ],
    featuresTitle: "Une application complète, de l'idée aux stores.",
    features: [
      ["Android et iOS", "Une seule application multiplateforme (Flutter, React Native) ou des applications natives (Kotlin, Swift)."],
      ["Notifications push", "Promotions, statut d'une commande, rappels : vous parlez directement à vos clients."],
      ["Paiements intégrés", "Mobile Money et carte bancaire, directement dans l'application."],
      ["Comptes et historique", "Profil, commandes, favoris : une expérience personnelle pour chaque utilisateur."],
      ["Fonctions du téléphone", "Appareil photo, géolocalisation, mode hors ligne, selon les besoins de votre projet."],
      ["Publication et mises à jour", "Nous publions sur le Play Store et l'App Store, et nous assurons les mises à jour."],
    ],
    useCases: ["Livraison et commande", "Réservation", "Programme de fidélité", "Équipes sur le terrain", "Éducation", "Santé et bien-être"],
    proof: "own",
    steps: [
      ["Cadrage", "Vos utilisateurs, les fonctions indispensables, Android, iOS ou les deux : nous posons les bases ensemble."],
      ["Maquettes cliquables", "Vous testez les écrans sur votre téléphone avant le développement."],
      ["Développement par étapes", "Des versions de test régulières à installer sur votre téléphone pour suivre l'avancement."],
      ["Publication sur les stores", "Préparation des fiches, envoi à Apple et Google, suivi des validations."],
      ["Suivi et mises à jour", "Corrections, évolutions et compatibilité avec les nouvelles versions d'Android et d'iOS."],
    ],
    price: { label: "Sur devis", note: "Chaque application est chiffrée fonctionnalité par fonctionnalité, après un cadrage offert. Le paiement est échelonné, étape par étape." },
    faq: [
      ["Faut-il développer deux applications pour Android et iOS ?", "Pas forcément. Selon le projet, nous développons une seule application multiplateforme (Flutter ou React Native) ou des applications natives (Kotlin, Swift). Nous vous recommandons la meilleure option dans le devis."],
      ["Qui s'occupe de la publication sur les stores ?", "Nous. Les comptes développeur Google Play et Apple sont créés à votre nom, et nous vous guidons pour les ouvrir ; leurs frais d'inscription sont à votre charge."],
      ["Ai-je aussi besoin d'un back-office ?", "Le plus souvent oui : nous livrons l'espace d'administration qui permet de gérer les contenus, les utilisateurs et les commandes de l'application."],
      ["Pourrai-je tester l'application avant sa sortie ?", "Oui. À chaque étape, vous installez une version de test sur votre téléphone et vous nous faites vos retours."],
      ["Le code et les données m'appartiennent-ils ?", "Oui. Une fois le paiement effectué, l'application, son code source et vos données vous appartiennent. Tout est précisé dans le contrat."],
    ],
  },
  {
    slug: "ui-ux-design", name: "UI / UX design", short: "UI / UX design", devis: "UI / UX design",
    title: "UI / UX design : maquettes et prototypes cliquables",
    description: "Maquettes et prototypes cliquables pour votre site ou votre application : testez et validez chaque écran avant le développement. Devis gratuit sous 24 h.",
    h1: "Testez votre projet avant d'écrire une ligne de code.",
    lead: "Maquettes et prototypes cliquables : vous voyez, touchez et validez chaque écran de votre site ou de votre application avant le développement. Moins de mauvaises surprises, moins de retouches, et un produit que vos utilisateurs comprennent tout de suite.",
    ideal: "Porteurs de projet, startups, entreprises qui refondent leur site ou leur application",
    delay: "Fixé dans le devis, selon le nombre d'écrans",
    included: ["Parcours utilisateurs", "Maquettes de chaque écran", "Prototype cliquable", "Charte de l'interface", "Fichiers prêts pour le développement"],
    painsTitle: "Corriger un écran coûte moins cher avant le code.",
    pains: [
      ["Des problèmes découverts trop tard", "Une fois l'application développée, chaque changement coûte du temps et de l'argent."],
      ["Des utilisateurs perdus", "Un bouton introuvable, un parcours trop long : l'utilisateur abandonne et ne revient pas."],
      ["Une idée difficile à expliquer", "À un associé, un investisseur ou une équipe, rien ne vaut un prototype qu'on peut toucher."],
    ],
    featuresTitle: "Du parcours au prototype, chaque écran pensé pour vos utilisateurs.",
    features: [
      ["Parcours utilisateurs", "Qui sont vos utilisateurs, ce qu'ils veulent faire, et le chemin le plus court pour y arriver."],
      ["Maquettes filaires", "La structure de chaque écran, validée avant de passer aux couleurs."],
      ["Design d'interface", "Couleurs, typographie, icônes et composants, à votre image."],
      ["Prototype cliquable", "Un prototype qui se parcourt comme une vraie application, sur téléphone et ordinateur."],
      ["Retours et ajustements", "Vous testez, vous faites tester autour de vous, et nous ajustons."],
      ["Prêt pour le développement", "Des fichiers organisés et des composants réutilisables, pour un développement fidèle et rapide."],
    ],
    useCases: ["Nouvelle application", "Refonte de site", "Présentation à des investisseurs", "Première version d'un produit", "Tableau de bord complexe"],
    proof: "method",
    steps: [
      ["Atelier", "Vos objectifs, vos utilisateurs, vos contraintes : nous posons les bases du parcours."],
      ["Maquettes filaires", "La structure des écrans, discutée et validée avec vous."],
      ["Design", "L'interface finale, à votre image, écran par écran."],
      ["Prototype et retours", "Vous testez le prototype cliquable, nous ajustons jusqu'à validation."],
    ],
    price: { label: "Sur devis", note: "Le design peut être commandé seul, ou intégré à la création de votre site ou de votre application. Le prix dépend du nombre d'écrans et de parcours." },
    faq: [
      ["Puis-je commander seulement le design ?", "Oui. Vous recevez les maquettes et le prototype, que vous pouvez faire développer par nous ou par une autre équipe."],
      ["Quelle différence entre UI et UX ?", "L'UX (expérience utilisateur), c'est le parcours : ce que l'utilisateur fait et dans quel ordre. L'UI (interface), c'est l'apparence : couleurs, typographie, boutons. Nous travaillons les deux."],
      ["Quels outils utilisez-vous ?", "Nous travaillons sur Figma, qui permet de partager les maquettes et le prototype avec vous en ligne, sans rien installer."],
      ["Les fichiers de design me sont-ils remis ?", "Oui, les fichiers de design vous sont remis à la fin du projet. Tout est précisé dans le contrat."],
    ],
  },
  {
    slug: "api-integrations", name: "API et intégrations", short: "API et intégrations", devis: "API et intégrations",
    title: "API, back-end et intégration des paiements Mobile Money",
    description: "Back-end, bases de données et API sur mesure ; intégration de MTN MoMo, Moov Money, FedaPay, KKiaPay et Stripe ; connexion de vos outils. Devis gratuit sous 24 h.",
    h1: "Vos outils et vos paiements, enfin connectés.",
    lead: "Back-end robuste, bases de données et API : nous connectons votre site, votre application et vos outils entre eux, et aux paiements MTN MoMo, Moov Money, FedaPay, KKiaPay et Stripe. Les données circulent toutes seules, sans ressaisie.",
    ideal: "Entreprises qui ont déjà un site ou une application, startups, équipes techniques",
    delay: "Fixé dans le devis, après étude de l'existant",
    included: ["Paiements Mobile Money et carte", "API sur mesure", "Connexion à vos outils", "Documentation", "Sécurité des échanges"],
    painsTitle: "Quand vos outils ne se parlent pas, c'est vous qui faites le lien.",
    pains: [
      ["Des ressaisies sans fin", "La même information tapée dans trois outils, avec le risque d'erreur à chaque fois."],
      ["Des paiements vérifiés à la main", "Captures d'écran de transferts, rapprochements en fin de journée : du temps perdu et des oublis."],
      ["Un projet bloqué par le back-end", "Votre application mobile ou votre site attend un serveur, une base de données et une API fiables."],
    ],
    featuresTitle: "Un back-end solide et des intégrations qui fonctionnent.",
    features: [
      ["Intégration des paiements", "MTN MoMo, Moov Money, FedaPay, KKiaPay, Stripe : paiement confirmé automatiquement, sans vérification manuelle."],
      ["API sur mesure", "Une API claire pour votre application mobile, votre site ou vos partenaires."],
      ["Bases de données", "PostgreSQL ou MongoDB, avec une structure propre, pensée pour durer."],
      ["Connexion de vos outils", "E-mail, messagerie, tableurs, logiciels de gestion : vos outils échangent leurs données."],
      ["Automatisations", "Synchronisations, notifications et tâches programmées, sans intervention."],
      ["Sécurité et documentation", "Accès authentifiés, échanges chiffrés, et une documentation pour votre équipe."],
    ],
    useCases: ["Paiement MoMo sur un site existant", "Back-end d'application mobile", "Synchronisation des stocks", "Export comptable", "API pour vos partenaires"],
    proof: "method",
    steps: [
      ["Étude de l'existant", "Vos outils, vos données et ce qui doit circuler : nous regardons ce qui est en place."],
      ["Devis", "Les intégrations chiffrées, avec les frais éventuels des services tiers."],
      ["Développement et tests", "Tout est d'abord testé dans un environnement d'essai, sans toucher à vos vraies données."],
      ["Mise en production et suivi", "Mise en service, documentation, et un œil sur le bon fonctionnement."],
    ],
    price: { label: "Sur devis", note: "Le prix dépend du nombre d'intégrations et de leur complexité. Les éventuels frais des services tiers (commissions de paiement, abonnements) sont indiqués dans le devis." },
    faq: [
      ["Pouvez-vous ajouter le paiement Mobile Money à mon site existant ?", "Le plus souvent oui, selon la technologie de votre site. Nous l'étudions gratuitement lors du premier échange."],
      ["Quelle solution de paiement choisir ?", "Cela dépend de vos clients, de vos volumes et des pays visés. Nous comparons pour vous FedaPay, KKiaPay, les API des opérateurs et Stripe, frais compris."],
      ["Mes données sont-elles en sécurité ?", "Les échanges sont chiffrés, les accès authentifiés, et nous testons d'abord dans un environnement d'essai. Vos données restent à vous."],
      ["Mon équipe pourra-t-elle reprendre le code ?", "Oui. Nous livrons une documentation de l'API et un code propre, que votre équipe ou un autre prestataire peut reprendre."],
    ],
  },
  {
    slug: "hebergement", name: "Hébergement et DevOps", short: "Hébergement", devis: "Hébergement",
    title: "Hébergement, nom de domaine et e-mails professionnels",
    description: "Nom de domaine à votre nom, e-mails professionnels, serveurs, HTTPS, déploiement automatique et sauvegardes : votre site toujours en ligne. Devis gratuit sous 24 h.",
    h1: "Un site toujours en ligne, rapide et sécurisé.",
    lead: "Nom de domaine, e-mails professionnels, serveurs, HTTPS, déploiement automatique et sauvegardes : nous nous occupons de toute la partie technique, et tout est enregistré à votre nom.",
    ideal: "Toute entreprise qui a, ou prépare, un site ou une application",
    delay: "Mise en place rapide, précisée dans le devis",
    included: ["Nom de domaine à votre nom", "E-mails professionnels", "Certificat HTTPS", "Sauvegardes régulières", "Déploiement automatique"],
    painsTitle: "La partie invisible d'un site fait toute la différence.",
    pains: [
      ["Un site qui tombe sans prévenir", "Un hébergement fragile, et ce sont vos clients qui tombent sur une page d'erreur."],
      ["Des e-mails en @gmail.com", "Une adresse personnelle pour une entreprise, ça ne rassure ni vos clients ni vos partenaires."],
      ["Un domaine au nom du prestataire", "Le jour où vous voulez changer, vous risquez de perdre votre propre adresse web."],
    ],
    featuresTitle: "Toute la technique, prise en charge et à votre nom.",
    features: [
      ["Nom de domaine", "Votre adresse web (.bj, .com…), enregistrée à votre nom et renouvelée à temps."],
      ["E-mails professionnels", "Des adresses à votre nom de domaine pour vous et votre équipe."],
      ["Hébergement adapté", "De l'hébergement simple au serveur cloud (Docker, AWS), selon votre trafic et votre budget."],
      ["HTTPS et sécurité", "Certificat HTTPS, mises à jour du serveur et accès protégés."],
      ["Déploiement automatique", "Chaque mise à jour du site est publiée proprement, sans coupure inutile."],
      ["Sauvegardes", "Des sauvegardes régulières pour repartir vite en cas de problème."],
    ],
    useCases: ["Nouveau site", "Changement d'hébergeur", "Récupérer son nom de domaine", "E-mails pro pour l'équipe", "Application à fort trafic"],
    proof: "method",
    steps: [
      ["État des lieux", "Ce que vous avez déjà, ce dont vous avez besoin, et ce qui doit changer."],
      ["Proposition", "L'hébergement, le domaine et les e-mails adaptés, avec leurs coûts annuels."],
      ["Mise en place ou migration", "Installation, ou transfert préparé pour limiter toute interruption."],
      ["Remise des accès et suivi", "Vous recevez vos accès ; nous veillons au renouvellement et aux sauvegardes."],
    ],
    price: { label: "Sur devis", note: "Le coût dépend de l'hébergement, du nom de domaine et du nombre d'adresses e-mail. La formule AD BUSINESS inclut le nom de domaine et les e-mails pro pendant 1 an.", offers: true },
    faq: [
      ["Le nom de domaine sera-t-il à mon nom ?", "Oui, toujours. Le nom de domaine est enregistré à votre nom : il vous appartient, quel que soit votre prestataire."],
      ["Pouvez-vous transférer mon site existant ?", "Oui. Nous préparons la migration de votre site, de votre domaine et de vos e-mails pour limiter toute interruption."],
      ["Puis-je garder mon hébergeur actuel ?", "Oui, s'il convient à votre projet. Nous pouvons déployer votre site chez votre hébergeur actuel."],
      ["Que se passe-t-il si mon site ne répond plus ?", "Avec la maintenance, vous bénéficiez d'une assistance prioritaire sur WhatsApp, et nos sauvegardes permettent de remettre le site en ligne rapidement."],
    ],
  },
  {
    slug: "maintenance", name: "Maintenance et évolution", short: "Maintenance", devis: "Maintenance",
    title: "Maintenance de site web et d'application",
    description: "Sauvegardes, mises à jour de sécurité, petites modifications et assistance prioritaire sur WhatsApp : votre site ou votre application entre de bonnes mains.",
    h1: "Votre site entre de bonnes mains, après le lancement aussi.",
    lead: "Sauvegardes, mises à jour de sécurité, petites modifications et assistance prioritaire sur WhatsApp : vous vous concentrez sur votre activité, nous veillons sur votre site ou votre application.",
    ideal: "Sites et applications en ligne, réalisés par nous ou par une autre équipe",
    delay: "Prise en main rapide, dès l'accord",
    included: ["Sauvegardes régulières", "Mises à jour de sécurité", "Petites modifications incluses", "Assistance prioritaire sur WhatsApp"],
    painsTitle: "Un site sans entretien finit par coûter cher.",
    pains: [
      ["Un site laissé à l'abandon", "Extensions dépassées, failles de sécurité : un site sans mises à jour devient une cible."],
      ["Personne à appeler", "Quand quelque chose ne fonctionne plus, vous ne savez pas à qui vous adresser."],
      ["Des modifications qui traînent", "Changer un prix ou une photo ne devrait pas prendre des semaines."],
    ],
    featuresTitle: "Un interlocuteur qui veille sur votre site, au quotidien.",
    features: [
      ["Sauvegardes régulières", "Votre site et vos données sauvegardés, pour repartir vite en cas de problème."],
      ["Mises à jour de sécurité", "Le site, ses composants et le serveur tenus à jour."],
      ["Petites modifications incluses", "Un texte, une photo, un prix, un horaire : c'est fait, sans devis à chaque fois."],
      ["Assistance prioritaire", "Un interlocuteur joignable sur WhatsApp, qui connaît votre site."],
      ["Corrections", "Un bug, un affichage cassé : nous corrigeons."],
      ["Évolutions", "Nouvelles fonctionnalités chiffrées à part, avec votre accord, quand votre activité grandit."],
    ],
    useCases: ["Site réalisé par AD SOLUTIONS", "Site existant fait ailleurs", "Boutique en ligne", "Application web ou mobile"],
    proof: "method",
    steps: [
      ["Audit de l'existant", "Nous vérifions gratuitement l'état de votre site : sécurité, vitesse, mises à jour."],
      ["Proposition mensuelle", "Ce qui est inclus, le prix par mois, sans surprise."],
      ["Prise en main", "Accès, première sauvegarde complète et mises à jour en retard."],
      ["Suivi au quotidien", "Sauvegardes, mises à jour et modifications, et un interlocuteur sur WhatsApp."],
    ],
    price: { label: "Sur devis", unit: "par mois", note: "Le prix mensuel dépend de la taille du site ou de l'application. La maintenance est offerte 1 mois avec AD BUSINESS et 3 mois avec AD PREMIUM.", offers: true },
    faq: [
      ["Reprenez-vous un site réalisé par une autre agence ?", "Oui, après un audit gratuit qui nous permet de vérifier son état et de vous dire honnêtement ce qu'il faut corriger."],
      ["Qu'est-ce qu'une petite modification ?", "Changer un texte, une photo, un prix ou un horaire, ajouter une actualité… Les nouvelles fonctionnalités sont chiffrées à part, avec votre accord."],
      ["Comment vous joindre en cas de problème ?", "Sur WhatsApp, en priorité. Vous avez un interlocuteur qui connaît votre site."],
      ["La maintenance est-elle incluse avec un nouveau site ?", "Oui, en partie : 1 mois offert avec AD BUSINESS et 3 mois avec AD PREMIUM. Ensuite, vous choisissez de continuer ou non."],
    ],
  },
];

// ---------- Blocs ----------
const sectionHead = (badge, title, intro, center = false) => `
        <div class="${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}">
          <span class="kt-badge kt-badge-outline kt-badge-primary rounded-full" data-scramble>${fr(badge)}</span>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight text-mono sm:text-4xl" data-words>${fr(title)}</h2>
          ${intro ? `<p class="mt-4 text-muted-foreground" data-reveal>${fr(intro)}</p>` : ""}
        </div>`;
const ctaButtons = (s, big = true) => `
            <button type="button" class="kt-btn kt-btn-primary ${big ? "kt-btn-lg " : ""}shimmer shadow-lg shadow-primary/25" data-kt-modal-toggle="#devis" data-devis-type="${esc(s.devis)}" data-magnet>Recevoir mon devis gratuit ${ARROW}</button>
            <a href="#" class="kt-btn kt-btn-outline ${big ? "kt-btn-lg " : ""}bg-background/70 backdrop-blur" data-wa-msg="${esc(`Bonjour AD SOLUTIONS, je souhaite des informations sur votre offre « ${s.name} ».`)}" target="_blank" rel="noopener" data-magnet>${WA}Discuter sur WhatsApp</a>`;
const REASSURE = '<p class="mt-4 text-sm text-muted-foreground" data-reveal>Devis détaillé sous 24&nbsp;h · Gratuit et sans engagement · Solde payé à la livraison</p>';

const CASES = {
  "cs-thalias": { name: "Thalia's Traiteur", url: "https://thaliastraiteur.com/", host: "thaliastraiteur.com", tags: ["Site web", "Traiteur", "Québec, Canada"], text: "Un traiteur ivoirien installé au Québec : menu, mariages et événements, commande, livraison, avis et WhatsApp. Un projet mené entièrement à distance." },
  "cs-marck": { name: "Marck-Land", url: "https://marckland.com/", host: "marckland.com", tags: ["Site web", "Portfolio"], text: "Un portfolio pour présenter un parcours, des compétences et des projets, avec un moyen simple d'entrer en contact." },
};
function proofBlock(s) {
  if (Array.isArray(s.proof)) {
    return `<div class="grid gap-4">${s.proof.map((id) => { const c = CASES[id]; return `
            <article class="kt-card magic" data-reveal><div class="kt-card-content flex flex-col gap-3 p-6">
              <div class="flex flex-wrap gap-1.5">${c.tags.map((t) => `<span class="kt-badge kt-badge-sm kt-badge-outline">${fr(t)}</span>`).join("")}</div>
              <h3 class="text-lg font-semibold text-mono">${fr(c.name)}</h3>
              <p class="text-sm text-muted-foreground">${fr(c.text)}</p>
              <div class="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <button type="button" class="kt-link kt-link-underlined" data-kt-drawer-toggle="#${id}">Lire l'étude de cas</button>
                <a href="${c.url}" target="_blank" rel="noopener" class="kt-link">${esc(c.host)} ↗</a>
              </div>
            </div></article>`; }).join("")}
          </div>`;
  }
  const own = s.proof === "own";
  return `<article class="kt-card magic" data-reveal><div class="kt-card-content flex flex-col gap-3 p-6">
            <span class="kt-badge kt-badge-sm kt-badge-primary kt-badge-outline self-start">${own ? "Nos propres produits" : "Notre méthode"}</span>
            <h3 class="text-lg font-semibold text-mono">${own ? "Nous construisons aussi pour nous-mêmes." : "Chaque projet AD SOLUTIONS passe par là."}</h3>
            <p class="text-sm text-muted-foreground">${own
              ? fr("AD SOLUTIONS développe ses propres plateformes, web et mobiles : une solution de logement et une solution de gestion scolaire. Les mêmes exigences s'appliquent à votre projet.")
              : fr("Échange, devis clair, maquettes validées, livraisons testées, suivi après le lancement : une méthode éprouvée sur nos réalisations.")}</p>
            <a href="../index.html#${own ? "bientot" : "methode"}" class="kt-link kt-link-underlined self-start text-sm">${own ? "Découvrir nos projets en cours" : "Voir notre méthode en 5 étapes"}</a>
          </div></article>`;
}

function faqBlock(s) {
  return s.faq.map(([q, a], i) => `
          <div class="kt-accordion-item magic bg-card" data-kt-accordion-item="true"><button type="button" class="kt-accordion-toggle" id="sq-t${i + 1}" aria-controls="sq-c${i + 1}" data-kt-accordion-toggle="#sq-c${i + 1}"><span class="kt-accordion-title">${fr(q)}</span><span class="kt-accordion-indicator" aria-hidden="true"></span></button><div class="kt-accordion-content hidden" id="sq-c${i + 1}" aria-labelledby="sq-t${i + 1}"><div class="kt-accordion-wrapper text-muted-foreground">${fr(a)}</div></div></div>`).join("");
}

function jsonLd(s) {
  const data = [
    { "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.title, description: s.description,
      provider: { "@type": "Organization", name: "AD SOLUTIONS", address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" } },
      areaServed: ["Bénin", "International"] },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: s.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function page(s) {
  const others = SERVICES.filter((o) => o !== s);
  return `${HEAD}  <title>${esc(s.title)} | AD SOLUTIONS</title>
  <meta name="description" content="${esc(s.description)}">
  <meta property="og:title" content="${esc(s.title)} | AD SOLUTIONS">
  <meta property="og:description" content="${esc(s.description)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="../assets/img/thalias-traiteur.jpg">
  ${jsonLd(s)}
</head>
${CHROME_TOP}
${MAIN_DECOR}

    <!-- ================================================================
         ${s.name.toUpperCase()} — page générée par scripts/build-services.mjs (ne pas modifier à la main)
         ================================================================ -->
    <section id="top" data-label="${esc(s.name)}" class="relative pb-20 pt-10 sm:pt-14">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">
        <nav aria-label="Fil d'Ariane" class="text-sm text-muted-foreground" data-reveal>
          <ol class="flex flex-wrap items-center gap-1.5">
            <li><a href="../index.html" class="hover:text-foreground">Accueil</a></li><li aria-hidden="true">/</li>
            <li><a href="../index.html#services" class="hover:text-foreground">Services</a></li><li aria-hidden="true">/</li>
            <li class="font-medium text-mono" aria-current="page">${fr(s.name)}</li>
          </ol>
        </nav>
        <div class="mt-10 grid items-start gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span class="kt-badge kt-badge-outline kt-badge-primary rounded-full" data-scramble>${fr(s.name)}</span>
            <h1 class="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-mono sm:text-5xl xl:text-[3.6rem]" data-words>${fr(s.h1)}</h1>
            <p class="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg" data-reveal>${fr(s.lead)}</p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row" data-reveal>${ctaButtons(s)}
            </div>
            ${REASSURE}
          </div>
          <aside class="kt-card beam" data-reveal="scale" aria-label="En bref"><div class="kt-card-content flex flex-col gap-5 p-7">
            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">En bref</p>
            <dl class="grid gap-4 text-sm">
              <div><dt class="text-muted-foreground">Idéal pour</dt><dd class="mt-1 font-medium text-mono">${fr(s.ideal)}</dd></div>
              <div><dt class="text-muted-foreground">Délai</dt><dd class="mt-1 font-medium text-mono">${fr(s.delay)}</dd></div>
              <div><dt class="text-muted-foreground">Prix</dt><dd class="mt-1 text-2xl font-semibold tracking-tight text-mono">${fr(s.price.label)}${s.price.unit ? ` <span class="text-sm font-normal text-muted-foreground">${fr(s.price.unit)}</span>` : ""}</dd></div>
            </dl>
            <div class="kt-separator"></div>
            <ul class="space-y-2.5 text-sm text-secondary-foreground">${s.included.map((t) => `<li class="flex gap-2">${CHECK}<span>${fr(t)}</span></li>`).join("")}</ul>
          </div></aside>
        </div>
      </div>
    </section>

    <section id="constat" data-label="Le constat" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">${sectionHead("Le constat", s.painsTitle, "")}
        <div class="mt-12 grid gap-5 md:grid-cols-3">${s.pains.map(([t, d]) => `
          <article class="kt-card magic" data-reveal><div class="kt-card-content flex flex-col gap-3 p-6">
            <span class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">${ALERT}</span>
            <h3 class="mt-2 font-semibold text-mono">${fr(t)}</h3>
            <p class="text-sm text-muted-foreground">${fr(d)}</p>
          </div></article>`).join("")}
        </div>
      </div>
    </section>

    <section id="solution" data-label="Ce que nous livrons" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">${sectionHead("Ce que nous livrons", s.featuresTitle, "Une seule équipe s'occupe de tout, du design à la mise en ligne. Vous n'avez qu'un interlocuteur, joignable sur WhatsApp.")}
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${s.features.map(([t, d], i) => `
          <article class="kt-card magic" data-reveal><div class="kt-card-content flex flex-col gap-2 p-6">
            <span class="kt-badge kt-badge-sm kt-badge-primary kt-badge-outline self-start">${pad(i + 1)}</span>
            <h3 class="mt-2 font-semibold text-mono">${fr(t)}</h3>
            <p class="text-sm text-muted-foreground">${fr(d)}</p>
          </div></article>`).join("")}
        </div>
        <div class="mt-10 flex flex-col gap-3 sm:flex-row" data-reveal>${ctaButtons(s, false)}
        </div>
      </div>
    </section>

    <section id="pour-qui" data-label="Pour qui" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div>${sectionHead("Pour qui", "Pensé pour votre activité.", `${s.short} : quelques exemples de projets que nous accompagnons. Le vôtre n'y est pas ? Parlons-en.`)}
          <ul class="mt-8 flex flex-wrap gap-2" data-reveal>${s.useCases.map((u) => `<li class="kt-badge kt-badge-lg kt-badge-outline rounded-full">${fr(u)}</li>`).join("")}</ul>
        </div>
        ${proofBlock(s)}
      </div>
    </section>

    <section id="deroulement" data-label="Déroulement" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">${sectionHead("Déroulement", "Comment ça se passe.", "À chaque étape, vous savez où en est votre projet et ce que vous payez. Le premier échange est gratuit.")}
        <ol class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-${s.steps.length}">${s.steps.map(([t, d], i) => `
          <li class="kt-card magic" data-reveal><div class="kt-card-content flex flex-col gap-2 p-6">
            <span class="text-4xl font-semibold tracking-tight text-primary">${i + 1}</span>
            <h3 class="mt-2 font-semibold text-mono">${fr(t)}</h3>
            <p class="text-sm text-muted-foreground">${fr(d)}</p>
          </div></li>`).join("")}
        </ol>
      </div>
    </section>

    <section id="tarif" data-label="Tarif" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">
        <article class="kt-card beam mx-auto max-w-4xl" data-reveal="scale"><div class="kt-card-content grid items-center gap-8 p-8 sm:p-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <span class="kt-badge kt-badge-outline kt-badge-primary">Tarif</span>
            <h2 class="mt-3 text-2xl font-semibold text-mono sm:text-3xl">${fr("Un prix clair, fixé avant de commencer.")}</h2>
            <p class="mt-3 text-muted-foreground">${fr(s.price.note)}</p>
            <ul class="mt-5 space-y-2.5 text-sm text-secondary-foreground">
              <li class="flex gap-2">${CHECK}<span>${fr("Devis détaillé et gratuit sous 24 h, sans engagement")}</span></li>
              <li class="flex gap-2">${CHECK}<span>${fr("Acompte au lancement, solde payé seulement à la livraison")}</span></li>
              <li class="flex gap-2">${CHECK}<span>${fr("Mobile Money et virement acceptés, facture remise")}</span></li>
            </ul>
          </div>
          <div class="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-6">
            <span class="text-xs text-muted-foreground">Prix</span>
            <span class="text-4xl font-semibold tracking-tight text-mono">${fr(s.price.label)}${s.price.unit ? ` <span class="text-base font-normal text-muted-foreground">${fr(s.price.unit)}</span>` : ""}</span>
            <button type="button" class="kt-btn kt-btn-primary shimmer mt-2 w-full justify-center" data-kt-modal-toggle="#devis" data-devis-type="${esc(s.devis)}">Recevoir mon devis gratuit</button>
            ${s.price.offers ? `<a href="../index.html#offres" class="kt-link kt-link-underlined self-center text-sm">Comparer les formules</a>` : ""}
          </div>
        </div></article>
      </div>
    </section>

    <section id="questions" data-label="Questions" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div class="lg:sticky lg:top-28">${sectionHead("Questions fréquentes", "Vous vous demandez peut‑être…", "")}
          <p class="wa-only mt-4 text-muted-foreground" data-reveal>Une autre question&nbsp;? <a href="#" class="kt-link" data-wa target="_blank" rel="noopener">Écrivez-nous sur WhatsApp</a>, on répond vite.</p>
        </div>
        <div class="kt-accordion kt-accordion-outline" data-kt-accordion="true" data-reveal>${faqBlock(s)}
        </div>
      </div>
    </section>

    <section id="demarrer" data-label="Démarrer" class="relative py-24 sm:py-32">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-3xl px-5 text-center lg:px-8">
        <span class="kt-badge kt-badge-outline kt-badge-primary rounded-full" data-scramble>Démarrer</span>
        <h2 class="mt-4 text-4xl font-semibold tracking-tight text-mono sm:text-5xl" data-words>${fr("Prêt à lancer votre projet ?")}</h2>
        <p class="mx-auto mt-5 max-w-xl text-muted-foreground" data-reveal>${fr("Décrivez votre projet en 3 clics : vous recevez un devis détaillé sous 24 h, gratuit et sans engagement.")}<span class="wa-only"> ${fr("Vous préférez parler ? Écrivez-nous sur WhatsApp.")}</span></p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row" data-reveal>${ctaButtons(s)}
        </div>
      </div>
    </section>

    <section id="autres-services" data-label="Nos autres services" class="relative py-20 sm:py-24">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">${sectionHead("Nos autres services", "Une seule équipe, du premier écran au dernier serveur.", "")}
        <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">${others.map((o) => `
          <a href="${o.slug}.html" class="kt-card magic group" data-reveal><div class="kt-card-content flex items-center justify-between gap-3 p-5">
            <span class="font-medium text-mono">${fr(o.name)}</span>
            <span class="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary [&>svg]:size-4">${ARROW}</span>
          </div></a>`).join("")}
        </div>
      </div>
    </section>
${CHROME_BOTTOM}`;
}

export function buildServices() {
  mkdirSync(OUT, { recursive: true });
  for (const s of SERVICES) {
    writeFileSync(join(OUT, `${s.slug}.html`), page(s));
    console.log(`écrit : services/${s.slug}.html`);
  }
}
// Réutilisé par scripts/build-pages.mjs (pages Réalisations, Méthode, Offres, À propos, FAQ)
export { SERVICES, esc, fr, ARROW, CHECK, WA, sectionHead };

// Lancé directement : node scripts/build-services.mjs
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) buildServices();

