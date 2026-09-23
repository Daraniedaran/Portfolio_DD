import { useEffect, useRef } from "react";
import * as THREE from "three";
import { computeParticle, paramsForScroll } from "../lib/quantumBloomMath";
import { getDeviceProfile, getParticleBudget } from "../lib/device";

// Base parameters: exact defaults from Casberry LUNA simulation
const BASE = { spin: 0.8, size: 60, pulse: 1.0 };

// Generates a soft circular luminous particle texture
function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.3, "rgba(230, 245, 255, 0.9)");
  grad.addColorStop(0.65, "rgba(100, 180, 255, 0.35)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function QuantumCanvas() {
  const mountRef = useRef(null);
  const posterRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const profile = getDeviceProfile();
    const COUNT = getParticleBudget(profile);

    // Static fallback: no WebGL work at all (best battery)
    if (COUNT === 0) {
      if (posterRef.current) posterRef.current.style.display = "block";
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      if (posterRef.current) posterRef.current.style.display = "block";
      return;
    }

    const isLow = profile.lowSpec;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLow ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020617, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.002);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 800);
    camera.position.set(0, 0, 100);

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pTexture = createParticleTexture();

    const mat = new THREE.PointsMaterial({
      size: isLow ? 1.0 : 1.4,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let raf = 0;
    let running = true;
    let last = 0;
    let scrollY = window.scrollY || 0;
    let scrollH = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    let progress = 0;
    let frameSkip = isLow ? 2 : 1;
    let tick = 0;
    const start = performance.now();

    // Subtle interactive mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onPointerMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onScroll = () => {
      scrollY = window.scrollY || 0;
      scrollH = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      progress = Math.min(1, Math.max(0, scrollY / scrollH));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onVis = () => {
      running = document.visibilityState !== "hidden";
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (raf) cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    function loop(now) {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      tick++;
      if (tick % frameSkip !== 0) return; // battery saver
      if (!isLow && now - last < 16) return; // ~60fps target
      last = now;

      const time = (now - start) / 1000;
      const params = paramsForScroll(BASE, progress);

      for (let i = 0; i < COUNT; i++) {
        computeParticle(i, COUNT, time, params, positions, colors);
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;

      // Smooth camera position with slight scroll dolly and mouse parallax
      const targetX = mouseX * 12;
      const targetY = -mouseY * 8 - progress * 15;
      const targetZ = 100 + progress * 25;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      // Auto-spin matching Casberry's OrbitControls autoRotate behavior
      points.rotation.y = time * 0.08;
      points.rotation.x = Math.sin(time * 0.04) * 0.08;

      // Slight dimming down the page to ensure long text remains effortlessly readable
      const targetOpacity = progress < 0.1 ? 0.95 : 0.75;
      mat.opacity += (targetOpacity - mat.opacity) * 0.05;

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVis);
      geo.dispose();
      mat.dispose();
      pTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={posterRef} className="quantum-poster fixed inset-0 -z-10" style={{ display: "none" }} aria-hidden="true" />
      <div ref={mountRef} className="fixed inset-0 -z-10" aria-hidden="true" />
      <div className="fixed inset-0 -z-[5] bg-white/35 pointer-events-none" aria-hidden="true" />
      <div className="fixed inset-x-0 top-0 -z-[5] h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 -z-[5] h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" aria-hidden="true" />
    </>
  );
}
