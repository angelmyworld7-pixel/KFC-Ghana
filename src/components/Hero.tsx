import React, { useState } from 'react';
import { ShoppingBag, MapPin, Smartphone, Star, ShieldCheck, Flame, ChevronRight } from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onFindStore: () => void;
}

export default function Hero({ onOrderNow, onFindStore }: HeroProps) {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [locationInput, setLocationInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) {
      setErrorMessage('Please type a Ghanaian city or street area (e.g., East Legon, Kumasi)!');
      return;
    }
    setErrorMessage('');
    onOrderNow(); // Proceed directly to menu selection
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-20 lg:py-24" id="home-hero">
      {/* Decorative Brand Accents */}
      <div className="absolute right-0 top-0 -z-10 h-full w-1/3 bg-red-600 opacity-5 md:block hidden skew-x-12"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text and Action Column */}
          <div className="space-y-6 md:space-y-8 text-left">
            
            {/* Hot Badge */}
            <div className="inline-flex items-center space-x-2 bg-red-100 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 animate-bounce text-red-600" />
              <span>THE REVOLUTION OF CRUNCH IN GHANA 🇬🇭</span>
            </div>

            {/* Title Display */}
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-tight">
              Get It Hot &amp; Fresh.<br />
              <span className="text-red-600 inline-block relative">
                Spicy Jollof
                <span className="absolute bottom-1.5 left-0 w-full h-2 bg-amber-400 -z-10 rounded"></span>
              </span> Meets Golden Fried Chicken!
            </h1>

            <p className="text-neutral-600 text-base sm:text-lg max-w-lg leading-relaxed">
              Experience the perfect crunch of KFC’s global recipe seasoned locally for Accra, Kumasi, Tema, and more. 100% fresh chicken, locally sourced spices!
            </p>

            {/* Quick-Ordering Action Container */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xl max-w-lg relative z-10">
              {/* Delivery / Pickup Toggles */}
              <div className="flex bg-neutral-100 p-1.5 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs sm:text-sm font-extrabold uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>🚀 Hot Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs sm:text-sm font-extrabold uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>🛍️ Express Pickup</span>
                </button>
              </div>

              {/* Order Location Selector */}
              <form onSubmit={handleQuickSearch} className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder={
                      orderType === 'delivery'
                        ? "Enter your delivery neighborhood (e.g. East Legon, Accra)"
                        : "Find your nearest KFC store (e.g. Accra Mall, Osu, Kumasi)"
                    }
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 hover:bg-neutral-100/50 border border-neutral-200 focus:border-red-500 focus:bg-white focus:outline-hidden rounded-xl text-sm transition-all text-neutral-800"
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-600 font-bold font-sans">{errorMessage}</p>
                )}

                {/* primary action triggers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 hover:shadow-lg active:scale-98 text-white text-sm font-extrabold uppercase py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>Order Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={onFindStore}
                    className="w-full bg-neutral-900 hover:bg-black hover:text-white text-neutral-300 text-sm font-extrabold uppercase py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Find Closest Store</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile App Download badges */}
            <div className="pt-2">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                <Smartphone className="w-3.5 h-3.5 text-red-500" />
                <span>Download KFC App &amp; Save Double!</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="#" 
                  className="flex items-center space-x-2 bg-neutral-900 text-white rounded-lg px-4 py-2 hover:bg-neutral-850 hover:-translate-y-0.5 transition-all text-xs"
                >
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-wide opacity-70">Get it on</p>
                    <p className="font-extrabold text-sm font-sans tracking-tight">Google Play</p>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-2 bg-neutral-900 text-white rounded-lg px-4 py-2 hover:bg-neutral-850 hover:-translate-y-0.5 transition-all text-xs"
                >
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-wide opacity-70">Download on the</p>
                    <p className="font-extrabold text-sm font-sans tracking-tight">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-dashed border-neutral-100 text-neutral-500 text-xs">
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-neutral-700">4.8 Rating</span>
                <span>(50k+ reviews)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-neutral-700">MTN Mobile Money verified secure checkout</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Splendor */}
          <div className="relative group flex items-center justify-center">
            {/* Visual glow background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 md:h-96 md:w-96 bg-red-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-all duration-350"></div>
            
            <div className="relative">
              {/* Main premium meal basket photo */}
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80"
                alt="KFC Ghana Golden Bucket Feast"
                className="rounded-3xl shadow-2xl min-w-82 max-w-full object-cover border-4 border-white transform rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-500"
              />
              
              {/* Float Card 1: Local Favorite */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-orange-100 max-w-xs transform hover:scale-105 transition-all animate-bounce-slow">
                <div className="bg-orange-500 text-white text-xl p-2.5 rounded-xl font-bold font-sans">🇬🇭</div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-none">LOCAL FAVORITE</p>
                  <h4 className="font-extrabold text-sm text-neutral-800 leading-normal mt-1">Spicy Ghana Jollof Rice</h4>
                  <p className="text-xs text-neutral-500">Perfectly spiced premium rice + shito</p>
                </div>
              </div>

              {/* Float Card 2: Limited Offer Discount info */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-neutral-900 font-extrabold p-5 rounded-full shadow-lg border-2 border-white flex flex-col items-center justify-center w-24 h-24 transform hover:scale-110 transition-transform">
                <span className="text-[10px] font-black uppercase tracking-wider block">Save</span>
                <span className="text-2xl font-black block leading-none font-mono">25%</span>
                <span className="text-[9px] uppercase opacity-80 block mt-1">On App Today</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
