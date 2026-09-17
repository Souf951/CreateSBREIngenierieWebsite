import tertiaire from "../../../media/1721891231854__1_.webp";
import logements from "../../../media/1741613187041.webp";
import chantier from "../../../media/1748964038069-1.webp";
import finition from "../../../media/1746172634781.webp";
import villaPrangins from "../../../media/3df6b3d580c913fd1f20bbd13b327fd4.webp";

export const projects = [
  {
    title: "Tertiaire, Genève",
    type: "RÉNOVATION · COORDINATION TCE",
    image: tertiaire,
    link: "/projet/tertiaire-geneve",
  },
  {
    title: "Micro-logements, Lancy",
    type: "RÉSIDENTIEL · SUIVI OPÉRATIONNEL",
    image: logements,
    link: "/projet/micro-logements-lancy",
  },
  {
    title: "Villa, Prangins",
    type: "TRANSFORMATION · FINITIONS",
    image: villaPrangins,
    link: "/projet/villa-prangins",
  },
];
export const cases = [
  {
    title: "Quand les corps de métier se croisent.",
    label: "Coordination des CFC",
    image: chantier,
    problem:
      "Des réseaux techniques, des cloisons et des plafonds occupent le même espace. Une interface oubliée peut bloquer plusieurs entreprises.",
    analysis:
      "Croiser les plans, les réservations et l’ordre d’intervention avant la fermeture des ouvrages.",
    action:
      "Arbitrer les interfaces en séance, attribuer chaque action et intégrer les décisions au planning des entreprises.",
    result:
      "Un point de contrôle clair : interfaces validées et autorisation de fermeture documentée.",
    deliverable: "Plan de coordination + relevé des décisions",
  },
  {
    title: "Un planning doit permettre de décider.",
    label: "Délais & anticipation",
    image: `${import.meta.env.BASE_URL}sbre-planning-case.webp`,
    problem:
      "Une tâche décale les suivantes. Les équipes restent mobilisées, mais la date de livraison devient incertaine.",
    analysis:
      "Identifier le chemin critique, les approvisionnements et les zones réellement disponibles.",
    action:
      "Reséquencer les tâches, organiser les interventions par zone et suivre les engagements à court terme.",
    result:
      "Un cap mesurable : jalons révisés, responsables identifiés et écarts suivis chaque semaine.",
    deliverable: "Planning recalé + suivi hebdomadaire",
  },
  {
    title: "La réception se prépare sur le terrain.",
    label: "Qualité & livraison",
    image: finition,
    problem:
      "Des défauts de finition découverts trop tard multiplient les reprises et compliquent l’entrée dans les lieux.",
    analysis:
      "Contrôler les points sensibles par local et par lot avant les opérations de réception.",
    action:
      "Organiser les pré-réceptions, photographier les défauts, affecter les corrections et vérifier les reprises.",
    result:
      "Une livraison documentée : état des réserves, corrections vérifiées et responsabilités traçables.",
    deliverable: "Liste de réserves + contrôle des reprises",
  },
];
