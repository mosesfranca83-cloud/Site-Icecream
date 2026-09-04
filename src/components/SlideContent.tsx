import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Plus, Star, Flame, Sparkles } from 'lucide-react';
import { FlavorSlide } from '../types';

interface SlideContentProps {
  currentSlide: FlavorSlide;
  direction: number;
  onOrderClick: (flavor: FlavorSlide) => void;
  onTasteInfoClick: (flavor: FlavorSlide) => void;
}

export const SlideContent: React.FC<SlideContentProps> = ({
  currentSlide,
  direction,
  onOrderClick,
  onTasteInfoClick,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = [
      badgeRef.current,
      titleRef.current,
      descRef.current,
      metaRef.current,
      ctaRef.current,
    ].filter(Boolean);

    // Fade and slide in with stagger
    gsap.fromTo(
      targets,
      {
        opacity: 0,
        y: 28 * (direction >= 0 ? 1 : -1),
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.25,
      }
    );
  }, [currentSlide.id, direction]);

  return (
    <div
      ref={contentRef}
      id="slide-content-container"
      className="absolute bottom-16 sm:bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-4 sm:left-10 md:left-14 lg:left-20 max-w-lg z-30 pointer-events-auto"
    >
      {/* Section & Flavor Label */}
      <div
        ref={badgeRef}
        id="slide-flavor-badge"
        className="flex items-center gap-3 mb-3"
      >
        <div className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2.5 py-1 border-l-4 border-orange-600 shadow-[2px_2px_0px_0px_#ffffff]">
          FLAVOR 0{currentSlide.id + 1}
        </div>
        <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/50">
          Stockholm / Churned Daily
        </div>
      </div>

      {/* Main Flavor Title: Ultra-bold, italic, tight tracking */}
      <h2
        ref={titleRef}
        id={`flavor-title-${currentSlide.id}`}
        className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic tracking-[-0.06em] uppercase text-white mb-2 leading-[0.88] drop-shadow-2xl"
      >
        {currentSlide.title}
      </h2>

      {/* Description: High-contrast typography statement */}
      <p
        ref={descRef}
        id={`flavor-desc-${currentSlide.id}`}
        className="text-sm sm:text-base font-bold text-white leading-snug mb-5 max-w-md border-l-2 border-orange-600 pl-3.5"
      >
        {currentSlide.description}
      </p>

      {/* Brutalist Metadata Specs Grid */}
      <div
        ref={metaRef}
        id="flavor-meta-chips"
        className="grid grid-cols-3 gap-3 border-t border-white/20 pt-3.5 mb-6 max-w-md"
      >
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">
            ENERGY
          </div>
          <div className="text-base sm:text-lg font-black italic text-white">
            {currentSlide.calories}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">
            RATING
          </div>
          <div className="text-base sm:text-lg font-black italic text-white flex items-center gap-1">
            <span className="text-orange-500">★</span> {currentSlide.rating}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">
            STATUS
          </div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-orange-500 bg-orange-600/10 px-2 py-1 border border-orange-600/40 inline-block">
            READY TO SCOOP
          </div>
        </div>
      </div>

      {/* Call to Action Buttons */}
      <div
        ref={ctaRef}
        id="flavor-cta-group"
        className="flex flex-wrap items-center gap-4"
      >
        {/* Primary Action: Order Scoop with Hard Orange Shadow */}
        <button
          id="btn-order-flavor"
          type="button"
          onClick={() => onOrderClick(currentSlide)}
          className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-white text-black font-black text-sm uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] hover:shadow-[2px_2px_0px_0px_rgba(234,88,12,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer italic"
        >
          <div className="w-3.5 h-3.5 bg-orange-600 shrink-0"></div>
          <span>ORDER ${currentSlide.price.toFixed(2)}</span>
        </button>

        {/* Secondary Action: Download design / Tasting notes */}
        <button
          type="button"
          onClick={() => onTasteInfoClick(currentSlide)}
          className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#0A0A0A] text-white border-2 border-white/40 hover:border-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-150 cursor-pointer italic shadow-[4px_4px_0px_0px_#ffffff]"
        >
          <span>TASTING NOTES</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
