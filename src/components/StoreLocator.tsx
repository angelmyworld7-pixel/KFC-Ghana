import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, Compass, Locate, Check, Sparkles } from 'lucide-react';
import { GHANA_STORES } from '../data';
import { Store } from '../types';

interface StoreLocatorProps {
  onSelectStore: (store: Store) => void;
  selectedStore: Store | null;
}

export default function StoreLocator({ onSelectStore, selectedStore }: StoreLocatorProps) {
  const [stores, setStores] = useState<Store[]>(GHANA_STORES);
  const [searchCity, setSearchCity] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');

  // Simulate Geolocation distance calculation
  const handleGPSDetect = () => {
    setIsLocating(true);
    setGpsMessage('Searching for satellites near Accra/Kumasi...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Haversine formula to sort stores by proximity
          const calculated = GHANA_STORES.map(store => {
            const radlat1 = Math.PI * lat / 180;
            const radlat2 = Math.PI * store.latitude / 180;
            const theta = lon - store.longitude;
            const radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) dist = 1;
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515 * 1.609344; // in km
            return {
              ...store,
              distance: Number(dist.toFixed(1))
            };
          }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

          setStores(calculated);
          setIsLocating(false);
          setGpsMessage(`Location verified! Found ${calculated[0].name} closest to you.`);
          onSelectStore(calculated[0]); // Auto-select closest
        },
        (error) => {
          console.warn("Geolocation failed. Simulating standard proximity layout.", error);
          // Standard proximity layout mockup
          const mockDistances = GHANA_STORES.map((store, i) => ({
            ...store,
            distance: Number((1.2 + i * 2.1).toFixed(1))
          }));
          setStores(mockDistances);
          setIsLocating(false);
          setGpsMessage('GPS denied or timed out. Simulated proximity based on Accra central coordinates (KFC Osu nearest).');
          onSelectStore(mockDistances[1]); // Auto select Osu
        },
        { timeout: 7000 }
      );
    } else {
      setIsLocating(false);
      setGpsMessage('Geolocation is not supported by your browser.');
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchCity.toLowerCase()) ||
    store.address.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <section className="py-12 bg-white" id="store-locator-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="text-left space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center space-x-2">
            <Compass className="w-8 h-8 text-red-650" />
            <span>KFC Ghana Store Finder</span>
          </h2>
          <p className="text-neutral-500 font-medium">
            Find addresses, working hours, shito sauce availability, and coordinate express pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Searches and listing */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4 text-left">
              
              {/* Inputs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Type city or suburb (osu, East Legon, Kumasi...)"
                  className="w-full bg-neutral-50 text-neutral-800 border border-neutral-250 py-3 px-4 rounded-xl text-sm font-medium focus:outline-hidden focus:border-red-500 transition-all font-sans"
                />
                <button
                  onClick={handleGPSDetect}
                  disabled={isLocating}
                  className="bg-red-600 hover:bg-red-700 active:scale-97 text-white py-3 px-5 rounded-xl text-sm font-bold uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                >
                  <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Find Nearest'}</span>
                </button>
              </div>

              {gpsMessage && (
                <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-xs font-semibold text-neutral-600 font-mono">
                  💡 {gpsMessage}
                </div>
              )}
            </div>

            {/* List entries */}
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {filteredStores.map((store) => {
                const isChosen = selectedStore?.id === store.id;
                return (
                  <div
                    key={store.id}
                    onClick={() => onSelectStore(store)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex justify-between gap-4 ${
                      isChosen
                        ? 'border-red-500 bg-red-50/10 shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                        <h4 className="font-extrabold text-neutral-900 text-sm">{store.name}</h4>
                        {store.distance !== undefined && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                            📍 {store.distance} km away
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-sm">
                        {store.address}
                      </p>

                      <div className="grid grid-cols-2 gap-y-1.5 pt-1 text-xs text-neutral-600 font-medium font-mono">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>{store.hours}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Navigation className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>Directions Ready</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <a
                        href={`tel:${store.phone.replace(/\s+/g, '')}`}
                        className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                        title="Call Store"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isChosen ? 'bg-red-600 border-red-600 text-white' : 'border-neutral-300'
                      }`}>
                        {isChosen && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Elegant map canvas simulation rendering Ghana nodes */}
          <div className="lg:col-span-7 bg-neutral-950 rounded-3xl p-6 relative flex flex-col justify-between border border-neutral-800 h-[65vh] xl:h-[55vh] overflow-hidden text-white shadow-xl">
            {/* Map title overlay */}
            <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md py-2 px-4 rounded-xl border border-neutral-800 text-left">
              <span className="text-[9px] uppercase font-black text-red-500 block tracking-widest leading-none">GPS Map Visual</span>
              <span className="font-bold text-xs text-neutral-300 mt-1 inline-block">Interactive Ghana Outlets Map</span>
            </div>

            {/* Custom Interactive SVG / Coordinate Canvas Grid representing Accra coast */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center">
              
              {/* Simulated Map Background */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-white/50 border-dashed"></div>
                ))}
              </div>

              {/* Graphic map contours */}
              <svg className="w-full h-full opacity-20 absolute inset-0" viewBox="0 0 100 100">
                {/* Coastal contour line representing Accra */}
                <path d="M 0,80 Q 25,75 50,82 T 100,78" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
                <path d="M 0,20 Q 30,35 60,15 T 100,40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
                {/* Lake Volta simulation */}
                <path d="M 80,40 Q 85,55 75,70" fill="none" stroke="cyan" strokeWidth="1" strokeDasharray="3,1" />
              </svg>

              {/* Node stars and glow pulses for stores */}
              {stores.map((store) => {
                const isActive = selectedStore?.id === store.id;
                // Place nodes around central coordinates
                let x = "50%";
                let y = "50%";
                if (store.id === 'store-accra-mall') { x = "48%"; y = "38%"; }
                else if (store.id === 'store-osu-oxford') { x = "55%"; y = "65%"; }
                else if (store.id === 'store-kumasi-mall') { x = "22%"; y = "25%"; }
                else if (store.id === 'store-tema-comm1') { x = "80%"; y = "52%"; }
                else if (store.id === 'store-dansoman') { x = "30%"; y = "70%"; }
                else if (store.id === 'store-east-legon') { x = "42%"; y = "45%"; }

                return (
                  <div
                    key={store.id}
                    onClick={() => onSelectStore(store)}
                    className="absolute cursor-pointer transition-all duration-300 group -translate-x-1/2 -translate-y-1/2"
                    style={{ left: x, top: y }}
                  >
                    {/* Glow Pulse */}
                    <div className={`absolute w-8 h-8 rounded-full -left-4 -top-4 -z-10 animate-ping transition-opacity ${
                      isActive ? 'bg-red-500 opacity-60' : 'bg-neutral-500 opacity-20 group-hover:opacity-40'
                    }`}></div>

                    {/* Outer circle */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isActive 
                        ? 'bg-red-600 border-white text-white shadow-lg scale-120' 
                        : 'bg-neutral-900 border-red-500 text-amber-400 group-hover:border-white'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* Mini floating label on hover or if active */}
                    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-900 font-bold border border-neutral-750 px-2.5 py-1 rounded text-[10px] pointer-events-none transition-all shadow-md ${
                      isActive ? 'opacity-100 scale-100 ring-2 ring-red-500/50' : 'opacity-0 scale-95 group-hover:opacity-100'
                    }`}>
                      {store.name}
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-4 right-4 text-right bg-neutral-900/80 backdrop-blur-md p-3 rounded-xl border border-neutral-800 text-[10px] space-y-1 font-mono text-neutral-400">
                <span className="font-bold text-white block">MAP METRICS:</span>
                <span>Proximity Area: Accra-Kumasi Highway</span>
                <span className="block mt-0.5">Satellite: Dual-GPS MoMo Coverage online</span>
              </div>
            </div>

            {/* Selected Store Status Bar Bottom */}
            {selectedStore && (
              <div className="p-4 bg-yellow-400 rounded-3xl text-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4 self-stretch text-left shadow-lg">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black tracking-widest text-neutral-900/60 leading-none">SELECTED ORDERING LOCATION</span>
                  <p className="font-extrabold text-sm">{selectedStore.name}</p>
                  <p className="text-xs text-neutral-900/80 font-medium">Ordering will be Routed &amp; cooked here.</p>
                </div>
                
                <button
                  onClick={() => onSelectStore(selectedStore)}
                  className="bg-neutral-950 text-white font-black text-xs uppercase py-3 px-5 rounded-xl cursor-pointer hover:bg-neutral-900 shadow-md transition-all active:scale-97 hover:scale-102 flex items-center space-x-1 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                  <span>Choose this store</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
