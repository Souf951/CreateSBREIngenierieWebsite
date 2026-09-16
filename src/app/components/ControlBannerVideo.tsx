import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/control-banner-video.css";

export default function ControlBannerVideo() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const findHost = () => {
      setHost(document.querySelector<HTMLElement>(".control-banner"));
    };

    findHost();
    const observer = new MutationObserver(findHost);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setShouldLoad(false);
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "450px 0px", threshold: 0.01 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [host]);

  if (!host || !shouldLoad) return null;

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
