import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MethodSectionVideoBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let observedSection: HTMLElement | null = null;

    const mountVideo = (section: HTMLElement) => {
      if (cancelled) return;

      section.classList.add("method-section-has-video");

      let wrap = section.querySelector<HTMLDivElement>(".method-video-background");
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "method-video-background";
        wrap.setAttribute("aria-hidden", "true");

        const video = document.createElement("video");
        video.src = `${import.meta.env.BASE_URL}sbre-method-bg.mp4`;
        video.autoplay = false;
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
        video.play().catch(() => {});
      }
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            mountVideo(section);
          } else {
            section
              .querySelector<HTMLVideoElement>(".method-video-background video")
              ?.pause();
          }
        });
      },
      { rootMargin: "500px 0px", threshold: 0.01 },
    );

    const bindSection = () => {
      if (cancelled) return;
      const section = document.querySelector<HTMLElement>(".method-section");
      if (!section || section === observedSection) return;

      if (observedSection) visibilityObserver.unobserve(observedSection);
      observedSection = section;
      section.classList.add("method-section-has-video");
      visibilityObserver.observe(section);
    };

    bindSection();

    const domObserver = new MutationObserver(bindSection);
    domObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      domObserver.disconnect();
      visibilityObserver.disconnect();
      observedSection
        ?.querySelector<HTMLVideoElement>(".method-video-background video")
        ?.pause();
    };
  }, [pathname]);

  return null;
}
