import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ContactSectionPhotoGuard() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let frame = 0;
    const background = `url("${import.meta.env.BASE_URL}sbre-office-contact.webp")`;

    const apply = () => {
      if (cancelled) return;

      const section = document.querySelector<HTMLElement>(".contact-section");
      if (!section) return;

      if (section.style.getPropertyValue("--contact-bg") !== background) {
        section.style.setProperty("--contact-bg", background);
      }

      if (!section.classList.contains("contact-section-has-photo")) {
        section.classList.add("contact-section-has-photo");
      }
    };

    const scheduleApply = () => {
      if (cancelled || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    apply();

    // Only watch DOM mounting/unmounting. Watching every class/style mutation on
    // the whole page causes a feedback storm with animated sections and can hang
    // Chromium's renderer.
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
