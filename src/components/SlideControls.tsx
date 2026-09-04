import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FlavorSlide } from '../types';

interface SlideControlsProps {
  slides: FlavorSlide[];
  currentIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
  isAnimating: boolean;
}

export const SlideControls: React.FC<SlideControlsProps> = ({
  slides,
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
  onSelectSlide,
  isAnimating,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  return (
    <>
      {/* Primary Arrow Navigation (matching .ffy-arrows with brutalist styling) */}
      <div
        id="ffy-arrows-container"
        className="absolute bottom-6 sm:bottom-10 right-4 sm:right-10 md:right-14 z-40 flex items-center gap-3 pointer-events-auto"
      >
        {/* Prev Arrow */}
        <button
          id="ffy-prev-btn"
          type="button"
          onClick={onPrev}
          disabled={isFirst || isAnimating}
          aria-label="Previous Flavor"
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 transition-all duration-150 cursor-pointer ${
            isFirst
              ? 'opacity-25 cursor-not-allowed border-white/10 bg-[#0A0A0A] text-white/30'
              : 'bg-[#0A0A0A] text-white border-white/40 hover:border-orange-600 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[1px_1px_0px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Arrow */}
        <button
          id="ffy-next-btn"
          type="button"
          onClick={onNext}
          disabled={isLast || isAnimating}
          aria-label="Next Flavor"
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 transition-all duration-150 cursor-pointer ${
            isLast
              ? 'opacity-25 cursor-not-allowed border-white/10 bg-[#0A0A0A] text-white/30'
              : 'bg-[#0A0A0A] text-white border-orange-600 shadow-[4px_4px_0px_0px_#ea580c] hover:shadow-[1px_1px_0px_0px_#ea580c] hover:translate-x-0.5 hover:translate-y-0.5'
          }`}
        >
          <ChevronRight className="w-6 h-6 text-orange-500" />
        </button>
      </div>

      {/* Flavor Dots & Preview Thumbnails (Bottom Center) */}
      <div
        id="slide-thumbnails-bar"
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-2 bg-[#0A0A0A]/95 border-2 border-white/20 px-3 py-2 shadow-[4px_4px_0px_0px_#ffffff] pointer-events-auto"
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              id={`thumbnail-select-${slide.id}`}
              type="button"
              onClick={() => onSelectSlide(idx)}
              disabled={isAnimating}
              className={`group relative flex items-center gap-2 px-3 py-1.5 transition-all duration-150 cursor-pointer font-black text-xs uppercase tracking-wider italic ${
                isActive
                  ? 'bg-white text-black shadow-[2px_2px_0px_0px_#ea580c]'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span
                className="w-2.5 h-2.5 transition-all"
                style={{
                  backgroundColor: isActive ? '#ea580c' : 'rgba(255,255,255,0.4)',
                }}
              />
              <span>{slide.title}</span>
            </button>
          );
        })}
      </div>

      {/* Slide Counter Indicator (Top Right: Bold Typography Metric Block) */}
      <div
        id="slide-counter"
        className="absolute top-24 right-6 sm:right-10 z-30 hidden md:flex flex-col items-end border-r-2 border-orange-600 pr-3"
      >
        <div className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/40">
          INDEX SELECTOR
        </div>
        <div className="flex items-baseline gap-1 font-display font-black italic text-3xl text-white">
          <span className="text-orange-500">0{currentIndex + 1}</span>
          <span className="text-white/30 text-lg">/</span>
          <span className="text-white/50 text-base">0{totalSlides}</span>
        </div>
      </div>

      {/* Keyboard & Wheel Guide */}
      <div
        id="scroll-swipe-hint"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-[9px] font-bold uppercase tracking-[0.35em] text-white/30 select-none pointer-events-none hidden md:block"
      >
        WHEEL SCROLL / ARROWS: CYCLE FLAVORS
      </div>
    </>
  );
};
