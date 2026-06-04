import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, ShoppingBag, Flame, TrendingUp } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';

interface FeaturedDealsProps {
  onAddToCart: (item: MenuItem, modifier?: any) => void;
  onSelectProduct: (item: MenuItem) => void;
}

export default function FeaturedDeals({ onAddToCart, onSelectProduct }: FeaturedDealsProps) {
  // Select some hot deals
  const deals = MENU_ITEMS.filter(item => item.popular || item.limitedTime).slice(0, 4);

  // Urgent Countdown timers
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 48,
    seconds: 35,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 59, seconds: 59 }; // Reset
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-neutral-50 py-16" id="featured-deals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header container with countdown timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="text-left space-y-2">
            <h2 className="font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
              🔥 Streetwise hot deals &amp; promos
            </h2>
            <p className="text-neutral-500 font-medium">
              Finger lickin' good discounts. Grab them before they expire!
            </p>
          </div>

          {/* Golden countdown urgency widget */}
          <div className="bg-red-50 border border-red-100 p-3 sm:px-5 sm:py-3.5 rounded-2xl flex items-center space-x-3.5 self-start shadow-sm">
            <div className="bg-red-600 text-white p-2 rounded-xl">
              <Timer className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-none">Deal of the day ends in</p>
              <div className="flex items-center space-x-1.5 mt-1 font-mono text-neutral-900 text-base font-extrabold">
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-100 shadow-xs">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-red-600">:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-100 shadow-xs">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-red-600">:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-100 shadow-xs text-red-600">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid layout of deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map(item => (
            <div 
              key={item.id}
              id={`deal-card-${item.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-150 hover:shadow-xl transition-all duration-300 flex flex-col group relative"
            >
              {/* Product Badge triggers */}
              <div className="absolute top-4 left-4 z-15 flex flex-col space-y-1">
                {item.limitedTime && (
                  <span className="bg-amber-500 text-neutral-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 fill-neutral-900" />
                    <span>LTD OFFER</span>
                  </span>
                )}
                {item.popular && (
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>TRENDING</span>
                  </span>
                )}
              </div>

              {/* Product Image Click Trigger */}
              <div 
                onClick={() => onSelectProduct(item)}
                className="relative overflow-hidden aspect-video bg-neutral-100 cursor-pointer h-48"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-between items-end">
                  <span className="text-yellow-400 font-mono text-[10px] font-bold bg-black/40 px-2 py-1 rounded">
                    ⭐ {item.rating.toFixed(1)}
                  </span>
                  <span className="text-white font-mono text-xs font-semibold bg-red-600/90 px-2 py-1 rounded flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span>{item.ordersCount}+ sold</span>
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-2">
                  <h3 
                    onClick={() => onSelectProduct(item)}
                    className="font-bold text-lg text-neutral-900 cursor-pointer hover:text-red-600 transition-colors"
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 min-h-8">
                    {item.description}
                  </p>
                </div>

                {/* Pricing & Add to cart button actions */}
                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-neutral-400 font-bold block leading-none">Price</span>
                    <span className="font-extrabold text-xl font-mono text-neutral-900 inline-block mt-1">
                      GH₵ {item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(item)}
                    id={`quick-add-${item.id}`}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs uppercase py-2.5 px-4 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-white" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
