import React, { useState, useMemo } from 'react';
import { Sparkles, BadgeAlert, ShoppingBag, X, Check, Flame, Award, Heart, Search } from 'lucide-react';
import { MENU_ITEMS, UPSELL_ITEMS } from '../data';
import { MenuItem, CartItem } from '../types';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, config: { size: 'regular' | 'medium' | 'large'; addons: { id: string; name: string; price: number }[] }) => void;
  selectedProduct: MenuItem | null;
  setSelectedProduct: (item: MenuItem | null) => void;
}

const CATEGORIES = [
  { id: 'all', label: '🇲🇵 All', name: 'All Bites' },
  { id: 'jollof', label: '🇬🇭 KFC Jollof', name: 'KFC Ghana Jollof' },
  { id: 'chicken', label: '🍗 Fried Chicken', name: 'Signature Chicken' },
  { id: 'buckets', label: '🪣 Feast Buckets', name: 'Sharing Buckets' },
  { id: 'burgers', label: '🍔 Burgers', name: 'Premium Burgers' },
  { id: 'wraps', label: '🌯 Wraps', name: 'Crispy Wraps' },
  { id: 'sides', label: '🍟 Sides', name: 'Local Sides' },
  { id: 'drinks', label: '🥤 Cold Drinks', name: 'Refreshing Drinks' },
  { id: 'desserts', label: '🍦 Sweet Krushers', name: 'Krushers & Desserts' }
];

