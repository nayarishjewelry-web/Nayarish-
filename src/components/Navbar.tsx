import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, User, X, Menu, ArrowRight } from 'lucide-react';
import { PageView, BrandSettings } from '../types';
import { useToast } from './Toast';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  cartCount: number;
  openCartDrawer: () => void;
  onSearchSubmit: (query: string) => void;
  userEmail?: string;
  brandSettings: BrandSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  openCartDrawer,
  onSearchSubmit,
  userEmail,
  brandSettings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Focus mobile input automatically when mobile search opens
  useEffect(() => {
    if (isSearchOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;

    // Secret Admin Gate Trigger: ONLY triggered by typing "admin"
    if (cleanQuery.toLowerCase() === 'admin') {
      const isAuthorizedAdmin = userEmail?.toLowerCase().trim() === 'nayarishjewelry@gmail.com';
      if (isAuthorizedAdmin) {
        showToast({
          type: 'luxury',
          title: 'Administrative Console Access Granted',
          message: 'Welcome, Administrator (nayarishjewelry@gmail.com).',
        });
        setCurrentPage('admin');
      } else {
        showToast({
          type: 'error',
          title: 'Administrative Access Denied',
          message: 'Administrative privileges are restricted exclusively to nayarishjewelry@gmail.com.',
        });
        if (!userEmail) {
          setCurrentPage('auth');
        }
      }
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      return;
    }

    // Standard product search
    onSearchSubmit(cleanQuery);
    setCurrentPage('shop');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleQuickSuggestion = (term: string) => {
    setSearchQuery(term);
    onSearchSubmit(term);
    setCurrentPage('shop');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0F172A]/95 backdrop-blur-md border-b border-purple-900/30 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-8">
          
          {/* Left: Mobile Hamburger + Dynamic Brand Wordmark / Logo Image */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-300 hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-slate-800/60 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Brand Logo / Name */}
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group"
            >
              {(brandSettings.logoMode === 'image' || brandSettings.logoMode === 'both') && brandSettings.logoImageUrl && (
                <img
                  src={brandSettings.logoImageUrl}
                  alt={brandSettings.brandName || 'Nayarish'}
                  style={{ height: `${brandSettings.logoHeight || 32}px` }}
                  className="max-h-12 w-auto object-contain rounded shrink-0 transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Graceful fallback if URL breaks
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              )}
              {(brandSettings.logoMode === 'text' || brandSettings.logoMode === 'both' || !brandSettings.logoImageUrl) && (
                <div className="flex flex-col justify-center">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-display font-medium tracking-[0.2em] sm:tracking-[0.25em] text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap leading-tight">
                    {brandSettings.brandName || 'NAYARISH'}
                  </span>
                  {brandSettings.tagline && (
                    <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block leading-none mt-0.5">
                      {brandSettings.tagline}
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>

          {/* Center: Desktop Navigation Links (No appointment/consultation links) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-medium tracking-[0.15em] uppercase text-slate-300">
            <button
              onClick={() => setCurrentPage('home')}
              className={`hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'home' ? 'text-[#D4AF37]' : ''
              }`}
            >
              Maison
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className={`hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'shop' ? 'text-[#D4AF37]' : ''
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => {
                setCurrentPage('home');
                setTimeout(() => {
                  const el = document.getElementById('bespoke-story');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Bespoke Heritage
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Fine Diamonds
            </button>
          </nav>

          {/* Right: Actions Cluster (Search, VIP Account, Bag) */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
            
            {/* Desktop Inline Search Bar (Hidden on Mobile) */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden sm:flex items-center"
            >
              <div
                className={`flex items-center transition-all duration-300 ${
                  isSearchOpen ? 'w-56 lg:w-64' : 'w-9'
                } overflow-hidden rounded-full border border-purple-900/40 bg-slate-900/80 focus-within:border-[#D4AF37]/70 focus-within:w-56 lg:focus-within:w-64`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (!isSearchOpen) {
                      setTimeout(() => desktopInputRef.current?.focus(), 50);
                    }
                  }}
                  className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-[#D4AF37] transition-colors shrink-0 cursor-pointer"
                  aria-label="Toggle search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  ref={desktopInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewels..."
                  className="w-full bg-transparent py-1.5 pr-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && isSearchOpen && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="pr-2.5 text-slate-400 hover:text-slate-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-slate-300 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-slate-800/60 cursor-pointer"
              aria-label="Open mobile search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Profile / Account */}
            <button
              onClick={() => setCurrentPage('auth')}
              className={`p-2 rounded-full border border-purple-900/40 text-slate-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors cursor-pointer relative ${
                currentPage === 'auth' ? 'border-[#D4AF37] text-[#D4AF37]' : ''
              }`}
              title={userEmail ? `Account: ${userEmail}` : 'Sign In / Account'}
              aria-label="Account"
            >
              <User className="w-4 h-4" />
              {userEmail && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
              )}
            </button>

            {/* Shopping Bag Button with Counter */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#3B0764] to-[#2E1065] border border-[#D4AF37]/40 text-slate-100 hover:border-[#D4AF37] hover:gold-glow transition-all duration-200 cursor-pointer"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D4AF37]" />
              <span className="text-xs font-semibold tabular-nums text-amber-200">
                {cartCount}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Full-Width Search Dropdown Overlay */}
        {isSearchOpen && (
          <div className="sm:hidden border-t border-purple-900/40 bg-[#0F172A]/98 backdrop-blur-xl px-4 py-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="space-y-2.5">
              <div className="relative flex items-center bg-slate-900/90 border border-[#D4AF37]/60 rounded-xl overflow-hidden shadow-inner">
                <div className="pl-3 text-[#D4AF37] shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewels in catalog..."
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-slate-400 hover:text-slate-100"
                    aria-label="Clear query"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3.5 py-2.5 bg-[#3B0764] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider shrink-0 hover:bg-[#2E1065] border-l border-purple-900/40"
                >
                  Search
                </button>
              </div>

              {/* Mobile Quick Keywords */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none text-slate-400">
                <span className="shrink-0 text-slate-500">Popular:</span>
                <button
                  type="button"
                  onClick={() => handleQuickSuggestion('Rings')}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  Rings
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuggestion('Necklaces')}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  Necklaces
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuggestion('Diamonds')}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  Diamonds
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuggestion('Bracelets')}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  Bracelets
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-auto text-slate-500 hover:text-slate-300 text-xs shrink-0 px-1"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer (Completely clean of admin links) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-[#0F172A] border-r border-purple-900/50 h-full flex flex-col z-10 p-6 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                {(brandSettings.logoMode === 'image' || brandSettings.logoMode === 'both') && brandSettings.logoImageUrl && (
                  <img
                    src={brandSettings.logoImageUrl}
                    alt={brandSettings.brandName || 'Nayarish'}
                    style={{ height: `${Math.min(32, brandSettings.logoHeight || 32)}px` }}
                    className="max-h-8 w-auto object-contain rounded"
                  />
                )}
                {(brandSettings.logoMode === 'text' || brandSettings.logoMode === 'both' || !brandSettings.logoImageUrl) && (
                  <div>
                    <span className="text-lg font-display font-medium tracking-[0.2em] text-slate-100 block leading-tight">
                      {brandSettings.brandName || 'NAYARISH'}
                    </span>
                    {brandSettings.tagline && (
                      <span className="text-[8px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block mt-0.5">
                        {brandSettings.tagline}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-4 text-sm font-medium tracking-wider uppercase text-slate-300">
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  currentPage === 'home' ? 'bg-[#3B0764]/50 text-[#D4AF37]' : 'hover:bg-slate-900'
                }`}
              >
                <span>Maison Home</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => {
                  setCurrentPage('shop');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  currentPage === 'shop' ? 'bg-[#3B0764]/50 text-[#D4AF37]' : 'hover:bg-slate-900'
                }`}
              >
                <span>Collections</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('bespoke-story')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between hover:bg-slate-900"
              >
                <span>Bespoke Heritage</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => {
                  setCurrentPage('auth');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  currentPage === 'auth' ? 'bg-[#3B0764]/50 text-[#D4AF37]' : 'hover:bg-slate-900'
                }`}
              >
                <span>VIP Patron Vault</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </nav>

            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500 text-center">
              Maison Nayarish Haute Joaillerie
            </div>
          </div>
        </div>
      )}
    </>
  );
};
