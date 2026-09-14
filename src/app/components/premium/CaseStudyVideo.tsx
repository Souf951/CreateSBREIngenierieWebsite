import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function CaseStudyVideo() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [isFirstCase, setIsFirstCase] = useState(false);

  useEffect(() => {
    const sync = () => {
      const nextHost = document.querySelector<HTMLElement>(".case-section .case-image");
      const active = document.querySelector<HTMLButtonElement>(
        '.case-section .case-tabs button[aria-pressed="true"]',
      );
      const first = active?.querySelector("span")?.textContent?.trim() === "01";

      setHost(nextHost);
      setIsFirstCase(Boolean(first));
      nextHost?.classList.toggle("has-sbre-case-video", Boolean(first));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-pressed"],
    });

    return () => {
      observer.disconnect();
      document
        .querySelector<HTMLElement>(".case-section .case-image")
        ?.classList.remove("has-sbre-case-video");
    };
  }, []);

  if (!host) return null;

  return createPortal(
    <video
      className={`sbre-case-card-video ${isFirstCase ? "is-active" : ""}`}
      src={`${import.meta.env.BASE_URL}sbre-case-coordination.mp4`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />,
    host,
  );
}
