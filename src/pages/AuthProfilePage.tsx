import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, MapPin, Package, LogOut, Sparkles, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { UserProfile, Order, ShippingAddress, PageView } from '../types';
import { NayarishStore } from '../services/store';
import { formatINR } from '../utils/currency';
import { useToast } from '../components/Toast';

interface AuthProfilePageProps {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  orders: Order[];
  setCurrentPage: (page: PageView) => void;
}

export const AuthProfilePage: React.FC<AuthProfilePageProps> = ({
  currentUser,
  setCurrentUser,
  orders,
  setCurrentPage,
}) => {
  const { showToast } = useToast();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Editable address state
  const [address, setAddress] = useState<ShippingAddress>(
    currentUser?.address || {
      fullName: currentUser?.displayName || '',
      street: '',
      apartment: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400026',
      country: 'India',
    }
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Filter orders for current user
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.userId === currentUser.uid ||
          o.email.toLowerCase() === currentUser.email.toLowerCase()
      )
    : [];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please provide both email and password credentials.',
      });
      return;
    }

    try {
      const user = await NayarishStore.signInWithEmail(email, password);
      setCurrentUser(user);
      showToast({
        type: 'luxury',
        title: 'Welcome Back',
        message: `Signed in as ${user.displayName || user.email}`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err?.message || 'Check your credentials and try again.',
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast({
        type: 'error',
        title: 'Registration Incomplete',
        message: 'Please enter a valid email and password.',
      });
      return;
    }

    try {
      const user = await NayarishStore.signUpWithEmail(email, password, name);
      setCurrentUser(user);
      showToast({
        type: 'luxury',
        title: 'Account Created',
        message: 'Your Nayarish account is active.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: err?.message || 'Unable to register account.',
      });
    }
  };

  const handleSignOut = async () => {
    await NayarishStore.signOut();
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have securely signed out of your account.',
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = NayarishStore.updateUserProfile({ address });
    if (updated) {
      setCurrentUser(updated);
      setIsEditingAddress(false);
      showToast({
        type: 'success',
        title: 'Coordinates Updated',
        message: 'Saved delivery destination updated.',
      });
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await NayarishStore.signInWithGoogle();
      setCurrentUser(user);
      const isAdmin = user.email.toLowerCase().trim() === 'nayarishjewelry@gmail.com';
      showToast({
        type: 'luxury',
        title: isAdmin ? 'Administrator Signed In' : 'Welcome',
        message: isAdmin 
          ? 'Authenticated with administrator privileges (nayarishjewelry@gmail.com).' 
          : `Signed in as ${user.displayName || user.email}`,
      });
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        showToast({
          type: 'error',
          title: 'Google Sign-In Failed',
          message: err?.message || 'Unable to authenticate with Google.',
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // If user is NOT logged in: Show Standard Auth Forms
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-16 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#141E33] border border-purple-900/40 rounded-2xl p-8 lg:p-10 shadow-2xl gold-border-glow">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#3B0764] border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-3 text-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Maison Nayarish
            </span>
            <h1 className="text-2xl font-display font-medium text-slate-100 mt-1">
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {authMode === 'signin' 
                ? 'Sign in to access your orders, saved addresses, and profile.' 
                : 'Create an account to track orders and save your delivery details.'}
            </p>
          </div>

          {/* Standard Mode Switch Tabs: Sign In / Sign Up */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                authMode === 'signin'
                  ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                authMode === 'signup'
                  ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all gold-glow cursor-pointer"
            >
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#141E33] px-3 text-[10px] tracking-widest text-slate-400">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-[#D4AF37]/60 text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign In with Google'}</span>
          </button>

        </div>
      </div>
    );
  }

  // If user IS logged in: Show VIP Profile & Order History
  return (
    <div className="min-h-screen bg-[#0F172A] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Profile Banner */}
        <div className="bg-[#141E33] border border-purple-900/40 rounded-2xl p-6 lg:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 gold-border-glow">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3B0764] to-[#D4AF37] p-0.5 shrink-0">
              <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-[#D4AF37] text-xl font-display font-bold">
                {currentUser.displayName ? currentUser.displayName[0] : 'V'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-display font-medium text-slate-100">
                  {currentUser.displayName || 'VIP Patron'}
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#3B0764] text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/40">
                  {currentUser.email?.toLowerCase().trim() === 'nayarishjewelry@gmail.com' ? 'Administrator' : 'Client'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Saved Address & Personal Details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#141E33] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Saved Delivery Coordinates</span>
                </h3>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                >
                  {isEditingAddress ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Street</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Zip Code</label>
                      <input
                        type="text"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Country</label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 py-2 bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/50 rounded font-semibold uppercase tracking-wider hover:bg-[#2E1065] cursor-pointer"
                  >
                    Save Coordinates
                  </button>
                </form>
              ) : (
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-100">{currentUser.address?.fullName || currentUser.displayName}</p>
                  <p>{currentUser.address?.street || 'No street on file'}</p>
                  {currentUser.address?.apartment && <p>{currentUser.address?.apartment}</p>}
                  <p>
                    {currentUser.address?.city && `${currentUser.address.city}, `}
                    {currentUser.address?.state && `${currentUser.address.state} `}
                    {currentUser.address?.zip}
                  </p>
                  <p className="text-slate-400">{currentUser.address?.country}</p>
                </div>
              )}
            </div>

            {/* Cash on Delivery & Armored Transit Guarantee */}
            <div className="bg-gradient-to-br from-[#1E1136] to-[#0F172A] border border-purple-900/40 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Armored Handover & COD Covenant</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All acquisitions dispatched via insured armored transport. Inspect the tamper-evident sealed presentation box before completing Cash on Delivery settlement.
              </p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="w-full py-2.5 rounded-lg bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-wider hover:bg-[#2E1065] transition-colors cursor-pointer"
              >
                Acquire New Creations
              </button>
            </div>
          </div>

          {/* Right Column: Order History & Acquisitions (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141E33] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-200 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#D4AF37]" />
                    <span>Your Acquisition History</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {userOrders.length} confirmed purchase order(s)
                  </p>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-300">No Orders in Vault Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                    When you acquire high-jewelry creations, their lifetime certificates and dispatch tracking will appear here.
                  </p>
                  <button
                    onClick={() => setCurrentPage('shop')}
                    className="px-6 py-2.5 rounded-lg bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider hover:bg-[#2E1065] transition-colors cursor-pointer"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors"
                    >
                      {/* Top Bar of Order */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 text-xs">
                        <div>
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Reference</span>
                          <p className="font-semibold text-slate-200 mt-0.5">{order.id}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Date Lodged</span>
                          <p className="text-slate-300 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Armored Tracking</span>
                          <p className="font-mono text-[#D4AF37] font-semibold mt-0.5">{order.trackingNumber}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Status</span>
                          <span className="block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/40">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
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

                      {/* Order Total & Payment Method */}
                      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                        <span className="text-slate-400">
                          Mode: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
                        </span>
                        <span className="text-sm font-bold tabular-nums text-slate-100">
                          {formatINR(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
