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

// ============================================================
// Effets : inspirés de React Bits, Fancy Components, Motion Primitives,
// NumberFlow et Cursify, réécrits en JavaScript natif.
// Tous se désactivent si le visiteur a demandé moins d'animations.
// ============================================================
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function onVisible(el, cb, options = { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) {
  if (!("IntersectionObserver" in window)) return cb(el);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { cb(en.target); io.unobserve(en.target); } });
  }, options);
  io.observe(el);
}

// --- Liens WhatsApp ---
const defaultMsg = "Bonjour AD SOLUTIONS, je souhaite avoir des informations pour un projet (site web ou application).";
$$('[data-contact="whatsapp"]').forEach((el) => {
  el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`;
});

// --- Projets sans lien : on masque le bouton et on désactive l'image ---
$$(".work__item").forEach((item) => {
  const media = $(".work__media", item);
  if (media && media.getAttribute("href") === "#") {
    $("[data-project-link]", item)?.remove();
    const div = document.createElement("div");
    div.className = media.className;
    div.innerHTML = media.innerHTML;
    media.replaceWith(div);
  }
});

// ============================================================
// TEXTE
// ============================================================

// Lettres qui roulent au survol (Fancy « Letter Swap Hover »)
$$("[data-swap]").forEach((el) => {
  const text = el.textContent.trim();
  el.textContent = "";
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = text;
  const swap = document.createElement("span");
  swap.className = "swap";
  swap.setAttribute("aria-hidden", "true");
  [...text].forEach((c, i) => {
    const s = document.createElement("span");
    s.className = "swap__c";
    s.style.setProperty("--i", i);
    s.textContent = c;
    swap.append(s);
  });
  el.append(sr, swap);
});

// Mots qui apparaissent avec un flou (React Bits « Blur Text » / « Split Text »)
$$("[data-split]").forEach((el) => {
  const words = el.textContent.trim().split(/[ \t\r\n]+/);
  el.textContent = "";
  words.forEach((w, i) => {
    const s = document.createElement("span");
    s.className = "split__w";
    s.style.setProperty("--i", i);
    s.textContent = w;
    el.append(s, i < words.length - 1 ? " " : "");
  });
});

// Mot du titre qui change lettre par lettre (Fancy « Text Rotate »)
const rotator = $(".rotator");
if (rotator) {
  const words = rotator.dataset.words.split("|");
  rotator.textContent = "";
  const nodes = words.map((w) => {
    const wrap = document.createElement("span");
    wrap.className = "rotator__w";
    [...w].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "rotator__c";
      s.style.setProperty("--i", i);
      s.textContent = c;
      wrap.append(s);
    });
    rotator.append(wrap);
    return wrap;
  });
  const fit = () => rotator.style.setProperty("--rw", `${Math.max(...nodes.map((n) => n.scrollWidth)) + 4}px`);
  fit();
  document.fonts?.ready.then(fit);
  addEventListener("resize", fit);
  let i = 0;
  // Premier mot : entre avec le reste du titre
  setTimeout(() => nodes[0].classList.add("is-in"), reduceMotion ? 0 : 350);
  if (!reduceMotion) {
    setInterval(() => {
      const cur = nodes[i];
      i = (i + 1) % nodes.length;
      const next = nodes[i];
      cur.classList.replace("is-in", "is-out");
      next.classList.remove("is-out");
      void next.offsetWidth; // repart de la position basse
      next.classList.add("is-in");
      setTimeout(() => cur.classList.remove("is-out"), 900);
    }, 2800);
  }
}

// Texte qui se « décode » (React Bits « Decrypted Text » / Fancy « Scramble In »)
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-+*";
function scramble(el, duration = 700) {
  if (reduceMotion || el.dataset.busy) return;
  const target = el.dataset.text || (el.dataset.text = el.textContent);
  el.dataset.busy = "1";
  const t0 = performance.now();
  const tick = (t) => {
    const p = clamp((t - t0) / duration, 0, 1);
    const shown = Math.floor(p * target.length);
    el.textContent = [...target].map((c, i) => (i < shown || c === " " || c === "." ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    if (p < 1) requestAnimationFrame(tick);
    else { el.textContent = target; delete el.dataset.busy; }
  };
  requestAnimationFrame(tick);
}
$$("[data-scramble]").forEach((el) => {
  el.setAttribute("aria-label", el.textContent);
  onVisible(el, () => scramble(el, 650));
});
$$("[data-decrypt]").forEach((el) => {
  const host = el.closest("a, .browser") || el;
  host.addEventListener("mouseenter", () => scramble(el, 600));
});

// Chiffres qui roulent (NumberFlow)
function prepareRoll(el) {
  const target = el.dataset.roll;
  el.setAttribute("aria-label", target);
  el.textContent = "";
  [...target].forEach((d, i) => {
    const col = document.createElement("span");
    col.className = "roll__d";
    col.setAttribute("aria-hidden", "true");
    const strip = document.createElement("span");
    strip.className = "roll__s";
    strip.style.setProperty("--i", target.length - 1 - i);
    for (let n = 0; n <= 9; n++) {
      const s = document.createElement("span");
      s.textContent = n;
      strip.append(s);
    }
    col.append(strip);
    el.append(col);
  });
}
function playRoll(el) {
  $$(".roll__s", el).forEach((strip, i) => {
    const d = Number(el.dataset.roll[i]);
    strip.style.transform = `translateY(-${d * 10}%)`;
  });
}
$$("[data-roll]").forEach((el) => {
  prepareRoll(el);
  if (reduceMotion) playRoll(el);
  else onVisible(el, () => setTimeout(() => playRoll(el), 150));
});

// Texte qui s'allume au défilement (React Bits « Scroll Reveal »)
const statement = $("[data-scroll-reveal]");
let srWords = [];
if (statement) {
  const accent = /^(Google,|confiance\.|jour|nuit\.)$/;
  const words = statement.textContent.trim().split(/[ \t\r\n]+/);
  statement.textContent = "";
  words.forEach((w, i) => {
    const s = document.createElement("span");
    s.className = "sr" + (accent.test(w) ? " sr--accent" : "");
    s.textContent = w;
    statement.append(s, i < words.length - 1 ? " " : "");
  });
  srWords = $$(".sr", statement);
}
function updateStatement() {
  if (!statement) return;
  if (reduceMotion) { srWords.forEach((w) => w.classList.add("is-lit")); return; }
  const r = statement.getBoundingClientRect();
  const start = innerHeight * 0.85, end = innerHeight * 0.35;
  const p = clamp((start - r.top) / (start - end + r.height * 0.5), 0, 1);
  const lit = Math.round(p * srWords.length);
  srWords.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
}

// Grand nom du pied de page : lettres qui se soulèvent au survol
$$("[data-letters]").forEach((el) => {
  const text = el.textContent;
  el.textContent = "";
  [...text].forEach((c) => {
    const s = document.createElement("span");
    s.textContent = c === " " ? " " : c;
    el.append(s);
  });
  el.classList.add("is-split");
});

// ============================================================
// THÈMES : Nuit (par défaut) → Espresso → Sable → Nuit… (21st.dev « Animated Theme Toggler »)
// Chaque clic passe au thème suivant. Le choix est mémorisé dans le navigateur du visiteur.
// ============================================================
const THEMES = [
  { id: "dark", name: "Nuit", color: "#0F1B2D" },
  { id: "espresso", name: "Espresso", color: "#16100C" },
  { id: "light", name: "Sable", color: "#F4F2EE" },
];
const themeBtn = $(".theme-toggle");
const themeMeta = $('meta[name="theme-color"]');
const themeIndex = (id) => Math.max(0, THEMES.findIndex((t) => t.id === id));
function applyTheme(id) {
  const cur = THEMES[themeIndex(id)];
  const next = THEMES[(themeIndex(cur.id) + 1) % THEMES.length];
  document.documentElement.dataset.theme = cur.id;
  try { localStorage.setItem("ad-theme", cur.id); } catch (e) {}
  themeBtn.setAttribute("aria-label", `Thème ${cur.name}. Passer au thème ${next.name}`);
  themeBtn.title = `Thème ${cur.name}`;
  if (themeMeta) themeMeta.content = cur.color;
  document.dispatchEvent(new Event("themechange"));
}
applyTheme(document.documentElement.dataset.theme);
themeBtn.addEventListener("click", () => {
  const next = THEMES[(themeIndex(document.documentElement.dataset.theme) + 1) % THEMES.length].id;
  if (!document.startViewTransition || reduceMotion) return applyTheme(next);
  // Le nouveau thème s'ouvre en cercle depuis le bouton
  const r = themeBtn.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(() => applyTheme(next)).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
});

// ============================================================
// NAVIGATION
// ============================================================
const toggle = $(".nav-toggle");
const nav = $("#nav");
$$(".nav__pill a").forEach((a, i) => a.style.setProperty("--n", i));
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
}
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
});

// Pastille qui glisse sous le lien survolé (React Bits « Pill Nav »)
const pill = $(".nav__pill");
const indicator = $(".nav__indicator");
const navLinks = $$(".nav__pill a");
function moveIndicator(a) {
  navLinks.forEach((l) => l.classList.toggle("is-hot", l === a));
  if (!a) { pill.classList.remove("has-indicator"); return; }
  pill.style.setProperty("--ix", `${a.offsetLeft}px`);
  pill.style.setProperty("--iw", `${a.offsetWidth}px`);
  indicator.style.transform = `translateX(${a.offsetLeft}px)`;
  indicator.style.width = `${a.offsetWidth}px`;
  pill.classList.add("has-indicator");
}
navLinks.forEach((a) => {
  a.addEventListener("mouseenter", () => moveIndicator(a));
  a.addEventListener("focus", () => moveIndicator(a));
});
pill.addEventListener("mouseleave", () => moveIndicator(null));

// Lien actif selon la section visible
const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

// ============================================================
// DÉFILEMENT : en-tête, progression, cartes empilées, bandeaux
// ============================================================
const header = $(".header");
const waFloat = $(".wa-float");
const contact = $("#contact");
const stackCards = $$("[data-stack] .stack__card");
stackCards.forEach((c, i) => c.style.setProperty("--i", i));

function updateStack() {
  if (reduceMotion) return;
  stackCards.forEach((card, i) => {
    const next = stackCards[i + 1];
    if (!next) return;
    const r = card.getBoundingClientRect();
    const n = next.getBoundingClientRect();
    // Avancement : 0 quand la carte suivante arrive, 1 quand elle recouvre celle-ci
    const p = clamp((r.bottom - n.top) / r.height, 0, 1);
    card.style.setProperty("--s", (1 - p * 0.06).toFixed(4));
    card.style.setProperty("--b", (1 - p * 0.12).toFixed(4));
  });
}

let lastY = scrollY, velocity = 0, ticking = false;
function onScroll() {
  const y = scrollY;
  velocity += (y - lastY);
  lastY = y;
  const max = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle("is-scrolled", y > 12);
  header.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
  const r = contact.getBoundingClientRect();
  waFloat.classList.toggle("is-hidden", r.top < innerHeight * 0.6 && r.bottom > 0);
  updateStack();
  updateStatement();
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// Bandeaux dont la vitesse suit le défilement (React Bits « Scroll Velocity »)
const tracks = $$("[data-velocity]");
if (tracks.length) {
  tracks.forEach((t) => {
    const items = [...t.children];
    for (let k = 0; k < 3; k++) items.forEach((it) => { const c = it.cloneNode(true); c.setAttribute("aria-hidden", "true"); t.append(c); });
    t._x = 0;
  });
  if (!reduceMotion) {
    // Chaque bandeau ne bouge que lorsqu'il est à l'écran
    tracks.forEach((t) => { t._on = true; });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => { e.target._track._on = e.isIntersecting; }));
      tracks.forEach((t) => { t.parentElement._track = t; io.observe(t.parentElement); });
    }
    const loop = () => {
      velocity *= 0.9;
      const boost = clamp(Math.abs(velocity) * 0.08, 0, 14);
      const sign = velocity < -1 ? -1 : 1;
      tracks.forEach((t) => {
        if (!t._on) return;
        const dir = Number(t.dataset.velocity) * sign;
        const one = t.scrollWidth / 4; // largeur d'un jeu d'éléments (4 jeux identiques)
        t._x -= dir * (0.6 + boost);
        if (t._x <= -one) t._x += one;
        if (t._x > 0) t._x -= one;
        t.style.transform = `translate3d(${t._x}px,0,0)`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// ============================================================
// SOURIS : projecteur, tuiles, vitrine, aimant, curseur
// ============================================================
if (finePointer && !reduceMotion) {
  // Projecteur (hero, contact)
  $$("[data-spotlight]").forEach((zone) => {
    zone.addEventListener("pointermove", (e) => {
      const r = zone.getBoundingClientRect();
      zone.style.setProperty("--sx", `${e.clientX - r.left}px`);
      zone.style.setProperty("--sy", `${e.clientY - r.top}px`);
    });
  });

  // Bordure lumineuse des tuiles (React Bits « Magic Bento » / « Spotlight Card »)
  $$("[data-spotlight-group]").forEach((group) => {
    const tiles = $$(".tile", group);
    group.addEventListener("pointermove", (e) => {
      tiles.forEach((t) => {
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${e.clientX - r.left}px`);
        t.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  });

  // Légère inclinaison 3D des tuiles
  $$("[data-tile-tilt]").forEach((t) => {
    t.addEventListener("pointermove", (e) => {
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `perspective(1000px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });
    t.addEventListener("pointerleave", () => (t.style.transform = ""));
  });

  // Vitrine du hero (React Bits « Tilted Card »)
  const tilt = $("[data-tilt]");
  const hero = $(".hero");
  if (tilt && hero) {
    hero.addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      tilt.style.setProperty("--ry", `${(-7 + x * 12).toFixed(2)}deg`);
      tilt.style.setProperty("--rx", `${(5 - y * 10).toFixed(2)}deg`);
    });
    hero.addEventListener("pointerleave", () => { tilt.style.removeProperty("--ry"); tilt.style.removeProperty("--rx"); });
  }

  // Boutons aimantés (React Bits « Magnet »)
  $$("[data-magnet]").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--bx", `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
      btn.style.setProperty("--by", `${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
    });
    btn.addEventListener("pointerleave", () => { btn.style.removeProperty("--bx"); btn.style.removeProperty("--by"); });
  });

  // Curseur contextuel « Visiter » (Cursify)
  const cursor = $(".cursor");
  const label = $(".cursor__label");
  let cx = -200, cy = -200, tx = -200, ty = -200, running = false;
  const follow = () => {
    cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
    cursor.style.setProperty("--cx", `${cx.toFixed(1)}px`);
    cursor.style.setProperty("--cy", `${cy.toFixed(1)}px`);
    if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) requestAnimationFrame(follow); else running = false;
  };
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!running) { running = true; requestAnimationFrame(follow); }
  }, { passive: true });
  $$("[data-cursor]").forEach((el) => {
    if (!el.matches("a")) return;
    el.addEventListener("pointerenter", () => { label.textContent = el.dataset.cursor; cursor.classList.add("is-on"); });
    el.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));
  });
}

// Aperçu des services qui suit la souris (Fancy « Image Trail », Codrops « hover reveal »)
const svcList = $("[data-svc]");
const svcPreview = $(".svc-preview");
if (svcList && svcPreview && finePointer && !reduceMotion) {
  $$(".svc-preview__item", svcPreview).forEach((it, i) => it.style.setProperty("--n", i));
  let px = 0, py = 0, tx = 0, ty = 0, raf = 0;
  const W = 340 + 36 + 24; // largeur de l'aperçu + décalage + marge
  const loop = () => {
    const dx = tx - px;
    px += dx * 0.16; py += (ty - py) * 0.16;
    svcPreview.style.transform = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0)`;
    svcPreview.style.setProperty("--pr", `${clamp(dx * 0.05, -8, 8).toFixed(2)}deg`);
    raf = Math.abs(dx) > 0.3 || Math.abs(ty - py) > 0.3 ? requestAnimationFrame(loop) : 0;
  };
  const aim = (e) => {
    tx = Math.min(e.clientX, innerWidth - W);
    ty = clamp(e.clientY, 140, innerHeight - 140);
  };
  svcList.addEventListener("pointerenter", (e) => { aim(e); px = tx; py = ty; });
  svcList.addEventListener("pointermove", (e) => { aim(e); if (!raf) raf = requestAnimationFrame(loop); });
  svcList.addEventListener("pointerleave", () => svcPreview.classList.remove("is-on"));
  $$(".svc__row", svcList).forEach((row) => row.addEventListener("pointerenter", () => {
    svcPreview.style.setProperty("--k", row.dataset.art);
    svcPreview.classList.add("is-on");
  }));
  addEventListener("scroll", () => svcPreview.classList.remove("is-on"), { passive: true });
}

// Étincelles au clic (React Bits « Click Spark »)
if (!reduceMotion) {
  $$("[data-spark]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const x = e.clientX || btn.getBoundingClientRect().left + btn.offsetWidth / 2;
      const y = e.clientY || btn.getBoundingClientRect().top + btn.offsetHeight / 2;
      for (let k = 0; k < 8; k++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        s.style.setProperty("--r", `${k * 45}deg`);
        document.body.append(s);
        setTimeout(() => s.remove(), 550);
      }
    });
  });
}

