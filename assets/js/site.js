/* ============================================================
   AD SOLUTIONS × KTUI — comportements du site
   Composants KTUI (Modal, Drawer, Tabs, Accordion, Stepper, Dropdown, Tooltip, Clipboard,
   ThemeSwitch, Toast) : assets/js/ktui.min.js, initialisé automatiquement.
   Ce fichier les pilote et anime les composants inspirés de Magic UI, Aceternity et React Bits.
   ============================================================ */

// ---------- CONFIGURATION (à compléter) ----------
const WHATSAPP_NUMBER = "22900000000"; // TODO : numéro au format international, sans + ni espaces
const RECRUTEMENT_EMAIL = "recrutement@adsolutions.bj"; // TODO
const CONTACT_EMAIL = "contact@adsolutions.bj"; // TODO : adresse qui reçoit les demandes tant que WhatsApp n'est pas configuré
// Tant que le numéro est celui d'exemple (229 suivi de zéros), tout ce qui mène à WhatsApp est masqué (classe « no-wa »)
// et les formulaires partent par e-mail. Renseigner le vrai numéro ci-dessus suffit à tout réactiver.
const WA_READY = !/^2290+$/.test(WHATSAPP_NUMBER);
if (!WA_READY) document.documentElement.classList.add("no-wa");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const wa = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
// Envoi d'une demande : WhatsApp si configuré, sinon e-mail pré-rempli
const sendRequest = (text, subject) => {
  if (WA_READY) window.open(wa(text), "_blank", "noopener");
  else location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
};
const toast = (message, variant = "success") => {
  if (window.KTToast) KTToast.show({ message, variant, position: "bottom-center", duration: 3500, progress: true });
};
function onVisible(el, cb, opts = { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) {
  if (!el) return;
  if (!("IntersectionObserver" in window)) return cb(el);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } }), opts);
  io.observe(el);
}
// Exécute fn à intervalle régulier, seulement quand el est à l'écran
function whileVisible(el, fn, every) {
  if (!el || reduceMotion) return;
  let on = false;
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (on = e.isIntersecting)).observe(el); else on = true;
  setInterval(() => { if (on && !document.hidden) fn(); }, every);
}

