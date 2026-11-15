/* ============================================================
   Hero 3D : le symbole AD SOLUTIONS en volume (Three.js, WebGL)
   Compilé et minifié par esbuild vers assets/js/hero3d.js (npm run js).
   - Les deux équerres du logo (coordonnées exactes de logos/ad-solutions-symbole.svg), extrudées et biseautées.
   - Matériaux « laque métallisée » éclairés par un environnement studio (RoomEnvironment).
   - Arrivée : les deux pièces viennent de loin et s'emboîtent ; ensuite flottement, inclinaison vers la souris,
     léger « souffle » entre les deux pièces.
   - Pause hors écran / onglet caché ; image fixe si le visiteur demande moins d'animations ;
     sans WebGL, la tuile 2D d'origine reste affichée.
   ============================================================ */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Shape, ExtrudeGeometry,
  MeshPhysicalMaterial, PMREMGenerator, ACESFilmicToneMapping, SRGBColorSpace, DirectionalLight, Color, MathUtils,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const host = document.getElementById("hero3d");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function supportsWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; }
}

// Démarrage différé : le texte du hero s'anime d'abord, la 3D arrive quand le navigateur est disponible
if (host && supportsWebGL()) {
  const go = () => init();
  if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1200 }); else setTimeout(go, 400);
}

function lShape(points) {
  // Coordonnées du SVG (0–120, y vers le bas) → centrées sur 0 et y vers le haut
  const s = new Shape();
  points.forEach(([x, y], i) => { const px = x - 60, py = 60 - y; i ? s.lineTo(px, py) : s.moveTo(px, py); });
  s.closePath();
  return s;
}

function init() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "hero3d__canvas";
  host.append(canvas);

  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const renderer = new WebGLRenderer({ canvas, antialias: dpr < 1.5, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(30, 1, 1, 2000);
  camera.position.set(0, 0, 330);

  // Lumière de découpe : fait briller les arêtes, même sur fond sombre
  const rim = new DirectionalLight(0xffffff, 2.2); rim.position.set(-160, 180, 120); scene.add(rim);
  const warm = new DirectionalLight(0xffb27d, 1.4); warm.position.set(200, -120, 160); scene.add(warm);

  const extrude = { depth: 16, bevelEnabled: true, bevelThickness: 3.2, bevelSize: 2.6, bevelSegments: 8, curveSegments: 4 };
  const navyGeo = new ExtrudeGeometry(lShape([[10, 10], [72, 10], [72, 34], [34, 34], [34, 72], [10, 72]]), extrude);
  const orangeGeo = new ExtrudeGeometry(lShape([[110, 110], [48, 110], [48, 86], [86, 86], [86, 48], [110, 48]]), extrude);
  [navyGeo, orangeGeo].forEach((g) => g.translate(0, 0, -extrude.depth / 2));

  const navyMat = new MeshPhysicalMaterial({ color: new Color("#1a2b47"), metalness: 0.55, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06 });
  const orangeMat = new MeshPhysicalMaterial({ color: new Color("#F26B1D"), metalness: 0.3, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, emissive: new Color("#F26B1D"), emissiveIntensity: 0.12 });

  const navy = new Mesh(navyGeo, navyMat);
  const orange = new Mesh(orangeGeo, orangeMat);
  const logo = new Group(); logo.add(navy, orange);
  const tilt = new Group(); tilt.add(logo);
  scene.add(tilt);

  // Le symbole remplit la zone, quelle que soit sa taille
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(host); else addEventListener("resize", resize);

  // Souris : inclinaison douce vers le pointeur (toute la fenêtre)
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("pointermove", (e) => { tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });

  host.classList.add("is-3d");

  if (reduceMotion) {
    tilt.rotation.set(-0.18, 0.42, 0);
    renderer.render(scene, camera);
    return;
  }

  let visible = true, raf = 0;
  const t0 = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  function frame(now) {
    const t = (now - t0) / 1000;
    // Arrivée : les deux pièces viennent de loin, en tournant, puis s'emboîtent (1,8 s)
    const k = ease(MathUtils.clamp(t / 1.8, 0, 1));
    const breathe = k >= 1 ? Math.sin(t * 1.4) * 2.2 : 0;
    navy.position.set(MathUtils.lerp(-140, 0, k) - breathe, MathUtils.lerp(120, 0, k) + breathe, MathUtils.lerp(-120, 0, k));
    orange.position.set(MathUtils.lerp(140, 0, k) + breathe, MathUtils.lerp(-120, 0, k) - breathe, MathUtils.lerp(-120, 0, k));
    navy.rotation.z = MathUtils.lerp(-1.2, 0, k);
    orange.rotation.z = MathUtils.lerp(1.2, 0, k);
    logo.scale.setScalar(MathUtils.lerp(0.6, 1, k));

    // Flottement + oscillation lente + inclinaison vers la souris
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    tilt.rotation.y = Math.sin(t * 0.5) * 0.35 + mx * 0.45;
    tilt.rotation.x = Math.sin(t * 0.7) * 0.08 - 0.12 + my * 0.3;
    tilt.position.y = Math.sin(t * 1.1) * 4;

    renderer.render(scene, camera);
    raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
  }
  const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }).observe(host);
  document.addEventListener("visibilitychange", start);
  start();
}
