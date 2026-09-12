import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useCallback, useRef } from 'react';
import logoImage from '../../imports/Pr_sentation1_page-0001.png';

interface IntroLoaderProps {
  onComplete: () => void;
  onReveal?: () => void;
}

type Phase = 'grid' | 'logo' | 'tagline' | 'move';

const STROKE = '#0a5c3d';

// All drawing delays are measured from the same clock. The next family begins
// before the preceding one has finished, keeping the sketch as one gesture.
const DRAW_START = {
  foundation: 0.08,
  volumes: 0.58,
  details: 1.32,
} as const;

const INTRO_CUES: ReadonlyArray<{ at: number; action: 'logo' | 'tagline' | 'move' | 'hide' | 'complete' }> = [
  { at: 2_500, action: 'logo' },
  { at: 3_500, action: 'tagline' },
  { at: 4_500, action: 'move' },
  { at: 4_900, action: 'hide' },
  { at: 5_200, action: 'complete' },
];

export default function IntroLoader({ onComplete, onReveal }: IntroLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>('grid');
  const [drawing, setDrawing] = useState(false);

  const onCompleteRef = useRef(onComplete);
  const onRevealRef = useRef(onReveal);
  const timelineCancelledRef = useRef(false);
  onCompleteRef.current = onComplete;
  onRevealRef.current = onReveal;

  const skip = useCallback(() => {
    timelineCancelledRef.current = true;
    setPhase('move');
    onRevealRef.current?.();
    setTimeout(() => setVisible(false), 700);
    setTimeout(() => onCompleteRef.current(), 1100);
  }, []);

  useEffect(() => {
    let frame = 0;
    let startedAt: number | null = null;
    let nextCue = 0;

    const runTimeline = (now: number) => {
      if (timelineCancelledRef.current) return;
      if (startedAt === null) {
        startedAt = now;
        setDrawing(true);
      }

      const elapsed = now - startedAt;
      while (nextCue < INTRO_CUES.length && elapsed >= INTRO_CUES[nextCue].at) {
        const cue = INTRO_CUES[nextCue++];
        if (cue.action === 'logo' || cue.action === 'tagline') setPhase(cue.action);
        if (cue.action === 'move') {
          setPhase('move');
          onRevealRef.current?.();
        }
        if (cue.action === 'hide') setVisible(false);
        if (cue.action === 'complete') {
          timelineCancelledRef.current = true;
          onCompleteRef.current();
          return;
        }
      }
      frame = requestAnimationFrame(runTimeline);
    };

    frame = requestAnimationFrame(runTimeline);
    return () => cancelAnimationFrame(frame);
  }, []);

  const villaOpacity = phase === 'logo' || phase === 'tagline' || phase === 'move' ? 0.12 : 1;
  const villaStroke = phase === 'logo' || phase === 'tagline' || phase === 'move' ? 0.55 : 0.4;
  const logoPhase = phase === 'logo' || phase === 'tagline' || phase === 'move';

  // SVG normalizes every contour to one unit, so dash endpoints always meet at
  // their original coordinates regardless of viewport size.
  const drawProps = (group: keyof typeof DRAW_START, duration = 1.2, delay = 0) => ({
    pathLength: 1,
    strokeDasharray: 1,
    initial: { strokeDashoffset: 1, opacity: 0 },
    animate: drawing
      ? { strokeDashoffset: 0, opacity: 1 }
      : { strokeDashoffset: 1, opacity: 0 },
    transition: { duration: duration * 0.72, delay: DRAW_START[group] + delay * 0.5, ease: 'linear' },
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f6f5f1] overflow-hidden"
        >
          {/* Skip button */}
          <button
            onClick={skip}
            className="absolute bottom-5 right-5 md:bottom-8 md:right-8 z-10 px-4 py-2 text-xs md:text-sm tracking-wider uppercase text-[#0a5c3d]/70 hover:text-[#0a5c3d] border border-[#0a5c3d]/30 hover:border-[#0a5c3d]/70 rounded-full transition-all duration-300 bg-white/40 backdrop-blur-sm"
            style={{ pointerEvents: 'auto' }}
            aria-label="Passer l'animation"
          >
            Passer →
          </button>

          {/* Architectural SVG */}
          <motion.svg
            viewBox="0 0 200 120"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ opacity: villaOpacity }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* === GRID & AXES (phase: grid) === */}
            <motion.g
              stroke={STROKE}
              strokeWidth={0.15}
              initial={{ opacity: 0 }}
              animate={{ opacity: logoPhase ? 0.15 : 0.35 }}
              transition={{ duration: 0.8 }}
            >
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v${i}`} x1={20 + i * 16} y1={10} x2={20 + i * 16} y2={110} />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h${i}`} x1={10} y1={15 + i * 15} x2={190} y2={15 + i * 15} />
              ))}
            </motion.g>

            {/* Cote marks */}
            <motion.g
              stroke={STROKE}
              strokeWidth={0.25}
              initial={{ opacity: 0 }}
              animate={{ opacity: logoPhase ? 0.2 : 0.7 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <line x1={30} y1={12} x2={170} y2={12} />
              <line x1={30} y1={10} x2={30} y2={14} />
              <line x1={170} y1={10} x2={170} y2={14} />
              <line x1={100} y1={10} x2={100} y2={14} />
              <line x1={12} y1={30} x2={12} y2={95} />
              <line x1={10} y1={30} x2={14} y2={30} />
              <line x1={10} y1={95} x2={14} y2={95} />
            </motion.g>

            {/* === TERRAIN / GROUND (phase: foundation) === */}
            <motion.line
              x1={25} y1={95} x2={175} y2={95}
              stroke={STROKE} strokeWidth={villaStroke} strokeLinecap="round"
              {...drawProps('foundation', 1.0)}
            />
            {/* Ground hatches */}
            <motion.g stroke={STROKE} strokeWidth={0.2}
              initial={{ opacity: 0 }}
              animate={{ opacity: drawing ? (logoPhase ? 0.2 : 0.6) : 0 }}
              transition={{ duration: 0.55, delay: DRAW_START.foundation + 0.25 }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={`g${i}`} x1={30 + i * 10} y1={95} x2={26 + i * 10} y2={99} />
              ))}
            </motion.g>

            {/* Foundation rectangle */}
            <motion.rect
              x={40} y={90} width={120} height={5}
              fill="none" stroke={STROKE} strokeWidth={villaStroke}
              {...drawProps('foundation', 1.0, 0.2)}
            />

            {/* === MAIN VOLUMES (phase: volumes) === */}
            {/* Ground floor main rectangle */}
            <motion.rect
              x={45} y={60} width={110} height={30}
              fill="none" stroke={STROKE} strokeWidth={villaStroke}
              {...drawProps('volumes', 1.0)}
            />
            {/* Upper cantilevered volume (offset to right) */}
            <motion.rect
              x={70} y={40} width={95} height={20}
              fill="none" stroke={STROKE} strokeWidth={villaStroke}
              {...drawProps('volumes', 1.0, 0.4)}
            />
            {/* Flat roof line — slightly extends */}
            <motion.line
              x1={66} y1={40} x2={169} y2={40}
              stroke={STROKE} strokeWidth={villaStroke}
              {...drawProps('volumes', 0.8, 0.9)}
            />
            <motion.line
              x1={41} y1={60} x2={73} y2={60}
              stroke={STROKE} strokeWidth={villaStroke}
              {...drawProps('volumes', 0.6, 1.0)}
            />

            {/* === DETAILS (phase: details) === */}
            {/* Large bay windows — ground floor */}
            <motion.rect
              x={52} y={66} width={22} height={20}
              fill="none" stroke={STROKE} strokeWidth={villaStroke * 0.8}
              {...drawProps('details', 0.7)}
            />
            <motion.line x1={63} y1={66} x2={63} y2={86}
              stroke={STROKE} strokeWidth={villaStroke * 0.6}
              {...drawProps('details', 0.5, 0.5)}
            />
            <motion.rect
              x={82} y={66} width={28} height={20}
              fill="none" stroke={STROKE} strokeWidth={villaStroke * 0.8}
              {...drawProps('details', 0.7, 0.2)}
            />
            <motion.line x1={96} y1={66} x2={96} y2={86}
              stroke={STROKE} strokeWidth={villaStroke * 0.6}
              {...drawProps('details', 0.5, 0.6)}
            />
            <motion.rect
              x={118} y={66} width={32} height={20}
              fill="none" stroke={STROKE} strokeWidth={villaStroke * 0.8}
              {...drawProps('details', 0.7, 0.3)}
            />
            <motion.line x1={134} y1={66} x2={134} y2={86}
              stroke={STROKE} strokeWidth={villaStroke * 0.6}
              {...drawProps('details', 0.5, 0.7)}
            />

            {/* Upper floor windows */}
            <motion.rect
              x={75} y={45} width={28} height={12}
              fill="none" stroke={STROKE} strokeWidth={villaStroke * 0.8}
              {...drawProps('details', 0.6, 0.4)}
            />
            <motion.rect
              x={108} y={45} width={28} height={12}
              fill="none" stroke={STROKE} strokeWidth={villaStroke * 0.8}
              {...drawProps('details', 0.6, 0.5)}
            />
            <motion.rect
              x={141} y={45} width={20} height={12}
              fill="none" stroke={STROKE} strokeWidth={villaStroke * 0.8}
              {...drawProps('details', 0.6, 0.6)}
            />

            {/* Terrace */}
            <motion.line
              x1={155} y1={90} x2={180} y2={90}
              stroke={STROKE} strokeWidth={villaStroke}
              {...drawProps('details', 0.6, 0.3)}
            />
            <motion.line
              x1={180} y1={90} x2={180} y2={95}
              stroke={STROKE} strokeWidth={villaStroke}
              {...drawProps('details', 0.4, 0.5)}
            />
            {/* Terrace railing */}
            <motion.line
              x1={155} y1={86} x2={180} y2={86}
              stroke={STROKE} strokeWidth={villaStroke * 0.6}
              {...drawProps('details', 0.5, 0.6)}
            />
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.line
                key={`rail${i}`}
                x1={158 + i * 5} y1={86} x2={158 + i * 5} y2={90}
                stroke={STROKE} strokeWidth={villaStroke * 0.5}
                {...drawProps('details', 0.3, 0.7 + i * 0.05)}
              />
            ))}

            {/* External stairs */}
            <motion.g stroke={STROKE} strokeWidth={villaStroke * 0.7}>
              {[0, 1, 2, 3].map((i) => (
                <motion.line
                  key={`step${i}`}
                  x1={28 + i * 4} y1={95 - i * 1.5}
                  x2={45} y2={95 - i * 1.5}
                  {...drawProps('details', 0.4, 0.5 + i * 0.1)}
                />
              ))}
            </motion.g>

            {/* Door */}
            <motion.rect
              x={45} y={72} width={5} height={18}
              fill="none" stroke={STROKE} strokeWidth={villaStroke * 0.8}
              {...drawProps('details', 0.5, 0.4)}
            />

            {/* Subtle reference annotations */}
            <motion.g
              stroke={STROKE} strokeWidth={0.2}
              initial={{ opacity: 0 }}
              animate={{ opacity: drawing ? (logoPhase ? 0.1 : 0.5) : 0 }}
              transition={{ duration: 0.55, delay: DRAW_START.details + 0.35 }}
            >
              <line x1={45} y1={36} x2={45} y2={42} />
              <line x1={155} y1={36} x2={155} y2={42} />
              <line x1={45} y1={38} x2={155} y2={38} />
            </motion.g>
          </motion.svg>

          {/* Logo */}
          <motion.img
            src={logoImage}
            alt="SBRE Ingénierie"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
            animate={
              phase === 'logo' || phase === 'tagline'
                ? {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    top: '50%',
                    left: '50%',
                    x: '-50%',
                    y: '-50%',
                  }
                : phase === 'move'
                  ? {
                      opacity: 1,
                      scale: 0.4,
                      filter: 'blur(0px)',
                      top: '0%',
                      left: '0%',
                      x: '0%',
                      y: '0%',
                    }
                  : { opacity: 0, scale: 0.92, filter: 'blur(10px)' }
            }
            transition={{
              duration: phase === 'move' ? 0.9 : 0.9,
              ease: phase === 'move' ? [0.7, 0, 0.3, 1] : 'easeOut',
            }}
            className="absolute h-28 md:h-36 lg:h-40 w-auto"
            style={{ transformOrigin: 'top left' }}
          />

          {/* Tagline */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center px-6"
            style={{ top: 'calc(50% + 90px)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={
              phase === 'tagline'
                ? { opacity: 1, y: 0 }
                : phase === 'move'
                  ? { opacity: 0, y: 0 }
                  : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-sm md:text-base tracking-[0.25em] uppercase text-[#0a5c3d]">
              Structurer. Budgéter. Réaliser. Exiger.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