function main() {
  const html = document.documentElement;
  // Pages secondaires (services/…) : <body data-home="../">. Une section absente de la page renvoie vers l'accueil.
  const HOME = document.body.dataset.home || "";
  const goHome = (hash) => (location.href = `${HOME}index.html${hash || ""}`);

  // ---------- Défilement fluide (Lenis) ----------
  const lenis = !reduceMotion && window.Lenis ? new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true }) : null;
  if (lenis) {
    const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    // Fenêtres et tiroirs KTUI : on suspend le défilement de la page pendant qu'ils sont ouverts
    $$("[data-kt-modal], [data-kt-drawer]").forEach((el) => {
      el.addEventListener("show", () => lenis.stop());
      el.addEventListener("hide", () => lenis.start());
    });
  }
  const scrollToEl = (el) => {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };
  // Liens d'ancre : glissement fluide jusqu'à la section
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || !lenis) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.replaceState(null, "", id);
  });

  // ---------- Liens WhatsApp, candidatures, année ----------
  const defaultMsg = "Bonjour AD SOLUTIONS, je souhaite avoir des informations pour un projet (site web ou application).";
  $$("[data-wa]").forEach((a) => (a.href = wa(defaultMsg)));
  $$("[data-apply]").forEach((a) => {
    const body = ["Bonjour AD SOLUTIONS,", "", `Je souhaite postuler : ${a.dataset.apply}.`, "", "Nom et prénom :", "Téléphone / WhatsApp :", "Portfolio ou GitHub :", "", "(Pensez à joindre votre CV.)"].join("\n");
    a.href = `mailto:${RECRUTEMENT_EMAIL}?subject=${encodeURIComponent("Candidature : " + a.dataset.apply)}&body=${encodeURIComponent(body)}`;
  });
  $$('[data-project-link][href="#"]').forEach((a) => a.remove());
  $$("[data-wa-msg]").forEach((a) => (a.href = wa(a.dataset.waMsg)));

  // Bientôt : noms confidentiels brouillés en continu (dossier classé secret)
  $$("[data-redact]").forEach((el) => {
    const n = Number(el.dataset.redact) || 10, G = "█▓▒░#%&@$*+=?<>/\\";
    const tick = () => { el.textContent = Array.from({ length: n }, () => (Math.random() < 0.55 ? "█" : G[(Math.random() * G.length) | 0])).join(""); };
    whileVisible(el, tick, 140);
  });
  const yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $$("[data-kbd]").forEach((k) => (k.textContent = "⌘ K"));

  // ---------- Apparence : couleur (Orange AD / Bleu KTUI) + mode via KTThemeSwitch ----------
  const getMode = () => { try { return localStorage.getItem("ad-mode") || localStorage.getItem("kt-theme") || "light"; } catch (e) { return "light"; } };
  const syncAppearance = () => {
    $$("[data-accent-set]").forEach((b) => b.classList.toggle("is-on", b.dataset.accentSet === html.dataset.accent));
    $$("[data-mode-set]").forEach((b) => b.classList.toggle("is-on", b.dataset.modeSet === getMode()));
  };
  const withTransition = (origin, change) => {
    if (!document.startViewTransition || reduceMotion) return change();
    const r = origin ? origin.getBoundingClientRect() : null;
    const x = r ? r.left + r.width / 2 : innerWidth / 2, y = r ? r.top + r.height / 2 : 0;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(change).ready.then(() => {
      html.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" });
    });
  };
  // « espresso » et « foret » = mode sombre de KTUI + jetons de couleur propres (data-tone)
  const TONES = ["espresso", "foret"];
  function setMode(mode) {
    const ktMode = TONES.includes(mode) ? "dark" : mode;
    const sw = window.KTThemeSwitch && KTThemeSwitch.getInstance(html);
    if (sw) sw.setMode(ktMode);
    else {
      const m = ktMode === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : ktMode;
      html.classList.remove("dark", "light"); html.classList.add(m);
      try { localStorage.setItem("kt-theme", ktMode); } catch (e) {}
    }
    if (TONES.includes(mode)) html.dataset.tone = mode; else delete html.dataset.tone;
    try { localStorage.setItem("ad-mode", mode); } catch (e) {}
    syncAppearance();
  }
  function setAccent(accent) {
    html.dataset.accent = accent;
    try { localStorage.setItem("ad-accent", accent); } catch (e) {}
    syncAppearance();
  }
  $$("[data-mode-set]").forEach((b) => b.addEventListener("click", () => withTransition(b, () => setMode(b.dataset.modeSet))));
  $$("[data-accent-set]").forEach((b) => b.addEventListener("click", () => withTransition(b, () => setAccent(b.dataset.accentSet))));
  syncAppearance();
  // Palette Ctrl K : clair → sombre → espresso → forêt → clair
  const toggleTheme = () => withTransition(null, () => {
    const cur = TONES.includes(html.dataset.tone) ? html.dataset.tone : html.classList.contains("dark") ? "dark" : "light";
    setMode({ light: "dark", dark: "espresso", espresso: "foret", foret: "light" }[cur]);
  });

  // ---------- En-tête : collé, progression, lien actif, pastille ----------
  const hdr = $("#hdr"), progress = $("#progress"), waf = $("#wa-float"), contactSec = $("#contact");
  const nav = $("#nav"), glider = $(".glider", nav), links = $$(".nav-link", nav);
  const glideTo = (el) => {
    if (!el) return glider.classList.add("opacity-0");
    glider.style.transform = `translateX(${el.offsetLeft}px)`; glider.style.width = `${el.offsetWidth}px`;
    glider.classList.remove("opacity-0");
  };
  links.forEach((l) => l.addEventListener("mouseenter", () => glideTo(l)));
  nav.addEventListener("mouseleave", () => glideTo(null));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", (l.getAttribute("href") || l.dataset.href) === `#${e.target.id}`));
    }), { rootMargin: "-45% 0px -50% 0px" });
    ["realisations", "services", "methode", "offres", "apropos", "faq"].map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => spy.observe(el));
  }
  $('[data-href="#services"]')?.addEventListener("click", () => ($("#services") ? scrollToEl($("#services")) : goHome("#services")));

  // Frise de la méthode : la ligne se remplit au défilement (Aceternity « Tracing Beam »)
  const timeline = $("#timeline"), trace = timeline && $(".trace", timeline);
  let ticking = false;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    hdr.classList.toggle("is-stuck", y > 24);
    progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
    if (contactSec && waf) { const r = contactSec.getBoundingClientRect(); waf.classList.toggle("is-off", r.top < innerHeight * 0.7 && r.bottom > 0); }
    if (timeline && trace) {
      const r = timeline.getBoundingClientRect();
      const p = reduceMotion ? 1 : clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1);
      trace.style.setProperty("--trace", `${(p * 100).toFixed(1)}%`);
    }
    lightStatement();
    updateStory();
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  addEventListener("resize", onScroll);

  $$("[data-close-drawer]").forEach((el) => el.addEventListener("click", () => {
    const d = el.closest("[data-kt-drawer]");
    if (d && window.KTDrawer) KTDrawer.getInstance(d)?.hide();
  }));

  // ---------- Un projet prend vie : la section reste à l'écran et le site se construit au fil du défilement ----------
  const story = $("[data-story]");
  const storyFrame = $("#story-frame"), storySteps = $$(".story-step"), storyLines = $$(".story-line"), storyBar = $("#story-bar .kt-progress-indicator");
  const storyUrl = $("#story-url"), storyStatus = $("#story-status");
  const STEPS = [
    { url: "maquette · figma", status: "Maquette", variant: "warning" },
    { url: "localhost:3000", status: "En développement", variant: "primary" },
    { url: "app.votre-entreprise.bj", status: "En ligne ✓", variant: "success" },
  ];
  let storyStep = -1;
  function updateStory() {
    if (!story) return;
    const r = story.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
    const w1 = clamp((p - 0.18) / 0.2, 0, 1), w2 = clamp((p - 0.6) / 0.2, 0, 1);
    storyFrame.style.setProperty("--w1", `${(w1 * 100).toFixed(2)}%`);
    storyFrame.style.setProperty("--w2", `${(w2 * 100).toFixed(2)}%`);
    // Ligne lumineuse sur le front du balayage
    const active = w1 > 0 && w1 < 1 ? w1 : w2 > 0 && w2 < 1 ? w2 : -1;
    storyFrame.style.setProperty("--edge", `${(Math.max(active, 0) * 100).toFixed(2)}%`);
    storyFrame.style.setProperty("--edge-o", active >= 0 ? "1" : "0");
    // Le code s'écrit ligne par ligne
    const n = Math.round(clamp((p - 0.24) / 0.3, 0, 1) * storyLines.length);
    storyLines.forEach((l, i) => l.classList.toggle("on", i < n));
    storyBar.style.setProperty("--p", `${(p * 100).toFixed(1)}%`);
    const step = p < 0.36 ? 0 : p < 0.72 ? 1 : 2;
    if (step !== storyStep) {
      storyStep = step;
      storySteps.forEach((el, i) => { el.classList.toggle("is-on", i === step); el.classList.toggle("is-done", i < step); });
      storyUrl.textContent = STEPS[step].url;
      storyStatus.textContent = STEPS[step].status;
      storyStatus.className = storyStatus.className.replace(/kt-badge-(warning|primary|success)/g, "").trim() + ` kt-badge-${STEPS[step].variant}`;
    }
  }

  // ---------- TEXTE ----------
  $$("[data-words]").forEach((el) => {
    const words = el.textContent.trim().split(/[ \t\r\n]+/);
    el.textContent = "";
    words.forEach((w, i) => { const s = document.createElement("span"); s.className = "wd"; s.style.setProperty("--i", i); s.textContent = w; el.append(s, i < words.length - 1 ? " " : ""); });
  });
  const h1Words = $$("h1 [data-words]");
  if (h1Words[1]) h1Words[1].style.setProperty("--d0", "450ms");

  const rot = $(".rot");
  if (rot) {
    const words = rot.dataset.rotate.split("|");
    rot.textContent = "";
    const nodes = words.map((w) => {
      const wrap = document.createElement("span"); wrap.className = "rot__w";
      [...w].forEach((c, i) => { const s = document.createElement("span"); s.className = "rot__c"; s.style.setProperty("--i", i); s.textContent = c; wrap.append(s); });
      rot.append(wrap); return wrap;
    });
    let k = 0;
    const fit = () => rot.style.setProperty("--rw", `${nodes[k].scrollWidth + 2}px`);
    fit(); document.fonts?.ready.then(fit); addEventListener("resize", fit);
    setTimeout(() => nodes[0].classList.add("is-in"), reduceMotion ? 0 : 300);
    if (!reduceMotion) setInterval(() => {
      const cur = nodes[k]; k = (k + 1) % nodes.length; const nx = nodes[k];
      fit();
      cur.classList.replace("is-in", "is-out"); nx.classList.remove("is-out"); void nx.offsetWidth; nx.classList.add("is-in");
      setTimeout(() => cur.classList.remove("is-out"), 900);
    }, 2800);
  }

  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  function scramble(el, dur = 600) {
    if (reduceMotion || el.dataset.busy) return;
    const target = el.dataset.text || (el.dataset.text = el.textContent);
    el.dataset.busy = "1";
    const t0 = performance.now();
    const tick = (t) => {
      const p = clamp((t - t0) / dur, 0, 1), shown = Math.floor(p * target.length);
      el.textContent = [...target].map((c, i) => (i < shown || c === " " || c === "." ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (p < 1) requestAnimationFrame(tick); else { el.textContent = target; delete el.dataset.busy; }
    };
    requestAnimationFrame(tick);
  }
  $$("[data-scramble]").forEach((el) => { el.setAttribute("aria-label", el.textContent); onVisible(el, () => scramble(el)); });
  $$("[data-decrypt]").forEach((el) => (el.closest("article") || el).addEventListener("mouseenter", () => scramble(el, 600)));

  const statement = $("[data-light]");
  let sw = [];
  if (statement) {
    const hl = /^(Google,|confiance\.|jour|nuit\.)$/;
    const words = statement.textContent.trim().split(/\s+/);
    statement.textContent = "";
    words.forEach((w, i) => { const s = document.createElement("span"); s.className = "w" + (hl.test(w) ? " hl" : ""); s.textContent = w; statement.append(s, i < words.length - 1 ? " " : ""); });
    sw = $$(".w", statement);
  }
  function lightStatement() {
    if (!statement) return;
    if (reduceMotion) return sw.forEach((w) => w.classList.add("on"));
    const r = statement.getBoundingClientRect(), start = innerHeight * 0.85, end = innerHeight * 0.3;
    const lit = Math.round(clamp((start - r.top) / (start - end + r.height * 0.5), 0, 1) * sw.length);
    sw.forEach((w, i) => w.classList.toggle("on", i < lit));
  }

  // Magic UI « Number Ticker »
  $$("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion) return;
    el.textContent = "0";
    onVisible(el, () => {
      const t0 = performance.now(), dur = 1600;
      const tick = (t) => { const p = clamp((t - t0) / dur, 0, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  });

  $$("[data-letters]").forEach((el) => {
    const t = el.textContent; el.textContent = "";
    [...t].forEach((c) => { const s = document.createElement("span"); s.textContent = c === " " ? " " : c; el.append(s); });
  });

  // Boucles infinies : on double le contenu (React Bits « Logo Loop », Magic UI « 3D Marquee »)
  $$("[data-loop], [data-col]").forEach((t) => [...t.children].forEach((c) => { const d = c.cloneNode(true); d.setAttribute("aria-hidden", "true"); t.append(d); }));

  // ---------- Apparitions en cascade ----------
  const revealEls = $$("[data-reveal], [data-words]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    revealEls.forEach((el) => {
      if (!el.hasAttribute("data-reveal")) return;
      const sib = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
      const i = sib.indexOf(el);
      if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
    });
    revealEls.forEach((el) => onVisible(el, (t) => t.classList.add("is-in"), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }));
  } else revealEls.forEach((el) => el.classList.add("is-in"));

  // ---------- Magic UI « Animated List » ----------
  function animatedList(list, tpl, max, every) {
    if (!list || !tpl) return;
    const items = [...tpl.content.children];
    let i = 0;
    const push = () => {
      const node = items[i % items.length].cloneNode(true); i++;
      list.prepend(node);
      const extra = [...list.children].slice(max).filter((n) => !n.classList.contains("is-leaving"));
      extra.forEach((n) => { n.classList.add("is-leaving"); setTimeout(() => n.remove(), 400); });
    };
    for (let k = 0; k < max; k++) push();
    whileVisible(list, push, every);
  }
  animatedList($("#alist"), $("#alist-items"), 3, 2600);
  animatedList($("#orders"), $("#orders-items"), 4, 2200);

  // ---------- Magic UI « Terminal » ----------
  const term = $("#terminal");
  if (term) {
    const lines = $$(".term-line", term);
    const play = () => {
      lines.forEach((l) => l.classList.remove("on"));
      lines.forEach((l, i) => setTimeout(() => l.classList.add("on"), reduceMotion ? 0 : 350 + i * 650));
    };
    onVisible(term, play);
    whileVisible(term, play, 9000);
  }

  // ---------- Aceternity « Compare » : glisser pour comparer ----------
  const cmp = $("#compare");
  if (cmp) {
    let dragging = false, touched = false;
    const setPos = (p) => { p = clamp(p, 4, 96); cmp.style.setProperty("--pos", `${p}%`); cmp.setAttribute("aria-valuenow", Math.round(p)); };
    const fromEvent = (e) => { const r = cmp.getBoundingClientRect(); setPos(((e.clientX - r.left) / r.width) * 100); };
    cmp.addEventListener("pointerdown", (e) => { dragging = true; touched = true; cmp.setPointerCapture(e.pointerId); fromEvent(e); });
    cmp.addEventListener("pointermove", (e) => { if (dragging || (finePointer && e.pointerType === "mouse")) { touched = true; fromEvent(e); } });
    cmp.addEventListener("pointerup", () => (dragging = false));
    cmp.addEventListener("keydown", (e) => {
      const cur = parseFloat(getComputedStyle(cmp).getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") { touched = true; setPos(cur - 5); } else if (e.key === "ArrowRight") { touched = true; setPos(cur + 5); }
    });
    // Balayage automatique tant que le visiteur n'a pas pris la main
    if (!reduceMotion) {
      let t0 = performance.now();
      const sweep = (t) => { if (touched) return; setPos(50 + Math.sin((t - t0) / 1400) * 30); requestAnimationFrame(sweep); };
      onVisible(cmp, () => { t0 = performance.now(); requestAnimationFrame(sweep); });
    }
  }

  // ---------- Souris : Magic Card, carte 3D, surbrillance glissante, aimant, curseur ----------
  if (finePointer && !reduceMotion) {
    document.addEventListener("pointermove", (e) => {
      // lueur au curseur : cartes Magic et toutes les cartes / blocs (bordure qui s'allume sous le curseur)
      // (toute la chaîne : une carte posée dans une carte s'allume aussi au bon endroit)
      const SEL = ".magic, .kt-card, .kt-accordion-item, .kt-toggle-group";
      for (let card = e.target.closest?.(SEL); card; card = card.parentElement?.closest(SEL)) {
        const r = card.getBoundingClientRect(); card.style.setProperty("--mx", `${e.clientX - r.left}px`); card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    }, { passive: true });

    $$("[data-card3d]").forEach((wrap) => {
      const body = $(".card3d__body", wrap);
      wrap.addEventListener("pointermove", (e) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        body.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`); body.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
      });
      wrap.addEventListener("pointerleave", () => { body.style.removeProperty("--ry"); body.style.removeProperty("--rx"); });
    });

    // Hero : la scène oblique s'incline vers la souris (mouvement lissé), le reflet du verre liquide suit
    const tilt = $("#hero-tilt"), heroSec = $("#accueil");
    if (tilt && heroSec) {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      const step = () => {
        cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
        tilt.style.setProperty("--px", cx.toFixed(4)); tilt.style.setProperty("--py", cy.toFixed(4));
        tilt.style.setProperty("--gx", `${(30 + cx * 70).toFixed(1)}%`); tilt.style.setProperty("--gy", `${(-10 + cy * 50).toFixed(1)}%`);
        raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(step) : 0;
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
      heroSec.addEventListener("pointermove", (e) => {
        const r = tilt.getBoundingClientRect();
        // -1 à 1 : la scène atteint son inclinaison maximale quand la souris arrive sur ses bords (et au-delà)
        tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
        ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
        kick();
      }, { passive: true });
      heroSec.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
    }

    const values = $("#values"), glide = values && $(".hover-glide", values);
    if (values && glide) {
      $$(":scope > div", values).forEach((card) => card.addEventListener("pointerenter", () => {
        glide.style.transform = `translate(${card.offsetLeft}px, ${card.offsetTop}px)`;
        glide.style.width = `${card.offsetWidth}px`; glide.style.height = `${card.offsetHeight}px`;
        glide.style.opacity = "1";
      }));
      values.addEventListener("pointerleave", () => (glide.style.opacity = "0"));
    }

    $$("[data-magnet]").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.setProperty("--tx", `${((e.clientX - r.left - r.width / 2) * 0.2).toFixed(1)}px`); b.style.setProperty("--ty", `${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`); });
      b.addEventListener("pointerleave", () => { b.style.removeProperty("--tx"); b.style.removeProperty("--ty"); });
    });

    const cur = $(".cursor"), lbl = $(".cursor__label");
    let cx = -200, cy = -200, tx = -200, ty = -200, run = false;
    const follow = () => { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; cur.style.setProperty("--cx", `${cx.toFixed(1)}px`); cur.style.setProperty("--cy", `${cy.toFixed(1)}px`); if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) requestAnimationFrame(follow); else run = false; };
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; if (!run) { run = true; requestAnimationFrame(follow); } }, { passive: true });
    $$("[data-cursor]").forEach((el) => {
      el.addEventListener("pointerenter", () => { lbl.textContent = el.dataset.cursor; cur.classList.add("is-on"); });
      el.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
    });
  }

  // ---------- Devis : assistant KTUI Stepper dans une KTUI Modal ----------
  const dForm = $("#devis-form"), dStep = $("#devis-stepper");
  const dst = dStep && window.KTStepper && KTStepper.getInstance(dStep);
  if (dForm && dst) {
    const f = dForm.elements;
    if (!WA_READY) { const sub = $('button[type="submit"]', dForm); if (sub) sub.lastChild.textContent = "Recevoir mon devis par e-mail"; }
    const bar = $("#devis-bar .kt-progress-indicator");
    // Étapes lues directement : la modale est cachée au chargement (getItemElements ne voit que le visible)
    const dItems = $$("[data-kt-stepper-item]", dStep);
    const current = () => Math.max(1, dItems.findIndex((i) => i.classList.contains("active")) + 1);
    const syncBar = () => bar.style.setProperty("--p", `${(current() / dItems.length) * 100}%`);
    syncBar();
    const paneOk = (n) => {
      const pane = $(`#d-${n}`), err = $(".wizard-err", pane);
      let first = null;
      if (n === 1 && !$('input[name="type"]:checked', dForm)) first = $('input[name="type"]', dForm);
      if (n === 2 && !f.message.value.trim()) first = f.message;
      if (n === 3) [f.nom, f.tel].forEach((el) => { if (!el.value.trim() && !first) first = el; });
      if (n > 1) $$("input[required], textarea[required]", pane).forEach((el) => el.setAttribute("aria-invalid", String(!el.value.trim())));
      err.hidden = !first;
      if (first) { first.focus(); pane.animate?.([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 280 }); }
      return !first;
    };
    dStep.addEventListener("change", (e) => {
      const p = e.detail?.payload;
      if (p && p.step > current() && !paneOk(current())) p.cancel = true;
    });
    dStep.addEventListener("changed", syncBar);
    $("#devis").addEventListener("show", syncBar);
    $$("input, textarea", dForm).forEach((el) => el.addEventListener("input", () => el.removeAttribute("aria-invalid")));

    const TYPE_OF = { "AD START": "Site vitrine", "AD BUSINESS": "Site vitrine", "AD PREMIUM": "E-commerce" };
    $$("[data-devis-type]").forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.devisType, type = TYPE_OF[v] || v;
      const radio = $$('input[name="type"]', dForm).find((r) => r.value === type);
      const fallback = $$('input[name="type"]', dForm).find((r) => r.value === "Je ne sais pas encore");
      if (radio) radio.checked = true; else if (fallback) fallback.checked = true;
      // Service sans case dédiée (UI / UX, API, hébergement) : repris tel quel dans le message
      f.offre.value = TYPE_OF[v] ? v : radio ? "" : v;
      dst.goFirst();
    }));
    $$('[data-kt-modal-toggle="#devis"]:not([data-devis-type])').forEach((b) => b.addEventListener("click", () => (f.offre.value = "")));

    dForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!paneOk(3)) return;
      const type = $('input[name="type"]:checked', dForm)?.value || "Je ne sais pas encore";
      const delai = $('input[name="delai"]:checked', dForm)?.value;
      const lines = [
        "Bonjour AD SOLUTIONS,", "",
        `Nom : ${f.nom.value.trim()}`,
        `Téléphone : ${f.tel.value.trim()}`,
        f.entreprise.value.trim() ? `Entreprise : ${f.entreprise.value.trim()}` : null,
        `Projet : ${type}${f.offre.value ? ` (${f.offre.value})` : ""}`,
        delai ? `Délai : ${delai}` : null,
        "", f.message.value.trim(),
      ].filter((l) => typeof l === "string");
      sendRequest(lines.join("\n"), `Demande de devis : ${type}`);
      KTModal.getInstance($("#devis"))?.hide();
      toast(WA_READY ? "Votre demande est prête dans WhatsApp. Il ne reste qu'à l'envoyer." : "Votre demande est prête dans votre messagerie. Il ne reste qu'à l'envoyer.");
      dForm.reset(); dst.goFirst();
    });
  }

  // ---------- Audit gratuit ----------
  const aForm = $("#audit-form");
  aForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = aForm.elements;
    let first = null;
    [f.url, f.nom, f.tel].forEach((el) => { const bad = !el.value.trim(); el.setAttribute("aria-invalid", String(bad)); if (bad && !first) first = el; });
    if (first) { first.focus(); toast("Merci de remplir les champs marqués d'un *.", "warning"); return; }
    sendRequest(["Bonjour AD SOLUTIONS,", "", "Je souhaite un audit gratuit de :", f.url.value.trim(), "", `Nom : ${f.nom.value.trim()}`, `Téléphone : ${f.tel.value.trim()}`].join("\n"), "Demande d'audit gratuit");
    toast(WA_READY ? "Votre demande d'audit est prête dans WhatsApp." : "Votre demande d'audit est prête dans votre messagerie.");
  });
  $$("#audit-form input").forEach((el) => el.addEventListener("input", () => el.removeAttribute("aria-invalid")));

  document.addEventListener("kt.clipboard.success", () => toast("Copié dans le presse-papiers"));

  // ---------- Palette de commandes (KTUI Modal) ----------
  const pal = $("#palette"), pin = $("#palette-input"), plist = $("#palette-list");
  const pModal = () => window.KTModal && KTModal.getInstance(pal);
  const items = $$(".palette-item", plist);
  let sel = 0;
  const visible = () => items.filter((i) => !i.hidden);
  const mark = () => { const v = visible(); v.forEach((i, k) => i.classList.toggle("is-sel", k === sel)); v[sel]?.scrollIntoView({ block: "nearest" }); };
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filter = () => {
    const q = norm(pin.value.trim());
    items.forEach((i) => (i.hidden = !!q && !norm(i.textContent).includes(q)));
    $$(".palette-group", plist).forEach((g) => {
      let n = g.nextElementSibling, any = false;
      while (n && !n.classList.contains("palette-group")) { if (n.classList.contains("palette-item") && !n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
    $(".palette-empty", plist).hidden = visible().length > 0;
    sel = 0; mark();
  };
  const run = (it) => {
    if (!it) return;
    pModal()?.hide();
    setTimeout(() => {
      if (it.dataset.url) location.href = HOME + it.dataset.url;
      else if (it.dataset.go) ($(it.dataset.go) ? scrollToEl($(it.dataset.go)) : goHome(it.dataset.go));
      else if (it.dataset.act === "devis") KTModal.getInstance($("#devis"))?.show();
      else if (it.dataset.act === "wa") window.open(wa(defaultMsg), "_blank", "noopener");
      else if (it.dataset.act === "theme") toggleTheme();
    }, 220);
  };
  pin.addEventListener("input", filter);
  pin.addEventListener("keydown", (e) => {
    const v = visible();
    if (!v.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % v.length; mark(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + v.length) % v.length; mark(); }
    else if (e.key === "Enter") { e.preventDefault(); run(v[sel]); }
  });
  items.forEach((it) => { it.addEventListener("click", () => run(it)); it.addEventListener("mousemove", () => { const k = visible().indexOf(it); if (k !== sel) { sel = k; mark(); } }); });
  pal.addEventListener("show", () => { pin.value = ""; filter(); setTimeout(() => pin.focus(), 60); });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); const m = pModal(); if (m) m.isOpen() ? m.hide() : m.show(); }
  });

  onScroll();
}

// Sécurité : si le script plante, on retire la classe « js » pour que tout le contenu masqué par les animations s'affiche
function boot() {
  try { main(); }
  catch (err) { document.documentElement.classList.remove("js"); throw err; }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
