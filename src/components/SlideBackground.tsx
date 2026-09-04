import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FlavorSlide } from '../types';

interface SlideBackgroundProps {
  slides: FlavorSlide[];
  currentIndex: number;
  prevIndex: number;
}

export const SlideBackground: React.FC<SlideBackgroundProps> = ({
  slides,
  currentIndex,
  prevIndex,
}) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const colorProxy = useRef({
    inColor: slides[0].gradient[0],
    outColor: slides[0].gradient[1],
  });

  useEffect(() => {
    const targetIn = slides[currentIndex].gradient[0];
    const targetOut = slides[currentIndex].gradient[1];

    const tween = gsap.to(colorProxy.current, {
      inColor: targetIn,
      outColor: targetOut,
      duration: 1.1,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (bgRef.current) {
          bgRef.current.style.background = `linear-gradient(270deg, ${colorProxy.current.inColor} 0%, ${colorProxy.current.outColor} 100%)`;
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [currentIndex, slides]);

  return (
    <div className="absolute inset-0 w-full h-full -z-20 bg-[#0A0A0A] overflow-hidden pointer-events-none select-none">
      {/* Dynamic Animated Flavor Hue Layer */}
      <div
        ref={bgRef}
        id="ffy-dynamic-background"
        className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen transition-all pointer-events-none"
        style={{
          background: `linear-gradient(270deg, ${slides[0].gradient[0]} 0%, ${slides[0].gradient[1]} 100%)`,
        }}
      />

      {/* Dark Vignette & Atmospheric Contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,transparent_30%,#0A0A0A_90%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[#0A0A0A]/40 pointer-events-none" />

      {/* Editorial Grid Lines & Watermarks */}
      <div className="absolute inset-0 flex justify-between px-10 pointer-events-none opacity-10">
        <div className="w-[1px] h-full bg-white"></div>
        <div className="w-[1px] h-full bg-white hidden sm:block"></div>
        <div className="w-[1px] h-full bg-white hidden md:block"></div>
        <div className="w-[1px] h-full bg-white"></div>
      </div>
    </div>
  );
};
