import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CaseSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;

    const ensureImageBackground = () => {
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

      // The section background is now a still chantier photo. Remove only the
      // old section-level video if it is still present; case-card videos are
      // mounted elsewhere and remain untouched.
      wrap.querySelector("video")?.remove();

      let image = wrap.querySelector<HTMLImageElement>("img");
      if (!image) {
        image = document.createElement("img");
        image.alt = "";
        image.decoding = "async";
        wrap.prepend(image);
      }
      image.src = `${import.meta.env.BASE_URL}sbre-situations-bg.jpg`;

      if (!wrap.querySelector(".case-video-veil")) {
        const veil = document.createElement("div");
        veil.className = "case-video-veil";
        wrap.append(veil);
      }
    };

    const ensureMethodVideo = () => {
      const section = document.querySelector<HTMLElement>(".method-section");
      if (!section) return;

      section.classList.add("method-section-has-video");

      let wrap = section.querySelector<HTMLDivElement>(".method-video-background");
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "method-video-background";
        wrap.setAttribute("aria-hidden", "true");

        const video = document.createElement("video");
        video.src = `${import.meta.env.BASE_URL}sbre-method-bg.mp4`;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("playsinline", "");

        const veil = document.createElement("div");
        veil.className = "method-video-veil";

        wrap.append(video, veil);
        section.prepend(wrap);
      }

      const video = wrap.querySelector<HTMLVideoElement>("video");
      if (video) {
        video.muted = true;
        const play = () => video.play().catch(() => {});
        play();
        window.setTimeout(play, 180);
      }
    };

    const apply = () => {
      if (cancelled) return;
      ensureImageBackground();
      ensureMethodVideo();
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
