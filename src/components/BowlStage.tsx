import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FlavorSlide } from '../types';

interface BowlStageProps {
  slides: FlavorSlide[];
  currentIndex: number;
  prevIndex: number;
  direction: number; // 1 for next, -1 for prev
  isAnimating: boolean;
  onAnimationComplete: () => void;
  onBowlClick: (flavor: FlavorSlide) => void;
}

export const BowlStage: React.FC<BowlStageProps> = ({
  slides,
  currentIndex,
  prevIndex,
  direction,
  isAnimating,
  onAnimationComplete,
  onBowlClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const bowlsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ingsRef = useRef<(HTMLDivElement | null)[][]>([]);
  const idleTweensRef = useRef<gsap.core.Tween[]>([]);

  // Initialize refs arrays
  if (ingsRef.current.length !== slides.length) {
    ingsRef.current = slides.map(() => []);
  }

  // Clear idle tweens
  const killIdle = () => {
    idleTweensRef.current.forEach((tween) => tween.kill());
    idleTweensRef.current = [];
  };

  // Start continuous floating animation for active ingredients
  const startIdle = (slideIdx: number) => {
    killIdle();
    const imgs = ingsRef.current[slideIdx]?.filter(Boolean);
    if (!imgs || imgs.length === 0) return;

    imgs.forEach((el, j) => {
      if (!el) return;
      const tween = gsap.to(el, {
        y: j % 2 === 0 ? 12 : -12,
        rotation: j % 2 === 0 ? 6 : -6,
        duration: 2.5 + j * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: j * 0.25,
      });
      idleTweensRef.current.push(tween);
    });
  };

  // Initial setup on mount
  useEffect(() => {
    slides.forEach((_, idx) => {
      const isCurrent = idx === currentIndex;
      const word = wordsRef.current[idx];
      const bowl = bowlsRef.current[idx];
      const ings = ingsRef.current[idx];

      if (word) {
        gsap.set(word, {
          xPercent: isCurrent ? 0 : 120,
          opacity: isCurrent ? 0.32 : 0,
        });
      }

      if (bowl) {
        gsap.set(bowl, {
          xPercent: isCurrent ? 0 : 160,
          rotation: isCurrent ? 0 : 120,
          opacity: isCurrent ? 1 : 0,
          pointerEvents: isCurrent ? 'auto' : 'none',
        });
      }

      if (ings) {
        ings.forEach((ing) => {
          if (!ing) return;
          gsap.set(ing, {
            opacity: isCurrent ? 1 : 0,
            scale: isCurrent ? 1 : 0.3,
            x: 0,
            y: 0,
          });
        });
      }
    });

    startIdle(currentIndex);

    return () => {
      killIdle();
    };
  }, []);

  // Handle transition when currentIndex changes
  useEffect(() => {
    if (prevIndex === currentIndex) return;

    killIdle();
    const prev = prevIndex;
    const next = currentIndex;
    const dir = direction;

    const outWord = wordsRef.current[prev];
    const inWord = wordsRef.current[next];
    const outBowl = bowlsRef.current[prev];
    const inBowl = bowlsRef.current[next];
    const outIngs = ingsRef.current[prev]?.filter(Boolean) || [];
    const inIngs = ingsRef.current[next]?.filter(Boolean) || [];

    // Pre-position incoming elements
    if (inWord) {
      gsap.set(inWord, {
        xPercent: 120 * dir,
        opacity: 0.32,
      });
    }

    if (inBowl) {
      gsap.set(inBowl, {
        xPercent: 160 * dir,
        rotation: 120 * dir,
        opacity: 1,
        pointerEvents: 'auto',
      });
    }

    if (outBowl) {
      outBowl.style.pointerEvents = 'none';
    }

    inIngs.forEach((ing) => {
      gsap.set(ing, {
        opacity: 0,
        scale: 0.3,
        x: 60 * dir,
        y: 0,
        rotation: 0,
      });
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        if (outWord) gsap.set(outWord, { opacity: 0 });
        if (outBowl) {
          gsap.set(outBowl, {
            xPercent: 160 * dir,
            rotation: 120 * dir,
            opacity: 0,
          });
        }
        outIngs.forEach((ing) => {
          gsap.set(ing, { opacity: 0, scale: 0.3 });
        });
        startIdle(next);
        onAnimationComplete();
      },
    });

    const DUR = 1.05;
    const EASE = 'power3.inOut';

    // 1. Giant Word Transition
    if (outWord) {
      timeline.to(
        outWord,
        {
          xPercent: -120 * dir,
          opacity: 0,
          duration: DUR,
          ease: EASE,
        },
        0
      );
    }
    if (inWord) {
      timeline.to(
        inWord,
        {
          xPercent: 0,
          opacity: 0.32,
          duration: DUR,
          ease: EASE,
        },
        0
      );
    }

    // 2. Bowl Translation & Rotation
    if (outBowl) {
      timeline.to(
        outBowl,
        {
          xPercent: -160 * dir,
          rotation: -120 * dir,
          opacity: 0,
          duration: DUR,
          ease: EASE,
        },
        0
      );
    }
    if (inBowl) {
      timeline.to(
        inBowl,
        {
          xPercent: 0,
          rotation: 0,
          opacity: 1,
          duration: DUR,
          ease: EASE,
        },
        0
      );
    }

    // 3. Outgoing Ingredients
    if (outIngs.length > 0) {
      timeline.to(
        outIngs,
        {
          opacity: 0,
          scale: 0.3,
          x: 0,
          rotation: 0,
          y: 0,
          duration: 0.28,
          ease: 'power2.in',
          stagger: 0.04,
        },
        0
      );
    }

    // 4. Incoming Ingredients Stagger
    if (inIngs.length > 0) {
      timeline.to(
        inIngs,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          rotation: 0,
          y: 0,
          duration: 0.42,
          ease: 'power3.out',
          stagger: 0.06,
        },
        0.32
      );
    }

    return () => {
      timeline.kill();
    };
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      id="stage-viewport"
      className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
    >
      {slides.map((slide, sIdx) => {
        return (
          <div
            key={slide.id}
            id={`slide-layer-${slide.id}`}
            className="absolute inset-0 flex items-center justify-center w-full h-full"
            style={{
              zIndex: sIdx === currentIndex ? 14 : 6,
            }}
          >
            {/* Giant Background Word */}
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none">
              <h1
                ref={(el) => {
                  wordsRef.current[sIdx] = el;
                }}
                id={`giant-word-${slide.id}`}
                className="font-display font-black text-white uppercase tracking-[-0.07em] select-none whitespace-nowrap text-[24vw] md:text-[22vw] lg:text-[20vw] leading-[0.72] will-change-transform"
                style={{
                  textShadow: '0 24px 48px rgba(0,0,0,0.6)',
                  transform: 'translateZ(0)',
                }}
              >
                {slide.bigWord}
              </h1>
            </div>

            {/* Central Bowl Container with dynamic floating elements */}
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center md:justify-end px-6 md:pr-16 lg:pr-24">
              <div
                ref={(el) => {
                  bowlsRef.current[sIdx] = el;
                }}
                id={`bowl-wrapper-${slide.id}`}
                className="relative cursor-pointer group will-change-transform pointer-events-auto"
                onClick={() => onBowlClick(slide)}
                title={`Click to customize & order ${slide.title}`}
              >
                {/* Glow ring behind bowl */}
                <div className="absolute -inset-8 md:-inset-16 rounded-full bg-orange-600/15 blur-3xl -z-10 group-hover:bg-orange-600/25 transition-all duration-700 pointer-events-none" />

                {/* Main Bowl Image */}
                <div className="relative w-[280px] sm:w-[380px] md:w-[460px] lg:w-[540px] xl:w-[580px] aspect-square transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={slide.bowlImage}
                    alt={slide.title}
                    className="w-full h-full object-contain bowl-shadow pointer-events-auto"
                    draggable={false}
                  />

                  {/* Floating badge over bowl on hover */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="px-5 py-2.5 bg-black text-white font-black text-xs sm:text-sm tracking-widest uppercase border-2 border-orange-600 shadow-[6px_6px_0px_0px_#ea580c] flex items-center gap-2 whitespace-nowrap italic">
                      <span className="w-2.5 h-2.5 bg-orange-600 inline-block"></span>
                      Order Artisan Scoop
                    </span>
                  </div>
                </div>

                {/* Orbiting / Floating Ingredients */}
                {slide.ingredients.map((ing, iIdx) => {
                  // Coordinate layout percentage based on ingredient role
                  // ing 0: top-left (-28%, -15%)
                  // ing 1: top-right (72%, -18%)
                  // ing 2: bottom-right (68%, 68%) or bottom-left (-20%, 65%)
                  const positions = [
                    'top-[-8%] left-[-14%] sm:top-[-10%] sm:left-[-18%] w-[85px] sm:w-[125px] md:w-[155px]',
                    'top-[-12%] right-[-10%] sm:top-[-16%] sm:right-[-15%] w-[95px] sm:w-[140px] md:w-[175px]',
                    'bottom-[-6%] right-[-6%] sm:bottom-[-10%] sm:right-[-12%] w-[80px] sm:w-[120px] md:w-[150px]',
                  ];

                  const posClass = positions[iIdx % positions.length];

                  return (
                    <div
                      key={ing.id}
                      ref={(el) => {
                        if (!ingsRef.current[sIdx]) ingsRef.current[sIdx] = [];
                        ingsRef.current[sIdx][iIdx] = el;
                      }}
                      id={`ingredient-${slide.id}-${ing.id}`}
                      className={`absolute ${posClass} pointer-events-none z-20 will-change-transform`}
                    >
                      <img
                        src={ing.image}
                        alt={ing.name}
                        className="w-full h-auto object-contain ingredient-shadow drop-shadow-2xl"
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
