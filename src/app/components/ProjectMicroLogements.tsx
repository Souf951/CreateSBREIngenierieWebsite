import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEOHead from './SEOHead';
import logoImage from '../../media/Pr_sentation1_page-0001.webp';
import heroImage from '../../media/1741613187041-2.webp';
import chantier1 from '../../media/563BF4ED-0D3E-40DE-9842-E41CBCC58358.webp';
import chantier2 from '../../media/IMG_4094.webp';
import chantier3 from '../../media/IMG_4120.webp';
import chantier4 from '../../media/IMG_4109.webp';
import final1 from '../../media/1746172633498-2.webp';
import final2 from '../../media/1746172634781-2.webp';
import final3 from '../../media/1746172642405-2.webp';
import final4 from '../../media/cabbfb516d4a0a7b2efdcd36ad672d45.webp';

export default function ProjectMicroLogements() {
  const navigate = useNavigate();
  const [selectedImageChantier, setSelectedImageChantier] = useState<number | null>(null);
  const [selectedImageFinal, setSelectedImageFinal] = useState<number | null>(null);

  const chantierImages: { src: string; alt: string }[] = [
    { src: chantier1, alt: 'Construction immeuble micro-logements - Structure en cours' },
    { src: chantier2, alt: 'Chantier micro-logements - Avancement travaux' },
    { src: chantier3, alt: 'Phase construction - Coordination des entreprises' },
    { src: chantier4, alt: 'Suivi chantier - Aménagement intérieur' },
  ];

  const finalImages: { src: string; alt: string }[] = [
    { src: final1, alt: 'Micro-logement livré - Salle de bain moderne' },
    { src: final2, alt: 'Cuisine équipée - Finitions haut de gamme' },
    { src: final3, alt: 'Studio livré - Espace de vie optimisé' },
    { src: final4, alt: 'Micro-logement réception finale - Vue d\'ensemble' },
  ];

  const openLightboxChantier = (index: number) => {
    setSelectedImageChantier(index);
  };

  const closeLightboxChantier = () => {
    setSelectedImageChantier(null);
  };

  const nextImageChantier = () => {
    if (selectedImageChantier !== null) {
      setSelectedImageChantier((selectedImageChantier + 1) % chantierImages.length);
    }
  };

  const previousImageChantier = () => {
    if (selectedImageChantier !== null) {
      setSelectedImageChantier((selectedImageChantier - 1 + chantierImages.length) % chantierImages.length);
    }
  };

  const openLightboxFinal = (index: number) => {
    setSelectedImageFinal(index);
  };

  const closeLightboxFinal = () => {
    setSelectedImageFinal(null);
  };

  const nextImageFinal = () => {
    if (selectedImageFinal !== null) {
      setSelectedImageFinal((selectedImageFinal + 1) % finalImages.length);
    }
  };

  const previousImageFinal = () => {
    if (selectedImageFinal !== null) {
      setSelectedImageFinal((selectedImageFinal - 1 + finalImages.length) % finalImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageChantier !== null) {
        if (e.key === 'Escape') {
          closeLightboxChantier();
        } else if (e.key === 'ArrowRight') {
          nextImageChantier();
        } else if (e.key === 'ArrowLeft') {
          previousImageChantier();
        }
      } else if (selectedImageFinal !== null) {
        if (e.key === 'Escape') {
          closeLightboxFinal();
        } else if (e.key === 'ArrowRight') {
          nextImageFinal();
        } else if (e.key === 'ArrowLeft') {
          previousImageFinal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageChantier, selectedImageFinal]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHead title="Pilotage de chantier résidentiel Lancy – Micro-logements | SBRE Ingénierie" description="SBRE Ingénierie pilote le chantier résidentiel de micro-logements à Lancy en Suisse romande : suivi technique, coordination TCE, contrôle des reprises et interface exploitation." />
      {/* Navigation */}
      <header>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24 lg:h-28">
            <Link to="/" aria-label="Retourner à l’accueil SBRE Ingénierie" className="flex items-center">
              <img
                    loading="lazy" decoding="async"
                src={logoImage}
                alt="SBRE Ingénierie"
                className="h-16 md:h-20 lg:h-24 w-auto"
              />
            </Link>
            <button
              onClick={() => { navigate('/#réalisations'); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0a5c3d] text-white rounded-full font-medium hover:bg-[#0d7a52] active:scale-95 transition-all duration-200 shadow-md"
            >
              <ArrowLeft size={18} />
              <span>Retour</span>
            </button>
          </div>
        </div>
      </nav>
      </header>

      <main>
      {/* Hero Section */}
      <section className="relative h-[45vh] sm:h-[60vh] mt-20 md:mt-24 lg:mt-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 z-10" />
        <img
                    loading="lazy" decoding="async"
          src={heroImage}
          alt="Micro-logements CityPop Lancy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Micro-logements CityPop – Lancy
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl text-gray-200">Projet résidentiel de micro-logements réalisé en collaboration avec GA Total Contract dans un environnement exploité par CityPop</p>
          </motion.div>
        </div>
      </section>

      {/* Badges */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {['Micro-logements', 'Résidentiel', 'CityPop', 'GA Total Contract', 'Coordination TCE', 'Suivi qualité', 'Finitions', 'Livraison', 'Suisse romande'].map((badge) => (
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

      {/* Context */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Dans le cadre de ce projet de micro-logements, l'intervention a porté sur le suivi opérationnel du chantier, la coordination des entreprises et l'accompagnement des phases de finition et de livraison. Ce type de projet exige une organisation rigoureuse, car les logements sont répétitifs, techniques et soumis à des standards élevés de qualité, de délais et d'exploitation.
            </p>
            <div className="bg-[#0a5c3d] text-white p-6 rounded-lg border-l-4 border-[#1db954]">
              <p className="text-lg font-medium italic">"Un projet de micro-logements ne se pilote pas comme un chantier classique. La répétition des unités impose de la rigueur, de la méthode et un contrôle constant. Chaque défaut répété devient un problème multiplié. L'objectif est donc simple : anticiper, coordonner, contrôler et livrer proprement."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Mission</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Suivi de chantier',
              'Coordination des entreprises',
              'Gestion des interfaces techniques et architecturales',
              'Contrôle des finitions',
              'Suivi des reprises',
              'Préparation des livraisons',
              'Accompagnement jusqu\'à la remise des zones concernées',
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 bg-white p-6 rounded-lg shadow-sm"
              >
                <CheckCircle className="text-[#0a5c3d] flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      

      {/* Gallery - Photos Chantier */}
      {chantierImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Photos du chantier</h2>
              <p className="text-lg text-gray-600">Avancement des travaux et coordination sur site</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {chantierImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openLightboxChantier(index)}
                  className="relative h-56 sm:h-80 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                >
                  <img
                    loading="lazy" decoding="async"
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Cliquer pour agrandir
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery - Résultat Final */}
      {finalImages.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Résultat final</h2>
              <p className="text-lg text-gray-600">Finitions et livraison du projet</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {finalImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openLightboxFinal(index)}
                  className="relative h-56 sm:h-80 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                >
                  <img
                    loading="lazy" decoding="async"
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Cliquer pour agrandir
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Chantier */}
      {selectedImageChantier !== null && chantierImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightboxChantier}
        >
          <button
            onClick={closeLightboxChantier}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <X size={40} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              previousImageChantier();
            }}
              aria-label="Photo précédente"
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <ChevronLeft size={60} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImageChantier();
            }}
              aria-label="Photo suivante"
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <ChevronRight size={60} />
          </button>

          <div
            className="max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={selectedImageChantier}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={chantierImages[selectedImageChantier].src}
              alt={chantierImages[selectedImageChantier].alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg">
              {chantierImages[selectedImageChantier].alt}
            </p>
            <p className="text-gray-400 text-center mt-2">
              {selectedImageChantier + 1} / {chantierImages.length}
            </p>
          </div>
        </div>
      )}

      {/* Lightbox Résultat Final */}
      {selectedImageFinal !== null && finalImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightboxFinal}
        >
          <button
            onClick={closeLightboxFinal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <X size={40} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              previousImageFinal();
            }}
              aria-label="Photo précédente"
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <ChevronLeft size={60} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImageFinal();
            }}
              aria-label="Photo suivante"
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <ChevronRight size={60} />
          </button>

          <div
            className="max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={selectedImageFinal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={finalImages[selectedImageFinal].src}
              alt={finalImages[selectedImageFinal].alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg">
              {finalImages[selectedImageFinal].alt}
            </p>
            <p className="text-gray-400 text-center mt-2">
              {selectedImageFinal + 1} / {finalImages.length}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
                    loading="lazy" decoding="async"
              src={logoImage}
              alt="SBRE Ingénierie"
              className="h-16 md:h-20 w-auto mb-4 brightness-0 invert mx-auto"
            />
            <p className="text-gray-400 mb-4">
              Direction de travaux & pilotage de projets en Suisse romande.
            </p>
            <Link
              to="/"
              className="text-[#1db954] hover:underline"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
