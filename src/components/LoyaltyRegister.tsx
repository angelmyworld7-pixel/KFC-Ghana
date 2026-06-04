import React, { useState } from 'react';
import { Award, Sparkles, Gift, Check, Phone, Mail, UserPlus, Heart, Milestone } from 'lucide-react';
import { LOYALTY_REWARDS } from '../data';
import { LoyaltyReward } from '../types';

interface LoyaltyRegisterProps {
  points: number;
  onAddPoints: (points: number) => void;
  onRedeemReward: (reward: LoyaltyReward) => void;
}

export default function LoyaltyRegister({ points, onAddPoints, onRedeemReward }: LoyaltyRegisterProps) {
  // Simulate loyalty enrollment structure
  const [isRegistered, setIsRegistered] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  // Tiers layout
  const currentTier = points >= 250 ? 'Gold Colonel' : points >= 100 ? 'Silver Colonel' : 'Bronze Colonel';
  const nextMilestone = points >= 250 ? null : points >= 100 ? 250 : 100;
  const progressPercent = nextMilestone ? Math.min(100, (points / nextMilestone) * 100) : 100;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError('Please fill in all details to claim your welcome bonus!');
      return;
    }
    setFormError('');
    setIsRegistered(true);
    onAddPoints(50); // Instantly grant 50 welcome points!
  };

  const handleClaim = (reward: LoyaltyReward) => {
    if (points >= reward.pointsCost) {
      onRedeemReward(reward);
      setClaimedRewards([...claimedRewards, reward.id]);
    }
  };

  return (
    <section className="py-12 bg-neutral-900 text-white" id="loyalty-rewards-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Banner header grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border-b border-neutral-800 pb-10 mb-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-yellow-400 text-neutral-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-neutral-900" />
              <span>COLONEL CLUB REWARDS PROGRAM</span>
            </div>
            
            <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight">
              Eat Chicken, <span className="text-red-500">Earn Points</span>, Redeem Free Feasts!
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Join Ghana’s premier quick-service loyalty club. Earn 1 point for every GH₵ 1 spent. Bronze, Silver, and Gold tiers trigger extra secret birthday savings and first access to new recipes.
            </p>
          </div>

          {/* Interactive quick signup stats display/signup */}
          <div className="bg-neutral-850 p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col justify-center">
            {isRegistered ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">Akwaaba, {name}!</h4>
                  <p className="text-xs text-neutral-400">Membership Active • {currentTier} VIP</p>
                </div>
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block leading-none">Your Balance</span>
                  <span className="font-black font-mono text-2xl text-yellow-400 mt-1 inline-block">{points} Points</span>
                </div>
                <p className="text-[10px] text-green-400 font-bold uppercase animate-pulse">🎉 Instantly Awarded 50 welcome points!</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-red-650/10 border border-red-500/30 text-amber-500 py-2.5 px-3 rounded-xl inline-block">
                  <span className="font-extrabold text-xs uppercase text-amber-400">🎁 LIMITED ON-BOARD BONUS</span>
                  <p className="text-[10px] text-neutral-300 mt-0.5">Register now to instantly get 50 Free Points!</p>
                </div>
                <p className="text-neutral-400 text-xs">Unlock your first free reward (Free Strawberry Krusher) on us instantly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic points status layout or registration form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Panel Left */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* If registered, show progression tracker */}
            {isRegistered && (
              <div className="bg-neutral-850 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="text-left space-y-1">
                    <span className="text-xs text-neutral-500 uppercase font-black leading-none">VIP TIER STATUS</span>
                    <h3 className="text-xl font-black text-white flex items-center space-x-2">
                      <span className="text-yellow-400">★</span>
                      <span>{currentTier}</span>
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-500 uppercase font-black block leading-none">Current Balance</span>
                    <span className="text-2xl font-black font-mono text-yellow-400 mt-1 inline-block">{points} PTS</span>
                  </div>
                </div>

                {/* Simulated Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-neutral-400">
                    <span>Bronze Star</span>
                    {nextMilestone ? (
                      <span>{nextMilestone - points} pts to Silver/Gold Benefits</span>
                    ) : (
                      <span>Max Gold VIP Limit Unlocked 💎</span>
                    )}
                    <span>{nextMilestone || 250} pts</span>
                  </div>
                  
                  <div className="relative w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tier Privileges detail */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dashed border-neutral-805 text-left">
                  <div className={`p-3 rounded-xl border ${points < 100 ? 'border-amber-400 bg-amber-400/5' : 'border-neutral-800 opacity-60'}`}>
                    <h5 className="font-bold text-neutral-200 text-xs">Bronze (0-99)</h5>
                    <p className="text-[10px] text-neutral-400 mt-1">Earn 1x points, custom newsletter, birthday offers.</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${points >= 100 && points < 250 ? 'border-amber-400 bg-amber-400/5' : 'border-neutral-800 opacity-60'}`}>
                    <h5 className="font-bold text-neutral-200 text-xs text-yellow-500">★ Silver (100-249)</h5>
                    <p className="text-[10px] text-neutral-400 mt-1">Get 5% permanent auto-cash savings, secret menu item launches.</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${points >= 250 ? 'border-amber-400 bg-amber-400/5' : 'border-neutral-800 opacity-60'}`}>
                    <h5 className="font-bold text-yellow-400 text-xs">💎 Gold (250+)</h5>
                    <p className="text-[10px] text-neutral-400 mt-1">10% VIP auto-cash savings, free hot priority home delivery.</p>
                  </div>
                </div>
              </div>
            )}

            {/* List of rewards redeemable */}
            <div className="space-y-4">
              <h3 className="font-black text-xl text-white tracking-tight flex items-center space-x-2">
                <Gift className="w-5 h-5 text-red-500" />
                <span>Redeem Your Colonel Club points</span>
              </h3>
              <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest leading-none">Milestones Catalogue:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LOYALTY_REWARDS.map((reward) => {
                  const canRedeem = points >= reward.pointsCost;
                  const claimed = claimedRewards.includes(reward.id);
                  
                  return (
                    <div 
                      key={reward.id}
                      className={`bg-neutral-850 p-4 rounded-2xl border flex items-center space-x-4 transition-all ${
                        canRedeem ? 'border-amber-500/50 shadow-md' : 'border-neutral-800 opacity-80'
                      }`}
                    >
                      <img 
                        src={reward.image} 
                        alt={reward.title} 
                        className="w-16 h-16 rounded-xl object-cover border border-neutral-750"
                      />
                      
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-sm text-white">{reward.title}</h4>
                        <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">{reward.description}</p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-mono text-xs font-extrabold text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full">
                            {reward.pointsCost} Points
                          </span>
                          
                          {claimed ? (
                            <span className="text-[10px] text-green-400 font-bold uppercase leading-none">Claimed! Check Cart</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleClaim(reward)}
                              disabled={!canRedeem}
                              className={`py-1 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                                canRedeem
                                  ? 'bg-amber-400 hover:bg-amber-500 text-neutral-950 hover:scale-103 active:scale-97'
                                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              }`}
                            >
                              Redeem Item
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Form and CTA Panel Right */}
          <div className="lg:col-span-5">
            {!isRegistered ? (
              <div className="bg-neutral-850 p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-6">
                <div className="text-left space-y-2">
                  <h3 className="font-extrabold text-xl text-white tracking-tight flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-red-500" />
                    <span>Free Membership Registration</span>
                  </h3>
                  <p className="text-xs text-neutral-400">Fill your details. Instant activation with 50 points welcome rewards.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {formError && (
                    <div className="bg-red-550/20 text-red-400 border border-red-500/30 p-2.5 rounded-xl text-xs font-bold font-sans">
                      ⚠️ {formError}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 block tracking-wide">Your Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Kwame Mensah"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 focus:outline-hidden text-sm py-2.5 px-3.5 rounded-xl text-white transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 block tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kwame.m@gmail.com"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 focus:outline-hidden text-sm py-2.5 px-3.5 rounded-xl text-white transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 block tracking-wide">Ghanaian Mobile Number (MTN, Telecel, AT)</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., 054 XXX XXXX"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 focus:outline-hidden text-sm py-2.5 px-3.5 rounded-xl text-white transition-all font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    id="loyalty-signup-action"
                    className="w-full bg-red-650 hover:bg-red-700 active:scale-97 text-white py-3 px-6 rounded-xl font-black uppercase text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Award className="w-4 h-4 text-white" />
                    <span>Enrol &amp; Claim 50 Welcome Points!</span>
                  </button>
                </form>

                <p className="text-[10px] text-neutral-500 text-center uppercase leading-tight mt-4">
                  * By signing up you agree to receive crispy promo deals, birthday gifts, and Colonel newsletter alerts. We do not spam.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-400 text-neutral-950 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <Sparkles className="w-8 h-8 text-neutral-900 animate-pulse" />
                <h3 className="font-extrabold text-xl tracking-tight leading-tight">Welcome to Captain's Star InnerCircle!</h3>
                <p className="text-xs text-neutral-900/80 font-medium leading-relaxed">
                  You are now in VIP standing. When placing an order at checkout, your membership code will auto-apply to accumulate points for free meals.
                </p>
                <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/40 space-y-1 text-left">
                  <span className="text-[10px] uppercase font-bold text-neutral-900/70 block leading-none">Your Club ID</span>
                  <span className="font-mono font-black text-sm text-neutral-950 uppercase block mt-1 tracking-widest">KFC-GH-{(name.substring(0,2)+phone.slice(-4)).toUpperCase()}</span>
                </div>
                <div className="pt-2 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 justify-center bg-black/5 py-1.5 rounded">
                  <span>💎 Gold Member auto savings configured</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
