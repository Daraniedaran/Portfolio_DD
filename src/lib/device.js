// Low-spec + battery detection. Runs once, no per-frame cost.
export function getDeviceProfile() {
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const cores = nav.hardwareConcurrency || 4;
  const mem = nav.deviceMemory || 4;
  const smallScreen =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth, window.innerHeight) < 500
      : false;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent || "") || smallScreen;
  const lowSpec = cores <= 4 || mem <= 4 || isMobile;

  const reducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const saveData =
    typeof navigator !== "undefined" &&
    navigator.connection &&
    navigator.connection.saveData === true;

  return { cores, mem, isMobile, lowSpec, reducedMotion, saveData };
}

export function getParticleBudget(profile) {
  if (profile.reducedMotion || profile.saveData) return 0; // static poster
  if (profile.lowSpec) return 6000;   // mobile: reduced but still impressive
  return 20000; // desktop: full 20k+ swarm
}
