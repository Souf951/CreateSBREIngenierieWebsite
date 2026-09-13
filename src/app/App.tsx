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
import "../styles/premium.css";
import "../styles/contrast-fixes.css";
import "../styles/dark-logo.css";
import "../styles/small-text-pass.css";

const ProjectTertiaire = lazy(() => import("./components/ProjectTertiaire"));
const ProjectMicroLogements = lazy(
  () => import("./components/ProjectMicroLogements"),
);
const ProjectVillaPrangins = lazy(
  () => import("./components/ProjectVillaPrangins"),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function shouldSkipIntro() {
  try {
    return (
      sessionStorage.getItem("sbre_intro_v2") === "true" ||
      matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)")
        .matches ||
      window.location.hash.length > 2
    );
  } catch {
    return true;
  }
}

function getInitialTheme(): "light" | "dark" {
  try {
    const saved = localStorage.getItem("sbre_theme");
    if (saved === "light" || saved === "dark") return saved;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function App() {
  const [introDone, setIntroDone] = useState(shouldSkipIntro);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  const complete = useCallback(() => {
    try {
      sessionStorage.setItem("sbre_intro_v2", "true");
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
            {isDark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          </span>
          <span className="theme-toggle-label">{isDark ? "Jour" : "Nuit"}</span>
        </button>

        <FloatingContact />

        <Router>
          <ScrollToTop />
          <MethodAccordionGuard />
          <ControlBannerVideo />
          <Suspense
            fallback={
              <div style={{ padding: "15vh 8%", color: "#0a5c3d" }}>
                Ouverture du projet…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
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
