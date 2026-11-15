// Copie dans assets/ les fichiers à mettre en ligne depuis node_modules :
// le JavaScript de KTUI et de Lenis (défilement fluide) et la police Inter (police par défaut de KTUI), en latin et latin étendu.
import { copyFileSync, mkdirSync } from "node:fs";

const copies = [
  ["node_modules/@keenthemes/ktui/dist/ktui.min.js", "assets/js/ktui.min.js"],
  ["node_modules/lenis/dist/lenis.min.js", "assets/js/lenis.min.js"],
  ["node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "assets/fonts/inter-latin-wght-normal.woff2"],
  ["node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2", "assets/fonts/inter-latin-ext-wght-normal.woff2"],
];
for (const dir of ["assets/js", "assets/fonts"]) mkdirSync(dir, { recursive: true });
for (const [from, to] of copies) {
  copyFileSync(from, to);
  console.log(`copié : ${to}`);
}
