import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const tax = (subtotal - discountAmount) * 0.08;
  const grandTotal = Math.max(0, subtotal - discountAmount + tax);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FRESH20' || promoCode.trim().toUpperCase() === 'BERRY') {
      setDiscountPercent(20);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "FRESH20" for 20% off.');
    }
  };

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutComplete(false);
      onClose();
    }, 2400);
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="relative w-full max-w-md h-full bg-[#0A0A0A] border-l-2 border-white/30 p-6 sm:p-7 flex flex-col text-white shadow-[-12px_0px_0px_0px_#ea580c] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b-2 border-white/20">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-black italic font-display uppercase tracking-tight">Order Bag</h2>
            <span className="text-xs bg-orange-600 text-white px-2 py-0.5 font-black shadow-[2px_2px_0px_0px_#ffffff]">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            id="close-cart-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 bg-[#0A0A0A] border-2 border-white/40 hover:border-orange-600 flex items-center justify-center text-white/80 hover:text-orange-500 shadow-[2px_2px_0px_0px_#ffffff] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkoutComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-600 text-white border-2 border-white flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#ffffff]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-black italic uppercase text-3xl mb-2">ORDER CONFIRMED</h3>
            <p className="text-white/80 text-xs sm:text-sm font-bold max-w-xs mb-4">
              Your freshly churned scoops are being hand-crafted with organic ingredients.
            </p>
            <div className="text-xs font-mono font-black bg-black border-2 border-orange-600 px-4 py-2 text-orange-500 shadow-[3px_3px_0px_0px_#ea580c]">
              ORDER #FS-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white/60">
            <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5] text-white/30" />
            <p className="text-lg font-black italic uppercase font-display text-white mb-1">BAG IS EMPTY</p>
            <p className="text-xs font-medium max-w-xs text-white/60 mb-6">
              Explore the 4 signature artisanal flavors and customize your scoop!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#ea580c] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer italic"
            >
              EXPLORE FLAVORS
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-neutral-950 border-2 border-white/20 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_#ffffff]"
                >
                  <img
                    src={item.bowlImage}
                    alt={item.title}
                    className="w-14 h-14 object-contain shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black uppercase italic tracking-wider truncate text-white">{item.title}</h4>
                    {item.toppings.length > 0 && (
                      <p className="text-[10px] text-white/50 truncate font-mono">
                        + {item.toppings.join(', ')}
                      </p>
                    )}
                    <div className="text-xs font-mono text-orange-500 font-bold mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-black border border-white/30 hover:border-white flex items-center justify-center text-xs text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-black w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-black border border-white/30 hover:border-white flex items-center justify-center text-xs text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-1 text-white/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={applyPromo} className="py-3 border-t-2 border-white/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PROMO CODE (FRESH20)"
                  className="flex-1 bg-black border-2 border-white/20 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-600 uppercase font-mono font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ea580c] cursor-pointer hover:bg-neutral-100"
                >
                  APPLY
                </button>
              </div>
              {discountPercent > 0 && (
                <div className="text-[11px] font-bold text-emerald-400 mt-1">
                  20% DISCOUNT APPLIED
                </div>
              )}
              {promoError && (
                <div className="text-[11px] font-bold text-rose-400 mt-1">{promoError}</div>
              )}
            </form>

            {/* Bill Summary */}
            <div className="pt-3 border-t-2 border-white/20 space-y-1.5 text-xs text-white/70 font-medium">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>DISCOUNT ({discountPercent}%)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ESTIMATED LOCAL TAX (8%)</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t-2 border-white/20">
                <span className="font-display italic uppercase">TOTAL</span>
                <span className="font-display font-black text-xl italic text-orange-500">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-checkout-btn"
              type="button"
              onClick={handleCheckout}
              className="mt-4 w-full py-4 bg-white text-black font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[6px_6px_0px_0px_#ea580c] hover:shadow-[2px_2px_0px_0px_#ea580c] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer italic"
            >
              <div className="w-3 h-3 bg-orange-600 shrink-0"></div>
              <span>PLACE ARTISAN ORDER</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
