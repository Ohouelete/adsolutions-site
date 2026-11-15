/* ============================================================
   AD SOLUTIONS — génération des pages du menu (realisations, methode, offres, a-propos, faq)
   et des pages de services (services/*.html, via build-services.mjs).
   Usage : node scripts/build-pages.mjs   (ou npm run pages)

   Les sections sont reprises telles quelles depuis index.html (même balisage, mêmes animations) puis enrichies :
   modifiez index.html, relancez ce script, les pages suivent. Ne modifiez pas les pages générées à la main.
   ============================================================ */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildServices, SERVICES, esc, fr, ARROW, CHECK, WA, sectionHead } from "./build-services.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = readFileSync(join(ROOT, "index.html"), "utf8");
const indexIds = [...INDEX.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);

// ---------- Extraction depuis index.html ----------
function section(id) {
  const a = INDEX.indexOf(`<section id="${id}"`);
  if (a < 0) throw new Error(`Section introuvable dans index.html : ${id}`);
  const b = INDEX.indexOf("</section>", a) + "</section>".length;
  return "    " + INDEX.slice(a, b);
}
function caseStudy(id) {
  const a = INDEX.indexOf(`id="${id}"`);
  const c0 = INDEX.indexOf('<div data-lenis-prevent class="kt-drawer-content', a);
  const c1 = INDEX.indexOf('">', c0) + 2; // fin de la balise ouvrante (la classe contient « [&>*] »)
  const f0 = INDEX.indexOf('<div class="kt-drawer-footer">', c1);
  const body = INDEX.slice(c1, INDEX.lastIndexOf("</div>", f0)).trim();
  const site = (INDEX.slice(f0, INDEX.indexOf("</div>", f0)).match(/<a href="(https?:[^"]+)"/) || [])[1];
  return { body, site };
}
function modalBody(id) {
  const a = INDEX.indexOf(`id="${id}"`);
  const b0 = INDEX.indexOf('class="kt-modal-body', a);
  const b1 = INDEX.indexOf('">', b0) + 2;
  return INDEX.slice(b1, INDEX.indexOf("\n      </div>", b1)).trim();
}
const legalPage = (id) => `
    <section id="texte" data-label="Texte" class="relative py-16 sm:py-20">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-3xl px-5 lg:px-8">
        <article class="kt-card" data-reveal><div class="kt-card-content space-y-3 p-7 text-muted-foreground sm:p-10 [&_h4]:mt-6 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-mono">
          ${modalBody(id)}
        </div></article>
      </div>
    </section>`;
// Ancres vers une section absente de la page → accueil
const rebase = (html, local) => html.replace(/\bhref="#([a-z0-9-]+)"/g, (m, id) => (indexIds.includes(id) && !local.includes(id) ? `href="index.html#${id}"` : m));

