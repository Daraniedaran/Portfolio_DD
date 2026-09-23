import { useEffect } from "react";

// Nav scrolled-state toggle only. The visible thin progress bar now lives in
// OceanSkyBackground (accent follows the current scene), so this renders no bar
// to avoid a duplicate. Passive scroll listener, no layout thrash.
export default function ScrollProgress() {
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const nav = document.getElementById("topnav");
      if (nav) nav.classList.toggle("nav-scrolled", (window.scrollY || 0) > 24);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <style>{`#topnav.nav-scrolled{background:rgba(255,255,255,0.85);backdrop-filter:blur(14px);border-bottom:1px solid rgba(15,23,42,0.08);}`}</style>
  );
}
