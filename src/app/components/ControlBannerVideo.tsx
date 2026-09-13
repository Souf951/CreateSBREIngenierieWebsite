import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/control-banner-video.css";

export default function ControlBannerVideo() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findHost = () => {
      const next = document.querySelector<HTMLElement>(".control-banner");
      if (next) setHost(next);
    };

    findHost();
    const observer = new MutationObserver(findHost);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!host) return null;

  return createPortal(
    <video
      className="control-banner-video"
      src={`${import.meta.env.BASE_URL}sbre-role-video.mp4`}
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
