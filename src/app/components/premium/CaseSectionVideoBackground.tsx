import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CaseSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;

    const ensureBackground = (
      selector: string,
      sectionClass: string,
      backgroundClass: string,
      veilClass: string,
      videoFile: string,
    ) => {
      const section = document.querySelector<HTMLElement>(selector);
      if (!section) return;

      section.classList.add(sectionClass);

      let wrap = section.querySelector<HTMLDivElement>(`.${backgroundClass}`);
      if (!wrap) {
        wrap = document.createElement("div");
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
      ensureBackground(
        ".case-section",
        "case-section-has-video",
        "case-video-background",
        "case-video-veil",
        "sbre-situations-bg.mp4",
      );
      ensureBackground(
        ".method-section",
        "method-section-has-video",
        "method-video-background",
        "method-video-veil",
        "sbre-method-bg.mp4",
      );
    };

    apply();

    // Les helpers globaux restent montés quand HomePage est recréée. On veille donc
    // à remettre les vidéos si une modification DOM remplace une section.
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
