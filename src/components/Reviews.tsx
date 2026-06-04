import React, { useState } from 'react';
import { Star, Check, Sparkles, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { REVIEWS } from '../data';
import { Review } from '../types';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [mealSelected, setMealSelected] = useState('Streetwise 1 with Jollof');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      return;
    }

    const nReview: Review = {
      id: String(Date.now()),
      name: name,
      rating: rating,
      date: 'Today',
      comment: comment,
      itemOrdered: mealSelected,
      verified: true
    };

    setReviews([nReview, ...reviews]);
    setName('');
    setComment('');
    setRating(5);
    setSuccessMsg('Medaase! Your review has been validated and added directly to our local feed.');
    
    setTimeout(() => {
      setSuccessMsg('');
    }, 4500);
  };

  return (
    <section className="py-16 bg-neutral-50" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header visual cues */}
        <div className="text-left space-y-2 mb-10">
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center space-x-2">
            <MessageSquare className="w-8 h-8 text-red-650" />
            <span>KFC Ghana Customer Love</span>
          </h2>
          <p className="text-neutral-500 font-medium">
            Read real stories from our satisfied customers who order original recipe crunch and hot spiced Jollof regularly.
          </p>
        </div>

        {/* Dashboard review summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Dashboard star ratios */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-neutral-150 shadow-xs space-y-4">
            <div className="text-center md:text-left">
              <span className="text-neutral-400 text-xs font-bold uppercase tracking-widest block">Core Satisfaction Rating</span>
              <div className="flex items-baseline justify-center md:justify-start space-x-2 mt-2">
                <span className="text-5xl font-black text-neutral-900 font-mono">4.8</span>
                <span className="text-sm font-bold text-neutral-500">/ 5.0</span>
              </div>

              {/* Gold Stars */}
              <div className="flex items-center justify-center md:justify-start space-x-1 mt-2 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-500 font-medium mt-1">Based on 50,000+ verified checkouts across Accra, Kumasi, Tema community.</p>
            </div>

            {/* Simulated bar percentages */}
            <div className="space-y-2 pt-4 border-t border-neutral-100 font-mono text-xs font-bold text-neutral-600">
              <div className="flex items-center space-x-2">
                <span className="w-12 text-left">5 Stars</span>
                <div className="flex-1 h-2 bg-neutral-150 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-red-600 rounded-full"></div>
                </div>
                <span className="w-8 text-right">88%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-12 text-left">4 Stars</span>
                <div className="flex-1 h-2 bg-neutral-150 rounded-full overflow-hidden">
                  <div className="w-[9%] h-full bg-red-600 rounded-full"></div>
                </div>
                <span className="w-8 text-right">9%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-12 text-left">3 Stars</span>
                <div className="flex-1 h-2 bg-neutral-150 rounded-full overflow-hidden">
                  <div className="w-[2%] h-full bg-amber-500 rounded-full"></div>
                </div>
                <span className="w-8 text-right">2%</span>
              </div>
            </div>
          </div>

          {/* List index */}
          <div className="lg:col-span-8 space-y-4">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-neutral-100 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="text-left space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-neutral-900 text-sm leading-none">{rev.name}</h4>
                      {rev.verified && (
                        <span className="bg-red-50 text-red-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center space-x-1 leading-none select-none">
                          <Check className="w-3.5 h-3.5" />
                          <span>VERIFIED ORDER</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono font-semibold">{rev.date} • Ordered: **{rev.itemOrdered}**</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center space-x-0.5 text-yellow-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>

                <div className="flex items-center space-x-2.5 pt-2 text-[10px] font-black uppercase text-neutral-450 font-sans tracking-wide">
                  <button className="flex items-center space-x-1.5 hover:text-red-600 transition-colors cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful (12)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Dynamic bottom inline submission form */}
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="text-left space-y-1.5">
            <span className="bg-red-650 text-[9px] font-black uppercase px-2 py-0.5 rounded text-white tracking-widest font-sans inline-block">Review Corner</span>
            <h3 className="font-black text-xl text-white tracking-tight">Enjoyed your Jollof &amp; Chicken? Voice your crunch!</h3>
            <p className="text-xs text-neutral-400">Your feedback inspires our kitchen riders across Ghana. Fill out this brief form.</p>
          </div>

          <form onSubmit={handleAddReview} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-450 block leading-none">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Afua Serwaa"
                  className="w-full bg-neutral-950 border border-neutral-800 py-2.5 px-3.5 text-xs font-semibold rounded-xl text-white focus:outline-hidden text-left font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-450 block leading-none">What did you eat?</label>
                <select
                  value={mealSelected}
                  onChange={(e) => setMealSelected(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-300 focus:outline-hidden"
                >
                  <option value="Streetwise 1 with Jollof">Streetwise 1 with Jollof - GH₵ 45</option>
                  <option value="Streetwise Jollof Giant Feaster">Streetwise Jollof Giant - GH₵ 85</option>
                  <option value="KFC Ghana Jollof Bucket Feast">KFC Ghana Jollof Bucket - GH₵ 210</option>
                  <option value="Streetwise 2 Classic">Streetwise 2 Classic - GH₵ 60</option>
                  <option value="Zinger Burger Classic">Zinger Burger Classic - GH₵ 68</option>
                  <option value="Ghanaian Golden Yam Fries">Ghanaian Golden Yam Fries - GH₵ 28</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-450 block leading-none">Score Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRating(stars)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star className={`w-6 h-6 ${rating >= stars ? 'text-yellow-400 fill-current' : 'text-neutral-700'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-neutral-400 font-bold ml-2 font-mono">{rating} / 5 Stars</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="space-y-1 flex-1 flex flex-col">
                <label className="text-xs font-bold text-neutral-450 block leading-none mb-1">Your Crunch Review</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the crunch, shito dip quality, or delivery timeline..."
                  className="w-full bg-neutral-950 border border-neutral-800 p-3.5 text-xs font-semibold rounded-xl text-white focus:outline-hidden text-left flex-1 font-medium"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  type="submit"
                  className="bg-red-650 hover:bg-red-700 active:scale-97 text-white font-extrabold uppercase text-xs py-3 px-6 rounded-xl cursor-pointer flex items-center space-x-1 shadow-md"
                >
                  <span>Publish Review</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
                {successMsg && (
                  <p className="text-[10px] text-green-400 font-bold font-sans animate-fade-in">{successMsg}</p>
                )}
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
