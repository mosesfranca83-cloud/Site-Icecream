import React, { useState } from 'react';
import { X, Award, ShieldCheck, MapPin, Clock, Phone, Mail, Send, Check } from 'lucide-react';
import { FlavorSlide } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'shop' | 'contact' | 'tasting';
  activeFlavor?: FlavorSlide;
  slides: FlavorSlide[];
  onSelectFlavor: (index: number) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
  activeFlavor,
  slides,
  onSelectFlavor,
}) => {
  if (!isOpen) return null;

  const [tab, setTab] = useState<'about' | 'shop' | 'contact' | 'tasting'>(initialTab);
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      id="info-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="info-modal-card"
        className="relative w-full max-w-2xl bg-[#0A0A0A] border-2 border-white/30 p-6 sm:p-8 text-white shadow-[12px_12px_0px_0px_#ea580c] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-white/20">
          <div className="flex items-center gap-1 sm:gap-2">
            {(['about', 'shop', 'contact', 'tasting'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 sm:px-4 py-1.5 border-2 text-xs font-black uppercase tracking-wider italic transition-all cursor-pointer ${
                  tab === t
                    ? 'bg-white text-black border-white shadow-[3px_3px_0px_0px_#ea580c]'
                    : 'border-transparent text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {t === 'tasting' ? 'Tasting Notes' : t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 bg-[#0A0A0A] border-2 border-white/40 hover:border-orange-600 flex items-center justify-center text-white/80 hover:text-orange-500 shadow-[2px_2px_0px_0px_#ffffff] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6">
          {/* ABOUT TAB */}
          {tab === 'about' && (
            <div className="space-y-5 text-sm text-white/80 leading-relaxed font-medium">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">
                  HERITAGE & CRAFT
                </div>
                <h3 className="text-2xl sm:text-3xl font-black italic font-display uppercase text-white mb-2 tracking-tight">
                  Our Artisanal Craft & Philosophy
                </h3>
                <p className="border-l-2 border-orange-600 pl-3.5 text-white/90">
                  Freshify was founded on a simple dedication: reviving authentic small-batch gelato
                  and smoothie bowls using 100% natural, unpasteurized sun-ripened fruits and organic
                  pasture-raised dairy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 bg-neutral-950 border-2 border-white/15 shadow-[3px_3px_0px_0px_#ffffff]">
                  <Award className="w-6 h-6 text-orange-500 mb-2" />
                  <h4 className="font-display font-black italic text-base uppercase text-white mb-1">Cold Slow-Churned</h4>
                  <p className="text-xs text-white/60">
                    Spun at ultra-low overrun for unmatched silkiness and deep, genuine fruit density.
                  </p>
                </div>
                <div className="p-4 bg-neutral-950 border-2 border-white/15 shadow-[3px_3px_0px_0px_#ffffff]">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
                  <h4 className="font-display font-black italic text-base uppercase text-white mb-1">Zero Artificial Preservatives</h4>
                  <p className="text-xs text-white/60">
                    No artificial food coloring, corn syrups, or chemical emulsifiers. Nature in its purest form.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black border-2 border-orange-600 shadow-[4px_4px_0px_0px_#ea580c]">
                <h4 className="font-display font-black italic uppercase text-sm text-white mb-1">Original Project Credits</h4>
                <p className="text-xs text-white/80">
                  Original layout & GSAP slide design inspired by Nicolai Palmkvist&apos;s &quot;Freshify Smoothie Slider&quot;. Rebuilt and enhanced as an interactive React application with full customization controls, audio feedback, and order flow.
                </p>
              </div>
            </div>
          )}

          {/* SHOP TAB */}
          {tab === 'shop' && (
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-black italic font-display uppercase text-white tracking-tight">
                All 4 Signature Flavors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slides.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectFlavor(s.id);
                      onClose();
                    }}
                    className="p-4 bg-neutral-950 border-2 border-white/15 hover:border-orange-600 transition-all cursor-pointer group flex items-center gap-3 shadow-[3px_3px_0px_0px_#ffffff]"
                  >
                    <img
                      src={s.bowlImage}
                      alt={s.title}
                      className="w-16 h-16 object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono font-black text-orange-500">FLAVOR 0{s.id + 1}</div>
                      <h4 className="font-display font-black italic uppercase text-base text-white truncate">
                        {s.title}
                      </h4>
                      <div className="text-xs text-white/60 font-mono font-bold">${s.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {tab === 'contact' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black italic font-display uppercase text-white mb-1">
                  Visit Our Artisanal Parlor
                </h3>
                <p className="text-xs text-white/70">
                  Stop by for fresh tastings, seasonal scoop drops, or catering queries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-neutral-950 border-2 border-white/15 shadow-[2px_2px_0px_0px_#ffffff] flex flex-col gap-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="font-black uppercase tracking-wider text-white">Boutique</span>
                  <span className="text-white/60">42 Strandgade, Copenhagen</span>
                </div>
                <div className="p-3.5 bg-neutral-950 border-2 border-white/15 shadow-[2px_2px_0px_0px_#ffffff] flex flex-col gap-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="font-black uppercase tracking-wider text-white">Hours</span>
                  <span className="text-white/60">Daily: 11:00 AM – 10:00 PM</span>
                </div>
                <div className="p-3.5 bg-neutral-950 border-2 border-white/15 shadow-[2px_2px_0px_0px_#ffffff] flex flex-col gap-1">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span className="font-black uppercase tracking-wider text-white">Direct Line</span>
                  <span className="text-white/60">hello@freshify-icecream.com</span>
                </div>
              </div>

              {messageSent ? (
                <div className="p-6 bg-black border-2 border-emerald-500 text-center text-emerald-400 flex flex-col items-center gap-2 shadow-[4px_4px_0px_0px_#ffffff]">
                  <Check className="w-8 h-8" />
                  <span className="font-display font-black italic uppercase text-lg">THANK YOU FOR YOUR MESSAGE!</span>
                  <span className="text-xs opacity-80">Our master churner will reply shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="YOUR NAME"
                      className="bg-black border-2 border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-600 font-bold uppercase"
                    />
                    <input
                      type="email"
                      required
                      placeholder="EMAIL ADDRESS"
                      className="bg-black border-2 border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-600 font-bold uppercase"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="TELL US WHAT YOU'D LIKE TO ASK OR REQUEST FOR YOUR EVENT..."
                    className="w-full bg-black border-2 border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-600 font-bold uppercase"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#ea580c] hover:shadow-[1px_1px_0px_0px_#ea580c] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer italic"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND MESSAGE</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TASTING NOTES TAB */}
          {tab === 'tasting' && activeFlavor && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 border-b-2 border-white/20 pb-4">
                <img
                  src={activeFlavor.bowlImage}
                  alt={activeFlavor.title}
                  className="w-20 h-20 object-contain drop-shadow"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-orange-500 font-black bg-orange-600/10 px-2 py-0.5 border border-orange-600/40">
                    FLAVOR PROFILE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-black italic uppercase text-white mt-1 leading-none">
                    {activeFlavor.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">{activeFlavor.subtitle}</p>
                </div>
              </div>

              {/* Radar / Bars of taste parameters */}
              <div className="space-y-3 pt-2">
                {Object.entries(activeFlavor.tasteProfile).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider text-white/90">
                      <span>{key}</span>
                      <span className="font-mono text-orange-500">{val}%</span>
                    </div>
                    <div className="h-2.5 bg-black border border-white/20 overflow-hidden">
                      <div
                        className="h-full bg-orange-600 transition-all duration-700"
                        style={{
                          width: `${val}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Ingredients breakdown */}
              <div className="pt-3">
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-2.5 font-black">
                  HAND-SELECTED INGREDIENTS
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  {activeFlavor.ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-3 bg-neutral-950 border-2 border-white/15 text-center flex flex-col items-center gap-1.5 shadow-[2px_2px_0px_0px_#ffffff]"
                    >
                      <img src={ing.image} alt={ing.name} className="w-10 h-10 object-contain" />
                      <span className="text-[11px] font-black uppercase text-white/90 line-clamp-1">
                        {ing.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
