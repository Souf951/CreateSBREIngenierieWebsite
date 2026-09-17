export const partnerStages = [
  {
    role: "Architecte",
    title: "Concevoir.",
    detail: "Plans, intentions, détails, validations.",
    text: "SBRE transforme les intentions du projet en décisions de chantier lisibles et exécutables.",
  },
  {
    role: "Entreprises",
    title: "Exécuter.",
    detail: "Planning, interfaces, accès, qualité.",
    text: "Les séquences deviennent claires et les interfaces sont structurées.",
  },
  {
    role: "Maître d’ouvrage",
    title: "Décider.",
    detail: "Coûts, délais, arbitrages, risques.",
    text: "Le projet reste lisible, pilotable et maîtrisé.",
  },
  {
    role: "Direction de travaux",
    title: "Coordonner.",
    detail: "Contrôle, anticipation, suivi, réception.",
    text: "SBRE renforce le pilotage terrain et sécurise les interfaces.",
  },
  {
    role: "Ensemble",
    title: "Un projet. Une coordination.",
    detail: "Collaborons ensemble.",
    text: "Chaque acteur conserve son rôle. Nous créons le lien qui fait avancer le projet.",
  },
] as const;

export const clamp = (value: number) => Math.min(1, Math.max(0, value));
export function stageOpacity(progress: number, index: number) {
  const t = clamp((0.85 - Math.abs(clamp(progress) * 4 - index)) / 0.7);
  return t * t * (3 - 2 * t);
}
