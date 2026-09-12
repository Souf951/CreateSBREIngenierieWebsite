import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    question: 'À quel moment devez-vous intervenir sur un projet ?',
    answer: 'Idéalement dès la phase d\'étude ou avant le lancement des soumissions. Plus nous intervenons tôt, plus nous pouvons sécuriser le budget, anticiper les contraintes techniques et éviter les mauvaises surprises en phase chantier.'
  },
  {
    question: 'Pouvez-vous reprendre un chantier déjà commencé ?',
    answer: 'Oui. Nous pouvons intervenir sur un projet en cours pour remettre de l\'ordre dans le planning, clarifier les responsabilités, suivre les entreprises et sécuriser les prochaines étapes. L\'objectif est simple : reprendre le contrôle avant que les retards ou les surcoûts ne s\'installent.'
  },
  {
    question: 'Travaillez-vous avec des architectes et des entreprises externes ?',
    answer: 'Oui. Nous collaborons avec les architectes, ingénieurs, maîtres d\'ouvrage et entreprises mandatées. Notre rôle est de coordonner les intervenants, contrôler l\'avancement, faire circuler les bonnes informations et défendre les intérêts du projet sur le terrain.'
  },
  {
    question: 'Pouvez-vous nous aider à maîtriser le budget ?',
    answer: 'Oui. Nous analysons les offres, comparons les prix, clarifions les prestations et suivons les coûts pendant le chantier. Un budget ne se maîtrise pas avec de bonnes intentions, mais avec des contrôles réguliers, des décisions claires et une vraie rigueur d\'exécution.'
  },
  {
    question: 'Êtes-vous présents concrètement sur le chantier ?',
    answer: 'Oui. Notre accompagnement ne se limite pas aux réunions ou aux documents. Nous assurons un suivi terrain, contrôlons la qualité d\'exécution, coordonnons les entreprises et veillons au respect du planning, du budget et des exigences du maître d\'ouvrage.'
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {faqData.map((faq, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20"
        >
          <button
            onClick={() => toggleQuestion(index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
          >
            <span className="text-base font-semibold text-white pr-3">
              {faq.question}
            </span>
            <div className="flex-shrink-0">
              {openIndex === index ? (
                <Minus size={18} className="text-white" />
              ) : (
                <Plus size={18} className="text-white" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
