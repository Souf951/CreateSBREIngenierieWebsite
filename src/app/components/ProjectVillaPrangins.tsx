import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from './SEOHead';
import logoImage from '../../imports/Pr_sentation1_page-0001.png';
import chantier1 from '../../imports/IMG_0258.jpeg';
import chantier2 from '../../imports/IMG_0305.jpeg';
import chantier3 from '../../imports/IMG_0307.jpeg';
import chantier4 from '../../imports/IMG_0259.jpeg';
import chantier5 from '../../imports/IMG_0179.jpeg';
import chantier6 from '../../imports/IMG_0786-1.jpeg';
import final1 from '../../imports/3df6b3d580c913fd1f20bbd13b327fd4.jpg';
import final2 from '../../imports/35854ac3a0ce421ef049bcb9d3957c41.jpg';
import final3 from '../../imports/7e3be6433a7e5d0459af5cf69e48117e.jpg';
import final4 from '../../imports/d8af3db0023b39dd112975781ef26207.jpg';
import final5 from '../../imports/e41d075ba383a83cb08a62743f4a0b71.jpg';
import final6 from '../../imports/94185f87db7ea4001f5d640651271683.jpg';

export default function ProjectVillaPrangins() {
  const navigate = useNavigate();
  const [selectedChantier, setSelectedChantier] = useState<number | null>(null);
  const [selectedFinal, setSelectedFinal] = useState<number | null>(null);

  const chantierImages = [
    { src: chantier1, alt: 'Chantier villa – vue 1' },
    { src: chantier2, alt: 'Chantier villa – vue 2' },
    { src: chantier3, alt: 'Chantier villa – vue 3' },
    { src: chantier4, alt: 'Chantier villa – vue 4' },
    { src: chantier5, alt: 'Chantier villa – vue 5' },
    { src: chantier6, alt: 'Chantier villa – vue 6' },
  ];

  const finalImages = [
    { src: final1, alt: 'Réception finale – vue 1' },
    { src: final2, alt: 'Réception finale – vue 2' },
    { src: final3, alt: 'Réception finale – vue 3' },
    { src: final4, alt: 'Réception finale – vue 4' },
    { src: final5, alt: 'Réception finale – vue 5' },
    { src: final6, alt: 'Réception finale – vue 6' },
  ];

  const handlePrevChantier = () => {
    if (selectedChantier !== null)
      setSelectedChantier((selectedChantier - 1 + chantierImages.length) % chantierImages.length);
  };
  const handleNextChantier = () => {
    if (selectedChantier !== null)
      setSelectedChantier((selectedChantier + 1) % chantierImages.length);
  };
  const handlePrevFinal = () => {
    if (selectedFinal !== null)
      setSelectedFinal((selectedFinal - 1 + finalImages.length) % finalImages.length);
  };
  const handleNextFinal = () => {
    if (selectedFinal !== null)
      setSelectedFinal((selectedFinal + 1) % finalImages.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedChantier !== null) {
      if (e.key === 'ArrowLeft') handlePrevChantier();
      if (e.key === 'ArrowRight') handleNextChantier();
      if (e.key === 'Escape') setSelectedChantier(null);
    }
    if (selectedFinal !== null) {
      if (e.key === 'ArrowLeft') handlePrevFinal();
      if (e.key === 'ArrowRight') handleNextFinal();
      if (e.key === 'Escape') setSelectedFinal(null);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChantier, selectedFinal]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHead title="Transformation villa Prangins – AMO et pilotage TCE | SBRE Ingénierie" description="SBRE Ingénierie assure l'assistance maître d'ouvrage (AMO) pour la transformation et rénovation d'une villa à Prangins (Vaud) : pilotage TCE, suivi qualité et réception des travaux selon normes SIA." canonical="https://sbre-ingenierie.ch/projet/villa-prangins" />
      {/* Navigation */}
      <header>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24 lg:h-28">
            <button onClick={() => navigate('/')} aria-label="Retourner à l’accueil SBRE Ingénierie" className="flex items-center">
              <img
                src={logoImage}
                alt="SBRE Ingénierie"
                className="h-18 md:h-24 lg:h-28 w-auto transition-all duration-300"
              />
            </button>
            <button
              onClick={() => { navigate('/'); setTimeout(() => { document.getElementById('réalisations')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0a5c3d] text-white rounded-full font-medium hover:bg-[#0d7a52] active:scale-95 transition-all duration-200 shadow-md"
            >
              <ArrowLeft size={18} />
              Retour
            </button>
          </div>
        </div>
      </motion.nav>
      </header>

      <main>
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[70vh] flex items-center justify-center overflow-hidden mt-20 md:mt-24 lg:mt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Villa haut de gamme"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-4xl md:text-6xl text-white mb-4 sm:mb-6 font-bold"
          >
            Transformation villa haut de gamme – Suisse romande - Prangins
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
          >
            Projet de transformation intérieure et extérieure d'une villa de standing, avec suivi technique, coordination des entreprises et contrôle des finitions.
          </motion.p>
        </div>
      </section>

      {/* Badges Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              'Villa haut de gamme',
              'Transformation',
              'Intérieur',
              'Extérieur',
              'Coordination TCE',
              'Consultation entreprises',
              'Suivi qualité',
              'Finitions',
              'Réception',
              'Suisse romande',
              'Prangins'
            ].map((badge) => (
              <span
                key={badge}
                className="px-4 py-2 bg-[#0a5c3d] text-white rounded-full text-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Présentation du projet */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Présentation du projet</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Ce projet concerne la transformation d'une villa haut de gamme, avec des exigences élevées en matière de qualité, de coordination et de finitions. Dans ce type d'intervention, chaque détail compte : choix techniques, interfaces entre entreprises, respect du planning, propreté d'exécution et rendu final.
            </p>
            <div className="bg-[#0a5c3d] text-white p-6 rounded-lg border-l-4 border-[#1db954]">
              <p className="text-lg italic">
                "Dans une villa haut de gamme, les finitions ne sont pas un détail. Elles sont la preuve que le chantier a été réellement maîtrisé."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Mission</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Analyse des travaux',
              'Consultation des entreprises',
              'Analyse comparative des offres',
              'Planification des interventions',
              'Coordination des lots',
              'Suivi d\'exécution',
              'Contrôle qualité',
              'Suivi des finitions',
              'Accompagnement jusqu\'à la réception',
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#0a5c3d]"
              >
                <p className="text-gray-900 font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases du chantier */}
      

      {/* Galerie photo – Photos de chantier */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-1 h-10 bg-[#0a5c3d] rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">Photos de chantier</h2>
            </div>
            <p className="text-gray-500 ml-5 pl-4">Suivi d'exécution et coordination sur site</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {chantierImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative h-48 sm:h-72 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedChantier(index)}
              >
                <img
                  loading="lazy"
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie photo – Réception finale */}
      {finalImages.length > 0 && (
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-1 h-10 bg-[#0a5c3d] rounded-full" />
                <h2 className="text-3xl font-bold text-gray-900">Photos de réception finale</h2>
              </div>
              <p className="text-gray-500 ml-5 pl-4">Finitions, espaces livrés et résultat final</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {finalImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative h-48 sm:h-72 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedFinal(index)}
                >
                  <img
                  loading="lazy"
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Résultat */}
      <section className="py-12 md:py-24 bg-[#0a5c3d] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold mb-6">Résultat</h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              Transformation réussie d'une villa haut de gamme, avec une coordination maîtrisée des entreprises, un suivi rigoureux des finitions et une livraison conforme aux exigences du maître d'ouvrage. Le projet a été accompagné de la phase d'analyse jusqu'à la réception finale, en garantissant qualité, délais et maîtrise budgétaire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
                  loading="lazy"
              src={logoImage}
              alt="SBRE Ingénierie"
              className="h-16 md:h-20 w-auto mb-4 brightness-0 invert mx-auto"
            />
            <p className="text-gray-400 mb-4">
              Direction de travaux & pilotage de projets en Suisse romande.
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-[#1db954] hover:text-white transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </footer>

      {/* Lightbox – Chantier */}
      {selectedChantier !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedChantier(null)}
        >
          <button onClick={() => setSelectedChantier(null)} aria-label="Fermer la galerie" className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
            <X size={32} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handlePrevChantier(); }} aria-label="Photo précédente" className="absolute left-4 text-white hover:text-gray-300 transition-colors">
            <ChevronLeft size={48} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleNextChantier(); }} aria-label="Photo suivante" className="absolute right-4 text-white hover:text-gray-300 transition-colors">
            <ChevronRight size={48} />
          </button>
          <img
                  loading="lazy"
            src={chantierImages[selectedChantier].src}
            alt={chantierImages[selectedChantier].alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedChantier + 1} / {chantierImages.length}
          </div>
        </div>
      )}

      {/* Lightbox – Réception finale */}
      {selectedFinal !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedFinal(null)}
        >
          <button onClick={() => setSelectedFinal(null)} aria-label="Fermer la galerie" className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
            <X size={32} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handlePrevFinal(); }} aria-label="Photo précédente" className="absolute left-4 text-white hover:text-gray-300 transition-colors">
            <ChevronLeft size={48} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleNextFinal(); }} aria-label="Photo suivante" className="absolute right-4 text-white hover:text-gray-300 transition-colors">
            <ChevronRight size={48} />
          </button>
          <img
                  loading="lazy"
            src={finalImages[selectedFinal].src}
            alt={finalImages[selectedFinal].alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedFinal + 1} / {finalImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
