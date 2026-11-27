import { useEffect, useState } from "react";

export function useDesktopFooterVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let intersecting = false;
    const update = () => setVisible(desktop.matches && intersecting);
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      intersecting = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.1);
      update();
    }, { threshold: 0.1 });
    observer.observe(footer);
    desktop.addEventListener("change", update);
    return () => { observer.disconnect(); desktop.removeEventListener("change", update); };
  }, []);
  return visible;
}