import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { FlavorSlide } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: FlavorSlide[];
  onSelectFlavor: (index: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  slides,
  onSelectFlavor,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return slides;
    return slides.filter((slide) => {
      const matchTitle = slide.title.toLowerCase().includes(q);
      const matchWord = slide.bigWord.toLowerCase().includes(q);
      const matchDesc = slide.description.toLowerCase().includes(q);
      const matchTags = slide.tags.some((t) => t.toLowerCase().includes(q));
      const matchIngredients = slide.ingredients.some((i) => i.name.toLowerCase().includes(q));
      return matchTitle || matchWord || matchDesc || matchTags || matchIngredients;
    });
  }, [query, slides]);

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="search-modal-card"
        className="relative w-full max-w-xl bg-[#0A0A0A] border-2 border-white/30 p-6 text-white shadow-[12px_12px_0px_0px_#ea580c] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center gap-3 pb-4 border-b-2 border-white/20">
          <Search className="w-5 h-5 text-orange-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH FLAVORS: BERRIES, CHOCOLATE, KIWI..."
            autoFocus
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-white placeholder-white/40 focus:outline-none uppercase font-black tracking-wider"
          />
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 bg-[#0A0A0A] border-2 border-white/40 hover:border-orange-600 flex items-center justify-center text-white/70 hover:text-white shadow-[2px_2px_0px_0px_#ffffff] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto py-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-white/50 text-xs font-mono uppercase tracking-wider">
              No artisanal flavors found matching &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((slide) => (
              <div
                key={slide.id}
                onClick={() => {
                  onSelectFlavor(slide.id);
                  onClose();
                }}
                className="group p-3.5 bg-neutral-950 border-2 border-white/10 hover:border-orange-600 flex items-center justify-between transition-all cursor-pointer shadow-[3px_3px_0px_0px_#ffffff]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 bg-black border border-white/20 flex items-center justify-center p-1 shrink-0">
                    <img
                      src={slide.bowlImage}
                      alt={slide.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black uppercase italic text-base text-white">
                        {slide.title}
                      </span>
                      <span className="text-[9px] uppercase font-black px-2 py-0.5 bg-orange-600/20 text-orange-500 border border-orange-600/40">
                        {slide.bigWord}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 line-clamp-1 mt-0.5 max-w-sm font-medium">
                      {slide.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-display font-black italic text-base text-orange-500">
                    ${slide.price.toFixed(2)}
                  </span>
                  <div className="w-8 h-8 bg-black border border-white/30 group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white flex items-center justify-center text-white transition-all shadow-[2px_2px_0px_0px_#ea580c]">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Tag suggestions */}
        <div className="pt-3 border-t-2 border-white/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-white/50">
          <span className="text-orange-500">POPULAR:</span>
          {['Strawberries', 'Blueberries', 'Banana', 'Kiwi'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="text-white/70 hover:text-white hover:underline cursor-pointer italic"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
