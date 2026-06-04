import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedDeals from './components/FeaturedDeals';
import MenuSection from './components/MenuSection';
import LoyaltyRegister from './components/LoyaltyRegister';
import StoreLocator from './components/StoreLocator';
import OrderDrawer from './components/OrderDrawer';
import CheckoutModal from './components/CheckoutModal';
import KFCColonelChat from './components/KFCColonelChat';
import Reviews from './components/Reviews';

import { MenuItem, Store, CartItem } from './types';
import { GHANA_STORES, MENU_ITEMS } from './data';
import { ShoppingBag, ArrowUpRight, ShieldCheck, MapPin, Award, Phone } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'loyalty' | 'locator' | 'reviews'
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [selectedStore, setSelectedStore] = useState<Store | null>(GHANA_STORES[0]); // Default to Mall branch
  
  // Promo states
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // decimal discount

  // Side Drawer switches
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  
  // Checkout Modal status
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Subscribe to custom global launcher events for Captain Sanders
  useEffect(() => {
    const handleOpenChat = () => setIsAIChatOpen(true);
    window.addEventListener('openKFCColonelChat', handleOpenChat);
    return () => window.removeEventListener('openKFCColonelChat', handleOpenChat);
  }, []);

  // Handlers
  const handleAddToCart = (
    product: MenuItem, 
    config: { size: 'regular' | 'medium' | 'large'; addons: { id: string; name: string; price: number }[] } = { size: 'regular', addons: [] }
  ) => {
    // Generate a unique item key based on product ID, size, and chosen addon ids
    const addonKey = config.addons.map(a => a.id).sort().join('_');
    const cartItemId = `${product.id}_${config.size}_${addonKey}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            quantity: 1,
            size: config.size,
            addonItems: config.addons,
          },
        ];
      }
    });

    // Fire tiny confirmation log
    setIsCartOpen(true);
  };

  const handleUpdateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleApplyPromo = (code: string) => {
    setPromoCode(code);
    if (code === 'MOMO50') {
      setPromoDiscount(0.15); // 15% off
    } else if (code === 'CHALEFREE') {
      // Add a FREE Yam Fries and soda to the cart automatically!
      setPromoDiscount(0.0); // 0 Cedi offset, instead add physical item
      const freeYamProduct = MENU_ITEMS.find(i => i.id === 'side-yam-fries') || MENU_ITEMS[9];
      handleAddToCart(freeYamProduct, { size: 'regular', addons: [] });
    }
  };

  const handleAddPoints = (pts: number) => {
    setLoyaltyPoints((prev) => prev + pts);
  };

  const handleRedeemLoyaltyReward = (reward: any) => {
    // Deduct points
    setLoyaltyPoints((prev) => Math.max(0, prev - reward.pointsCost));
    // Find matching food and add it to cart for GH₵ 0.00!
    const mockFreeFood: MenuItem = {
      id: `free_${reward.id}`,
      name: `🎁 FREE ${reward.title}`,
      description: 'Redeemed with your Colonel Club Points!',
      price: 0.0,
      category: 'sides',
      image: reward.image,
      rating: 5.0,
      ordersCount: 1,
      popular: true,
      limitedTime: false,
      calories: 0,
      ingredients: [],
      nutritionalInfo: { protein: '0g', carbs: '0g', fat: '0g' }
    };
    handleAddToCart(mockFreeFood);
  };

  const totals = React.useMemo(() => {
    const subtotal = cart.reduce((acc, item) => {
      const addonsTotal = item.addonItems.reduce((sum, a) => sum + a.price, 0);
      const sizeMultiplier = item.size === 'large' ? 1.25 : item.size === 'medium' ? 1.12 : 1.0;
      return acc + (item.product.price * sizeMultiplier + addonsTotal) * item.quantity;
    }, 0);
    return subtotal;
  }, [cart]);

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 flex flex-col justify-between" id="applet-viewport">
      
      {/* LOCAL SEO SCHEMA MARKUP INJECTION */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FastFoodRestaurant",
          "name": "KFC Ghana",
          "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80",
          "telephone": "+233302824155",
          "url": "https://kfcghana.com",
          "menu": "https://kfcghana.com/menu",
          "servesCuisine": "Fast Food, Fried Chicken, Jollof Rice",
          "priceRange": "GH₵₵",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Tetteh Quarshie Interchange",
            "addressLocality": "East Legon, Accra",
            "addressCountry": "GH"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "08:00",
            "closes": "23:59"
          }
        })}
      </script>

      {/* Global Navigation Header */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loyaltyPoints={loyaltyPoints}
        onOpenLoyalty={() => { setActiveTab('loyalty'); }}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Primary tab views content routing */}
      <main className="flex-1">
        {activeTab === 'menu' && (
          <>
            <Hero 
              onOrderNow={() => {
                const doc = document.getElementById('order-menu-section');
                if (doc) doc.scrollIntoView({ behavior: 'smooth' });
              }}
              onFindStore={() => setActiveTab('locator')}
            />
            
            <FeaturedDeals 
              onAddToCart={(item) => handleAddToCart(item)}
              onSelectProduct={(item) => setSelectedProduct(item)}
            />
            
            <MenuSection
              onAddToCart={(item, config) => handleAddToCart(item, config)}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          </>
        )}

        {/* Loyalty club tab content */}
        {activeTab === 'loyalty' && (
          <LoyaltyRegister
            points={loyaltyPoints}
            onAddPoints={handleAddPoints}
            onRedeemReward={handleRedeemLoyaltyReward}
          />
        )}

        {/* Store locator finder view tab */}
        {activeTab === 'locator' && (
          <StoreLocator
            selectedStore={selectedStore}
            onSelectStore={(store) => {
              setSelectedStore(store);
              // Switch direct to menu context is optional but helpful
            }}
          />
        )}

        {/* Review list ratings view tab */}
        {activeTab === 'reviews' && (
          <Reviews />
        )}
      </main>

      {/* COMPREHENSIVE LOCALIZED SEO SITE FOOTER */}
      <footer className="bg-neutral-900 text-white border-t border-neutral-800" id="global-site-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
            
            {/* Logo and shito callouts */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-600 rounded-xs flex flex-col justify-between p-0.5">
                  <div className="flex w-full justify-between h-full bg-red-600">
                    <div className="w-1 bg-white h-full"></div>
                    <div className="w-1 bg-white h-full"></div>
                  </div>
                </div>
                <span className="font-black text-lg tracking-tight">KFC GHANA</span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Ghana’s most loved signature hot chicken, seasoned crisp and made to satisfy. Try our localized Spiced Jollof buckets today. Medaase!
              </p>
              <div className="flex items-center space-x-2 text-xs text-white">
                <span className="bg-red-650 text-[10px] font-black uppercase px-2 py-0.5 rounded leading-none text-white">HOTLINE</span>
                <a href="tel:+233302824155" className="font-mono hover:text-red-500 font-bold text-neutral-300">
                  +233 30 282 4155
                </a>
              </div>
            </div>

            {/* Quick ordering locations links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 leading-none">Our Local Hubs</h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                {GHANA_STORES.slice(0, 4).map(store => (
                  <li key={store.id}>
                    <button 
                      onClick={() => { setSelectedStore(store); setActiveTab('locator'); }}
                      className="hover:text-white transition-colors flex items-center space-x-1.5 cursor-pointer text-left"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{store.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Loyalty tiers details quick reference */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 leading-none">Colonel Tiers</h4>
              <div className="text-neutral-400 text-xs space-y-2 font-medium">
                <p className="flex justify-between border-b border-neutral-800 pb-1.5">
                  <span>★ Gold Club Members:</span>
                  <span className="text-yellow-400 font-bold font-mono">10% Savings</span>
                </p>
                <p className="flex justify-between border-b border-neutral-800 pb-1.5">
                  <span>★ Silver Club Members:</span>
                  <span className="text-neutral-200 font-bold font-mono">5% Savings</span>
                </p>
                <p className="flex justify-between pb-1.5">
                  <span>★ Bronze Club Members:</span>
                  <span className="text-red-400 font-bold">Standard rewards</span>
                </p>
              </div>
            </div>

            {/* Trust and apps parameters */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 leading-none font-sans">Corporate &amp; Safety</h4>
              <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                Verify our SSL, MTN MoMo handshake integration, and food-handling regulations certificate directly in-cabinet.
              </p>
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 text-[10px] text-neutral-500 text-left font-mono">
                <span>GATEWAY: MTN MoMo Node POS-v3</span>
                <span className="block mt-1">LTD SECURE KEY: SHA-256 Enabled</span>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-neutral-805 text-center flex flex-col sm:flex-row items-center justify-between gap-6 text-neutral-500 text-[11px]">
            <p>© 2026 KFC Ghana, Inc. All Rights Reserved. Prepared fresh in-store. Shito and shito sauce are properties of signature Ghana spices.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Information</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">MoMo Rules</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Cookies Policies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* EXTREMELY HIGH CONVERTING - PERSISTENT STICKY ORDER TRIGGER BAR FOR MOBILE DEVICES */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-neutral-900 border-t border-neutral-800 py-3.5 px-6 z-30 flex items-center justify-between text-white md:hidden shadow-2xl animate-slide-in">
          <div className="text-left font-medium space-y-0.5">
            <span className="text-[10px] text-neutral-400 block tracking-wider leading-none uppercase">Total due ({cart.reduce((s,i) => s + i.quantity, 0)} items)</span>
            <span className="font-mono text-lg text-yellow-400 font-extrabold block">GH₵ {totals.toFixed(2)}</span>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            id="mobile-sticky-action-bucket"
            className="bg-red-650 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs uppercase py-3.5 px-6 rounded-xl shadow-md cursor-pointer flex items-center space-x-1"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Open Bucket Cart</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onApplyPromo={handleApplyPromo}
        promoCode={promoCode}
        promoDiscount={promoDiscount}
        onAddToCart={(item) => handleAddToCart(item)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Wizard Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        selectedStore={selectedStore}
        promoCode={promoCode}
        promoDiscount={promoDiscount}
        onClearCart={() => setCart([])}
        onAddPoints={handleAddPoints}
      />

      {/* Captain Colonel Sanders AI Chat Assistant */}
      <KFCColonelChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onOrderNow={() => {
          setIsAIChatOpen(false);
          const doc = document.getElementById('order-menu-section');
          if (doc) doc.scrollIntoView({ behavior: 'smooth' });
        }}
        onAddSpecialItem={(name, price) => {
          const customProduct: MenuItem = {
            id: `ai_${String(Date.now())}`,
            name: name,
            description: 'AI recommended combo feast',
            price: price,
            category: 'chicken',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
            rating: 5.0,
            ordersCount: 1,
            popular: true,
            limitedTime: false,
            calories: 800,
            ingredients: [],
            nutritionalInfo: { protein: '0g', carbs: '0g', fat: '0g' }
          };
          handleAddToCart(customProduct);
          setIsAIChatOpen(false);
        }}
      />

    </div>
  );
}
