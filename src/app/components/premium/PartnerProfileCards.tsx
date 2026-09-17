import { KeyboardEvent, MouseEvent, useState } from "react";
import { ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";
import "../../../styles/partners-profile-flip.css";

export type PartnerProfile = {
  title: string;
  subtitle: string;
  text: string;
  services: string;
};

type Props = {
  profiles: PartnerProfile[];
  onSelect: (profile: PartnerProfile, event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function PartnerProfileCards({ profiles, onSelect }: Props) {
  const [flipped, setFlipped] = useState<string | null>(null);

  const toggle = (title: string) => {
    setFlipped((current) => (current === title ? null : title));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, title: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle(title);
  };

  return (
    <div className="pr-profile-deck" aria-label="Profils de collaboration SBRE">
      {profiles.map((profile, index) => {
        const isFlipped = flipped === profile.title;
        const shortIndex = String(index + 1).padStart(2, "0");

        return (
          <article
            className={`pr-flip-card${isFlipped ? " is-flipped" : ""}`}
            key={profile.title}
            role="button"
            tabIndex={0}
            aria-pressed={isFlipped}
            aria-label={`${profile.title}. ${isFlipped ? "Afficher le recto" : "Afficher les détails"}`}
            onClick={() => toggle(profile.title)}
            onKeyDown={(event) => onKeyDown(event, profile.title)}
          >
            <div className="pr-flip-card-inner">
              <div className="pr-flip-face pr-flip-front">
                <div className="pr-flip-meta">
                  <span className="pr-flip-number">{shortIndex}</span>
                  <span>Collaboration</span>
                </div>

                <div className="pr-flip-front-copy">
                  <p className="pr-flip-kicker">Votre expertise</p>
                  <h3>{profile.title}</h3>
                  <p>{profile.subtitle}</p>
                </div>

                <div className="pr-flip-blueprint" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="pr-flip-hint">
                  <Sparkles size={15} aria-hidden="true" />
                  <span>Cliquer pour découvrir notre façon de collaborer</span>
                </div>
              </div>

              <div className="pr-flip-face pr-flip-back">
                <div className="pr-flip-back-top">
                  <div>
                    <span className="pr-flip-number pr-flip-number-light">{shortIndex}</span>
                    <p>SBRE × {profile.title}</p>
                  </div>
                  <RotateCcw size={19} aria-hidden="true" />
                </div>

                <div className="pr-flip-back-copy">
                  <p className="pr-flip-kicker">Notre point de rencontre</p>
                  <h3>{profile.title}</h3>
                  <p>{profile.text}</p>
                  <span className="pr-flip-services">{profile.services}</span>
                </div>

                <a
                  href="#partner-form"
                  className="pr-flip-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(profile, event);
                  }}
                >
                  Échanger sur une collaboration <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
