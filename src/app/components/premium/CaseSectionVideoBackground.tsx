import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CaseSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let timer = 0;

    const ensureBackground = (
      selector: string,
      sectionClass: string,
      backgroundClass: string,
      veilClass: string,
      videoFile: string,
    ) => {
      const section = document.querySelector<HTMLElement>(selector);
      if (!section) return false;
      if (section.querySelector(`.${backgroundClass}`)) return true;

      section.classList.add(sectionClass);

      const wrap = document.createElement("div");
      wrap.className = backgroundClass;
      wrap.setAttribute("aria-hidden", "true");

      const video = document.createElement("video");
      video.src = `${import.meta.env.BASE_URL}${videoFile}`;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("playsinline", "");

      const veil = document.createElement("div");
      veil.className = veilClass;

      wrap.append(video, veil);
      section.prepend(wrap);

      const play = () => video.play().catch(() => {});
      play();
      window.setTimeout(play, 250);
      return true;
    };

    const apply = () => {
      if (cancelled) return;

      const caseReady = ensureBackground(
        ".case-section",
        "case-section-has-video",
        "case-video-background",
        "case-video-veil",
        "sbre-situations-bg.mp4",
      );

      const methodReady = ensureBackground(
        ".method-section",
        "method-section-has-video",
        "method-video-background",
        "method-video-veil",
        "sbre-method-bg.mp4",
      );

      if (!caseReady || !methodReady) {
        timer = window.setTimeout(apply, 80);
      }
    };

    apply();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