export default function MenuSection({ onAddToCart, selectedProduct, setSelectedProduct }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal configurations for size & upselling
  const [chosenSize, setChosenSize] = useState<'regular' | 'medium' | 'large'>('regular');
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number }[]>([]);

  // Search and filter memo
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const handleOpenProduct = (product: MenuItem) => {
    setSelectedProduct(product);
    setChosenSize('regular');
    setSelectedAddons([]);
  };

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Size details multiplier pricing model
  const sizeMultiplier = {
    regular: 1.0,
    medium: 1.12,
    large: 1.25,
  };

  const calculatedModalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    const base = selectedProduct.price * sizeMultiplier[chosenSize];
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    return base + addonsTotal;
  }, [selectedProduct, chosenSize, selectedAddons]);

  const handleAddConfiguredProduct = () => {
    if (!selectedProduct) return;
    onAddToCart(selectedProduct, {
      size: chosenSize,
      addons: selectedAddons,
    });
    setSelectedProduct(null); // Close modal
  };

  return (
    <section className="py-12 bg-white" id="order-menu-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center space-x-2">
              <span>EXPLORE KFC MENU</span>
              <span className="text-red-600 font-bold text-sm bg-red-50 border border-red-100 py-1 px-3 rounded-full uppercase tracking-widest font-mono">GH₵ VALUES</span>
            </h2>
            <p className="text-neutral-500 font-medium">
              Select your favorites from Ghana’s freshest, crunchiest menu category.
            </p>
          </div>

          {/* Search container with icon */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chicken, burgers, sides..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/50 border border-neutral-250 focus:border-red-500 focus:bg-white focus:outline-hidden rounded-full text-sm font-medium transition-all text-neutral-800"
            />
          </div>
        </div>

        {/* Horizontal Category Selector */}
        <div className="flex overflow-x-auto pb-4 mb-10 gap-2.5 scrollbar-thin scrollbar-thumb-neutral-200" id="menu-categories-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap py-3 px-5 sm:px-6 rounded-full text-sm font-bold tracking-wide transition-all uppercase flex items-center space-x-2 cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-200'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:text-red-600 hover:border-red-500'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 text-lg font-medium">Chale! No mouthwatering meals matched your search.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} 
              className="mt-4 text-red-600 hover:text-red-700 font-extrabold text-sm uppercase underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="menu-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenProduct(item)}
                className="bg-white rounded-2xl border border-neutral-100 hover:border-red-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo container with labels */}
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      {item.popular && (
                        <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center space-x-1">
                          <Flame className="w-3 h-3" />
                          <span>BEST SELLER</span>
                        </span>
                      )}
                      {item.limitedTime && (
                        <span className="bg-amber-400 text-neutral-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 fill-neutral-900" />
                          <span>PROMO</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 text-left">
                    <h3 className="font-bold text-neutral-900 text-base line-clamp-1 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-550 leading-relaxed mt-1 line-clamp-2 min-h-8">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider leading-none">Price From</span>
                    <span className="font-extrabold font-mono text-base text-neutral-900 inline-block mt-0.5">
                      GH₵ {item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <span className="bg-white hover:bg-red-600 hover:text-white border border-neutral-200 rounded-lg py-1.5 px-3 text-xs font-extrabold uppercase transition-colors text-neutral-700 shadow-xs flex items-center space-x-1">
                    <span>Order</span>
                    <span>+</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DETAILED ORDER CUSTOMIZATION MODAL WITH SMART UPSELLS */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-neutral-200">
            {/* Modal Sticky Head */}
            <div className="relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-56 object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full cursor-pointer transition-colors"
                aria-label="Close product modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white text-left">
                <span className="bg-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded text-white tracking-widest font-sans inline-block mb-1.5">KFC AUTHENTIC MENU</span>
                <h3 className="text-2xl font-extrabold tracking-tight">{selectedProduct.name}</h3>
              </div>
            </div>

            {/* Modal Scroll Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Product description & stats */}
              <div className="space-y-2">
                <p className="text-neutral-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-neutral-500">
                  <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded">🔥 {selectedProduct.calories} kcal</span>
                  <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded">💪 Protein: {selectedProduct.nutritionalInfo.protein}</span>
                  <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded">🍞 Carbs: {selectedProduct.nutritionalInfo.carbs}</span>
                  <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded">🥑 Fats: {selectedProduct.nutritionalInfo.fat}</span>
                </div>
              </div>

              {/* Recipe / Ingredients index */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-450 mb-2 leading-none">Main Ingredients</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.ingredients.map((ing, i) => (
                    <span key={i} className="bg-neutral-50 text-neutral-800 text-xs py-1 px-3 rounded-md font-medium border border-neutral-150">
                      🥗 {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION 1: SIZE UPGRADE SELECTION */}
              <div className="border-t border-dashed border-neutral-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900 leading-none">1. Select Meal Size</h4>
                  <span className="text-xs text-neutral-400 font-semibold">*Medium +12%, Large +25%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(['regular', 'medium', 'large'] as const).map((size) => {
                    const active = chosenSize === size;
                    const priceOffset = selectedProduct.price * sizeMultiplier[size];
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setChosenSize(size)}
                        className={`py-3 px-2 sm:px-4 rounded-xl border font-bold capitalize transition-all text-xs text-center flex flex-col justify-center cursor-pointer ${
                          active
                            ? 'bg-red-50 border-red-500 text-red-700 shadow-xs'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-350'
                        }`}
                      >
                        <span className="text-xs">{size}</span>
                        <span className="text-[10px] font-mono mt-1 text-neutral-500">
                          GH₵ {priceOffset.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: INTELLIGENT UPSELLING RECOMMENDATIONS */}
              <div className="border-t border-dashed border-neutral-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900 leading-none">2. Frequently Bought Together (Upsells)</h4>
                  <span className="text-xs text-red-600 font-bold bg-amber-100 px-2 py-0.5 rounded">Combo Savings</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {UPSELL_ITEMS.map((addon) => {
                    const selected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-green-50 border-green-500 shadow-xs text-neutral-900'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-xl leading-none">{addon.icon}</span>
                          <div>
                            <p className="font-bold text-xs uppercase text-neutral-800">{addon.name}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{addon.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 font-mono font-bold text-xs">
                          <span className="text-neutral-600">+GH₵ {addon.price.toFixed(2)}</span>
                          <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                            selected ? 'bg-green-600 border-green-600 text-white' : 'border-neutral-300'
                          }`}>
                            {selected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Bottom sticky foot actions */}
            <div className="bg-neutral-50 border-t border-neutral-100 px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-neutral-450 uppercase text-[10px] font-black block tracking-wider leading-none">Total Combo Price</span>
                <span className="font-black font-mono text-2xl text-neutral-900 inline-block mt-1">
                  GH₵ {calculatedModalPrice.toFixed(2)}
                </span>
              </div>
              
              <button
                type="button"
                onClick={handleAddConfiguredProduct}
                id="modal-add-to-bucket"
                className="bg-red-600 hover:bg-red-700 active:scale-97 text-white font-extrabold uppercase py-3.5 px-6 rounded-xl flex items-center space-x-2.5 transition-all shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Add configuration to Bucket</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
