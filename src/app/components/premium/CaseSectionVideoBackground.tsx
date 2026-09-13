import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CaseSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    const apply = () => {
      if (cancelled) return;
      const section = document.querySelector<HTMLElement>(".case-section");
      if (!section) {
        timer = window.setTimeout(apply, 80);
        return;
      }

      if (section.querySelector(".case-video-background")) return;

      section.classList.add("case-section-has-video");

      const wrap = document.createElement("div");
      wrap.className = "case-video-background";
      wrap.setAttribute("aria-hidden", "true");

      const video = document.createElement("video");
      video.src = `${import.meta.env.BASE_URL}sbre-situations-bg.mp4`;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("playsinline", "");

      const veil = document.createElement("div");
      veil.className = "case-video-veil";

      wrap.append(video, veil);
      section.prepend(wrap);

      const play = () => video.play().catch(() => {});
      play();
      window.setTimeout(play, 250);
    };

    apply();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
