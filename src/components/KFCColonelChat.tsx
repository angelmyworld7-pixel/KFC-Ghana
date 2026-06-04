import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface KFCColonelChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: () => void;
  onAddSpecialItem: (name: string, price: number) => void;
}

const PRESETS = [
  { text: 'Suggest a GH₵ 80 combo 🍔', budget: 80 },
  { text: 'Best local Jollof shares 🇬🇭' },
  { text: 'Diet / Low calorie options 🥗' },
  { text: 'Tell me about Colonel Club Rewards 🏆' }
];

export default function KFCColonelChat({ isOpen, onClose, onOrderNow, onAddSpecialItem }: KFCColonelChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Akwaaba! 🇬🇭 I am **Captain Colonel**, your AI ordering guide for KFC Ghana. I’m here to recommend the spiciest local Jollof boxes, find combos suited for your exact pocket budget, or tell you fun recipe facts! What are we eating?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroller
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string, explicitBudget?: number) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          budget: explicitBudget || null
        })
      });

      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'model',
          content: data.reply || "Something went slightly crunchy in my network! Highly recommend the **Streetwise Jollof Giant Feaster** (GH₵ 85) with cold shito sauce, absolute banger!"
        }
      ]);
    } catch (err) {
      console.error("AI Chat fetch error:", err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'model',
          content: "Chale! A tiny static in my satellite. But let me recommend our legendary **KFC Ghana Jollof Bucket Feast** for GH₵ 210, perfect for family sharing! Shall I route you to the buckets catalog?"
        }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  if (!isOpen) {
    // Return a floating chat button launcher overlay
    return (
      <button
        onClick={() => {
          // Open chat frame
          const openChatCustomEvent = new CustomEvent('openKFCColonelChat');
          window.dispatchEvent(openChatCustomEvent);
        }}
        id="ai-chat-launcher-floating"
        className="fixed bottom-20 md:bottom-8 right-6 z-40 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-white transition-all cursor-pointer group"
      >
        <Bot className="w-5 h-5 text-white animate-wiggle group-hover:animate-bounce" />
        <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-white">Ask Captain Colonel AI</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 max-w-full flex pl-10 text-neutral-800 text-left" id="ai-chat-container">
      {/* Scrim */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/50 backdrop-blur-3xs transition-opacity"
      ></div>

      <div className="w-screen max-w-sm bg-white h-full flex flex-col shadow-2xl relative z-10 animate-slide-in border-l border-neutral-100">
        
        {/* Drawer Header */}
        <div className="bg-neutral-900 px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3 text-left">
            <div className="bg-red-600 p-2 rounded-full border border-red-500">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Captain Colonel AI</h4>
              <p className="text-[10px] text-green-400 font-mono font-bold uppercase tracking-wider leading-none mt-0.5">Online • MoMo verified</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info alerts */}
        <div className="bg-red-50 p-2.5 px-4 text-[10px] text-red-700 leading-normal border-b border-red-100 flex items-center space-x-1.5 font-sans">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Need customized recommendations? Chat pricing or ask about recipe secrets now.</span>
        </div>

        {/* Chat message listing scroll container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50"
          id="ai-chat-messages"
        >
          {messages.map((m) => {
            const isModel = m.role === 'model';
            return (
              <div 
                key={m.id}
                className={`flex gap-2 text-xs leading-relaxed max-w-[85%] ${
                  isModel ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'
                }`}
              >
                {isModel && (
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-extrabold flex items-center justify-center shrink-0 border border-white text-[9px]">
                    🍗
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl ${
                  isModel 
                    ? 'bg-white border border-neutral-200 text-neutral-800' 
                    : 'bg-red-650 text-white font-medium'
                }`}>
                  {/* Rich-formatting parser simple mockup */}
                  <p className="whitespace-pre-line">
                    {m.content.split('**').map((chunk, i) => {
                      if (i % 2 === 1) return <strong key={i} className="font-extrabold text-[#E4002B]">{chunk}</strong>;
                      return chunk;
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 text-xs mr-auto">
              <div className="w-6 h-6 rounded-full bg-red-600 text-white font-extrabold flex items-center justify-center shrink-0 border border-white text-[10px]">
                🍗
              </div>
              <div className="bg-white border border-neutral-200 text-neutral-400 p-2 px-3 rounded-xl flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion presets */}
        {messages.length === 1 && (
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider text-left block">Popular Prompts</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(p.text, p.budget)}
                  className="bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[10px] font-semibold py-1.5 px-2.5 rounded-full border border-neutral-200 transition-colors text-left"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box form */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-150 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type values, diets, or questions..."
            className="flex-1 bg-neutral-50 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden border border-neutral-250 text-neutral-800 focus:border-red-500 focus:bg-white"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>

      </div>
    </div>
  );
}
