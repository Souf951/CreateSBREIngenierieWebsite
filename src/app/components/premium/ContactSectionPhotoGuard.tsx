import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ContactSectionPhotoGuard() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    const background = `url("${import.meta.env.BASE_URL}sbre-office-contact.webp")`;

    const apply = () => {
      if (cancelled) return;

      const section = document.querySelector<HTMLElement>(".contact-section");
      if (!section) return;

      if (section.style.getPropertyValue("--contact-bg") !== background) {
        section.style.setProperty("--contact-bg", background);
      }
      section.classList.add("contact-section-has-photo");
    };

    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
