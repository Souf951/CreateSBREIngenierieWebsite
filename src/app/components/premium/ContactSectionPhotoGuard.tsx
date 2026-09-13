import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ContactSectionPhotoGuard() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let timer = 0;

    const apply = () => {
      if (cancelled) return;
      const section = document.querySelector<HTMLElement>(".contact-section");
      if (!section) {
        timer = window.setTimeout(apply, 80);
        return;
      }

      section.style.setProperty(
        "--contact-bg",
        `url("${import.meta.env.BASE_URL}sbre-office-contact.webp")`,
      );
    };

    apply();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
