import { useEffect, useState } from "react";

export function useFooterVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setVisible(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.1));
    }, { threshold: 0.1 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  return visible;
}