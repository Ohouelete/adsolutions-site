# AD SOLUTIONS — Signature visuelle (guide pour agents IA)

> **À l'agent qui lit ce fichier.** Tu construis une interface (site, landing page, dashboard, app web) dans la
> **signature AD SOLUTIONS**. Applique ce guide à la lettre : les règles « TOUJOURS » et « JAMAIS » sont non
> négociables, les valeurs (couleurs, opacités, tailles) sont exactes. Le CSS fourni est autonome : copie la
> section « Kit CSS » telle quelle, puis construis avec ses classes. Si le projet utilise Tailwind, KTUI,
> shadcn ou autre, garde leurs composants mais applique par-dessus les jetons et les classes de ce kit.

---

## 1. L'esprit en une phrase

**Un plan d'architecte sombre et précis, éclairé par une seule couleur : l'orange.**
Des surfaces en **noir transparent**, posées sur un **fond à anneaux** très discret, découpées par des
**délimitations techniques** (filets, règles graduées, croix, pointillés, étiquettes numérotées). L'orange ne sert
qu'à **signaler** : un bouton principal, un repère, une lueur sous le curseur.

Mots-clés : *blueprint*, *précision*, *calme*, *profondeur*, *orange dosé*.

---

## 2. Règles d'or

**TOUJOURS**
1. Des **délimitations partout** : chaque section séparée par un filet + trait orange + losange ; règles graduées ;
   croix « + » aux intersections ; pointillés à l'intérieur des cartes ; étiquette numérotée « 05 — SERVICES ».
2. Les surfaces (cartes, blocs, panneaux) en **noir transparent** (`--glass-black`) **sans aucun flou**, avec des
   **ombres marquées** (portée + intérieure) pour que la transparence se lise.
3. Bordures de cartes **grises** façon « champ actif » (bord + anneau de 3 px). L'**orange n'apparaît qu'au survol**,
   **localisé sous le curseur**.
4. Un **fond à anneaux concentriques** sur toutes les sections, en alternant grands et moyens anneaux, dosé à ~3 %.
5. Des **visuels génériques** (maquettes dessinées en HTML/CSS, dashboards, apps fictives) : marque « Votre marque »,
   domaine `votre-entreprise.bj`, montants en F CFA, paiement Mobile Money.
