import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useInView } from 'motion/react';
import SEOHead from './SEOHead';
import { Menu, X, ArrowRight, CheckCircle, Users, Building2, TrendingUp, Shield, Ruler, Eye, HardHat, Compass, Zap, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import FAQAccordion from './FAQAccordion';
import logoImage from '../../imports/Pr_sentation1_page-0001.png';
import tertiaireImage from '../../imports/1721891231854__1_.jpg';
import portraitImage from '../../imports/84866ccc-3981-49bb-9de4-bd675f0f41e1.jpg';
import photo84866 from '../../imports/84866ccc-3981-49bb-9de4-bd675f0f41e1-1.jpg';
import founderVideo from '../../imports/7646402-uhd_2160_3840_25fps.mp4';
import microLogementImage from '../../imports/1741613187041-2.jpg';
import methodeBackgroundImage from '../../imports/1748964038069-3.jpg';
import heroSlide1 from '../../imports/1741613187041.jpg';
import contactSlide1 from '../../imports/35854ac3a0ce421ef049bcb9d3957c41-1.jpg';
import contactSlide2 from '../../imports/7e3be6433a7e5d0459af5cf69e48117e-1.jpg';
import contactSlide3 from '../../imports/d8af3db0023b39dd112975781ef26207-1.jpg';
import contactSlide4 from '../../imports/3df6b3d580c913fd1f20bbd13b327fd4-1.jpg';
import contactSlide5 from '../../imports/94185f87db7ea4001f5d640651271683-1.jpg';
import contactSlide6 from '../../imports/1721891231854__1_-2.jpg';
import heroSlide2 from '../../imports/1746172633498.jpg';
import heroSlide3 from '../../imports/1746172634781.jpg';
import heroSlide4 from '../../imports/1746172642405.jpg';
import heroSlide5 from '../../imports/1748964038069-1.jpg';
import heroSlide6 from '../../imports/1721891231854__1_-1.jpg';
import realisationBg1 from '../../imports/1746172633498-1.jpg';
import realisationBg2 from '../../imports/1746172634781-1.jpg';
import realisationBg3 from '../../imports/1746172642405-1.jpg';
import realisationBg4 from '../../imports/1746532140682.jpg';
import realisationBg5 from '../../imports/1748964038069-2.jpg';
import realisationBg6 from '../../imports/1751294920003.jpg';
import realisationBg7 from '../../imports/1721891230647.jpg';
import realisationBg8 from '../../imports/1721891230963-1.jpg';
import realisationBg9 from '../../imports/1721891231094-1.jpg';
import realisationBg10 from '../../imports/1721891231854.jpg';
import sbreOfficeImage from '../../imports/ChatGPT_Image_16_juin_2026__20_34_27.png';
import ubsLogo from '../../imports/UBS_Logo.png';
import artisaLogo from '../../imports/artisagroup.svg';
import bruellanLogo from '../../imports/Bruellan.png';
import psyReunisLogo from '../../imports/Psy-Reunis-Fond-transparent-scaled.png';
import policeGeneveLogo from '../../imports/p_police_geneve_drupal_0.jpg';
import citypopLogo from '../../imports/images.png';
import brsLogo from '../../imports/BRS-Shipbrokers-Main-Logo-200x175.png';
import wincasaLogo from '../../imports/Logo__1_.jpg';
import lemanLogo from '../../imports/LOGO1.jpg';
import swissLifeLogo from '../../imports/Logo_Swiss_Life.svg.png';
import artisaGaLogo from '../../imports/artisa-group-g-a-total-contract-sa-logo-xl.png';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function ScrambleText({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(value.split('').map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]));
  const resolvedRef = useRef<boolean[]>(value.split('').map(() => false));

  useEffect(() => {
    if (!isInView) return;
    const target = value.toUpperCase();
    let frame = 0;
    const totalFrames = 90;

    const tick = () => {
      frame++;
      setDisplay(target.split('').map((char, i) => {
        if (char === ' ') return ' ';
        const resolveAt = Math.floor((i / target.replace(/ /g, '').length) * totalFrames * 0.8);
        if (frame > resolveAt + 4) {
          resolvedRef.current[i] = true;
          return char;
        }
        if (resolvedRef.current[i]) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }));
      if (frame < totalFrames) requestAnimationFrame(tick);
      else setDisplay(target.split(''));
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#0a5c3d] mb-3 tracking-widest font-mono">
      {display.map((char, i) => (
        <span
          key={i}
          className={resolvedRef.current[i] ? 'text-[#0a5c3d]' : 'text-[#0a5c3d]/40'}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

function AnimatedCounter({ value, duration = 3 }: { value: string; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const isText = !/\d/.test(value);

  useEffect(() => {
    if (!isInView || isText) return;
    const match = value.match(/\d+/);
    if (!match) return;
    const target = parseInt(match[0]);
    const startTime = Date.now();

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) requestAnimationFrame(updateCount);
      else setCount(target);
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value, duration, isText]);

  if (isText) return <ScrambleText value={value} />;

  const formattedValue = value.replace(/\d+/, count.toString());
  return (
    <div ref={ref} className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#0a5c3d] mb-3">
      {formattedValue}
    </div>
  );
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const contactSlides = [contactSlide1, contactSlide2, contactSlide3, contactSlide4, contactSlide5, contactSlide6];
  const [contactSlideIndex, setContactSlideIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setContactSlideIndex(i => (i + 1) % contactSlides.length), 3000);
    return () => clearInterval(interval);
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentRealisationSlide, setCurrentRealisationSlide] = useState(0);
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();

  const heroImages = [heroSlide1, heroSlide2, heroSlide3, heroSlide4, heroSlide5, heroSlide6];
  const heroAltTexts = [
    'Direction de travaux en Suisse romande – SBRE Ingénierie',
    'Pilotage de chantier et coordination TCE – chantier suisse',
    'Suivi de rénovation de bâtiment à Lausanne',
    "Bureau de direction de travaux en Suisse romande",
    'Projet de construction suivi par SBRE Ingénierie',
    'Maîtrise des coûts et délais – suivi qualité chantier',
  ];
  const realisationAltTexts = [
    'Rénovation bâtiment Suisse romande – SBRE Ingénierie',
    'Direction de travaux chantier tertiaire Genève',
    'Pilotage de chantier résidentiel Lausanne',
    'Coordination TCE et suivi de chantier Suisse',
    'Gestion de projet construction – SBRE Ingénierie',
    "Assistance maître d'ouvrage – rénovation Suisse romande",
    'Suivi des coûts et délais – direction de travaux',
    'Réalisation SBRE Ingénierie – projet résidentiel Vaud',
    'Chantier de construction piloté par SBRE Ingénierie',
    'Direction de travaux et coordination TCE en Suisse',
  ];
  const realisationImages = [realisationBg1, realisationBg2, realisationBg3, realisationBg4, realisationBg5, realisationBg6, realisationBg7, realisationBg8, realisationBg9, realisationBg10];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRealisationSlide((prev) => (prev + 1) % realisationImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [realisationImages.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHead />
      {/* Navigation */}
      <header>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24 lg:h-28">
            <button
              onClick={() => scrollToSection('accueil')}
              aria-label="Retourner à l’accueil SBRE Ingénierie"
              className="flex items-center"
            >
              <img
                src={logoImage}
                alt="SBRE Ingénierie"
                className="h-18 md:h-24 lg:h-28 w-auto transition-all duration-300"
              />
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['Accueil', 'Expertises', 'Méthode', 'Réalisations', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`transition-colors hover:text-[#1db954] ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
              className={`md:hidden ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t"
          >
            {['Accueil', 'Expertises', 'Méthode', 'Réalisations', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left px-6 py-3 hover:bg-gray-50 text-gray-700"
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </motion.nav>
      </header>

      <main>
      {/* Hero Section */}
      <section id="accueil" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 z-10" />
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={heroAltTexts[index] ?? `Chantier SBRE Ingénierie ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ opacity: currentSlide === index ? 1 : 0 }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex justify-center"
          >
            
          </motion.div>

          <h1 className="sr-only">SBRE Ingénierie – Direction de travaux en Suisse romande</h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-7xl text-white mb-6 tracking-tight font-bold leading-[1.05]"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="block"
            >
              Direction de travaux
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="block text-gray-300"
            >
              &amp; pilotage de projets
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="block mt-2 italic font-light bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-200 bg-clip-text text-transparent"
            >
              en Suisse romande
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
          >SBRE Ingénierie pilote vos projets de construction et de rénovation en Suisse romande, de la planification jusqu'à la réception de chantier — maîtrise des coûts, délais, coordination TCE et conformité aux normes SIA.</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-[#0a5c3d] text-white rounded-md hover:bg-[#0a5c3d]/90 hover:shadow-[0_10px_40px_rgba(10,92,61,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              Discuter de mon projet
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button
              onClick={() => scrollToSection('expertises')}
              className="px-8 py-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 hover:shadow-[0_10px_40px_rgba(10,92,61,0.3)] transition-all"
            >
              Découvrir nos expertises
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20"
          >
            {[
              { icon: Users, text: 'Pilotage terrain' },
              { icon: TrendingUp, text: 'Maîtrise coûts & délais' },
              { icon: Shield, text: 'Coordination TCE' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-3 text-white">
                <item.icon className="text-[#1db954]" size={24} />
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <button
          onClick={() => document.getElementById('partenaire')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
        >
          <span className="text-xs tracking-[0.2em] uppercase font-medium">Découvrir</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#1db954] transition-colors duration-300">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </button>
      </section>

      {/* Positioning Section */}
      <section id="partenaire" className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-left">Direction de travaux en Suisse romande</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                SBRE Ingénierie intervient auprès des maîtres d'ouvrage, architectes, promoteurs, régies, entreprises générales et entreprises de rénovation pour structurer, coordonner et piloter les projets de construction, rénovation et transformation. Basée en Suisse romande, l'entreprise accompagne les projets depuis la préparation du chantier jusqu'à la réception des travaux, avec une attention particulière portée aux coûts, aux délais, à la qualité d'exécution et à la conformité aux normes SIA.
              </p>
              <div className="bg-[#0a5c3d] text-white p-6 rounded-lg border-l-4 border-[#1db954]">
                <p className="text-lg italic">"Un chantier ne se réussit pas avec de belles intentions. Il se réussit avec du suivi, de la méthode et des décisions claires."</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[280px] sm:h-[380px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl"
            >
              <video
                src={founderVideo}
                autoPlay
                muted
                loop
                playsInline
                title="SBRE Ingénierie – bureau de direction de travaux en Suisse romande"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertises Section */}
      <section id="expertises" className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Nos expertises</h2>
            <p className="text-xl text-gray-600">Pilotage de chantier, coordination TCE et assistance à maîtrise d'ouvrage — AMO/RMO en Suisse romande</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Direction de travaux',
                description: "Suivi de chantier complet : coordination des entreprises, contrôle de l'avancement, gestion des séances, PV de chantier, décisions techniques et réception des travaux.",
              },
              {
                title: 'AMO/RMO – Assistance au Maître d\'Ouvrage',
                description: "Représentant du maître d'ouvrage en Suisse romande : accompagnement technique, analyse de devis travaux, clarification des besoins et défense de vos intérêts.",
              },
              {
                title: 'Appels d\'offres & analyse de devis',
                description: "Préparation des dossiers d'appel d'offres entreprises, consultation, analyse comparative, clarification technique et aide à l'adjudication selon les pratiques suisses.",
              },
              {
                title: 'Maîtrise des coûts, délais et qualité',
                description: "Suivi budgétaire rigoureux, planification de travaux, anticipation des risques, suivi qualité chantier et coordination des priorités tout au long du projet.",
              },
              {
                title: 'Normes SIA & conformité',
                description: "Pilotage de chantier selon les standards suisses : contrôle documentaire, cohérence technique, coordination technique chantier et suivi réglementaire.",
              },
              {
                title: 'Rénovation & transformation de bâtiment',
                description: "Suivi de rénovation bâtiment Suisse romande et transformation de bâtiment : analyse des travaux, coordination des corps d'état et réception de chantier.",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-[0_10px_40px_rgba(10,92,61,0.4)] hover:border-2 hover:border-[#0a5c3d] transition-all border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#0a5c3d] rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section id="méthode" className="relative py-8 md:py-16 bg-white overflow-hidden">
        {/* Blueprint grid background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#0a5c3d 1px, transparent 1px), linear-gradient(90deg, #0a5c3d 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-8 bg-[#0a5c3d]/40" />
              <span className="uppercase tracking-[0.3em] text-[10px] text-[#0a5c3d]/70">Méthodologie</span>
              <div className="h-px w-8 bg-[#0a5c3d]/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0a5c3d] mb-3 tracking-tight">Méthode SBRE</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              <strong className="text-[#0a5c3d]">Structurer — Budgéter — Réaliser — Exiger</strong>
              <br />
              <em className="text-gray-500 text-xs md:text-sm">
                Une méthode de direction de travaux pour planifier, coordonner et piloter l'exécution selon les normes SIA, en maîtrisant les coûts, les délais et la qualité du chantier.
              </em>
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="hidden md:block absolute left-[29px] top-3 bottom-3 w-px bg-gradient-to-b from-[#0a5c3d]/10 via-[#0a5c3d]/40 to-[#0a5c3d]/10" />

            {[
              {
                step: '01',
                phase: 'Phase initiale',
                title: 'Analyse du projet',
                description:
                  'Lecture des plans, identification des contraintes, analyse technique et définition des priorités.',
              },
              {
                step: '02',
                phase: 'Cadrage',
                title: 'Structuration',
                description:
                  'Organisation des lots, planning, soumissions, clarification des responsabilités et préparation du chantier.',
              },
              {
                step: '03',
                phase: 'Exécution',
                title: 'Coordination',
                description:
                  'Pilotage des entreprises, séances, suivi des décisions, gestion des interfaces et anticipation des blocages.',
              },
              {
                step: '04',
                phase: 'Suivi',
                title: 'Contrôle',
                description:
                  "Suivi qualité, coûts, délais, conformité, vérification de l'exécution et gestion des écarts.",
              },
              {
                step: '05',
                phase: 'Livraison',
                title: 'Réception',
                description:
                  "Contrôle final, levée des réserves, documentation, clôture et accompagnement jusqu'à livraison.",
              },
            ].map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative mb-3 last:mb-0"
              >
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  {/* Step marker - square architectural style */}
                  <div className="flex-shrink-0 relative">
                    <div className="relative w-14 h-14 bg-white border-2 border-[#0a5c3d] flex items-center justify-center transition-all duration-500 group-hover:bg-[#0a5c3d] group-hover:shadow-[0_10px_30px_-10px_rgba(10,92,61,0.5)]">
                      {/* Corner ticks */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#0a5c3d]" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#0a5c3d]" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#0a5c3d]" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#0a5c3d]" />
                      <span className="text-xl font-bold text-[#0a5c3d] group-hover:text-white transition-colors duration-500 font-mono">
                        {method.step}
                      </span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 relative bg-white border border-gray-200 group-hover:border-[#0a5c3d]/40 p-4 md:p-5 transition-all duration-500 group-hover:shadow-[0_20px_50px_-20px_rgba(10,92,61,0.25)]">
                    {/* Left accent bar */}
                    <div className="absolute top-0 left-0 w-[3px] h-0 bg-[#0a5c3d] group-hover:h-full transition-all duration-500 ease-out" />

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] tracking-[0.25em] text-[#0a5c3d]/60 font-mono uppercase">
                        {method.phase}
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-[10px] tracking-[0.25em] text-gray-400 font-mono">
                        ÉTAPE {method.step}/05
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0a5c3d] transition-colors duration-500">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{method.description}</p>

                    {/* Bottom corner bracket */}
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#0a5c3d]/30 group-hover:border-[#0a5c3d] transition-colors duration-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-12 md:py-20 bg-[#0a5c3d] text-white overflow-hidden">
        {/* Blueprint grid background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Decorative architectural lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Corner brackets */}
        <div className="hidden md:block absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/40" />
        <div className="hidden md:block absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/40" />
        <div className="hidden md:block absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/40" />
        <div className="hidden md:block absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 bg-white/40" />
              <span className="uppercase tracking-[0.3em] text-xs text-white/70">Fondations</span>
              <div className="h-px w-12 bg-white/40" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3">Nos valeurs</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Six piliers qui structurent chacune de nos interventions, du premier coup de crayon à la livraison finale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {[
              {
                title: 'Rigueur',
                description: 'Chaque détail compte. Un chantier mal suivi coûte cher.',
                icon: Ruler,
                code: 'V.01',
              },
              {
                title: 'Transparence',
                description: 'Des décisions claires, des informations fiables, aucun flou inutile.',
                icon: Eye,
                code: 'V.02',
              },
              {
                title: 'Responsabilité',
                description: "Nous agissons dans l'intérêt du projet et du maître d'ouvrage.",
                icon: Shield,
                code: 'V.03',
              },
              {
                title: 'Terrain',
                description: 'Nous ne pilotons pas depuis un bureau. Nous comprenons la réalité du chantier.',
                icon: HardHat,
                code: 'V.04',
              },
              {
                title: 'Réactivité',
                description: "Un problème traité trop tard devient une perte d'argent.",
                icon: Zap,
                code: 'V.05',
              },
              {
                title: 'Exigence',
                description: 'Qualité, délais, coûts : les trois doivent avancer ensemble.',
                icon: Target,
                code: 'V.06',
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-[#0a5c3d] p-6 md:p-7 overflow-hidden cursor-default"
                >
                  {/* Hover sweep */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-500 ease-out" />

                  {/* Code label */}
                  <div className="relative flex items-center justify-between mb-4">
                    <span className="text-xs tracking-[0.25em] text-white/40 font-mono">{value.code}</span>
                    <div className="h-px flex-1 mx-4 bg-white/10" />
                    <span className="text-xs tracking-[0.25em] text-white/40 font-mono">
                      {String(index + 1).padStart(2, '0')}/06
                    </span>
                  </div>

                  {/* Icon block */}
                  <div className="relative mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 border border-white/30 group-hover:border-white group-hover:bg-white/5 transition-all duration-500">
                      <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="relative text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-500">
                    {value.title}
                  </h3>
                  <p className="relative text-gray-300 leading-relaxed">{value.description}</p>

                  {/* Bottom corner mark */}
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/20 group-hover:border-white/60 transition-colors duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* References Scrolling Banner */}
      <section className="py-10 md:py-16 bg-white overflow-hidden">
        <h2 className="font-bold text-center text-gray-900 mb-8 md:mb-12 text-3xl md:text-[48px] font-[Italianno]"><span className="not-italic"><span className="font-normal">Ils nous ont fait confiance...</span></span></h2>
        <div className="relative w-full overflow-hidden">
          <motion.div
            animate={{ x: [0, -3500] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="flex items-center"
            style={{ gap: '8rem' }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center" style={{ gap: '5rem' }}>
                {[
                  { src: ubsLogo, alt: 'UBS' },
                  { src: bruellanLogo, alt: 'Bruellan' },
                  { src: psyReunisLogo, alt: 'PSY Réunis' },
                  { src: policeGeneveLogo, alt: 'Police Genève' },
                  { src: citypopLogo, alt: 'CityPop' },
                  { src: brsLogo, alt: 'BRS' },
                  { src: wincasaLogo, alt: 'Wincasa' },
                  { src: lemanLogo, alt: 'Léman Construction SA' },
                  { src: swissLifeLogo, alt: 'Swiss Life' },
                  { src: artisaGaLogo, alt: 'Artisa GA Total Contract' },
                ].map((client, idx) => (
                  <div key={`${client.alt}-${idx}`} className="flex-shrink-0" style={{ minWidth: '150px' }}>
                    <img
                      src={client.src}
                      alt={client.alt}
                      className={`object-contain opacity-80 hover:opacity-100 transition-opacity mx-auto ${
                        client.alt === 'BRS' || client.alt === 'PSY Réunis' || client.alt === 'Police Genève' || client.alt === 'Léman Construction SA' ? 'h-24 max-w-[140px]' :
                        client.alt === 'Artisa GA Total Contract' ? 'h-20 max-w-[180px]' :
                        'h-16 max-w-[140px]'
                      }`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">
          Références projets / environnements d'intervention / expériences associées
        </p>
      </section>

      {/* Projects Section */}
      <section id="réalisations" className="relative py-12 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          {realisationImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={realisationAltTexts[index] ?? 'Réalisation SBRE Ingénierie – suivi de chantier en Suisse romande'}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ opacity: currentRealisationSlide === index ? 1 : 0 }}
              loading="lazy"
            />
          ))}
          <div className="absolute inset-0 bg-white/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Réalisations & expériences projet</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Suivi de rénovation et transformation de bâtiments, direction de travaux et coordination TCE en Suisse romande — Lausanne, Genève, Vaud.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                image: tertiaireImage,
                title: 'Rénovation tertiaire – Genève',
                alt: 'Direction de travaux rénovation tertiaire Genève – SBRE Ingénierie',
                description: "Direction de travaux et coordination TCE : suivi des entreprises, gestion des interfaces techniques, suivi qualité chantier et réception des travaux.",
                tags: ['Rénovation', 'Tertiaire', 'Coordination TCE', 'Genève'],
                link: '/projet/tertiaire-geneve',
              },
              {
                image: microLogementImage,
                title: 'Micro-logements résidentiels – Lancy',
                alt: 'Pilotage de chantier résidentiel micro-logements Lancy Suisse romande',
                description: "Pilotage de chantier résidentiel : suivi technique, coordination des entreprises, contrôle des reprises et interface exploitation.",
                tags: ['Résidentiel', 'Pilotage chantier', 'Suisse romande', 'Livraison'],
                link: '/projet/micro-logements-lancy',
              },
              {
                image: 'https://images.unsplash.com/photo-1638885930125-85350348d266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                title: 'Transformation extérieure et intérieure haut de gamme',
                alt: 'Transformation de bâtiment haut de gamme – AMO et pilotage TCE SBRE',
                description: "Assistance maître d'ouvrage (AMO) : analyse des travaux, appel d'offres entreprises, planification, suivi exécution selon normes SIA et réception de chantier.",
                tags: ['Transformation', 'AMO/RMO', 'Normes SIA', 'Qualité'],
                link: '/projet/villa-prangins',
              },
              {
                image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                title: "Appels d'offres & analyse de devis travaux",
                alt: "Analyse de devis travaux et appel d'offres entreprises – gestion de projet construction",
                description: "Gestion de projet construction : constitution des dossiers d'appel d'offres, analyse de devis travaux, clarification technique et aide à la décision.",
                tags: ["Appels d'offres", 'Analyse devis', 'Maîtrise des coûts', 'AMO'],
                link: null,
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => { if (project.link) { navigate(project.link); } }}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-[0_10px_40px_rgba(10,92,61,0.4)] hover:border-2 hover:border-[#0a5c3d] transition-all ${project.link ? 'cursor-pointer' : ''}`}
              >
                <div className="relative h-64 overflow-hidden group">
                  <img
                    src={project.image}
                    alt={project.alt ?? project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {project.link && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Voir le projet →
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Pour qui ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Maîtres d'ouvrage, architectes, promoteurs, régies, entreprises générales et entreprises de rénovation en Suisse romande.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: 'Maîtres d\'ouvrage', description: 'Pour sécuriser votre projet, vos coûts, vos décisions et votre livraison.' },
              { title: 'Architectes', description: 'Pour renforcer votre suivi chantier et déléguer la coordination opérationnelle.' },
              { title: 'Promoteurs & investisseurs', description: 'Pour garder le contrôle sur les risques, les délais et la qualité.' },
              { title: 'Entreprises générales', description: 'Pour appuyer les équipes travaux, absorber une surcharge ou structurer une phase sensible.' },
            ].map((audience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 border border-gray-200 rounded-lg hover:border-[#0a5c3d] hover:shadow-[0_10px_40px_rgba(10,92,61,0.3)] transition-all bg-white"
              >
                <Building2 className="mx-auto mb-4 text-[#0a5c3d]" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{audience.title}</h3>
                <p className="text-gray-600">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Numbers Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Photo — cadrage sur le haut (logo SBRE lumineux) */}
        <img
          src={sbreOfficeImage}
          alt="Bureau SBRE Ingénierie – direction de travaux en Suisse romande"
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
        />
        {/* Overlay : haut léger pour laisser respirer le logo, bas plus sombre */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[#0a5c3d]/15" />
        {/* Transition progressive vers la FAQ */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0a5c3d]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.35em] uppercase text-[#1db954] font-medium mb-5">
              Notre engagement
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
              Maîtrise des coûts, délais et qualité
            </h2>
            <div className="w-8 h-px bg-white/25 mx-auto mb-4" />
            <p className="text-sm text-white/55 font-light max-w-lg mx-auto leading-relaxed tracking-wide">
              Un bureau de direction de travaux engagé sur chaque projet en Suisse romande.
            </p>
          </motion.div>

          {/* 4 cartes verre dépoli premium */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { value: '+6 ans',           label: "d'expérience terrain" },
              { value: 'Suisse romande',   label: 'Lausanne · Genève · Vaud' },
              { value: 'Coordination TCE', label: 'entreprises · délais · qualité' },
              { value: 'Normes SIA',       label: 'conformité · réception' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex flex-col items-center justify-center text-center
                           backdrop-blur-[4px] bg-white/[0.06]
                           border border-white/20
                           rounded-lg px-4 py-8 md:py-10
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.3)]"
              >
                <span className="text-lg md:text-xl font-semibold text-white leading-snug mb-2 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] md:text-xs text-white/50 font-light tracking-wide leading-relaxed">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-16 bg-[#0a5c3d] text-white relative overflow-hidden">
        {/* Arrière-plan discret avec motif architectural */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 36px),
                              repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 36px)`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

            {/* Colonne gauche : Titre + Texte + Bouton */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-24"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Vos questions avant de lancer un projet
              </h2>
              <p className="text-base sm:text-lg text-gray-200 mb-6 leading-relaxed">
                Budget, planning, coordination, suivi terrain : mieux vaut clarifier les choses.
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 bg-white text-[#0a5c3d] rounded-md hover:bg-gray-100 hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2 group text-sm sm:text-base"
              >
                Parler de mon projet
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            </motion.div>

            {/* Colonne droite : FAQ Accordéon */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <FAQAccordion />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-12 md:py-24 overflow-hidden">
        {contactSlides.map((slide, i) => (
          <img
            key={i}
            src={slide}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === contactSlideIndex ? 0.6 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-white/25" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-block backdrop-blur-md bg-white/40 rounded-2xl px-5 py-6 sm:px-10 sm:py-8 shadow-lg border border-white/40 w-full sm:w-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Contact</h2>
              <div className="w-14 h-1 bg-[#0a5c3d] mx-auto mb-4 rounded-full" />
              <p className="text-base text-gray-800 max-w-2xl font-medium leading-relaxed">
                Vous souhaitez faire analyser un projet, préparer une soumission, renforcer votre direction de travaux ou sécuriser une phase chantier ? Contactez SBRE Ingénierie.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-md bg-white/40 rounded-2xl px-6 py-4 shadow border border-white/40 mb-6 text-center"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-1">Intervention à Lausanne, Genève, Vaud et Suisse romande</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              SBRE Ingénierie intervient principalement à Lausanne, Genève, Nyon, Yverdon, dans le canton de Vaud et plus largement en Suisse romande pour des missions de direction de travaux, pilotage de chantier, AMO/RMO, coordination TCE, rénovation et suivi de projets de construction.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
            <motion.form
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-md bg-white/40 rounded-2xl shadow-2xl p-8 space-y-4 border border-white/40"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Nom</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a5c3d] bg-white/90 text-gray-900" />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Entreprise</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a5c3d] bg-white/90 text-gray-900" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a5c3d] bg-white/90 text-gray-900" />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Téléphone</label>
                  <input type="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a5c3d] bg-white/90 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-1 text-sm">Type de projet</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a5c3d] bg-white/90 text-gray-900">
                  <option>Direction de travaux</option>
                  <option>Assistance MO</option>
                  <option>Soumissions</option>
                  <option>Audit</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-1 text-sm">Message</label>
                <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a5c3d] bg-white/90 text-gray-900 resize-none"></textarea>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "mailto:info@sbre-ingenierie.ch";
                }}
                className="w-full px-8 py-4 bg-[#0a5c3d] text-white font-bold rounded-lg hover:bg-[#0d7a52] hover:shadow-[0_8px_30px_rgba(10,92,61,0.45)] transition-all duration-200 tracking-wide"
              >
                Envoyer ma demande
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="backdrop-blur-md bg-white/40 rounded-2xl shadow-xl p-6 border border-white/40">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">SBRE Ingénierie</h3>
                <p className="text-gray-800 font-medium text-sm">Direction de travaux · Pilotage · Coordination · Conseil</p>
                <p className="text-gray-700 text-sm mt-0.5">Lausanne – Suisse romande</p>
              </div>

              <div className="backdrop-blur-md bg-white/40 rounded-2xl shadow-xl p-6 border border-white/40 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a5c3d] flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-xs font-bold text-[#0a5c3d] uppercase tracking-widest mb-0.5">Email</p>
                    <a href="mailto:info@sbre-ingenierie.ch" className="text-gray-900 font-semibold hover:text-[#0a5c3d] transition-colors">info@sbre-ingenierie.ch</a>
                  </div>
                </div>
                <div className="border-t border-gray-300/40 pt-4 flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a5c3d] flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-xs font-bold text-[#0a5c3d] uppercase tracking-widest mb-0.5">Téléphone</p>
                    <a href="tel:+41783076029" className="text-gray-900 font-bold hover:text-[#0a5c3d] transition-colors">+41 78 307 60 29</a>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-md bg-white/40 rounded-2xl shadow-xl p-6 border border-white/40 flex gap-5 items-start">
                <div className="flex-shrink-0 w-30 sm:w-40 rounded-xl overflow-hidden shadow-md" style={{ aspectRatio: '3/4' }}>
                  <ImageWithFallback src={photo84866} alt="Fondateur SBRE" className="w-full h-full object-cover object-top" />
                </div>
                <blockquote className="border-l-4 border-[#0a5c3d] pl-4 self-center">
                  <p className="text-gray-900 italic leading-relaxed text-sm font-medium">"Les bons projets se <br />structurent, se contrôlent et se pilotent avec exigence."</p>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img
                src={logoImage}
                alt="SBRE Ingénierie"
                className="h-16 md:h-20 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400">
                Bureau de direction de travaux, pilotage de chantier et coordination TCE en Suisse romande — Lausanne, Genève, Vaud.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navigation</h4>
              <div className="space-y-2">
                {['Accueil', 'Expertises', 'Méthode', 'Réalisations', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">Lausanne, Suisse romande</p>
              <p className="text-gray-400 mb-2"><a href="mailto:info@sbre-ingenierie.ch" className="hover:text-white transition-colors">info@sbre-ingenierie.ch</a></p>
              <p className="text-gray-400"><a href="tel:+41783076029" className="hover:text-white transition-colors">+41 78 307 60 29</a></p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 SBRE Ingénierie. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
