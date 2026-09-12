import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEOHead from './SEOHead';
import logoImage from '../../imports/Pr_sentation1_page-0001.png';
import heroImage from '../../imports/1721891231854__1_.jpg';
import gallery1 from '../../imports/1721891230963.jpg';
import gallery2 from '../../imports/1721891231094.jpg';
import gallery3 from '../../imports/1721891230808.jpg';
import gallery4 from '../../imports/1748964038069.jpg';
import gallery5 from '../../imports/IMG_2957.jpg';
import gallery6 from '../../imports/IMG_0582.jpeg';
import gallery7 from '../../imports/IMG_0593.jpeg';
import chantier1 from '../../imports/IMG_1276.jpeg';
import chantier2 from '../../imports/IMG_1260.jpeg';
import chantier3 from '../../imports/IMG_0994.jpeg';
import chantier4 from '../../imports/IMG_0987.jpeg';
import chantier5 from '../../imports/IMG_1279.jpeg';
import chantier6 from '../../imports/IMG_0786.jpeg';

export default function ProjectTertiaire() {
  const navigate = useNavigate();
  const [selectedImageChantier, setSelectedImageChantier] = useState<number | null>(null);
  const [selectedImageFinal, setSelectedImageFinal] = useState<number | null>(null);

  const chantierImages = [
    { src: chantier1, alt: 'Travaux escalier et plafond avec verrière' },
    { src: chantier2, alt: 'Phase de construction escalier' },
    { src: chantier3, alt: 'Coordination des travaux intérieurs' },
    { src: chantier4, alt: 'Chantier - Aménagement des espaces' },
    { src: chantier5, alt: 'Avancement des finitions' },
    { src: chantier6, alt: 'Travaux de rénovation en cours' },
  ];

  const finalImages = [
    { src: gallery1, alt: 'Couloir rénové avec finitions haut de gamme' },
    { src: gallery2, alt: 'Espace cafétéria moderne avec mur vert' },
    { src: gallery3, alt: 'Bureaux rénovés avec finitions soignées' },
    { src: gallery5, alt: 'Bureau rénové avec éclairage moderne' },
    { src: gallery6, alt: 'Escalier design avec garde-corps en verre' },
    { src: gallery7, alt: 'Couloir avec plafond design et mur bleu' },
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
      <SEOHead title="Rénovation tertiaire Genève – Direction de travaux | SBRE Ingénierie" description="SBRE Ingénierie assure la direction de travaux et la coordination TCE pour la rénovation d'espaces tertiaires à Genève : suivi de chantier, gestion des entreprises, suivi qualité et réception des travaux." canonical="https://sbre-ingenierie.ch/projet/tertiaire-geneve" />
      {/* Navigation */}
      <header>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24 lg:h-28">
            <Link to="/" aria-label="Retourner à l’accueil SBRE Ingénierie" className="flex items-center">
              <img
                src={logoImage}
                alt="SBRE Ingénierie"
                className="h-16 md:h-20 lg:h-24 w-auto"
              />
            </Link>
            <button
              onClick={() => { navigate('/'); setTimeout(() => { document.getElementById('réalisations')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
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
          src={heroImage}
          alt="Bâtiment tertiaire Genève"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Rénovation tertiaire – Genève
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl text-gray-200">Projet réalisé en collaboration avec GA Total Contract dans un environnement tertiaire pour le client UBS</p>
          </motion.div>
        </div>
      </section>

      {/* Badges */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {['Rénovation', 'Tertiaire', 'Genève', 'Coordination TCE', 'GA Total Contract', 'UBS', 'Suivi qualité', 'Réception'].map((badge) => (
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
            <p className="text-lg text-gray-700 leading-relaxed">Dans le cadre de cette rénovation tertiaire à Genève, SBRE Ingénierie valorise son expérience en direction de travaux en collaboration avec GA Total Contract. Le projet concernait un bâtiment existant à usage professionnel, avec des contraintes fortes de coordination, de délais, d'interfaces techniques et de qualité d'exécution.</p>
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
              'Coordination des entreprises',
              'Suivi de l\'avancement',
              'Gestion des interfaces techniques',
              'Organisation des interventions',
              'Suivi des décisions chantier',
              'Contrôle qualité',
              'Accompagnement jusqu\'à la livraison',
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

      {/* Gallery - Photos Chantier */}
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
                  loading="lazy"
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

      {/* Gallery - Résultat Final */}
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
                  loading="lazy"
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

      {/* Phases */}
      

      {/* Conclusion */}
      

      {/* Lightbox Chantier */}
      {selectedImageChantier !== null && (
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
      {selectedImageFinal !== null && (
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
                  loading="lazy"
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
