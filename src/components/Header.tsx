import React from 'react';
import { ShoppingBag, Search, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { LOGO_URL } from '../data/slides';

interface HeaderProps {
  currentSlideIndex: number;
  totalSlides: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenInfo: (section: 'about' | 'shop' | 'contact') => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenInfo,
  audioEnabled,
  onToggleAudio,
}) => {
  return (
    <header
      id="main-header"
      className="absolute top-0 left-0 right-0 z-40 px-4 sm:px-8 py-5 flex items-center justify-between pointer-events-auto"
    >
      {/* Brand Logo & Edition Label */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          id="logo-brand-link"
          className="group flex items-center gap-3 transition-transform duration-200"
        >
          <div className="border-b-4 border-orange-600 pb-1 flex items-center gap-2">
            <img
              src={LOGO_URL}
              alt="Freshify Milk & Ice Cream Restaurant Logo"
              className="h-8 sm:h-10 w-auto object-contain filter brightness-0 invert drop-shadow"
            />
            <span className="font-display font-black tracking-tighter italic text-xl sm:text-2xl text-white">
              TYPE<span className="text-orange-500">.</span>ICE
            </span>
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-[9px] font-black tracking-[0.4em] uppercase text-white/40">
              Annual Edition
            </div>
            <div className="text-[9px] font-black tracking-[0.3em] uppercase text-orange-500">
              Craft Gelato / 2026
            </div>
          </div>
        </a>
      </div>

      {/* Center Nav: Bold Brutalist Container */}
      <nav
        id="nav-pill-container"
        className="hidden md:flex items-center gap-1 bg-[#0A0A0A]/90 border-2 border-white/20 px-2 py-1.5 shadow-[4px_4px_0px_0px_#ea580c]"
      >
        <button
          id="nav-home-btn"
          type="button"
          className="px-4 py-1.5 text-xs font-black tracking-widest uppercase transition-all duration-200 bg-white text-black shadow-sm cursor-pointer italic"
        >
          Home
        </button>
        <button
          id="nav-about-btn"
          type="button"
          onClick={() => onOpenInfo('about')}
          className="px-4 py-1.5 text-xs font-black tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer italic"
        >
          About
        </button>
        <button
          id="nav-shop-btn"
          type="button"
          onClick={() => onOpenInfo('shop')}
          className="px-4 py-1.5 text-xs font-black tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer italic"
        >
          Shop
        </button>
        <button
          id="nav-contact-btn"
          type="button"
          onClick={() => onOpenInfo('contact')}
          className="px-4 py-1.5 text-xs font-black tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer italic"
        >
          Contact
        </button>
      </nav>

      {/* Right Icons: Audio, Search & Bag */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Audio Toggle */}
        <button
          id="audio-toggle-btn"
          type="button"
          onClick={onToggleAudio}
          title={audioEnabled ? 'Mute sound effects' : 'Enable ambient sound effects'}
          className="w-10 h-10 bg-[#0A0A0A]/90 hover:bg-neutral-900 border-2 border-white/20 hover:border-orange-600 flex items-center justify-center text-white/90 hover:text-orange-500 transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_#ffffff]"
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-orange-500" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/50" />
          )}
        </button>

        {/* Search button */}
        <button
          id="header-search-btn"
          type="button"
          onClick={onOpenSearch}
          title="Search flavors"
          className="w-10 h-10 bg-[#0A0A0A]/90 hover:bg-neutral-900 border-2 border-white/20 hover:border-orange-600 flex items-center justify-center text-white/90 hover:text-orange-500 transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_#ffffff]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Cart button */}
        <button
          id="header-cart-btn"
          type="button"
          onClick={onOpenCart}
          title="Shopping Cart"
          className="relative h-10 px-4 bg-[#0A0A0A]/90 hover:bg-neutral-900 border-2 border-white/20 hover:border-orange-600 flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_#ea580c]"
        >
          <ShoppingBag className="w-4 h-4 text-orange-500" />
          <span className="hidden sm:inline italic">Order Bag</span>
          {cartCount > 0 ? (
            <span className="px-1.5 py-0.5 bg-orange-600 text-white font-black text-[10px] tracking-tighter">
              {cartCount}
            </span>
          ) : (
            <span className="text-[10px] text-white/40 font-mono">0</span>
          )}
        </button>
      </div>
    </header>
  );
};
