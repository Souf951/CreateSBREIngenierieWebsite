import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CaseSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    const cleanup = () => {
      const section = document.querySelector<HTMLElement>(".case-section");
      if (!section) return;

      section.classList.remove("case-section-has-video");
      section.querySelector(".case-video-background")?.remove();
    };

    cleanup();

    const observer = new MutationObserver(() => cleanup());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
