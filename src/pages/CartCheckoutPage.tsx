import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Sparkles, CheckCircle2, Package, Tag, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, PageView, ShippingAddress, UserProfile, Order, PaymentMethodType } from '../types';
import { NayarishStore } from '../services/store';
import { formatINR } from '../utils/currency';
import { useToast } from '../components/Toast';

interface CartCheckoutPageProps {
  cart: CartItem[];
  currentUser: UserProfile | null;
  onClearCart: () => void;
  setCurrentPage: (page: PageView) => void;
}

export const CartCheckoutPage: React.FC<CartCheckoutPageProps> = ({
  cart,
  currentUser,
  onClearCart,
  setCurrentPage,
}) => {
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('COD');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: currentUser?.displayName || currentUser?.address?.fullName || '',
    street: currentUser?.address?.street || '',
    apartment: currentUser?.address?.apartment || '',
    city: currentUser?.address?.city || 'Mumbai',
    state: currentUser?.address?.state || 'Maharashtra',
    zip: currentUser?.address?.zip || '400026',
    country: currentUser?.address?.country || 'India',
  });

  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+91 98200 44912');

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [activeCoupon, setActiveCoupon] = useState<string>('');

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [cardholderName, setCardholderName] = useState(currentUser?.displayName || 'Ananya Singhania');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'ROYAL10') {
      setAppliedDiscount(0.10);
      setActiveCoupon('ROYAL10');
      showToast({
        type: 'luxury',
        title: 'VIP Privilege Applied',
        message: '10% Royal Heritage reduction credited to your order.',
      });
    } else if (clean === 'NAYARISH20') {
      setAppliedDiscount(0.20);
      setActiveCoupon('NAYARISH20');
      showToast({
        type: 'luxury',
        title: 'Maison Patron Reduction',
        message: '20% Private Collector discount applied.',
      });
    } else {
      showToast({
        type: 'error',
        title: 'Invalid Privilege Code',
        message: 'Please try ROYAL10 or NAYARISH20 for preview testing.',
      });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast({
        type: 'error',
        title: 'Empty Bag',
        message: 'Please select a jewelry creation before placing an order.',
      });
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !customerEmail || !customerPhone) {
      showToast({
        type: 'error',
        title: 'Incomplete Delivery Coordinates',
        message: 'Please provide full name, mobile phone number, street, and city for dispatch.',
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const newOrder = NayarishStore.createOrder({
          userId: currentUser?.uid,
          customerName: shippingAddress.fullName,
          email: customerEmail,
          phone: customerPhone,
          items: cart.map(item => ({
            productId: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            selectedMetal: item.selectedMetal,
            selectedSize: item.selectedSize,
            imageUrl: item.product.imageUrl,
          })),
          subtotal,
          discount: discountAmount,
          couponCode: activeCoupon || undefined,
          shippingFee: 0,
          total,
          shippingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'Pending Handover' : 'Paid',
          orderStatus: 'Confirmed',
        });

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#3B0764', '#F59E0B', '#F8FAFC'],
          });
        } catch (e) {
          // ignore
        }

        onClearCart();
        setCompletedOrder(newOrder);
        showToast({
          type: 'luxury',
          title: paymentMethod === 'COD' ? 'Order Confirmed · Cash on Delivery' : 'Purchase Confirmed',
          message: `Order #${newOrder.id} logged. Armored courier dispatched with white-glove security.`,
        });
      } catch (err) {
        showToast({
          type: 'error',
          title: 'Order Processing Failed',
          message: 'An error occurred during order dispatch.',
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1200);
  };

  // Order Confirmation Screen
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-16 px-6">
        <div className="max-w-3xl mx-auto bg-[#141E33] border border-purple-900/40 rounded-2xl p-8 lg:p-12 shadow-2xl gold-border-glow animate-in fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Maison Nayarish · Acquisition Confirmed
            </span>
            <h1 className="text-3xl font-display font-medium text-slate-100 mt-2 mb-3">
              Thank You for Your Patronage
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your high jewelry creation has entered our atelier preparation and armored logistics dispatch.
            </p>
          </div>

          {/* Order Details card */}
          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800 space-y-4 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pb-4 border-b border-slate-800">
              <div>
                <p className="text-slate-500 uppercase tracking-wider">Order Reference</p>
                <p className="font-semibold text-slate-100 mt-0.5">{completedOrder.id}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-wider">Armored Tracking</p>
                <p className="font-mono text-[#D4AF37] font-semibold mt-0.5">{completedOrder.trackingNumber}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-wider">Total Amount</p>
                <p className="font-semibold tabular-nums text-slate-100 mt-0.5">{formatINR(completedOrder.total)}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-wider">Payment Term</p>
                <span className={`inline-block mt-0.5 text-xs font-semibold ${completedOrder.paymentMethod === 'COD' ? 'text-amber-300' : 'text-emerald-400'}`}>
                  {completedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (₹ Due at Door)' : 'Paid Online'}
                </span>
              </div>
            </div>

            {/* COD Handover Notice */}
            {completedOrder.paymentMethod === 'COD' && (
              <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-3">
                <Banknote className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Cash on Delivery Handover Instructions</p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">
                    Please keep <strong>{formatINR(completedOrder.total)}</strong> ready for the armored security courier at time of delivery. You may inspect the tamper-evident wax seal before cash/demand handover.
                  </p>
                </div>
              </div>
            )}

            {/* Items summary */}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-3">Acquired Creations</p>
              <div className="space-y-3">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover border border-purple-900/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 truncate">{item.title}</p>
                      <p className="text-slate-400 text-[11px]">
                        {item.selectedMetal} {item.selectedSize ? `· Size ${item.selectedSize}` : ''} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="tabular-nums font-semibold text-[#D4AF37]">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="pt-4 border-t border-slate-800 text-xs">
              <p className="text-slate-500 uppercase tracking-wider mb-1">Destined Recipient Address</p>
              <p className="text-slate-200">
                {completedOrder.shippingAddress.fullName} · {completedOrder.phone}<br />
                {completedOrder.shippingAddress.street} {completedOrder.shippingAddress.apartment && `, ${completedOrder.shippingAddress.apartment}`}<br />
                {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.zip}, {completedOrder.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('auth')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider hover:bg-[#2E1065] transition-colors cursor-pointer"
            >
              View in VIP Order Vault
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Continue Exploring Collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If bag is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#141E33] border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <Package className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-display text-slate-100 mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Please browse our collections and add a piece before proceeding to the checkout chamber.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
          >
            Explore Masterpieces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation link */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Collections</span>
          </button>
          <h1 className="text-3xl font-display font-medium text-slate-100 mt-3">
            Maison Nayarish Checkout
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure high-value transaction chamber · Dispatched with white-glove armored security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Delivery Coordinates & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Contact & Delivery Address */}
            <div className="bg-[#141E33] border border-purple-900/30 rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                  1. Recipient Coordinates & Verification
                </h3>
                <span className="text-xs text-slate-400">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    placeholder="e.g. Ananya Singhania"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                    Mobile Phone (For Armored Handover) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98200 44912"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                    Notification Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="patron@domain.com"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                    Country *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="India"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                    Street Address & Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    placeholder="e.g. 42 Altamount Road, Penthouse"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      placeholder="400026"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Chamber with Cash on Delivery (COD) Implementation */}
            <div className="bg-[#141E33] border border-purple-900/30 rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                    2. Select Payment Settlement Method
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Step 2 of 2</span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                
                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#D4AF37] bg-[#3B0764]/40 gold-glow'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-semibold text-xs text-slate-100 uppercase tracking-wider">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'COD' ? 'border-[#D4AF37]' : 'border-slate-600'}`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Pay upon physical armored handover. Inspect sealed vault box before payment.
                  </p>
                  <span className="inline-block mt-2 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Zero Pre-payment · 100% Secure
                  </span>
                </div>

                {/* Encrypted Card Option */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-[#D4AF37] bg-[#3B0764]/40 gold-glow'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      <span className="font-semibold text-xs text-slate-100 uppercase tracking-wider">
                        Vault Card Payment
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-[#D4AF37]' : 'border-slate-600'}`}>
                      {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Immediate encrypted payment via Mastercard, Visa, or RuPay credit card.
                  </p>
                  <span className="inline-block mt-2 text-[10px] uppercase font-medium text-slate-400">
                    256-Bit TLS Protected
                  </span>
                </div>

              </div>

              {/* Conditional Payment Details */}
              {paymentMethod === 'COD' ? (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cash on Delivery Verification Covenant</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                    <li>Our concierge will place a verification call to <strong>{customerPhone}</strong> prior to armored dispatch.</li>
                    <li>Security couriers carry digital receipt and accept Cash, Demand Draft, or instant UPI at the doorstep.</li>
                    <li>Tamper-evident serial seal is verified in your presence prior to cash exchange.</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        maxLength={4}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Placement CTA */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all gold-glow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {paymentMethod === 'COD' ? <Banknote className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>
                    {isProcessing
                      ? 'Processing Acquisition...'
                      : paymentMethod === 'COD'
                      ? `Confirm Cash on Delivery (${formatINR(total)})`
                      : `Authorize & Pay ${formatINR(total)}`}
                  </span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2.5">
                  Includes full transit insurance, tamper-evident sealed packaging, and BIS Hallmarking guarantee.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Order Breakdown & Coupon (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Items Summary */}
            <div className="bg-[#141E33] border border-purple-900/30 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-200 pb-3 border-b border-slate-800">
                Order Breakdown ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0 border border-purple-900/40"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-slate-200 truncate">{item.product.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.selectedMetal} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Qty: <span className="text-slate-200 font-semibold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold tabular-nums text-[#D4AF37]">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privilege Promo Code */}
              <div className="pt-4 border-t border-slate-800">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Privilege Code (try ROYAL10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs uppercase text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3B0764] hover:bg-[#2E1065] text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </form>
                {activeCoupon && (
                  <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Coupon <strong>{activeCoupon}</strong> applied ({(appliedDiscount * 100)}% off)</span>
                  </p>
                )}
              </div>

              {/* Price Calculation Matrix in INR */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-slate-200">{formatINR(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Privilege Reduction</span>
                    <span className="tabular-nums">-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Armored Security Courier</span>
                  <span className="text-emerald-400 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Velvet Presentation Vault Box</span>
                  <span className="text-[#D4AF37] font-medium">Included</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-slate-100 pt-3 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="tabular-nums text-xl font-bold text-[#D4AF37]">
                    {formatINR(total)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Payment Mode: <strong className="text-amber-200">{paymentMethod === 'COD' ? 'Cash on Delivery (Pay at Handover)' : 'Encrypted Card'}</strong>
                </div>
              </div>
            </div>

            {/* Guarantee Callout */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-amber-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>The Nayarish Sovereign Covenant</span>
              </div>
              <p className="leading-relaxed">
                Every piece is authenticated by our master gemologist before leaving the vault. Handover is executed via armored courier directly to the recipient with proof of identity.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
