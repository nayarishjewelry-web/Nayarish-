import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, PageView } from '../types';
import { formatINR } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  setCurrentPage: (page: PageView) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  setCurrentPage,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    setCurrentPage('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#0F172A] border-l border-purple-900/50 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-medium text-slate-100">Your High Jewelry Bag</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {cart.length === 0 ? 'Empty collection bag' : `${cart.reduce((a, b) => a + b.quantity, 0)} handcrafted creation(s)`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-full hover:bg-slate-800"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-slate-300 mb-1">Your bag is currently empty</p>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our Haute Joaillerie creations and discover timeless museum-grade heirlooms.
              </p>
              <button
                onClick={() => {
                  onClose();
                  setCurrentPage('shop');
                }}
                className="px-6 py-2.5 rounded-lg bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider hover:bg-[#2E1065] transition-colors"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedMetal}-${item.selectedSize}`}
                className="flex gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-lg bg-slate-950 shrink-0 border border-purple-900/30"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-medium text-slate-200 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.selectedMetal} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                    </p>
                    <p className="text-xs font-semibold tabular-nums text-[#D4AF37] mt-1">
                      {formatINR(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center border border-slate-700 rounded-md">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="p-1 hover:text-[#D4AF37] text-slate-400 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-medium text-slate-200 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="p-1 hover:text-[#D4AF37] text-slate-400 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onUpdateQuantity(index, 0)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove piece"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-800/80 bg-slate-950/80 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="tabular-nums text-slate-200">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Insured Armored Courier</span>
                <span className="text-emerald-400 uppercase tracking-wider text-[11px] font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Velvet Presentation Vault</span>
                <span className="text-[#D4AF37] uppercase tracking-wider text-[11px] font-medium">Included</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-100 pt-2 border-t border-slate-800">
                <span>Estimated Total</span>
                <span className="tabular-nums text-base text-[#D4AF37] font-bold">
                  {formatINR(subtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-[0.15em] hover:brightness-110 transition-all gold-glow cursor-pointer"
            >
              <span>Proceed to Luxury Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Tax calculated at checkout · 30-day private viewing guarantee
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
