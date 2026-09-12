import { useState } from 'react';
import { Phone, Mail } from 'lucide-react';

function FloatingPhoneButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="tel:+41783076029"
      aria-label="Appeler SBRE Ingénierie"
      className="fixed right-0 z-50 flex items-center bg-[#0a5c3d] hover:bg-[#0d7a52] rounded-l-lg shadow-lg overflow-hidden transition-all duration-300 ease-out"
      style={{
        top: 'calc(50% - 30px)',
        width: isHovered ? '230px' : '48px',
        height: '48px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
        <Phone size={20} className="text-white" />
      </div>
      <span
        className="text-white text-sm font-medium whitespace-nowrap pl-2 pr-3 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0
        }}
      >
        +41 78 307 60 29
      </span>
    </a>
  );
}

function FloatingEmailButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="mailto:info@sbre-ingenierie.ch"
      aria-label="Envoyer un email à SBRE Ingénierie"
      className="fixed right-0 z-50 flex items-center bg-[#0a5c3d] hover:bg-[#0d7a52] rounded-l-lg shadow-lg overflow-hidden transition-all duration-300 ease-out"
      style={{
        top: 'calc(50% + 21px)',
        width: isHovered ? '270px' : '48px',
        height: '48px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
        <Mail size={20} className="text-white" />
      </div>
      <span
        className="text-white text-sm font-medium whitespace-nowrap pl-2 pr-3 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0
        }}
      >
        info@sbre-ingenierie.ch
      </span>
    </a>
  );
}

export default function FloatingContact() {
  return (
    <>
      <FloatingPhoneButton />
      <FloatingEmailButton />
    </>
  );
}
