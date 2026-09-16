import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SITE_URL = "https://sbre-ingenierie.ch/";
const OG_IMAGE = `${SITE_URL}og-sbre-ingenierie.jpg`;

function resolveCanonical(value: string) {
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return SITE_URL;
  }
}

export default function SEOHead({
  title = "SBRE Ingénierie | Direction de travaux en Suisse romande",
  description = "SBRE Ingénierie accompagne maîtres d’ouvrage, architectes et propriétaires en direction de travaux, suivi de chantier et coordination des entreprises en Suisse romande.",
  canonical = SITE_URL,
}: SEOHeadProps) {
  useEffect(() => {
    const canonicalUrl = resolveCanonical(canonical);
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
      Object.entries(attrs).forEach(([attribute, content]) =>
        element!.setAttribute(attribute, content),
      );
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
    setLink("canonical", canonicalUrl);
    setLink("icon", `${SITE_URL}favicon-sbre.svg`);

    setMeta({ property: "og:type", content: "website" });
    setMeta({ property: "og:locale", content: "fr_CH" });
    setMeta({ property: "og:site_name", content: "SBRE Ingénierie" });
    setMeta({ property: "og:title", content: title });
    setMeta({ property: "og:description", content: description });
    setMeta({ property: "og:url", content: canonicalUrl });
    setMeta({ property: "og:image", content: OG_IMAGE });
    setMeta({
      property: "og:image:alt",
      content: "SBRE Ingénierie — direction de travaux en Suisse romande",
    });

    setMeta({ name: "twitter:card", content: "summary_large_image" });
    setMeta({ name: "twitter:title", content: title });
    setMeta({ name: "twitter:description", content: description });
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
        logo: `${SITE_URL}favicon-sbre.svg`,
        image: OG_IMAGE,
        telephone: "+41783076029",
        email: "info@sbre-ingenierie.ch",
        description:
          "Direction de travaux, suivi de chantier, coordination des entreprises, planification et réception des travaux en Suisse romande.",
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
            "Assistance au maître d’ouvrage",
            "Suivi de chantier",
            "Coordination des entreprises",
            "Appels d’offres et consultation des entreprises",
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
