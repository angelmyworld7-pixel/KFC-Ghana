import React from 'react';
import { ShoppingBag, MapPin, Award, PhoneCall, Sparkles, MessageSquare } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loyaltyPoints: number;
  onOpenLoyalty: () => void;
  onOpenAIChat: () => void;
}

export default function Header({
  cart,
  onOpenCart,
  activeTab,
  setActiveTab,
  loyaltyPoints,
  onOpenLoyalty,
  onOpenAIChat,
}: HeaderProps) {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const itemAddonsTotal = item.addonItems.reduce((sum, a) => sum + a.price, 0);
    const sizeMultiplier = item.size === 'large' ? 1.25 : item.size === 'medium' ? 1.12 : 1.0;
    return acc + (item.product.price * sizeMultiplier + itemAddonsTotal) * item.quantity;
  }, 0);

  const tabs = [
    { id: 'menu', label: 'Order Menu', icon: ShoppingBag },
    { id: 'loyalty', label: 'Colonel Club Rewards', icon: Award },
    { id: 'locator', label: 'Store Finder', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-md">
      {/* Top micro-bar: Promotion banner */}
      <div className="bg-neutral-900 text-white text-xs py-1.5 px-4 font-sans tracking-wide flex justify-between items-center overflow-hidden">
        <div className="flex items-center space-x-2 animate-pulse">
          <span className="bg-red-600 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white">PROMO</span>
          <span className="font-medium">Get FREE Yam Fries + Cola when you buy any Streetwise Jollof Giant Feaster! 🇬🇭 Code: <strong className="text-yellow-400 font-mono text-xs">CHALEFREE</strong></span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={onOpenAIChat} 
            className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 transition-colors font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Captain Colonel AI</span>
          </button>
          <span className="text-neutral-500">|</span>
          <a href="tel:+233302824155" className="flex items-center space-x-1 hover:text-red-500 transition-colors">
            <PhoneCall className="w-3 h-3 text-red-500" />
            <span>Direct Order: +233 Hotline</span>
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('menu')} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="nav-logo"
        >
          {/* Authentic KFC Stripes */}
          <div className="flex flex-col space-y-0.5 justify-center w-8 h-8 md:w-10 md:h-10 bg-red-600 p-1 rounded-sm shadow-sm">
            <div className="flex w-full justify-between h-full bg-red-600">
              <div className="w-2.5 bg-white h-full"></div>
              <div className="w-2.5 bg-white h-full"></div>
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl md:text-2xl text-neutral-900 tracking-tighter block leading-none">
              KFC<span className="text-red-600"> GHANA</span>
            </span>
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest leading-none block mt-0.5">
              So Good • Finger Lickin' Good
            </span>
          </div>
        </div>

        {/* Center navigation tabs */}
        <nav className="hidden md:flex space-x-1 lg:space-x-2" id="desktop-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 lg:px-4 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm'
                    : 'text-neutral-700 hover:text-red-600 hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600 animate-wiggle' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side status indicators & Actions */}
        <div className="flex items-center space-x-3" id="nav-actions">
          {/* Loyalty membership button indicator */}
          <button
            onClick={onOpenLoyalty}
            id="loyalty-indicator-btn"
            className="flex items-center space-x-1.5 md:space-x-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-800 transition-all cursor-pointer shadow-xs"
          >
            <Award className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
            <span className="hidden sm:inline text-neutral-500">Colonel Club:</span>
            <span className="text-red-600 font-mono">{loyaltyPoints} pts</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            id="cart-indicator-btn"
            className="relative flex items-center space-x-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-2 px-3 sm:px-4 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="text-sm hidden xs:inline">Bag</span>
            <div className="bg-white text-red-600 text-xs font-black px-1.5 py-0.5 rounded-full min-w-5 text-center font-mono">
              {cartCount}
            </div>
            {cartCount > 0 && (
              <span className="hidden md:inline font-mono text-xs border-l border-red-500/50 pl-2">
                GH₵ {cartTotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sticky Quick-Action Bar for Mobile Screens */}
      <div className="md:hidden flex justify-around items-center border-t border-gray-100 bg-white/95 backdrop-blur-md py-2 overflow-x-auto gap-1" id="mobile-bottom-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center flex-1 py-1 px-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isActive ? 'text-red-600 font-extrabold' : 'text-neutral-500'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-red-600' : 'text-neutral-400'}`} />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={onOpenAIChat}
          className="flex flex-col items-center flex-1 py-1 px-1 text-neutral-500"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-yellow-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider">AI Chat</span>
        </button>
      </div>
    </header>
  );
}
