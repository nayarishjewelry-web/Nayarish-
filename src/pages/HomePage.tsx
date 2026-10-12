import React from 'react';
import { ArrowRight, Sparkles, Shield, Award, Gem, ShoppingBag, Zap } from 'lucide-react';
import { Product, PageView } from '../types';
import { jewelryImages } from '../assets/images';
import { formatINR } from '../utils/currency';
import { useToast } from '../components/Toast';

interface HomePageProps {
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  setCurrentPage: (page: PageView) => void;
  onSelectCategory: (cat: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  featuredProducts,
  onSelectProduct,
  setCurrentPage,
  onSelectCategory,
  onAddToCart,
  onBuyNow,
}) => {
  const { showToast } = useToast();

  const collections = [
    {
      name: 'Rings',
      subtitle: 'Solitaire, Crown & Pavé Bands',
      image: jewelryImages.solitaireRing,
      count: '14 Archival Pieces',
    },
    {
      name: 'Necklaces',
      subtitle: 'Byzantine Collars & Cascades',
      image: jewelryImages.goldChoker,
      count: '9 Masterworks',
    },
    {
      name: 'Bracelets',
      subtitle: 'Baguette Tennis & Serpentina',
      image: jewelryImages.tennisBracelet,
      count: '11 Kinetic Designs',
    },
    {
      name: 'Diamonds',
      subtitle: 'GIA Flawless Centerstones',
      image: jewelryImages.heroBanner,
      count: '8 Certified Rarities',
    },
  ];

  const testimonials = [
    {
      quote:
        'The Byzantine Pavé Choker is simply extraordinary. Under gala lights, the scintillation of the pavé setting is unmatched by any contemporary house. Nayarish is true high jewelry.',
      author: 'Ananya Singhania',
      role: 'Private Art & Jewelry Connoisseur',
      location: 'Altamount Road, Mumbai',
      piece: 'Sovereign Byzantine Pavé Choker',
    },
    {
      quote:
        'Acquiring an emerald-cut solitaire ring via Cash on Delivery was seamless. The armored security courier presented the tamper-evident sealed vault box with GIA documentation.',
      author: 'Rohit Mehta',
      role: 'Fine Gem Collector',
      location: 'Lutyens, New Delhi',
      piece: 'The Empress Crown Solitaire Ring',
    },
    {
      quote:
        'The white-glove armored handover at our residence was impeccable. Every document, wax seal, and velvet vault box exudes absolute luxury.',
      author: 'Dr. Radhika Sen',
      role: 'Private Collector',
      location: 'Alipore, Kolkata',
      piece: 'Astral Baguette Diamond Bracelet',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={jewelryImages.heroBanner}
            alt="Maison Nayarish High Jewelry"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,7,100,0.35)_0%,transparent_75%)] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 w-full">
          <div className="max-w-2xl">
            
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Joaillerie · Mumbai & Geneva</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-slate-100 tracking-tight leading-[1.1] mb-6">
              Eternal Radiance.<br />
              <span className="gold-shimmer">Archival Mastery.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl mb-10 font-light">
              Maison Nayarish creates timeless high jewelry heirlooms sculpted from 18-karat sovereign gold and rare GIA-certified flawless diamonds. Delivered via insured armored courier with Cash on Delivery available.
            </p>

            {/* CTAs: Direct shopping and collection exploration */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all gold-glow cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Shop The Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('featured-creations');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-xl bg-[#0F172A]/80 hover:bg-[#3B0764]/60 text-slate-200 hover:text-[#D4AF37] border border-purple-900/60 hover:border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Acquisitions</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="mt-12 pt-8 border-t border-purple-950/80 flex items-center gap-8 text-xs text-slate-400">
              <div>
                <span className="block font-bold text-slate-200">COD Available</span>
                <span className="text-[11px] text-slate-500">Armored Handover</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="block font-bold text-slate-200 tabular-nums">140+ hrs</span>
                <span className="text-[11px] text-slate-500">Hand-Chiseled</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="block font-bold text-slate-200">BIS Hallmarked</span>
                <span className="text-[11px] text-slate-500">100% Certified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Collections Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Curated Categories
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-medium text-slate-100 mt-2 mb-3">
            Haute Joaillerie Collections
          </h2>
          <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
            Discover our permanent collections, each sculpted to amplify the natural scintillation of exceptional gemstones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div
              key={col.name}
              onClick={() => {
                onSelectCategory(col.name);
                setCurrentPage('shop');
              }}
              className="group relative rounded-2xl overflow-hidden bg-[#141E33] border border-purple-900/30 hover:border-[#D4AF37]/60 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl hover:gold-glow"
            >
              <div className="aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-slate-950">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                  {col.count}
                </span>
                <h3 className="text-xl font-display font-medium text-slate-100 group-hover:text-[#D4AF37] transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {col.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#D4AF37] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Masterpiece Spotlight Showcase with Buy Now & Add to Cart (Replaces "View Creation") */}
      <section id="featured-creations" className="py-20 bg-gradient-to-b from-[#0F172A] via-[#140E24]/60 to-[#0F172A] border-y border-purple-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Signature Acquisitions
              </span>
              <h2 className="text-3xl lg:text-4xl font-display font-medium text-slate-100 mt-2">
                Pieces of the Season
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs uppercase tracking-widest text-[#D4AF37] hover:underline flex items-center gap-1.5 self-start md:self-auto cursor-pointer font-semibold"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-[#141E33] border border-slate-800 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group flex flex-col shadow-lg hover:gold-glow"
              >
                {/* Product image (Click to view full detail) */}
                <div
                  onClick={() => onSelectProduct(item)}
                  className="aspect-[4/3] bg-slate-950 overflow-hidden relative cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded bg-[#0F172A]/85 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/30">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onSelectProduct(item)}
                      className="text-base font-display font-medium text-slate-100 hover:text-[#D4AF37] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold tabular-nums text-[#D4AF37]">
                        {formatINR(item.price)}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Cash on Delivery Eligible
                      </span>
                    </div>

                    {/* Direct "Buy Now" and "Add to Cart" Actions (Replacing View Creation) */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onBuyNow) {
                            onBuyNow(item, 1);
                          } else {
                            onSelectProduct(item);
                          }
                        }}
                        className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all gold-glow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Buy Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onAddToCart) {
                            onAddToCart(item, 1);
                            showToast({
                              type: 'luxury',
                              title: 'Added to Bag',
                              message: `${item.title} added to collection bag.`,
                            });
                          } else {
                            onSelectProduct(item);
                          }
                        }}
                        className="py-2.5 px-3 rounded-lg bg-[#3B0764] hover:bg-[#2E1065] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Story & Craftsmanship */}
      <section id="bespoke-story" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-purple-900/40 shadow-2xl relative">
              <img
                src={jewelryImages.goldChoker}
                alt="Nayarish High Jewelry Craft"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
            </div>
            
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:right-6 bg-[#0F172A]/95 border border-[#D4AF37]/50 rounded-xl p-5 shadow-2xl backdrop-blur-md max-w-xs gold-border-glow">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#3B0764] text-[#D4AF37]">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-100 uppercase tracking-wider">Altamount Road Atelier</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Four decades of uninterrupted royal gold and gemological mastery.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              The Maison Heritage
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-medium text-slate-100 leading-tight">
              Where Imperial Artistry Meets Precision Gemology
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Founded on the belief that jewelry is an immortal vessel of human emotion, Maison Nayarish unites historic royal goldsmithing techniques with modern microscopic gemstone setting.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every creation begins with hand-selected rough crystals. Under the discerning eye of our master lapidaries, stones are oriented to maximize light dispersion before being set into custom-alloyed 18-karat gold and pure 950 platinum.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Ethical Provenance</h4>
                  <p className="text-[11px] text-slate-400 mt-1">100% Kimberley Process certified, conflict-free natural diamonds.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">BIS Hallmarked</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Certified by the Bureau of Indian Standards & international gem laboratories.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Quantitative Proof & Testimonials */}
      <section className="py-24 bg-[#090D17] border-t border-purple-950/60 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Patron Testimonials
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-medium text-slate-100 mt-2 mb-3">
              Words From Private Collectors
            </h2>
            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
              Discreet appraisals and cherished commissions from esteemed patrons and jewelry connoisseurs across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#141E33]/60 border border-slate-800/80 rounded-2xl p-8 flex flex-col justify-between shadow-xl relative"
              >
                <div>
                  <div className="text-amber-300 flex gap-1 mb-4">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-100">{t.author}</p>
                  <p className="text-[11px] text-[#D4AF37] mt-0.5">{t.role}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                    <span>{t.location}</span>
                    <span>·</span>
                    <span>{t.piece}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
