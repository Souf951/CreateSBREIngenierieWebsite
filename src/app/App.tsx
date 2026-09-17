import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { lazy, Suspense, useLayoutEffect, useState, useCallback } from "react";
import { MotionConfig } from "motion/react";
import HomePage from "./components/HomePage";
import IntroLoader from "./components/IntroLoader";
import "../styles/premium.css";
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
export default function App() {
  const [introDone, setIntroDone] = useState(shouldSkipIntro);
  const complete = useCallback(() => {
    try {
      sessionStorage.setItem("sbre_intro_v2", "true");
    } catch {
      /* Storage is optional. */
    }
    setIntroDone(true);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      {!introDone && <IntroLoader onComplete={complete} />}
      <div
        {...(!introDone ? { inert: "" } : {})}
        aria-hidden={!introDone || undefined}
      >
        <Router>
          <ScrollToTop />
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
