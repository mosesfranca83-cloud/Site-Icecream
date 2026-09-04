import React, { useState } from 'react';
import { X, Check, Plus, Minus, Sparkles, ShoppingBag } from 'lucide-react';
import { FlavorSlide, CartItem } from '../types';

interface OrderModalProps {
  flavor: FlavorSlide | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const SIZES = [
  { id: 'single' as const, name: 'Single Scoop', desc: '140g Classic', priceOffset: 0 },
  { id: 'double' as const, name: 'Double Scoop', desc: '260g Indulgence', priceOffset: 2.5 },
  { id: 'pint' as const, name: 'Artisanal Pint', desc: '475ml To Go', priceOffset: 6.0 },
  { id: 'tub' as const, name: 'Party Tub', desc: '950ml Shareable', priceOffset: 14.0 },
];

const TOPPING_OPTIONS = [
  { id: 'strawberries', name: 'Fresh Berries', price: 1.0 },
  { id: 'belgian-choc', name: 'Belgian Chocolate Curls', price: 1.2 },
  { id: 'pistachio', name: 'Toasted Crushed Pistachios', price: 1.5 },
  { id: 'honey', name: 'Wildflower Honey Drizzle', price: 0.8 },
  { id: 'mint', name: 'Fresh Organic Mint', price: 0.5 },
];

export const OrderModal: React.FC<OrderModalProps> = ({
  flavor,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !flavor) return null;

  const [selectedSize, setSelectedSize] = useState<'single' | 'double' | 'pint' | 'tub'>('single');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const currentSizeObj = SIZES.find((s) => s.id === selectedSize) || SIZES[0];
  const toppingsPrice = selectedToppings.reduce((acc, tId) => {
    const found = TOPPING_OPTIONS.find((t) => t.id === tId);
    return acc + (found ? found.price : 0);
  }, 0);

  const unitPrice = flavor.price + currentSizeObj.priceOffset + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  const handleAdd = () => {
    const newItem: CartItem = {
      id: `${flavor.id}-${selectedSize}-${Date.now()}`,
      flavorId: flavor.id,
      title: `${flavor.title} (${currentSizeObj.name})`,
      bowlImage: flavor.bowlImage,
      size: selectedSize,
      price: unitPrice,
      quantity,
      toppings: selectedToppings.map(
        (id) => TOPPING_OPTIONS.find((t) => t.id === id)?.name || id
      ),
    };

    onAddToCart(newItem);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="order-modal-card"
        className="relative w-full max-w-lg bg-[#0A0A0A] border-2 border-white/30 p-6 sm:p-8 text-white shadow-[12px_12px_0px_0px_#ea580c] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="order-modal-close"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 bg-[#0A0A0A] border-2 border-white/40 hover:border-orange-600 flex items-center justify-center text-white/80 hover:text-orange-500 shadow-[2px_2px_0px_0px_#ffffff] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with image preview */}
        <div className="flex items-center gap-4 mb-6 border-b-2 border-white/20 pb-5">
          <div className="relative w-20 h-20 bg-neutral-950 border-2 border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-[4px_4px_0px_0px_#ffffff]">
            <img
              src={flavor.bowlImage}
              alt={flavor.title}
              className="w-18 h-18 object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-orange-500 font-black bg-orange-600/10 px-2 py-0.5 border border-orange-600/40">
                ARTISANAL SCOOP
              </span>
              <span className="text-[10px] font-bold tracking-wider text-white/50">{flavor.calories}</span>
            </div>
            <h3 className="font-display font-black italic uppercase text-2xl sm:text-3xl tracking-tight leading-none">{flavor.title}</h3>
            <p className="text-xs font-medium text-white/70 mt-1 line-clamp-1">{flavor.subtitle}</p>
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-2.5">
            CHOOSE SERVING SPEC
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SIZES.map((size) => {
              const isSelected = selectedSize === size.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={`p-3.5 border-2 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-orange-600 bg-white text-black font-black shadow-[4px_4px_0px_0px_#ea580c]'
                      : 'border-white/20 bg-neutral-950 text-white/80 hover:border-white/50'
                  }`}
                >
                  <div className="text-xs font-black uppercase tracking-wider">{size.name}</div>
                  <div className={`text-[11px] ${isSelected ? 'text-neutral-700' : 'text-white/50'}`}>
                    {size.desc} {size.priceOffset > 0 && `(+${size.priceOffset.toFixed(2)})`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toppings Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">
              ARTISAN ADD-ONS
            </label>
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">OPTIONAL</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPPING_OPTIONS.map((topping) => {
              const isChecked = selectedToppings.includes(topping.id);
              return (
                <button
                  key={topping.id}
                  type="button"
                  onClick={() => toggleTopping(topping.id)}
                  className={`px-3 py-2 border-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-orange-600 text-white border-white shadow-[3px_3px_0px_0px_#ffffff]'
                      : 'bg-neutral-950 text-white/80 border-white/20 hover:border-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                  <span>{topping.name}</span>
                  <span className="opacity-80">+${topping.price.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity & Subtotal */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-white/20 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 bg-[#0A0A0A] border-2 border-white/30 hover:border-white flex items-center justify-center text-white cursor-pointer shadow-[2px_2px_0px_0px_#ffffff]"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-base font-black w-6 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 bg-[#0A0A0A] border-2 border-white/30 hover:border-white flex items-center justify-center text-white cursor-pointer shadow-[2px_2px_0px_0px_#ffffff]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/50">TOTAL AMOUNT</div>
            <div className="text-2xl sm:text-3xl font-black italic font-display text-white">
              ${totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          id="confirm-add-to-cart-btn"
          type="button"
          onClick={handleAdd}
          disabled={addedSuccess}
          className={`w-full py-4 font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer italic ${
            addedSuccess
              ? 'bg-emerald-600 text-white border-2 border-white shadow-[6px_6px_0px_0px_#ffffff]'
              : 'bg-white text-black hover:bg-neutral-100 shadow-[6px_6px_0px_0px_#ea580c] hover:shadow-[2px_2px_0px_0px_#ea580c] hover:translate-x-1 hover:translate-y-1'
          }`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>ADDED TO ORDER BAG!</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-orange-600 shrink-0"></div>
              <span>ADD TO BAG • ${totalPrice.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
