import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FLAVOR_SLIDES } from './data/slides';
import { FlavorSlide, CartItem } from './types';
import { Header } from './components/Header';
import { BowlStage } from './components/BowlStage';
import { SlideContent } from './components/SlideContent';
import { SlideControls } from './components/SlideControls';
import { SlideBackground } from './components/SlideBackground';
import { OrderModal } from './components/OrderModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { InfoModal } from './components/InfoModal';
import { playSlideTransitionSound, playAddToCartSound } from './utils/audio';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshify_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderFlavor, setSelectedOrderFlavor] = useState<FlavorSlide | null>(null);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState<'about' | 'shop' | 'contact' | 'tasting'>('about');

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('freshify_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors
    }
  }, [cartItems]);

  const currentSlide = FLAVOR_SLIDES[currentIndex];
  const totalSlides = FLAVOR_SLIDES.length;

  // Slide transition dispatcher
  const goTo = useCallback(
    (nextIdx: number, dir: number) => {
      if (
        isAnimating ||
        nextIdx === currentIndex ||
        nextIdx < 0 ||
        nextIdx >= totalSlides
      ) {
        return false;
      }

      if (audioEnabled) {
        playSlideTransitionSound();
      }

      setIsAnimating(true);
      setPrevIndex(currentIndex);
      setCurrentIndex(nextIdx);
      setDirection(dir);
      return true;
    },
    [currentIndex, isAnimating, totalSlides, audioEnabled]
  );

  const nextSlide = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      goTo(currentIndex + 1, 1);
    }
  }, [currentIndex, totalSlides, goTo]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1, -1);
    }
  }, [currentIndex, goTo]);

  const selectSlide = useCallback(
    (idx: number) => {
      if (idx !== currentIndex) {
        goTo(idx, idx > currentIndex ? 1 : -1);
      }
    },
    [currentIndex, goTo]
  );

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept keyboard if typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsSearchOpen(false);
        setIsOrderModalOpen(false);
        setIsInfoModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Wheel & Trackpad Navigation with debounce lock
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wheelAccumulatorRef = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Don't intercept if any modal is open
      if (isCartOpen || isSearchOpen || isOrderModalOpen || isInfoModalOpen) {
        return;
      }

      e.preventDefault();

      if (wheelLockRef.current || isAnimating) {
        return;
      }

      if (
        wheelAccumulatorRef.current !== 0 &&
        Math.sign(e.deltaY) !== Math.sign(wheelAccumulatorRef.current)
      ) {
        wheelAccumulatorRef.current = 0;
      }

      wheelAccumulatorRef.current += e.deltaY;

      if (Math.abs(wheelAccumulatorRef.current) < 35) {
        return;
      }

      wheelLockRef.current = true;
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        wheelLockRef.current = false;
        wheelAccumulatorRef.current = 0;
      }, 750);

      if (wheelAccumulatorRef.current > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [isAnimating, nextSlide, prevSlide, isCartOpen, isSearchOpen, isOrderModalOpen, isInfoModalOpen]);

  // Touch Swipe Navigation
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (isCartOpen || isSearchOpen || isOrderModalOpen || isInfoModalOpen) return;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || isCartOpen || isSearchOpen || isOrderModalOpen || isInfoModalOpen) {
        return;
      }

      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) nextSlide();
        else prevSlide();
      } else if (Math.abs(dy) > 50) {
        if (dy < 0) nextSlide();
        else prevSlide();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [nextSlide, prevSlide, isCartOpen, isSearchOpen, isOrderModalOpen, isInfoModalOpen]);

  // Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    if (audioEnabled) playAddToCartSound();
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.flavorId === item.flavorId && i.size === item.size && i.toppings.join() === item.toppings.join()
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [item, ...prev];
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Open customization modal
  const handleOpenOrder = (flavor: FlavorSlide) => {
    setSelectedOrderFlavor(flavor);
    setIsOrderModalOpen(true);
  };

  // Open info modal with section
  const handleOpenInfo = (section: 'about' | 'shop' | 'contact' | 'tasting') => {
    setInfoModalTab(section);
    setIsInfoModalOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      id="freshify-app-root"
      className="ffy-root relative w-screen h-screen overflow-hidden select-none bg-neutral-950 font-sans"
    >
      {/* Dynamic Animated Gradient Background */}
      <SlideBackground
        slides={FLAVOR_SLIDES}
        currentIndex={currentIndex}
        prevIndex={prevIndex}
      />

      {/* Main Framework Frame */}
      <div id="ffy-main-frame" className="ffy-frame relative w-full h-full">
        {/* Navigation Header */}
        <Header
          currentSlideIndex={currentIndex}
          totalSlides={totalSlides}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenInfo={handleOpenInfo}
          audioEnabled={audioEnabled}
          onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        />

        {/* 3D Visual Centerpiece: Giant Word + Bowls + Floating Ingredients */}
        <BowlStage
          slides={FLAVOR_SLIDES}
          currentIndex={currentIndex}
          prevIndex={prevIndex}
          direction={direction}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
          onBowlClick={handleOpenOrder}
        />

        {/* Dynamic Flavor Information & CTA */}
        <SlideContent
          currentSlide={currentSlide}
          direction={direction}
          onOrderClick={handleOpenOrder}
          onTasteInfoClick={() => handleOpenInfo('tasting')}
        />

        {/* Carousel Arrows, Indicator, and Thumbnails */}
        <SlideControls
          slides={FLAVOR_SLIDES}
          currentIndex={currentIndex}
          totalSlides={totalSlides}
          onPrev={prevSlide}
          onNext={nextSlide}
          onSelectSlide={selectSlide}
          isAnimating={isAnimating}
        />
      </div>

      {/* Interactive Customize & Order Modal */}
      <OrderModal
        flavor={selectedOrderFlavor || currentSlide}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        slides={FLAVOR_SLIDES}
        onSelectFlavor={selectSlide}
      />

      {/* Information & Tasting Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        initialTab={infoModalTab}
        activeFlavor={currentSlide}
        slides={FLAVOR_SLIDES}
        onSelectFlavor={selectSlide}
      />
    </div>
  );
}
