// ============================================================
// CONFIGURATION — à modifier avec les vraies informations
// Numéro WhatsApp au format international, sans "+" ni espaces.
// ============================================================
const WHATSAPP_NUMBER = "22900000000"; // TODO
const RECRUTEMENT_EMAIL = "recrutement@adsolutions.bj"; // TODO

// ============================================================
// OFFRES D'EMPLOI / DE STAGE
// Liste vide = la section affiche « Aucune offre » + candidature spontanée.
// Pour publier une offre, copier le modèle ci-dessous dans la liste.
//
//  {
//    titre: "Stagiaire développeur web",
//    type: "Stage",                       // Stage, CDD, CDI, Freelance…
//    lieu: "Télétravail / Cotonou",
//    duree: "3 mois",                     // facultatif
//    debut: "Janvier 2027",               // facultatif
//    resume: "Participez à la création des sites de nos clients.",
//    missions: ["Intégrer des maquettes en HTML/CSS", "Corriger et tester les sites"],
//    profil: ["Bases en HTML, CSS et JavaScript", "Curieux et rigoureux"],
//  },
// ============================================================
const OFFRES_EMPLOI = [];

// --- Lien WhatsApp du bouton flottant ---
const defaultMsg = "Bonjour AD SOLUTIONS, je souhaite avoir des informations sur la création d'un site web.";
document.querySelectorAll('[data-contact="whatsapp"]').forEach((el) => {
  el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`;
});

// --- Menu mobile ---
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// --- Ombre de l'en-tête au défilement ---
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// --- Boutons d'offre : pré-sélectionne l'offre dans le formulaire ---
const form = document.getElementById("contact-form");
document.querySelectorAll("[data-offer]").forEach((btn) =>
  btn.addEventListener("click", () => {
    form.elements.offre.value = btn.dataset.offer;
  })
);

// --- Formulaire -> message WhatsApp pré-rempli ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = form.elements;
  const error = form.querySelector(".form__error");
  const required = [f.nom, f.tel, f.message];
  const missing = required.filter((el) => !el.value.trim());
  required.forEach((el) => el.classList.toggle("is-invalid", !el.value.trim()));
  if (missing.length) {
    error.hidden = false;
    missing[0].focus();
    return;
  }
  error.hidden = true;

  const lines = [
    "Bonjour AD SOLUTIONS,",
    "",
    `Nom : ${f.nom.value.trim()}`,
    `Téléphone : ${f.tel.value.trim()}`,
    f.entreprise.value.trim() ? `Entreprise : ${f.entreprise.value.trim()}` : null,
    `Offre : ${f.offre.value}`,
    "",
    f.message.value.trim(),
  ];
  // Retire la ligne "Entreprise" si le champ est vide
  const text = lines.filter((l) => typeof l === "string").join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// --- Offres d'emploi ---
function applyLink(poste) {
  const subject = `Candidature : ${poste}`;
  const body = [
    "Bonjour AD SOLUTIONS,",
    "",
    `Je souhaite postuler pour : ${poste}.`,
    "",
    "Nom et prénom :",
    "Téléphone / WhatsApp :",
    "Lien vers mon portfolio ou GitHub (si vous en avez un) :",
    "",
    "Quelques mots sur moi :",
    "",
    "(Pensez à joindre votre CV.)",
  ].join("\n");
  return `mailto:${RECRUTEMENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderList(title, items) {
  const wrap = el("div", "job__list");
  wrap.append(el("h4", null, title));
  const ul = el("ul");
  items.forEach((item) => ul.append(el("li", null, item)));
  wrap.append(ul);
  return wrap;
}

const jobsContainer = document.getElementById("jobs");
if (OFFRES_EMPLOI.length === 0) {
  document.getElementById("jobs-empty").hidden = false;
  jobsContainer.hidden = true;
} else {
  OFFRES_EMPLOI.forEach((job) => {
    const card = el("article", "job");
    const tags = el("div", "job__tags");
    [job.type, job.lieu, job.duree, job.debut && `Début : ${job.debut}`]
      .filter(Boolean)
      .forEach((t, i) => tags.append(el("span", i === 0 ? "job__tag job__tag--type" : "job__tag", t)));
    card.append(tags, el("h3", null, job.titre));
    if (job.resume) card.append(el("p", "job__resume", job.resume));

    if (job.missions?.length || job.profil?.length) {
      const details = el("details", "job__details");
      details.append(el("summary", null, "Voir le détail"));
      if (job.missions?.length) details.append(renderList("Missions", job.missions));
      if (job.profil?.length) details.append(renderList("Profil recherché", job.profil));
      card.append(details);
    }

    const btn = el("a", "btn btn--secondary btn--sm", "Postuler");
    btn.href = applyLink(job.titre);
    card.append(btn);
    jobsContainer.append(card);
  });

  const spontaneous = el("p", "jobs__more");
  spontaneous.append("Aucune offre ne correspond à votre profil ? ");
  const link = el("a", null, "Envoyez une candidature spontanée");
  link.href = applyLink("Candidature spontanée");
  spontaneous.append(link, ".");
  jobsContainer.after(spontaneous);
}
document.querySelectorAll("[data-apply]").forEach((a) => (a.href = applyLink(a.dataset.apply)));

// --- Année du copyright ---
document.getElementById("year").textContent = new Date().getFullYear();

// --- Apparition douce des sections ---
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".card, .plan, .steps li, .project, .value, .stat, .job").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}
