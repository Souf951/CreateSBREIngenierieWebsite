import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import HeaderKineticTriangles from "./HeaderKineticTriangles";
import "../../../styles/header-kinetic-tiles.css";

export default function PartnersNavLink() {
  const { pathname } = useLocation();
  const [desktopHost, setDesktopHost] = useState<HTMLElement | null>(null);
  const [mobileHost, setMobileHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setDesktopHost(null);
      setMobileHost(null);
      return;
    }

    const sync = () => {
      setDesktopHost(document.querySelector<HTMLElement>(".desktop-nav"));
      setMobileHost(document.querySelector<HTMLElement>("#mobile-nav"));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <HeaderKineticTriangles />
      {desktopHost &&
        createPortal(
          <Link className="partners-nav-link" to="/partenaires">
            Partenaires
          </Link>,
          desktopHost,
        )}
      {mobileHost &&
        createPortal(
          <Link className="partners-mobile-nav-link" to="/partenaires">
            Partenaires ↗
          </Link>,
          mobileHost,
        )}
    </>
  );
}
