import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import {
  lazy,
  Suspense,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { MotionConfig } from "motion/react";
import { Moon, Sun } from "lucide-react";
import HomePage from "./components/HomePage";
import IntroLoader from "./components/IntroLoader";
import ControlBannerVideo from "./components/ControlBannerVideo";
import FloatingContact from "./components/FloatingContact";
import MethodAccordionGuard from "./components/premium/MethodAccordionGuard";
import TeamProfilesGuard from "./components/premium/TeamProfilesGuard";
import FooterEnhancer from "./components/premium/FooterEnhancer";
import CaseSectionVideoBackground from "./components/premium/CaseSectionVideoBackground";
import MethodSectionVideoBackground from "./components/premium/MethodSectionVideoBackground";
import ContactSectionPhotoGuard from "./components/premium/ContactSectionPhotoGuard";
import HomeCopyGuard from "./components/premium/HomeCopyGuard";
import CaseStudyVideo from "./components/premium/CaseStudyVideo";
import ExperiencesResultsBackground from "./components/premium/ExperiencesResultsBackground";
import ProjectsMethodTransition from "./components/premium/ProjectsMethodTransition";
import PartnersShowcase from "./components/premium/PartnersShowcase";
import PartnersNavLink from "./components/premium/PartnersNavLink";
import PartnersSharedChrome from "./components/premium/PartnersSharedChrome";
import FaqPunctuationGuard from "./components/premium/FaqPunctuationGuard";
import "../styles/premium.css";
import "../styles/contrast-fixes.css";
import "../styles/dark-logo.css";
import "../styles/small-text-pass.css";
import "../styles/project-gallery-premium.css";
import "../styles/footer-premium.css";
import "../styles/team-section-premium.css";
import "../styles/responsive-pass.css";
import "../styles/principles-center.css";
import "../styles/case-video-background.css";
import "../styles/case-top-cleanup.css";
import "../styles/contact-section-photo.css";
import "../styles/accordion-premium.css";
import "../styles/home-copy-polish.css";
import "../styles/case-study-video.css";
import "../styles/projects-method-transition.css";
import "../styles/partners-showcase.css";
import "../styles/hover-lift.css";
import "../styles/mobile-tablet-premium.css";
import "../styles/mobile-3d-cleanup.css";
import "../styles/fluid-responsive-type.css";
import "../styles/hero-phases-fill.css";
import "../styles/partners-nav-link.css";

const ProjectTertiaire = lazy(() => import("./components/ProjectTertiaire"));
const ProjectMicroLogements = lazy(
  () => import("./components/ProjectMicroLogements"),
);
const ProjectVillaPrangins = lazy(
  () => import("./components/ProjectVillaPrangins"),
);
const PartnersPage = lazy(() => import("./components/PartnersPage"));

function RouteContact() {
  const { pathname } = useLocation();
  return pathname === "/partenaires" ? null : <FloatingContact />;
}

function ScrollToTop() {
  const { pathname, key, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlAnchor = html.style.overflowAnchor;
    const previousBodyAnchor = body.style.overflowAnchor;

    html.style.overflowAnchor = "none";
    body.style.overflowAnchor = "none";

    const jumpTop = () => {
      window.scrollTo(0, 0);
      html.scrollTop = 0;
      body.scrollTop = 0;
    };

    jumpTop();

    const raf1 = requestAnimationFrame(() => {
      jumpTop();
      requestAnimationFrame(jumpTop);
    });

    const timers = [50, 150, 300, 600, 1000].map((delay) =>
      window.setTimeout(jumpTop, delay),
    );

    const restoreAnchor = window.setTimeout(() => {
      html.style.overflowAnchor = previousHtmlAnchor;
      body.style.overflowAnchor = previousBodyAnchor;
    }, 1100);

    return () => {
      cancelAnimationFrame(raf1);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(restoreAnchor);
      html.style.overflowAnchor = previousHtmlAnchor;
      body.style.overflowAnchor = previousBodyAnchor;
    };
  }, [pathname, key, hash]);

  return null;
}

function shouldSkipIntro() {
  try {
    return (
      sessionStorage.getItem("sbre_intro_figma_v1") === "true" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.location.hash.length > 2
    );
  } catch {
    return false;
  }
}

function getInitialTheme(): "light" | "dark" {
  try {
    const saved = localStorage.getItem("sbre_theme");
    if (saved === "light" || saved === "dark") return saved;
    return matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export default function App() {
  const [introDone, setIntroDone] = useState(shouldSkipIntro);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  const complete = useCallback(() => {
    try {
      sessionStorage.setItem("sbre_intro_figma_v1", "true");
    } catch {
      /* Storage is optional. */
    }
    setIntroDone(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sbre_theme", theme);
    } catch {
      /* Storage is optional. */
    }
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const isDark = theme === "dark";

  return (
    <MotionConfig reducedMotion="user">
      {!introDone && <IntroLoader onComplete={complete} />}
      <div
        className={`sbre-theme ${isDark ? "theme-dark" : "theme-light"}`}
        {...(!introDone ? { inert: "" } : {})}
        aria-hidden={!introDone || undefined}
      >
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? "Activer le mode jour" : "Activer le mode nuit"}
          title={isDark ? "Mode jour" : "Mode nuit"}
        >
          <span className="theme-toggle-icon" aria-hidden="true">
            {isDark ? (
              <Sun size={17} strokeWidth={1.8} />
            ) : (
              <Moon size={17} strokeWidth={1.8} />
            )}
          </span>
          <span className="theme-toggle-label">{isDark ? "Jour" : "Nuit"}</span>
        </button>

        <Router>
          <RouteContact />
          <ScrollToTop />
          <HomeCopyGuard />
          <MethodAccordionGuard />
          <TeamProfilesGuard />
          <FooterEnhancer />
          <ControlBannerVideo />
          <CaseSectionVideoBackground />
          <MethodSectionVideoBackground />
          <ContactSectionPhotoGuard />
          <CaseStudyVideo />
          <ExperiencesResultsBackground />
          <ProjectsMethodTransition />
          <PartnersShowcase />
          <PartnersNavLink />
          <PartnersSharedChrome />
          <FaqPunctuationGuard />
          <Suspense
            fallback={
              <div style={{ padding: "15vh 8%", color: "#0a5c3d" }}>
                Ouverture du projet…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/partenaires" element={<PartnersPage />} />
              <Route
                path="/projet/tertiaire-geneve"
                element={<ProjectTertiaire />}
              />
              <Route
                path="/projet/micro-logements-lancy"
                element={<ProjectMicroLogements />}
              />
              <Route
                path="/projet/villa-prangins"
                element={<ProjectVillaPrangins />}
              />
              <Route
                path="*"
                element={
                  <main style={{ padding: "15vh 8%" }}>
                    <h1>Cette page n’existe pas.</h1>
                    <Link to="/">Revenir à l’accueil SBRE ↗</Link>
                  </main>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </MotionConfig>
  );
}
