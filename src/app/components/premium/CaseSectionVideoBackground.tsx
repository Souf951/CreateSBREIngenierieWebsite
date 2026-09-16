import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CaseSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;

    const apply = () => {
      if (cancelled) return;

      const section = document.querySelector<HTMLElement>(".case-section");
      if (!section) return;

      section.classList.add("case-section-has-video");

      let wrap = section.querySelector<HTMLDivElement>(".case-video-background");
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "case-video-background";
        wrap.setAttribute("aria-hidden", "true");
        section.prepend(wrap);
      }

      // The section background is intentionally a still chantier photo.
      // Situation-card videos are mounted separately by CaseStudyVideo.
      wrap.querySelector("video")?.remove();

      let image = wrap.querySelector<HTMLImageElement>("img");
      if (!image) {
        image = document.createElement("img");
        image.alt = "";
        image.decoding = "async";
        image.loading = "lazy";
        wrap.prepend(image);
      }

      const expectedSrc = `${import.meta.env.BASE_URL}sbre-situations-bg.jpg`;
      if (image.getAttribute("src") !== expectedSrc) image.src = expectedSrc;

      if (!wrap.querySelector(".case-video-veil")) {
        const veil = document.createElement("div");
        veil.className = "case-video-veil";
        wrap.append(veil);
      }
    };

    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