6. Clair **et** sombre soignés tous les deux. Le sombre est le mode « vitrine ».
7. Respecter `prefers-reduced-motion` (aucune animation) et le tactile (pas d'effet de survol).

**JAMAIS**
1. **Trop d'orange** : pas de fonds orange, pas de bordures orange permanentes partout, pas de dégradés orange plein écran.
   Seule exception : la carte mise en avant (offre « le plus demandé ») garde un cadre orange.
2. **Pas de flou** (`backdrop-filter: blur`), pas de liquid glass à reflets ou lentilles, pas de neumorphism.
3. Pas de capture d'un projet client en vedette (hero, mises en scène) : les projets clients vont **uniquement** dans
   « Réalisations / études de cas ».
4. Pas de liste de technologies en héros d'une page : on montre ce qu'on **livre**, pas avec quoi.
5. Pas d'émojis décoratifs, pas d'illustrations 3D génériques, pas de photos de stock.

---

## 3. Jetons de design

| Jeton | Clair | Sombre | Rôle |
|---|---|---|---|
| `--background` | `oklch(100% 0 0)` | `oklch(14.1% .005 285.8)` | fond de page |
| `--foreground` | `oklch(14.1% .005 285.8)` | `oklch(98.5% 0 0)` | texte |
| `--mono` | quasi-noir | quasi-blanc | titres, boutons sombres |
| `--muted-foreground` | gris moyen | gris clair | textes secondaires |
| `--border` | `oklch(92% .004 286)` | `oklch(27% .006 286)` | filets |
| `--primary` | `oklch(64.6% .222 41.1)` (orange-600) | `oklch(70.5% .213 47.6)` (orange-500) | **seul accent** |
| `--glass-black` | `rgb(0 0 0 / .08)` | `rgb(0 0 0 / .38)` | surfaces « noir transparent » |

- **Police** : Inter (variable). Titres `font-weight: 600`, `letter-spacing: -.02em`, interlignage serré (1.05).
  Étiquettes techniques en **monospace** majuscules, `letter-spacing: .22em`, 10–11 px.
- **Rayons** : cartes 12–16 px, boutons 8–10 px, pastilles 999 px.
- **Easing** : `cubic-bezier(.22, 1, .36, 1)` (out-expo) pour tout.
- **Grille** : conteneur max 80rem (1280 px) centré ; deux **rails verticaux** sur ses bords (desktop).

---

## 4. Kit CSS (à copier tel quel)

```css
/* ============ AD SIGNATURE — jetons ============ */
:root {
  --background: oklch(100% 0 0); --foreground: oklch(14.1% .005 285.8);
  --mono: oklch(21% .006 285.9); --mono-foreground: oklch(98.5% 0 0);
  --muted: oklch(96.7% .001 286.4); --muted-foreground: oklch(55.2% .016 285.9);
  --border: oklch(92% .004 286.3);
  --primary: oklch(64.6% .222 41.116); --primary-foreground: #fff;
  --ease: cubic-bezier(.22, 1, .36, 1);
  --rail-x: max(1rem, calc(50% - 40rem));                 /* position des rails = bords du conteneur */
  --glass-black: rgb(0 0 0 / .08);
  --glass-shadow: inset 0 1px 0 rgb(255 255 255 / .6), inset 0 10px 24px -14px rgb(0 0 0 / .16),
    inset 0 -10px 20px -16px rgb(0 0 0 / .12), 0 2px 4px rgb(0 0 0 / .08),
    0 12px 28px -10px rgb(0 0 0 / .3), 0 28px 56px -28px rgb(0 0 0 / .25);
  --glass-shadow-sm: inset 0 1px 0 rgb(255 255 255 / .5), inset 0 6px 14px -10px rgb(0 0 0 / .14),
    0 1px 3px rgb(0 0 0 / .1), 0 8px 18px -8px rgb(0 0 0 / .24);
  --edge: color-mix(in oklab, var(--foreground) 28%, transparent);           /* bord gris « champ actif » */
  --edge-ring: 0 0 0 3px color-mix(in oklab, var(--foreground) 9%, transparent);
  --ink: color-mix(in oklab, var(--foreground) 3%, transparent);              /* encre des motifs de fond */
  --ink-accent: color-mix(in oklab, var(--primary) 5%, transparent);
}
.dark {
  --background: oklch(14.1% .005 285.8); --foreground: oklch(98.5% 0 0);
  --mono: oklch(98.5% 0 0); --mono-foreground: oklch(21% .006 285.9);
  --muted: oklch(27.4% .006 286); --muted-foreground: oklch(70.5% .015 286);
  --border: oklch(27.4% .006 286);
  --primary: oklch(70.5% .213 47.604);
  --glass-black: rgb(0 0 0 / .38);
  --glass-shadow: inset 0 1px 0 rgb(255 255 255 / .08), inset 0 12px 28px -14px rgb(0 0 0 / .55),
    0 2px 4px rgb(0 0 0 / .5), 0 16px 36px -12px rgb(0 0 0 / .8), 0 32px 64px -28px rgb(0 0 0 / .7);
  --glass-shadow-sm: inset 0 1px 0 rgb(255 255 255 / .06), inset 0 8px 16px -10px rgb(0 0 0 / .5),
    0 1px 3px rgb(0 0 0 / .45), 0 8px 18px -8px rgb(0 0 0 / .7);
  --edge: color-mix(in oklab, var(--foreground) 30%, transparent);
  --edge-ring: 0 0 0 3px color-mix(in oklab, var(--foreground) 10%, transparent);
  --ink: color-mix(in oklab, var(--foreground) 5%, transparent);
  --ink-accent: color-mix(in oklab, var(--primary) 9%, transparent);
}
html { background: var(--background); color: var(--foreground); }
body { overflow-x: clip; font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }

/* ============ 1. Surface : noir transparent ============ */
.ad-card {
  position: relative; isolation: isolate; border-radius: 16px;
  background: var(--glass-black); border: 1px solid var(--edge);
  box-shadow: var(--edge-ring), var(--glass-shadow);
}
.ad-card .ad-card, .ad-block { background: var(--glass-black); border: 1px solid var(--edge); border-radius: 12px;
  box-shadow: var(--edge-ring), var(--glass-shadow-sm); }
.ad-card--featured { border-color: var(--primary); }            /* la seule carte à cadre orange */
.ad-card hr, .ad-card .ad-sep { border: 0; border-top: 1px dashed var(--border); }   /* séparations internes */

/* Repères d'angle (traits de coupe), orange au survol */
.ad-card { --cm: color-mix(in oklab, var(--foreground) 22%, transparent); }
.ad-card:hover { --cm: color-mix(in oklab, var(--primary) 75%, transparent); }
.ad-card {
  background:
    linear-gradient(var(--cm), var(--cm)) left 9px top 9px / 11px 1px no-repeat,
    linear-gradient(var(--cm), var(--cm)) left 9px top 9px / 1px 11px no-repeat,
    linear-gradient(var(--cm), var(--cm)) right 9px top 9px / 11px 1px no-repeat,
    linear-gradient(var(--cm), var(--cm)) right 9px top 9px / 1px 11px no-repeat,
    linear-gradient(var(--cm), var(--cm)) left 9px bottom 9px / 11px 1px no-repeat,
    linear-gradient(var(--cm), var(--cm)) left 9px bottom 9px / 1px 11px no-repeat,
    linear-gradient(var(--cm), var(--cm)) right 9px bottom 9px / 11px 1px no-repeat,
    linear-gradient(var(--cm), var(--cm)) right 9px bottom 9px / 1px 11px no-repeat,
    var(--glass-black);
}

/* Lueur orange sous le curseur (bordure + reflet intérieur) — nécessite le JS « curseur » §5 */
.ad-card::before {
  content: ""; position: absolute; inset: 0; z-index: 3; border-radius: inherit; padding: 2px; pointer-events: none;
  opacity: 0; transition: opacity .3s;
  background: radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), var(--primary),
              color-mix(in oklab, var(--primary) 45%, transparent) 35%, transparent 70%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
.ad-card::after {
  content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none; opacity: 0;
  transition: opacity .3s;
  background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--primary) 8%, transparent), transparent 65%);
}
.ad-card:is(:hover, :focus-within)::before, .ad-card:is(:hover, :focus-within)::after { opacity: 1; }

/* ============ 2. Fond à anneaux (Gradient Magic « Dark Backgrounds » n° 50 et 51) ============ */
.ad-section { position: relative; padding-block: 6rem; }
.ad-bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; background-position: center top; }
.ad-bg--rings-l { background-size: 88px 88px;          /* grands anneaux : sections aérées */
  background-image: repeating-radial-gradient(circle at center, transparent 0 13px, var(--ink) 13px 26px,
    transparent 26px 27px, var(--ink) 27px 32px, transparent 32px 34px, var(--ink-accent) 34px 36px); }
.ad-bg--rings-m { background-size: 60px 60px;          /* anneaux moyens : sections denses */
  background-image: repeating-radial-gradient(circle at center, transparent 0 8px, var(--ink) 8px 11px,
    transparent 11px 17px, var(--ink) 17px 25px, transparent 25px 38px, var(--ink-accent) 38px 42px); }
/* Voile orange qui serpente sur toute la page (à poser une fois dans <main>) */
.ad-thread { position: absolute; inset: 0; z-index: -2; pointer-events: none;
  background:
    radial-gradient(ellipse 45% 5% at 12% 4%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 70%),
    radial-gradient(ellipse 40% 6% at 88% 25%, color-mix(in oklab, var(--primary) 9%, transparent), transparent 70%),
    radial-gradient(ellipse 45% 6% at 10% 50%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 70%),
    radial-gradient(ellipse 40% 6% at 90% 75%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 70%),
    radial-gradient(ellipse 60% 6% at 50% 95%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 70%); }

/* ============ 3. Rails verticaux gradués (desktop) ============ */
.ad-rails { position: absolute; inset: 0; z-index: -1; pointer-events: none; display: none; }
@media (min-width: 1024px) { .ad-rails { display: block; } }
.ad-rails::before, .ad-rails::after { content: ""; position: absolute; top: 0; bottom: 0; width: 9px;
  --rl: color-mix(in oklab, var(--foreground) 16%, transparent);
  background:
    linear-gradient(var(--rl), var(--rl)) 50% 0 / 1px 100% repeat-y,
    linear-gradient(var(--rl) 0 1px, transparent 1px) 50% 0 / 9px 120px repeat-y,
    linear-gradient(color-mix(in oklab, var(--foreground) 10%, transparent) 0 1px, transparent 1px) 50% 0 / 5px 24px repeat-y; }
.ad-rails::before { left: calc(var(--rail-x) - 4px); } .ad-rails::after { right: calc(var(--rail-x) - 4px); }

/* ============ 4. Séparation entre sections ============
   filet double + trait orange 2 px + losange + halo + croix sur les rails + étiquette « 05 — SERVICES » */
main { counter-reset: sec; position: relative; }
.ad-section { counter-increment: sec; }
.ad-section + .ad-section::before {
  --ln: color-mix(in oklab, var(--foreground) 22%, transparent);
  content: ""; position: absolute; left: 0; right: 0; top: 0; height: 90px; z-index: 1; pointer-events: none;
  background:
    linear-gradient(90deg, transparent, var(--primary) 30%, var(--primary) 70%, transparent) 50% 0 / min(760px, 76%) 2px no-repeat,
    linear-gradient(90deg, transparent, var(--ln) 6%, var(--ln) 94%, transparent) 0 0 / 100% 1px no-repeat,
    linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 8%, transparent) 10% 90%, transparent) 0 5px / 100% 1px no-repeat,
    radial-gradient(ellipse 50% 100% at 50% 0, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%) 50% 0 / 100% 90px no-repeat,
    linear-gradient(color-mix(in oklab, var(--foreground) 4%, transparent), transparent) 0 0 / 100% 48px no-repeat;
}
.ad-section + .ad-section::after {
  --c: color-mix(in oklab, var(--foreground) 55%, transparent);
  content: counter(sec, decimal-leading-zero) "  —  " attr(data-label);
  position: absolute; left: 0; right: 0; top: -10px; height: 46px; z-index: 2; pointer-events: none;
  padding: 32px 0 0 calc(var(--rail-x) + 18px); white-space: pre;
  font: 600 10.5px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .22em; text-transform: uppercase;
  color: color-mix(in oklab, var(--foreground) 50%, transparent);
  background:
    linear-gradient(var(--c), var(--c)) calc(var(--rail-x) - 10px) 10px / 21px 1px no-repeat,
    linear-gradient(var(--c), var(--c)) var(--rail-x) 0 / 1px 21px no-repeat,
    linear-gradient(var(--c), var(--c)) calc(100% - var(--rail-x) + 10px) 10px / 21px 1px no-repeat,
    linear-gradient(var(--c), var(--c)) calc(100% - var(--rail-x)) 0 / 1px 21px no-repeat,
    /* losange central */
    linear-gradient(to bottom right, transparent 50%, var(--primary) 50%) calc(50% - 3px) 4px / 6px 6px no-repeat,
    linear-gradient(to bottom left, transparent 50%, var(--primary) 50%) calc(50% + 3px) 4px / 6px 6px no-repeat,
    linear-gradient(to top right, transparent 50%, var(--primary) 50%) calc(50% - 3px) 10px / 6px 6px no-repeat,
    linear-gradient(to top left, transparent 50%, var(--primary) 50%) calc(50% + 3px) 10px / 6px 6px no-repeat;
}

/* ============ 5. Cadre « plan technique » d'une section (desktop) ============
   règle graduée sous la séparation, lignes de repère en pointillé, croix, plaque « AD · 05 / NN » */
@media (min-width: 1024px) {
  .ad-section > .ad-bg::after {
    --g: color-mix(in oklab, var(--foreground) 20%, transparent); --gd: color-mix(in oklab, var(--foreground) 14%, transparent);
    content: "AD  ·  " counter(sec, decimal-leading-zero) " / 13";          /* ← remplace 13 par le nombre de sections */
    position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: flex-end;
    padding: 0 calc(var(--rail-x) + 16px) 76px 0; white-space: pre;
    font: 600 10px/1 ui-monospace, monospace; letter-spacing: .24em; color: color-mix(in oklab, var(--foreground) 32%, transparent);
    background:
      repeating-linear-gradient(90deg, var(--g) 0 1px, transparent 1px 40px) 50% 0 / calc(100% - 2 * var(--rail-x)) 5px no-repeat,
      repeating-linear-gradient(90deg, color-mix(in oklab, var(--primary) 55%, transparent) 0 1px, transparent 1px 200px) 50% 0 / calc(100% - 2 * var(--rail-x)) 10px no-repeat,
      repeating-linear-gradient(90deg, var(--gd) 0 6px, transparent 6px 12px) 50% 64px / calc(100% - 2 * var(--rail-x)) 1px no-repeat,
      repeating-linear-gradient(90deg, var(--gd) 0 6px, transparent 6px 12px) 50% calc(100% - 64px) / calc(100% - 2 * var(--rail-x)) 1px no-repeat;
  }
}

/* ============ 6. Titres et badges ============ */
.ad-kicker { position: relative; display: inline-flex; padding: .2rem .7rem; border-radius: 999px; font-size: .75rem; font-weight: 500;
  color: var(--primary); background: color-mix(in oklab, var(--primary) 10%, transparent);
  border: 1px solid color-mix(in oklab, var(--primary) 25%, transparent); }
.ad-kicker::after, .ad-center .ad-kicker::before { content: ""; position: absolute; top: 50%; width: 56px; height: 1px;
  background: linear-gradient(90deg, var(--primary), transparent); }
.ad-kicker::after { left: calc(100% + 10px); }
.ad-center .ad-kicker::before { right: calc(100% + 10px); background: linear-gradient(270deg, var(--primary), transparent); }
.ad-h2 { font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 600; letter-spacing: -.02em; line-height: 1.05; color: var(--mono); }
.ad-h2:not(.ad-center *)::after { content: ""; display: block; width: 140px; height: 2px; margin-top: 1.1rem;  /* titre à gauche */
  background: linear-gradient(var(--primary), var(--primary)) 0 0 / 36px 2px no-repeat,
              linear-gradient(90deg, transparent 0 42px, var(--border) 42px) 0 50% / 100% 1px no-repeat; }
.ad-center { text-align: center; }
.ad-center::after { content: ""; display: block; height: 9px; width: min(260px, 70%); margin: 2rem auto 0;   /* titre centré */
  background:
    linear-gradient(to bottom right, transparent 50%, var(--primary) 50%) calc(50% - 2.25px) 0 / 4.5px 4.5px no-repeat,
    linear-gradient(to bottom left, transparent 50%, var(--primary) 50%) calc(50% + 2.25px) 0 / 4.5px 4.5px no-repeat,
    linear-gradient(to top right, transparent 50%, var(--primary) 50%) calc(50% - 2.25px) 100% / 4.5px 4.5px no-repeat,
    linear-gradient(to top left, transparent 50%, var(--primary) 50%) calc(50% + 2.25px) 100% / 4.5px 4.5px no-repeat,
    linear-gradient(90deg, transparent, var(--border) 20% 42%, transparent 42% 58%, var(--border) 58% 80%, transparent) 0 50% / 100% 1px no-repeat; }

/* ============ 7. Illustrations et fenêtres ============ */
.ad-frame { outline: 1px dashed color-mix(in oklab, var(--foreground) 22%, transparent); outline-offset: 9px; }  /* repère d'impression */
.ad-window { overflow: hidden; border-radius: 14px; border: 1px solid var(--edge); background: var(--background); box-shadow: var(--edge-ring), var(--glass-shadow); }
.ad-window__bar { display: flex; align-items: center; gap: .75rem; padding: .55rem .8rem; border-bottom: 1px solid var(--border);
  background: color-mix(in oklab, var(--muted) 70%, transparent); font: 12px ui-monospace, monospace; color: var(--muted-foreground); }
.ad-window__bar i { width: 10px; height: 10px; border-radius: 50%; } /* rouge #f87171, jaune #facc15, vert #22c55e */

/* ============ 8. Boutons ============ */
.ad-btn { display: inline-flex; align-items: center; gap: .5rem; height: 2.5rem; padding: 0 1rem; border-radius: 10px;
  font-weight: 500; transition: transform .2s var(--ease), box-shadow .2s; }
.ad-btn--primary { background: var(--primary); color: var(--primary-foreground);
  box-shadow: 0 10px 26px -12px color-mix(in oklab, var(--primary) 85%, transparent); }
.ad-btn--outline { border: 1px solid var(--border); background: var(--background); color: var(--mono); }
.ad-btn:active { transform: scale(.98); }

@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
```

---

## 5. JavaScript minimal (lueur sous le curseur)

```js
// La bordure orange s'allume sous le curseur, sur la carte survolée ET ses cartes parentes.
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const SEL = ".ad-card";
  document.addEventListener("pointermove", (e) => {
    for (let c = e.target.closest?.(SEL); c; c = c.parentElement?.closest(SEL)) {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
  }, { passive: true });
}
```

Facultatif mais dans la signature : une **scène en 3D oblique** pour le visuel du héros
(`perspective: 1500px; transform: rotateX(14deg) rotateY(-20deg) rotateZ(3deg)`), qui s'incline vers la souris
avec un mouvement lissé (interpolation `cur += (target - cur) * .12` dans `requestAnimationFrame`), et dont les
éléments sont à des profondeurs différentes (`translate: 0 0 80px` pour le téléphone, `120px` pour les notifications).

---

## 6. Squelette de page

```html
<html class="dark"> <!-- ou sans .dark -->
<body>
  <header class="ad-header">…logo · navigation · bouton « Démarrer un projet » (ad-btn--primary)…</header>
  <main>
    <div class="ad-thread" aria-hidden="true"></div>
    <div class="ad-rails" aria-hidden="true"></div>

    <section class="ad-section" data-label="Accueil">
      <div class="ad-bg ad-bg--rings-l" aria-hidden="true"></div>   <!-- alterner -l / -m d'une section à l'autre -->
      <div class="container">
        <span class="ad-kicker">Nouveau</span>
        <h1>…</h1>
        <!-- visuel : maquettes génériques (site + app) dans .ad-window, posées en 3D oblique -->
      </div>
    </section>

    <section class="ad-section" data-label="Services">
      <div class="ad-bg ad-bg--rings-m" aria-hidden="true"></div>
      <div class="container">
        <div class="ad-center"><span class="ad-kicker">Services</span><h2 class="ad-h2">…</h2><p>…</p></div>
        <div class="grid">
          <article class="ad-card">…<hr>…</article>
          <article class="ad-card ad-card--featured">…</article>   <!-- une seule mise en avant -->
        </div>
      </div>
    </section>
  </main>
</body>
```

`.container` = `max-width: 80rem; margin-inline: auto; padding-inline: 1.25rem;` (2rem en desktop).

---

## 7. Recettes de composants

| Composant | Recette |
|---|---|
| **Héros** | Titre 3 lignes avec un mot en orange qui tourne (« votre site web / votre app mobile / … »), sous-titre, 2 boutons (primaire + outline), à droite une scène 3D oblique : fenêtre de navigateur avec un site générique + téléphone avec une app (commande, paiement Mobile Money) + 3 notifications (« Nouvelle commande », « Paiement reçu », « Message WhatsApp »). |
| **Carte de service** | `.ad-card` ; en haut une zone d'illustration (`.ad-block`) qui dessine le service en CSS (mini-site, liste de commandes, barres de graphique, terminal) ; séparation en pointillé ; titre + numéro « 01 » en badge ; lien « Demander un devis ». |
| **Offres / prix** | 3 `.ad-card`, celle du milieu `--featured` et décalée de -12 px vers le haut, badge orange « Le plus demandé ». Onglets en pastilles au-dessus. |
| **Méthode** | Frise verticale : jour à gauche (« JOUR 1 », « SOUS 24 H » en orange majuscules), nœud numéroté sur la ligne, carte à droite avec badges. |
| **Dashboard** | Menu latéral (item actif : fond orange 12 % + liseré gauche orange), barre du haut (recherche en pastille, cloche, avatar), titre + filtre « 7 derniers jours », 4 indicateurs (valeur + tendance ▲ verte / ▼ rouge), graphique en aire (courbe orange + dégradé, semaine précédente en pointillé), liste « Dernières commandes » avec avatars et statuts en pastilles (Payée vert, En cours orange, Livrée bleu). Tout en `--glass-black`, séparations en pointillé. |
| **Mise en scène** | Fenêtre qui reste à l'écran au défilement : maquette filaire en pointillé → code ligne par ligne → interface finie, révélées par une ligne de balayage orange lumineuse. La maquette et l'interface finie ont **la même structure**. |
| **FAQ** | Accordéon : chaque question est une `.ad-card` ; titre à gauche avec trait d'accent, questions à droite. |
| **Pied de page** | Colonnes séparées par des pointillés verticaux, grand mot-symbole de la marque encadré de deux pointillés, barre légale en pointillé. |

---

## 8. Ton et contenu

- Français, phrases courtes, vouvoiement, concret. On parle de **résultats** (« Votre activité, ouverte 24 h/24 »).
- Données fictives crédibles : prénoms ouest-africains (Awa, Koffi, Aminata, Fatou), montants en **F CFA**
  (« 41 500 F »), **MTN MoMo / Moov / FedaPay**, WhatsApp comme canal principal, domaines `.bj`.
- Boutons : verbe d'action (« Démarrer mon projet », « Demander un devis », « Voir les offres »).

---

## 9. Checklist avant de livrer

- [ ] Chaque section a un fond à anneaux (l / m en alternance) et une séparation avec étiquette numérotée.
- [ ] Rails gradués visibles en desktop, croix aux intersections, plaque « AD · NN / total » correcte.
- [ ] Toutes les surfaces en `--glass-black` + ombres, **aucun** `backdrop-filter`.
- [ ] Bordures grises ; l'orange n'apparaît qu'au survol (sous le curseur), sur les boutons primaires, les accents et une seule carte mise en avant.
- [ ] Visuels génériques, aucun projet client hors section Réalisations.
- [ ] Rendu vérifié en clair, en sombre et à 390 px de large ; pas de débordement horizontal.
- [ ] `prefers-reduced-motion` respecté ; pas d'effet de survol sur tactile.
