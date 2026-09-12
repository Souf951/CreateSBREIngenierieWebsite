import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import HomePage from './components/HomePage';
import ProjectTertiaire from './components/ProjectTertiaire';
import ProjectMicroLogements from './components/ProjectMicroLogements';
import ProjectVillaPrangins from './components/ProjectVillaPrangins';
import FloatingContact from './components/FloatingContact';
import IntroLoader from './components/IntroLoader';

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

function App() {
  const alreadyPlayed = sessionStorage.getItem('sbre_intro_played') === 'true';
  const [introDone, setIntroDone] = useState(alreadyPlayed);
  const [reveal, setReveal] = useState(alreadyPlayed);

  const handleComplete = () => {
    sessionStorage.setItem('sbre_intro_played', 'true');
    setIntroDone(true);
  };

  return (
    <>
      <AnimatePresence>
        {!introDone && (
          <IntroLoader
            key="intro"
            onReveal={() => setReveal(true)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      >
        <Router>
          <ScrollToTop />
          <FloatingContact />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projet/tertiaire-geneve" element={<ProjectTertiaire />} />
            <Route path="/projet/micro-logements-lancy" element={<ProjectMicroLogements />} />
            <Route path="/projet/villa-prangins" element={<ProjectVillaPrangins />} />
          </Routes>
        </Router>
      </motion.div>
    </>
  );
}

export default App;
