import React, { useState, useMemo, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Ticket, Smartphone, Star, ArrowLeft, Loader2, Sparkles, Send } from 'lucide-react';
import { CartItem, Store } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  selectedStore: Store | null;
  onClearCart: () => void;
  onAddPoints: (pts: number) => void;
  promoCode: string;
  promoDiscount: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  selectedStore,
  onClearCart,
  onAddPoints,
  promoCode,
  promoDiscount
}: CheckoutModalProps) {
  // Steps: 'customer' | 'payment' | 'processing' | 'otp' | 'confirmed'
  const [step, setStep] = useState<'customer' | 'payment' | 'processing' | 'otp' | 'confirmed'>('customer');
  
  // Fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn');
  const [momoPhone, setMomoPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Processing triggers
  const [validationError, setValidationError] = useState('');

  // Live order status states
  const [orderId, setOrderId] = useState('');
  const [deliveryTimer, setDeliveryTimer] = useState(30); // 30 mins
  const [orderState, setOrderState] = useState<'received' | 'cooking' | 'delivering' | 'arrived'>('received');

  // Calculate prices
  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => {
      const addonsTotal = item.addonItems.reduce((sum, a) => sum + a.price, 0);
      const sizeMultiplier = item.size === 'large' ? 1.25 : item.size === 'medium' ? 1.12 : 1.0;
      return acc + (item.product.price * sizeMultiplier + addonsTotal) * item.quantity;
    }, 0);

    const deliveryFee = deliveryMethod === 'delivery' ? (subtotal > 150 ? 0 : 15.00) : 0;
    const discount = promoDiscount > 0 ? (subtotal * promoDiscount) : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

    return { subtotal, deliveryFee, discount, finalTotal };
  }, [cart, deliveryMethod, promoDiscount]);

  // Validation step triggers
  const validateCustomerStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setValidationError('Please fill in your primary details (Name, Email, Phone), chale!');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setValidationError('Delivery address is required so we can find your compound!');
      return;
    }
    setValidationError('');
    setStep('payment');
  };

  const handlePay = () => {
    if (paymentMethod === 'momo' && !momoPhone.trim()) {
      setValidationError('Please supply your Mobile Money registered number!');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCVV.trim())) {
      setValidationError('Please complete the Credit/Debit card visual fields!');
      return;
    }
    
    setValidationError('');
    setStep('processing');
    
    // Simulate payment endpoint latency
    setTimeout(() => {
      if (paymentMethod === 'momo') {
        setStep('otp'); // Redirect to interactive OTP checker
      } else {
        triggerOrderConfirm();
      }
    }, 2000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== '1234' && otpCode.trim().length > 0) {
      setOtpError('Incorrect MoMo confirmation PIN. Try "1234" to simulate approval.');
      return;
    }
    if (!otpCode.trim()) {
      setOtpError('Please input a simulated PIN first!');
      return;
    }
    
    setOtpError('');
    setStep('processing');
    setTimeout(() => {
      triggerOrderConfirm();
    }, 1500);
  };

  const triggerOrderConfirm = () => {
    // Generate simulated order receipt parameters
    const randomId = 'KFC-GH-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setStep('confirmed');
    
    // Add rewards points for the order (e.g. 1 point per 1 Cedi)
    const ptsEarned = Math.round(totals.finalTotal);
    onAddPoints(ptsEarned);

    // Track simulated analytics conversions
    console.log("GA4 Event Triggered: purchase", {
      transaction_id: randomId,
      value: totals.finalTotal,
      currency: "GHS",
      items: cart.map(item => ({ item_name: item.product.name, quantity: item.quantity }))
    });
  };

  // Status updates countdown
  useEffect(() => {
    if (step === 'confirmed') {
      const stateInterval = setInterval(() => {
        setOrderState((prev) => {
          if (prev === 'received') return 'cooking';
          if (prev === 'cooking') return 'delivering';
          if (prev === 'delivering') return 'arrived';
          return prev;
        });
      }, 15000); // Progress order state every 15s

      const timerInterval = setInterval(() => {
        setDeliveryTimer((prev) => (prev > 1 ? prev - 1 : 1));
      }, 60000); // Decrease timer mins sequentially

      return () => {
        clearInterval(stateInterval);
        clearInterval(timerInterval);
      };
    }
  }, [step]);

  const handleCompleteOrderSession = () => {
    onClearCart();
    setStep('customer');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-neutral-200 shadow-2xl flex flex-col max-h-[92vh] text-left">
        
        {/* Header visual cues */}
        <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-red-650" />
            <h3 className="font-extrabold text-neutral-900 text-lg">
              {step === 'confirmed' ? 'Receipt & Courier Tracker' : 'Frictionless Gateway Checkout'}
            </h3>
          </div>
          {step !== 'confirmed' && step !== 'processing' && step !== 'otp' && (
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-900 p-1 bg-neutral-50 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP-BY-STEP CONTENTS */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Progress stepper indicators */}
          {step !== 'confirmed' && (
            <div className="flex items-center space-x-2 pb-2">
              <div className={`flex-1 h-1 rounded-sm ${step === 'customer' ? 'bg-red-600' : 'bg-neutral-200'}`}></div>
              <div className={`flex-1 h-1 rounded-sm ${step === 'payment' ? 'bg-red-600' : 'bg-neutral-200'}`}></div>
              <div className={`flex-1 h-1 rounded-sm ${step === 'processing' || step === 'otp' ? 'bg-red-600' : 'bg-neutral-200'}`}></div>
            </div>
          )}

          {validationError && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-xs font-bold leading-normal">
              ⚠️ {validationError}
            </div>
          )}

          {/* STEP 1: CUSTOMER DETAILS */}
          {step === 'customer' && (
            <form onSubmit={validateCustomerStep} className="space-y-4">
              <div className="text-sm font-sans font-black uppercase text-neutral-400 tracking-wider">
                1. Delivery &amp; Contact Info
              </div>
              
              <div className="flex bg-neutral-100 p-1 rounded-xl mb-4 gap-1">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg cursor-pointer ${
                    deliveryMethod === 'delivery' ? 'bg-white text-red-650 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  🚀 Home Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg cursor-pointer ${
                    deliveryMethod === 'pickup' ? 'bg-white text-red-650 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  🛍️ Express Pickup
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 block leading-none">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block leading-none">WhatsApp / Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 054 231 9283"
                      className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block leading-none">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@gamil.com"
                      className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800"
                    />
                  </div>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block leading-none">Compound Address / Landmark</label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House No., Street Name, and nearest Landmark (e.g. East Legon, opposite Shell station)"
                      rows={3}
                      className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800 focus:outline-hidden"
                    ></textarea>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50/50 border border-red-500/20 text-xs text-red-700 rounded-xl leading-relaxed font-semibold">
                    🏪 Express pickup selected! Your order will be cooked hot at: <br />
                    <strong className="text-sm font-bold block mt-1">📍 {selectedStore ? selectedStore.name : 'KFC Osu Oxford Street'}</strong>
                  </div>
                )}
              </div>

              {/* Order total info display inside step */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] text-neutral-450 uppercase font-black leading-none">Final Payment Due</span>
                  <p className="font-extrabold font-mono text-lg text-neutral-900 mt-1">GH₵ {totals.finalTotal.toFixed(2)}</p>
                </div>
                
                <button
                  type="submit"
                  className="bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs uppercase py-3 px-6 rounded-xl cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  <span>Select Payment Method</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setStep('customer')} 
                  className="p-1 hover:bg-neutral-100 rounded-full text-neutral-550"
                  aria-label="Back to Customer details"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="text-sm font-sans font-black uppercase text-neutral-400 tracking-wider">
                  2. Select Payment System
                </div>
              </div>

              {/* Toggle MOMO vs Card */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('momo')}
                  className={`py-3.5 px-4 rounded-xl border-2 font-black uppercase text-xs text-center cursor-pointer transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-red-600 bg-red-50/15 text-neutral-900'
                      : 'border-neutral-200 text-neutral-500'
                  }`}
                >
                  📲 Mobile Money (MoMo)
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3.5 px-4 rounded-xl border-2 font-black uppercase text-xs text-center cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-red-600 bg-red-50/15 text-neutral-900'
                      : 'border-neutral-200 text-neutral-500'
                  }`}
                >
                  💳 Debit / Credit Card
                </button>
              </div>

              {/* Payment content */}
              {paymentMethod === 'momo' ? (
                <div className="space-y-4 text-left">
                  {/* MoMo Provider lists */}
                  <div className="grid grid-cols-3 gap-2">
                    {(['mtn', 'telecel', 'at'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setMomoProvider(p)}
                        className={`p-2.5 rounded-lg border text-xs font-bold uppercase text-center cursor-pointer transition-all ${
                          momoProvider === p
                            ? 'bg-amber-100 border-amber-500 text-neutral-900'
                            : 'bg-white border-neutral-250 text-neutral-600'
                        }`}
                      >
                        {p === 'mtn' ? 'MTN MoMo 🟡' : p === 'telecel' ? 'Telecel 🔴' : 'AT Cash 🔵'}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block leading-none">Registered MoMo Wallet Number</label>
                    <input
                      type="tel"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      placeholder="e.g. 024 XXX XXXX"
                      className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800"
                    />
                  </div>

                  <p className="text-[10px] text-neutral-500 leading-normal font-mono">
                    * Interactive Note: Ensure you have your phone handy! A simulated secure push prompt will ask you to confirm a secure billing code.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block leading-none">Card Holder Name</label>
                    <input
                      type="text"
                      placeholder="Kwame Mensah"
                      className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block leading-none">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block leading-none">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800 text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block leading-none">CVV Code</label>
                      <input
                        type="text"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        placeholder="123"
                        className="w-full bg-neutral-50 border border-neutral-250 py-2.5 px-3 rounded-xl text-sm text-neutral-800 text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary prices and Pay action */}
              <div className="bg-neutral-50 p-5 rounded-3xl border border-neutral-150 space-y-3.5">
                <div className="text-xs font-medium space-y-1.5 text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-neutral-900 font-bold">GH₵ {totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Discount:</span>
                      <span className="font-mono">- GH₵ {totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Hot Delivery Charge:</span>
                    <span className="font-mono">{totals.deliveryFee === 0 ? 'FREE' : `GH₵ ${totals.deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-neutral-200/60 pt-2 flex justify-between font-black text-sm text-neutral-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-lg text-neutral-950">GH₵ {totals.finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full bg-red-600 hover:bg-red-700 active:scale-97 text-white font-black uppercase text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Authorize secure billing of GH₵ {totals.finalTotal.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSACTION PROCESSING SPINNER */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-5">
              <Loader2 className="w-12 h-12 text-red-650 animate-spin mx-auto" />
              <div>
                <h4 className="font-extrabold text-neutral-800 text-base">Securing MoMo API Handshake...</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">Please do not refresh nor minimize this tab! Encrypting payment tokens in Accra nodes.</p>
              </div>
            </div>
          )}

          {/* STEP 4: INTERACTIVE MOBILE MONEY PIN DIALOG POPUP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-900 text-base uppercase">Simulated MoMo USSD push</h4>
                  <p className="text-xs text-neutral-550 max-w-xs mx-auto">
                    A secure prompt was sent to your phone! To confirm this simulation fee, input your MoMo passcode pin <strong className="text-neutral-900 font-mono text-sm bg-neutral-100 px-1 py-0.5 rounded">1234</strong> below.
                  </p>
                </div>
              </div>

              {otpError && (
                <div className="bg-red-50 text-red-700 p-2.5 rounded-lg border border-red-200 text-xs font-bold text-center">
                  ⚠️ {otpError}
                </div>
              )}

              <div className="space-y-2 max-w-xs mx-auto text-center">
                <label className="text-xs font-bold text-neutral-500 block leading-none uppercase">Enter 4-Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="••••"
                  className="w-36 text-center bg-neutral-50 border-2 border-neutral-300 py-3 rounded-xl font-bold font-mono tracking-widest text-2xl text-neutral-800 focus:outline-hidden focus:border-red-500 transition-all focus:bg-white"
                />
              </div>

              <div className="flex gap-2.5 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs uppercase py-3.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs uppercase py-3.5 rounded-xl cursor-pointer shadow-md shadow-green-100"
                >
                  Confirm payment
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: RECEIPT & LIVE ORDER COURIER TRACKER */}
          {step === 'confirmed' && (
            <div className="space-y-6 text-center text-neutral-800">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-scale-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="text-center space-y-1">
                <span className="text-[10px] text-green-600 uppercase font-black leading-none bg-green-50 px-2 py-0.5 rounded">Order Approved &amp; Paid 🟢</span>
                <h3 className="font-black text-xl text-neutral-900 tracking-tight leading-none mt-1">Finger Lickin' Goodness Incoming!</h3>
                <p className="text-xs text-neutral-550 max-w-sm mx-auto pt-1">
                  Medaase, {name}! Your order has been registered at {selectedStore ? selectedStore.name : 'KFC Osu Oxford Street'}. A receipt summary is in your WhatsApp.
                </p>
              </div>

              {/* Live Progress Tracker bar */}
              <div className="bg-neutral-50 p-5 rounded-3xl border border-neutral-150 text-left space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-neutral-100">
                  <div>
                    <span className="text-[9px] uppercase text-neutral-400 font-black block leading-none">Your Order ID</span>
                    <strong className="font-mono text-sm uppercase text-neutral-900 inline-block mt-0.5">{orderId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-neutral-400 font-black block leading-none">Est. Arrival Mins</span>
                    <strong className="font-mono text-red-600 text-sm inline-block mt-0.5">{deliveryTimer} Minutes remaining</strong>
                  </div>
                </div>

                {/* Progress Node bars */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-3 text-xs leading-none">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      orderState === 'received' || orderState === 'cooking' || orderState === 'delivering' || orderState === 'arrived'
                        ? 'bg-red-600 text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}>1</div>
                    <div className="flex-1">
                      <p className="font-extrabold text-neutral-900 select-all">Order Sent &amp; Paid (Approved)</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">MoMo verification finished successfully.</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs leading-none">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      orderState === 'cooking' || orderState === 'delivering' || orderState === 'arrived'
                        ? 'bg-red-600 text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}>2</div>
                    <div className="flex-1">
                      <p className="font-extrabold text-neutral-900">In the KFC Kitchen (Preparing)</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Chicken is seasoning in our 11 secret herbs &amp; spices.</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs leading-none">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      orderState === 'delivering' || orderState === 'arrived'
                        ? 'bg-red-600 text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}>3</div>
                    <div className="flex-1">
                      <p className="font-extrabold text-neutral-900">Out with KFC Dispatch Rider</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Rider is riding hot to your compound.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty accumulation card */}
              <div className="bg-yellow-400 p-4 rounded-2xl flex items-center space-x-3.5 text-left text-neutral-950">
                <Sparkles className="w-5 h-5 text-neutral-950 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-xs uppercase">Colonel Rewards Accumulated</h4>
                  <p className="text-[11px] text-neutral-900/80 leading-snug mt-0.5">Your membership wallet has been credited with **{Math.round(totals.finalTotal)}** rewards points! Free bites are near.</p>
                </div>
              </div>

              {/* Close session button */}
              <button
                type="button"
                onClick={handleCompleteOrderSession}
                className="w-full bg-neutral-900 hover:bg-black text-white py-3.5 rounded-xl font-bold uppercase text-xs"
              >
                Close Tracking &amp; Clear Bag
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