// ============================================================
// GRILLE « CARREAUX » INTERACTIVE DU HERO
// Inspirée de Magic UI « Animated Grid Pattern », Aceternity « Background Boxes » et des grilles de Vercel :
// filets fins, repères « + » aux intersections, carreaux qui s'allument sous la souris et laissent
// une traînée, et quelques carreaux qui s'allument d'eux-mêmes (aussi sur téléphone).
// ============================================================
const gridCanvas = $(".grid-canvas");
if (gridCanvas && gridCanvas.getContext) {
  const ctx = gridCanvas.getContext("2d");
  const zone = gridCanvas.parentElement;
  const layer = document.createElement("canvas"); // filets + repères, dessinés une seule fois
  const lctx = layer.getContext("2d");
  const cells = new Map(); // numéro du carreau -> { v: intensité affichée, t: intensité visée }
  let S = 56, w = 0, h = 0, dpr = 1, cols = 0, rows = 0, ox = 0;
  let raf = 0, onScreen = true, hover = -1, lastAmbient = 0;
  let col = { line: "", cross: "", cell: "242,107,29", alpha: 0.2 };

  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim();
    col = { line: g("--grid-line"), cross: g("--grid-cross"), cell: g("--grid-cell"), alpha: parseFloat(g("--grid-cell-alpha")) || 0.2 };
  };

  function drawLayer() {
    layer.width = w * dpr; layer.height = h * dpr;
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.clearRect(0, 0, w, h);
    lctx.lineWidth = 1;
    lctx.strokeStyle = col.line;
    lctx.beginPath();
    for (let i = 0; i <= cols; i++) { const x = Math.round(ox + i * S) + 0.5; lctx.moveTo(x, 0); lctx.lineTo(x, h); }
    for (let j = 0; j <= rows; j++) { const y = j * S + 0.5; lctx.moveTo(0, y); lctx.lineTo(w, y); }
    lctx.stroke();
    // Repères « + » de construction, une intersection sur quelques-unes
    lctx.strokeStyle = col.cross;
    lctx.beginPath();
    for (let i = 0; i <= cols; i += 4) for (let j = 1; j <= rows; j += 3) {
      const x = Math.round(ox + i * S) + 0.5, y = j * S + 0.5;
      lctx.moveTo(x - 4, y); lctx.lineTo(x + 5, y);
      lctx.moveTo(x, y - 4); lctx.lineTo(x, y + 5);
    }
    lctx.stroke();
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = zone.clientWidth; h = zone.clientHeight;
    S = w < 700 ? 40 : 56;
    cols = Math.ceil(w / S) + 1; rows = Math.ceil(h / S) + 1;
    ox = ((w % S) - S) / 2; // grille centrée horizontalement
    gridCanvas.width = w * dpr; gridCanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawLayer();
    render(false);
  }

  const light = (k, t) => {
    if (k < 0 || k >= cols * rows) return;
    const c = cells.get(k);
    if (c) c.t = Math.max(c.t, t); else cells.set(k, { v: 0, t });
  };

  function render(step) {
    ctx.clearRect(0, 0, w, h);
    for (const [k, c] of cells) {
      if (step) {
        if (k === hover) c.t = 1;
        c.v += (c.t - c.v) * (c.t > c.v ? 0.3 : 0.08);
        c.t *= k === hover ? 1 : 0.94;
        if (c.v < 0.008 && c.t < 0.008) { cells.delete(k); continue; }
      }
      const i = k % cols, j = (k / cols) | 0;
      const x = Math.round(ox + i * S) + 1, y = j * S + 1;
      ctx.fillStyle = `rgba(${col.cell},${(c.v * col.alpha).toFixed(3)})`;
      ctx.fillRect(x, y, S - 1, S - 1);
      if (c.v > 0.35) {
        ctx.strokeStyle = `rgba(${col.cell},${((c.v - 0.35) * 0.9).toFixed(3)})`;
        ctx.strokeRect(x - 0.5, y - 0.5, S, S);
      }
    }
    ctx.drawImage(layer, 0, 0, w, h);
  }

  function loop(now) {
    // Ambiance : un carreau s'allume de temps en temps dans la partie visible de la grille
    if (now - lastAmbient > 650) {
      lastAmbient = now;
      const i = 1 + Math.floor(Math.random() * (cols - 2));
      const j = Math.floor(Math.random() * Math.min(rows, Math.ceil(innerHeight / S)));
      light(j * cols + i, 0.55 + Math.random() * 0.3);
    }
    render(true);
    raf = onScreen ? requestAnimationFrame(loop) : 0;
  }
  const start = () => { if (!raf && onScreen) raf = requestAnimationFrame(loop); };

  readColors();
  resize();
  document.addEventListener("themechange", () => { readColors(); drawLayer(); render(false); });
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(zone); else addEventListener("resize", resize);

  if (reduceMotion) {
    // Version fixe : quelques carreaux allumés, sans animation
    [[2, 3, 0.7], [14, 2, 0.5], [21, 5, 0.75], [11, 9, 0.45], [24, 3, 0.4], [7, 12, 0.5]].forEach(([i, j, v]) => {
      if (i < cols && j < rows) cells.set(j * cols + i, { v, t: v });
    });
    render(false);
  } else {
    zone.addEventListener("pointermove", (e) => {
      const r = gridCanvas.getBoundingClientRect();
      const i = Math.floor((e.clientX - r.left - ox) / S), j = Math.floor((e.clientY - r.top) / S);
      const k = j * cols + i;
      if (k !== hover) {
        hover = k;
        light(k, 1);
        light(k - 1, 0.22); light(k + 1, 0.22); light(k - cols, 0.22); light(k + cols, 0.22);
      }
    }, { passive: true });
    zone.addEventListener("pointerleave", () => { hover = -1; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) start(); }).observe(zone);
    }
    start();
  }
}

