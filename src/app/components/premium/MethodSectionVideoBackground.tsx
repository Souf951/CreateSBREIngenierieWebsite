import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MethodSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let timer = 0;

    const apply = () => {
      if (cancelled) return;

      const section = document.querySelector<HTMLElement>(".method-section");
      if (!section) {
        timer = window.setTimeout(apply, 80);
        return;
      }

      section.classList.add("method-section-has-video");
      if (section.querySelector(".method-video-background")) return;

      const wrap = document.createElement("div");
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

      const play = () => video.play().catch(() => {});
      play();
      window.setTimeout(play, 250);
      window.setTimeout(play, 900);
    };

    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
