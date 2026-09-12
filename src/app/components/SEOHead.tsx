import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SITE_URL = "https://sbre-ingenierie.ch/";
const OG_IMAGE = `${SITE_URL}og-sbre-ingenierie.png`;

export default function SEOHead({
  title = "SBRE Ingenierie & Direction de travaux",
  description = "SBRE Ingénierie accompagne maîtres d’ouvrage, architectes et entreprises en direction de travaux, suivi de chantier et coordination en Suisse romande.",
  canonical = SITE_URL,
}: SEOHeadProps) {
  useEffect(() => {
    document.documentElement.lang = "fr-CH";
    document.title = title;

    const setMeta = (attrs: Record<string, string>) => {
      const key = attrs.name ? "name" : "property";
      const value = (attrs.name ?? attrs.property) as string;
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);
      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([attribute, content]) => element!.setAttribute(attribute, content));
    };

    const setLink = (rel: string, href: string) => {
      let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        document.head.appendChild(element);
      }
      element.rel = rel;
      element.href = href;
    };

    setMeta({ name: "description", content: description });
    setMeta({ name: "robots", content: "index, follow, max-image-preview:large" });
    setLink("canonical", canonical);
    setLink("icon", `${SITE_URL}favicon-sbre.png`);

    setMeta({ property: "og:type", content: "website" });
    setMeta({ property: "og:locale", content: "fr_CH" });
    setMeta({ property: "og:site_name", content: "SBRE Ingénierie" });
    setMeta({ property: "og:title", content: title });
    setMeta({ property: "og:description", content: "Direction de travaux, suivi de chantier, planification et coordination des entreprises en Suisse romande." });
    setMeta({ property: "og:url", content: canonical });
    setMeta({ property: "og:image", content: OG_IMAGE });
    setMeta({ property: "og:image:alt", content: "SBRE Ingénierie — direction de travaux en Suisse romande" });

    setMeta({ name: "twitter:card", content: "summary_large_image" });
    setMeta({ name: "twitter:title", content: title });
    setMeta({ name: "twitter:description", content: "Direction de travaux, suivi de chantier et coordination en Suisse romande." });
    setMeta({ name: "twitter:image", content: OG_IMAGE });

    const jsonLdId = "sbre-json-ld";
    let jsonLdElement = document.head.querySelector<HTMLScriptElement>(`#${jsonLdId}`);
    if (!jsonLdElement) {
      jsonLdElement = document.createElement("script");
      jsonLdElement.id = jsonLdId;
      document.head.appendChild(jsonLdElement);
    }
    jsonLdElement.type = "application/ld+json";
    jsonLdElement.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}#business`,
        name: "SBRE Ingénierie",
        url: SITE_URL,
        logo: `${SITE_URL}favicon-sbre.png`,
        image: OG_IMAGE,
        telephone: "+41783076029",
        email: "info@sbre-ingenierie.ch",
        description: "Direction de travaux, suivi de chantier, coordination des entreprises, planification de chantier et réception des travaux en Suisse romande.",
        areaServed: [
          { "@type": "AdministrativeArea", name: "Suisse romande" },
          { "@type": "City", name: "Lausanne" },
          { "@type": "City", name: "Genève" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services de direction de travaux",
          itemListElement: [
            "Direction de travaux",
            "Suivi de chantier",
            "Coordination des entreprises",
            "Planification de chantier",
            "Réception des travaux",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: "SBRE Ingénierie",
        inLanguage: "fr-CH",
        publisher: { "@id": `${SITE_URL}#business` },
      },
    ]);

    return () => {
      document.head.querySelector(`#${jsonLdId}`)?.remove();
    };
  }, [title, description, canonical]);

  return null;
}
