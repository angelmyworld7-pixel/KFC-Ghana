import React, { useState, useMemo } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, Ticket, Sparkles, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, MenuItem } from '../types';
import { UPSELL_ITEMS } from '../data';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: React.TransitionStartFunction[] | any[]; // Represent properly cart
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onApplyPromo: (code: string) => void;
  promoCode: string;
  promoDiscount: number;
  onCheckout: () => void;
  onAddToCart: (item: MenuItem, modifier?: any) => void;
}

export default function OrderDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onApplyPromo,
  promoCode,
  promoDiscount,
  onCheckout,
  onAddToCart
}: OrderDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const cartItems = cart as CartItem[];

  // Calculates totals properly
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const addonsTotal = item.addonItems.reduce((sum, a) => sum + a.price, 0);
      const sizeMultiplier = item.size === 'large' ? 1.25 : item.size === 'medium' ? 1.12 : 1.0;
      return acc + (item.product.price * sizeMultiplier + addonsTotal) * item.quantity;
    }, 0);

    const deliveryFee = subtotal > 150 ? 0 : subtotal === 0 ? 0 : 15.00; // Free delivery over 150 Cedis
    const discount = promoDiscount > 0 ? (subtotal * promoDiscount) : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

    return { subtotal, deliveryFee, discount, finalTotal };
  }, [cartItems, promoDiscount]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) {
      setPromoError('Please type a valid promo code first, chale!');
      return;
    }
    
    const formatted = promoInput.toUpperCase().trim();
    if (formatted === 'CHALEFREE') {
      onApplyPromo(formatted);
      setPromoSuccess('Promo Approved! Free Ghanaian Yam Fries & Red Soda added to your bucket.');
      setPromoError('');
    } else if (formatted === 'MOMO50') {
      onApplyPromo(formatted);
      setPromoSuccess('Promo Approved! 15% discount has been applied to your final subtotal.');
      setPromoError('');
    } else {
      setPromoError('Incorrect promo code! Try "CHALEFREE" or "MOMO50"');
      setPromoSuccess('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-neutral-800 text-left">
      {/* Black scrim overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="cart-drawer-container">
        <div className="w-screen max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in">
          
          {/* Drawer Sticky Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-red-650" />
              <h3 className="font-extrabold text-neutral-900 text-lg">Your Crispy Bucket Bag</h3>
              <div className="bg-red-50 text-red-600 text-xs font-black py-0.5 px-2 rounded-full font-mono">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Main Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* If Cart empty state */}
            {cartItems.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 p-6 space-y-5">
                <span className="text-4xl">🍗</span>
                <div>
                  <h4 className="font-extrabold text-neutral-800 text-base">Your bucket is empty!</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">Chale, add some original recipe chicken pieces or spicy Ghana Jollof combo boxes to get started.</p>
                </div>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase py-2.5 px-5 rounded-xl cursor-pointer shadow-xs"
                >
                  Start Ordering Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 leading-none">Selected Feasts</p>
                
                <div className="space-y-3.5" id="cart-items-list">
                  {cartItems.map((item) => {
                    const priceMultiplier = item.size === 'large' ? 1.25 : item.size === 'medium' ? 1.12 : 1.0;
                    const baseItemCost = item.product.price * priceMultiplier;
                    const addonsTotal = item.addonItems.reduce((sum, a) => sum + a.price, 0);
                    const itemTotal = (baseItemCost + addonsTotal) * item.quantity;

                    return (
                      <div 
                        key={item.id}
                        className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 flex items-start gap-4 hover:border-neutral-300 transition-colors"
                      >
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-14 h-14 rounded-lg object-cover border border-neutral-200 focus:outline-hidden"
                        />
                        
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">{item.product.name}</h4>
                          
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="bg-red-50 text-red-600 text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded">
                              {item.size}
                            </span>
                            {item.addonItems.map(addon => (
                              <span key={addon.id} className="bg-neutral-100 text-neutral-600 text-[9px] font-mono leading-none px-1.5 py-0.5 rounded">
                                +{addon.name}
                              </span>
                            ))}
                          </div>

                          {/* Dynamic price per unit */}
                          <p className="text-xs text-neutral-500 font-mono">
                            Unit: GH₵ {(baseItemCost + addonsTotal).toFixed(2)}
                          </p>

                          {/* Quantity adjustments */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                                className="bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-250 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer font-bold text-xs"
                              >
                                {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-neutral-400" /> : <Minus className="w-3.5 h-3.5" />}
                              </button>
                              
                              <span className="font-mono text-xs font-black text-neutral-900 w-5 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                className="bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-250 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer font-bold text-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="font-extrabold font-mono text-sm text-neutral-900">
                              GH₵ {itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Smart add-ons carousels - Recommended to upsell if item added */}
            {cartItems.length > 0 && (
              <div className="border-t border-dashed border-neutral-154 pt-6 text-left">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-400 leading-none">Complete your order combo</span>
                <p className="text-[10px] text-red-600 font-bold block mb-3.5">Add premium accessories at super low rates:</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {UPSELL_ITEMS.map((addon) => (
                    <div 
                      key={addon.id}
                      className="p-2 bg-white rounded-xl border border-neutral-200 shadow-3xs flex items-center justify-between text-left group"
                    >
                      <div className="truncate">
                        <span className="text-sm">{addon.icon}</span>
                        <h5 className="font-serif font-bold text-[10px] uppercase text-neutral-800 truncate mt-0.5">{addon.name}</h5>
                        <p className="text-[9px] font-mono font-bold text-neutral-500 mt-0.5">GH₵ {addon.price.toFixed(2)}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          const mockMenuProduct: MenuItem = {
                            id: addon.id,
                            name: addon.name,
                            description: addon.desc,
                            price: addon.price,
                            category: 'sides',
                            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                            rating: 4.8,
                            ordersCount: 500,
                            popular: true,
                            limitedTime: false,
                            calories: 200,
                            ingredients: [],
                            nutritionalInfo: { protein: '0g', carbs: '0g', fat: '0g' }
                          };
                          onAddToCart(mockMenuProduct);
                        }}
                        className="p-1 rounded bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-colors cursor-pointer"
                        title="Add to basket"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promo coupon form entry and savings alerts */}
            {cartItems.length > 0 && (
              <div className="border-t border-dashed border-neutral-154 pt-5">
                <form onSubmit={handleApplyPromo} className="flex gap-2.5">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="TRY 'CHALEFREE' or 'MOMO50'"
                      className="w-full bg-neutral-50 border border-neutral-250 text-xs py-2.5 pl-9 pr-3 uppercase focus:outline-hidden focus:border-red-500 focus:bg-white rounded-xl font-mono text-neutral-800 font-extrabold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-950 text-white font-extrabold text-xs py-2 px-4 uppercase rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {promoError && (
                  <p className="text-[10px] text-red-600 font-bold font-sans mt-2">⚠️ {promoError}</p>
                )}
                {promoSuccess && (
                  <div className="bg-green-50 text-green-700 p-2.5 rounded-xl border border-green-150 text-xs font-bold font-sans mt-2.5 leading-relaxed">
                    🎉 {promoSuccess}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Drawer Sticky Footer calculations and checkouts */}
          {cartItems.length > 0 && (
            <div className="bg-neutral-50 px-6 py-5 border-t border-gray-150 space-y-4">
              <div className="space-y-2 text-xs font-medium text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-neutral-900 font-bold">GH₵ {totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount applied:</span>
                    <span className="font-mono">- GH₵ {totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Hot Packaging &amp; Delivery Fee:</span>
                  <span className="font-mono text-neutral-950">
                    {totals.deliveryFee === 0 ? (
                      <strong className="text-green-600 uppercase font-sans font-extrabold text-[10px] bg-green-50 border border-green-100 px-1 py-0.5 rounded">FREE OVER GH₵150</strong>
                    ) : (
                      `GH₵ ${totals.deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-t border-neutral-200/60 pt-2 flex justify-between text-sm text-neutral-900 font-black">
                  <span className="text-neutral-500 font-sans font-bold">Grand Basket total:</span>
                  <span className="font-mono text-xl text-neutral-900">GH₵ {totals.finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure Trust Indicators */}
              <div className="bg-white/60 p-2.5 rounded-xl border border-neutral-100 flex items-center space-x-2 text-[10px] text-neutral-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>100% Encrypted checkouts. Secure MTN, Telecel Money.</span>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={onCheckout}
                id="cart-drawer-checkout-btn"
                className="w-full bg-red-600 hover:bg-red-700 active:scale-97 text-white font-black uppercase text-sm py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Proceed to secured checkout</span>
                <ArrowRight className="w-4 h-4 text-white animate-pulse" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