// ============================================================
// APPARITION AU DÉFILEMENT (Motion Primitives « In View »)
// ============================================================
const revealEls = $$(".reveal, [data-split]");
if ("IntersectionObserver" in window && !reduceMotion) {
  revealEls.forEach((el) => {
    if (!el.classList.contains("reveal")) return;
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.setProperty("--d", `${Math.min(idx, 6) * 0.08}s`);
  });
  // Titre du hero : la 2e ligne démarre après la 1re
  const heroLines = $$(".hero__line");
  if (heroLines[1]) heroLines[1].style.setProperty("--d0", "420ms");
  revealEls.forEach((el) => onVisible(el, (t) => t.classList.add("is-visible"), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// ============================================================
// FORMULAIRE
// ============================================================
const form = $("#contact-form");
$$("[data-offer]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const radio = $(`input[name="offre"][value="${btn.dataset.offer}"]`, form);
    if (radio) radio.checked = true;
  })
);

// Vérifie les champs obligatoires ; renvoie false (et place le curseur) s'il en manque
function checkRequired(formEl, fields) {
  const error = $(".form__error", formEl);
  const missing = fields.filter((el) => !el.value.trim());
  fields.forEach((el) => {
    el.classList.toggle("is-invalid", !el.value.trim());
    el.setAttribute("aria-invalid", String(!el.value.trim()));
  });
  error.hidden = !missing.length;
  if (missing.length) missing[0].focus();
  return !missing.length;
}
const openWhatsApp = (text) => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = form.elements;
  if (!checkRequired(form, [f.nom, f.tel, f.message])) return;

  const offre = $('input[name="offre"]:checked', form)?.value || "Je ne sais pas encore";
  const lines = [
    "Bonjour AD SOLUTIONS,",
    "",
    `Nom : ${f.nom.value.trim()}`,
    `Téléphone : ${f.tel.value.trim()}`,
    f.entreprise.value.trim() ? `Entreprise : ${f.entreprise.value.trim()}` : null,
    `Projet : ${offre}`,
    "",
    f.message.value.trim(),
  ];
  openWhatsApp(lines.filter((l) => typeof l === "string").join("\n"));
});

// Demande d'audit gratuit
const auditForm = $("#audit-form");
auditForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = auditForm.elements;
  if (!checkRequired(auditForm, [f.url, f.nom, f.tel])) return;
  openWhatsApp([
    "Bonjour AD SOLUTIONS,",
    "",
    "Je souhaite un audit gratuit de :",
    f.url.value.trim(),
    "",
    `Nom : ${f.nom.value.trim()}`,
    `Téléphone : ${f.tel.value.trim()}`,
  ].join("\n"));
});

$$("#contact-form input, #contact-form textarea, #audit-form input").forEach((el) =>
  el.addEventListener("input", () => {
    if (el.value.trim()) { el.classList.remove("is-invalid"); el.removeAttribute("aria-invalid"); }
  })
);

// ============================================================
// OFFRES D'EMPLOI
// ============================================================
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

const jobsContainer = $("#jobs");
if (OFFRES_EMPLOI.length === 0) {
  $("#jobs-empty").hidden = false;
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

    const btn = el("a", "btn btn--outline btn--sm", "Postuler");
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
$$("[data-apply]").forEach((a) => (a.href = applyLink(a.dataset.apply)));

// --- Année du copyright ---
$("#year").textContent = new Date().getFullYear();