const [hs, he] = [INDEX.indexOf("<!DOCTYPE html>"), INDEX.indexOf("</head>")];
const HEAD = INDEX.slice(hs, he)
  .replace(/<title>[\s\S]*?<\/title>\s*/, "")
  .replace(/\s*<meta name="description"[^>]*>/, "")
  .replace(/\s*<meta property="og:[^>]*>/g, "");
const bs = INDEX.indexOf("<body>"), mainOpen = INDEX.indexOf("<main", bs), mainOpenEnd = INDEX.indexOf(">", mainOpen) + 1;
const firstSection = INDEX.indexOf("    <!-- ====", mainOpenEnd);
const TOP = INDEX.slice(bs, mainOpenEnd), DECOR = INDEX.slice(mainOpenEnd, firstSection).trimEnd();
const BOTTOM = INDEX.slice(INDEX.indexOf("</main>"));

// ---------- Blocs communs ----------
const hero = (p) => `
    <!-- ================================================================
         ${p.name.toUpperCase()} — page générée par scripts/build-pages.mjs (ne pas modifier à la main)
         ================================================================ -->
    <section id="haut" data-label="${esc(p.name)}" class="relative pb-12 pt-10 sm:pt-14">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">
        <nav aria-label="Fil d'Ariane" class="text-sm text-muted-foreground" data-reveal>
          <ol class="flex flex-wrap items-center gap-1.5"><li><a href="index.html" class="hover:text-foreground">Accueil</a></li><li aria-hidden="true">/</li><li class="font-medium text-mono" aria-current="page">${fr(p.name)}</li></ol>
        </nav>
        <div class="mt-10 max-w-3xl">
          <span class="kt-badge kt-badge-outline kt-badge-primary rounded-full" data-scramble>${fr(p.name)}</span>
          <h1 class="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-mono sm:text-5xl xl:text-[3.6rem]" data-words>${fr(p.h1)}</h1>
          <p class="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg" data-reveal>${fr(p.lead)}</p>
          ${p.noHeroCta ? "" : `<div class="mt-8 flex flex-col gap-3 sm:flex-row" data-reveal>
            <button type="button" class="kt-btn kt-btn-primary kt-btn-lg shimmer shadow-lg shadow-primary/25" data-kt-modal-toggle="#devis" data-magnet>Recevoir mon devis gratuit ${ARROW}</button>
            ${p.secondary ? `<a href="${p.secondary[1]}" class="kt-btn kt-btn-outline kt-btn-lg bg-background/70 backdrop-blur" data-magnet>${fr(p.secondary[0])}</a>` : ""}
          </div>
          <p class="mt-4 text-sm text-muted-foreground" data-reveal>Devis détaillé sous 24&nbsp;h · Gratuit et sans engagement · Solde payé à la livraison</p>`}
        </div>
      </div>
    </section>`;

const cta = (title = "Prêt à lancer votre projet ?") => `
    <section id="demarrer" data-label="Démarrer" class="relative py-24 sm:py-32">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-3xl px-5 text-center lg:px-8">
        <span class="kt-badge kt-badge-outline kt-badge-primary rounded-full" data-scramble>Démarrer</span>
        <h2 class="mt-4 text-4xl font-semibold tracking-tight text-mono sm:text-5xl" data-words>${fr(title)}</h2>
        <p class="mx-auto mt-5 max-w-xl text-muted-foreground" data-reveal>${fr("Décrivez votre projet en 3 clics : vous recevez un devis détaillé sous 24 h, gratuit et sans engagement.")}<span class="wa-only"> ${fr("Vous préférez parler ? Écrivez-nous sur WhatsApp.")}</span></p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row" data-reveal>
          <button type="button" class="kt-btn kt-btn-primary kt-btn-lg shimmer shadow-lg shadow-primary/25" data-kt-modal-toggle="#devis" data-magnet>Recevoir mon devis gratuit ${ARROW}</button>
          <a href="#" class="kt-btn kt-btn-outline kt-btn-lg bg-background/70 backdrop-blur" data-wa target="_blank" rel="noopener" data-magnet>${WA}Discuter sur WhatsApp</a>
        </div>
      </div>
    </section>`;

const cardsGrid = (id, label, badge, title, intro, items, cols = 3) => `
    <section id="${id}" data-label="${esc(label)}" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">${sectionHead(badge, title, intro)}
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-${cols}">${items.map(([t, d], i) => `
          <article class="kt-card magic" data-reveal><div class="kt-card-content flex flex-col gap-2 p-6">
            <span class="kt-badge kt-badge-sm kt-badge-primary kt-badge-outline self-start">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-2 font-semibold text-mono">${fr(t)}</h3>
            <p class="text-sm text-muted-foreground">${fr(d)}</p>
          </div></article>`).join("")}
        </div>
      </div>
    </section>`;

const accordion = (prefix, qa) => `
        <div class="kt-accordion kt-accordion-outline" data-kt-accordion="true" data-reveal>${qa.map(([q, a], i) => `
          <div class="kt-accordion-item magic bg-card" data-kt-accordion-item="true"><button type="button" class="kt-accordion-toggle" id="${prefix}-t${i + 1}" aria-controls="${prefix}-c${i + 1}" data-kt-accordion-toggle="#${prefix}-c${i + 1}"><span class="kt-accordion-title">${fr(q)}</span><span class="kt-accordion-indicator" aria-hidden="true"></span></button><div class="kt-accordion-content hidden" id="${prefix}-c${i + 1}" aria-labelledby="${prefix}-t${i + 1}"><div class="kt-accordion-wrapper text-muted-foreground">${fr(a)}</div></div></div>`).join("")}
        </div>`;

const faqSection = (id, label, badge, title, qa, prefix) => `
    <section id="${id}" data-label="${esc(label)}" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div class="lg:sticky lg:top-28">${sectionHead(badge, title, "")}
          <p class="wa-only mt-4 text-muted-foreground" data-reveal>Une autre question&nbsp;? <a href="#" class="kt-link" data-wa target="_blank" rel="noopener">Écrivez-nous sur WhatsApp</a>, on répond vite.</p>
        </div>${accordion(prefix, qa)}
      </div>
    </section>`;

// Questions générales (reprises de la FAQ de l'accueil, texte brut pour les données structurées)
const GENERAL_FAQ = [...INDEX.slice(INDEX.indexOf('<section id="faq"'), INDEX.indexOf("</section>", INDEX.indexOf('<section id="faq"')))
  .matchAll(/<span class="kt-accordion-title">([\s\S]*?)<\/span>[\s\S]*?<div class="kt-accordion-wrapper[^"]*">([\s\S]*?)<\/div>/g)]
  .map((m) => [m[1], m[2]].map((t) => t.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&#8209;/g, "-").replace(/&amp;/g, "&").trim()));
const pickFaq = (...words) => GENERAL_FAQ.filter(([q]) => words.some((w) => q.toLowerCase().includes(w)));

// ---------- Pages ----------
let n404 = 0;
const PAGES = [
  {
    file: "realisations.html", nav: "realisations.html", name: "Réalisations",
    title: "Nos réalisations : sites et applications en ligne",
    description: "Thalia's Traiteur, Marck-Land, le Blog : découvrez les sites conçus par AD SOLUTIONS, avec le contexte, le besoin et ce que nous avons livré.",
    h1: "Nos réalisations, en ligne aujourd'hui.",
    lead: "Chaque projet est conçu sur mesure pour l'activité de son propriétaire. Découvrez le contexte, le besoin et ce que nous avons livré, puis visitez les sites : jugez sur pièce.",
    secondary: ["Lire les études de cas", "#etudes"],
    body: () => {
      const cs = ["cs-thalias", "cs-marck", "cs-blog"].map(caseStudy);
      return section("realisations") + `
    <section id="etudes" data-label="Études de cas" class="relative py-20 sm:py-28">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto max-w-7xl px-5 lg:px-8">${sectionHead("Études de cas", "Le détail de chaque projet.", "Le contexte, le besoin, notre réponse et ce que nous avons livré.")}
        <div class="mt-12 grid gap-6 lg:grid-cols-3">${cs.map((c) => `
          <article class="kt-card magic" data-reveal><div class="kt-card-content flex h-full flex-col gap-5 p-6">
            ${c.body}
            ${c.site ? `<div class="mt-auto flex flex-wrap gap-3 pt-2"><a href="${c.site}" target="_blank" rel="noopener" class="kt-btn kt-btn-outline kt-btn-sm">Visiter le site</a><button type="button" class="kt-btn kt-btn-primary kt-btn-sm" data-kt-modal-toggle="#devis">Un projet similaire&nbsp;?</button></div>` : ""}
          </div></article>`).join("")}
        </div>
      </div>
    </section>` + cardsGrid("points-communs", "Points communs", "Ce qu'ils ont en commun", "Le même soin, pour chaque projet.", "", [
        ["Sur mesure", "Aucun modèle recyclé : chaque site est conçu pour l'activité et les clients de son propriétaire."],
        ["Pensés pour le téléphone", "La majorité des visiteurs arrivent depuis leur téléphone : tout y est lisible et rapide."],
        ["Orientés vers l'action", "Chaque page mène quelque part : commander, réserver, écrire ou appeler."],
      ]) + cta("Le prochain projet, c'est le vôtre ?");
    },
    local: ["realisations"],
  },
  {
    file: "methode.html", nav: "methode.html", name: "Méthode",
    title: "Notre méthode : un projet clair, en 5 étapes",
    description: "Échange, devis sous 24 h, design et code, tests, lancement : la méthode AD SOLUTIONS pour livrer votre site ou votre application sans mauvaise surprise.",
    h1: "Une méthode claire, du premier échange au lancement.",
    lead: "Vous savez à chaque étape où en est votre projet et ce que vous payez. Voici, concrètement, comment nous travaillons avec vous.",
    secondary: ["Voir les 5 étapes", "#methode"],
    body: () => section("methode") + section("histoire") + cardsGrid("engagements", "Nos engagements", "Nos engagements", "Ce sur quoi vous pouvez compter.", "", [
        ["Un devis sous 24 h", "Une proposition claire : fonctionnalités, technologies, prix et délais. Gratuite et sans engagement."],
        ["Un contrat écrit", "Tout est écrit noir sur blanc : ce qui est livré, quand, et à quel prix. Aucun frais caché."],
        ["Vous payez le solde à la livraison", "Un acompte au lancement, le solde à la livraison. Pour les applications, un paiement par étapes."],
        ["Vous testez au fur et à mesure", "Maquettes, puis versions en cours : vous suivez l'avancement et donnez votre avis à chaque étape."],
        ["Le code et les données sont à vous", "Une fois le paiement effectué, votre site ou votre application, son code et vos données vous appartiennent."],
        ["On reste après le lancement", "Formation, maintenance et évolutions : un interlocuteur joignable sur WhatsApp."],
      ]) + faqSection("questions", "Questions", "Questions fréquentes", "Sur la méthode.", pickFaq("temps", "paiement", "code"), "mq") + cta(),
    local: ["methode", "histoire"],
  },
  {
    file: "offres.html", nav: "offres.html", name: "Offres",
    title: "Nos offres : sites web, applications et maintenance",
    description: "AD START, AD BUSINESS, AD PREMIUM, applications sur mesure et maintenance : des formules claires et un devis détaillé gratuit sous 24 h.",
    h1: "Des formules claires, un devis sur mesure.",
    lead: "Sites vitrines, boutiques en ligne, applications, maintenance : choisissez votre point de départ. Nous vous envoyons un devis détaillé sous 24 h, gratuit et sans engagement.",
    secondary: ["Comparer les formules", "#offres"],
    body: () => section("offres") + cardsGrid("inclus", "Toujours inclus", "Toujours inclus", "Quelle que soit la formule.", "", [
        ["Design sur mesure", "Une identité soignée, à votre image, et parfaite sur téléphone."],
        ["Un seul interlocuteur", "Une seule équipe, du design à l'hébergement, joignable sur WhatsApp."],
        ["Paiement souple", "Acompte au lancement, solde à la livraison. Mobile Money et virement acceptés, facture remise."],
        ["Domaine à votre nom", "Votre adresse web et vos données vous appartiennent."],
        ["Mise en ligne prise en charge", "Hébergement, HTTPS et publication : nous nous occupons de la technique."],
        ["Suivi après le lancement", "Maintenance offerte avec AD BUSINESS (1 mois) et AD PREMIUM (3 mois)."],
      ]) + section("audit") + faqSection("questions", "Questions", "Questions fréquentes", "Sur les offres.", pickFaq("paiement", "hébergement", "textes"), "oq") + cta("Votre devis est gratuit. On commence ?"),
    local: ["offres", "audit"],
  },
  {
    file: "a-propos.html", nav: "a-propos.html", name: "À propos",
    title: "À propos d'AD SOLUTIONS, agence web et mobile à Cotonou",
    description: "AD SOLUTIONS, entreprise de services numériques née au Bénin : une équipe fullstack qui conçoit, développe et met en ligne des sites et des applications, au Bénin et à l'international.",
    h1: "Une équipe béninoise, des standards internationaux.",
    lead: "AD SOLUTIONS est une entreprise de services numériques née au Bénin, portée par des développeurs fullstack. Nous prenons en charge les projets de A à Z, pour des clients au Bénin comme à l'étranger.",
    secondary: ["Nous rejoindre", "#recrutement"],
    body: () => section("apropos") + section("pourquoi") + section("stack") + section("bientot") + cta(),
    local: ["apropos", "pourquoi", "stack", "bientot"],
  },
  {
    file: "faq.html", nav: "faq.html", name: "Questions fréquentes",
    title: "Questions fréquentes : délais, prix, paiement, technologies",
    description: "Toutes les réponses sur la création de votre site ou de votre application avec AD SOLUTIONS : délais, prix, paiement, hébergement, propriété du code, et chaque service en détail.",
    h1: "Toutes vos questions, nos réponses.",
    lead: "Délais, prix, paiement, technologies, propriété du code… Les questions qu'on nous pose le plus souvent, puis le détail pour chaque service.",
    secondary: ["Écrire sur WhatsApp", "#"],
    body: () => section("faq") + SERVICES.map((s, i) => `
    <section id="faq-${s.slug}" data-label="${esc(s.name)}" class="relative py-16 sm:py-20">
      <div class="gm gm-sec" aria-hidden="true"></div>
      <div class="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div class="lg:sticky lg:top-28">${sectionHead("Par service", s.name, "")}
          <a href="services/${s.slug}.html" class="kt-link kt-link-underlined mt-5 inline-block text-sm font-medium" data-reveal>Découvrir l'offre ${fr(s.name)}</a>
        </div>${accordion(`f${i}`, s.faq)}
      </div>
    </section>`).join("") + cta("Vous n'avez pas trouvé votre réponse ?"),
    local: ["faq"],
    faqLd: () => [...GENERAL_FAQ, ...SERVICES.flatMap((s) => s.faq)],
  },
  {
    file: "mentions-legales.html", name: "Mentions légales", noHeroCta: true,
    title: "Mentions légales", description: "Mentions légales du site AD SOLUTIONS : éditeur, propriété intellectuelle, responsabilité et droit applicable.",
    h1: "Mentions légales.", lead: "Les informations légales relatives au site d'AD SOLUTIONS.",
    body: () => legalPage("legal") + cta(), local: [],
  },
  {
    file: "confidentialite.html", name: "Confidentialité", noHeroCta: true,
    title: "Politique de confidentialité", description: "Politique de confidentialité d'AD SOLUTIONS : aucun cookie, aucun traceur ; vos informations servent uniquement à vous répondre.",
    h1: "Politique de confidentialité.", lead: "Aucun cookie, aucun traceur, aucune publicité. Voici, simplement, ce que deviennent vos informations.",
    body: () => legalPage("privacy") + cta(), local: [],
  },
  {
    file: "404.html", name: "Page introuvable", noHeroCta: true, base: "/",
    title: "Page introuvable", description: "Cette page n'existe pas ou a été déplacée.",
    h1: "Cette page est introuvable.", lead: "Elle n'existe pas ou a été déplacée. Voici où trouver ce que vous cherchez.",
    body: () => cardsGrid("pistes", "Pistes", "Par ici", "Les pages les plus consultées.", "", [
        ["Accueil", "Sites, applications web et mobiles sur mesure, du design à l'hébergement."],
        ["Nos réalisations", "Des projets en ligne, avec leurs études de cas."],
        ["Nos offres", "Des formules claires et un devis gratuit sous 24 h."],
      ]).replace(/<article class="kt-card magic" data-reveal>([\s\S]*?)<\/article>/g, (m, inner) => {
        const href = ["index.html", "realisations.html", "offres.html"][n404++];
        return `<a href="${href}" class="kt-card magic group" data-reveal>${inner}</a>`;
      }) + cta(), local: [],
  },
];

function render(p) {
  const top = rebase(TOP, p.local).replace(`<a href="${p.nav}" class="nav-link `, `<a href="${p.nav}" class="nav-link is-active `);
  let body = p.body();
  // Bouton secondaire « # » : lien WhatsApp (renseigné par site.js)
  const heroHtml = hero(p).replace(`<a href="#" class="kt-btn kt-btn-outline kt-btn-lg bg-background/70 backdrop-blur" data-magnet>`, `<a href="#" class="kt-btn kt-btn-outline kt-btn-lg bg-background/70 backdrop-blur" data-wa target="_blank" rel="noopener" data-magnet>`);
  const ld = p.faqLd ? `\n  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faqLd().map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }).replace(/</g, "\\u003c")}</script>` : "";
  return `${HEAD.replace("<head>", p.base ? `<head>\n  <base href="${p.base}">` : "<head>")}  <title>${esc(p.title)} | AD SOLUTIONS</title>${p.file === "404.html" ? '\n  <meta name="robots" content="noindex">' : ""}
  <meta name="description" content="${esc(p.description)}">
  <meta property="og:title" content="${esc(p.title)} | AD SOLUTIONS">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/img/thalias-traiteur.jpg">${ld}
</head>
${top}
${DECOR}
${rebase(heroHtml + "\n\n" + body, p.local.concat(["haut", "demarrer", "etudes", "engagements", "inclus", "questions", "points-communs", "recrutement"]))}
${rebase(BOTTOM, p.local)}`;
}

buildServices();
for (const p of PAGES) {
  writeFileSync(join(ROOT, p.file), render(p));
  console.log(`écrit : ${p.file}`);
}
