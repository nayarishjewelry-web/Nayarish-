import React from 'react';
import { PageView } from '../types';
import { Shield, Sparkles, Award } from 'lucide-react';
import { useToast } from './Toast';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { showToast } = useToast();
  return (
    <footer className="w-full bg-[#090D17] border-t border-purple-950/60 text-slate-400">
      {/* Trust & Guarantee Tier */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-[#3B0764]/40 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Armored Courier Handover</h4>
              <p className="text-xs text-slate-400 mt-1">Cash on Delivery & insured security transport across all Indian cities.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-[#3B0764]/40 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">BIS Hallmarked & GIA Certified</h4>
              <p className="text-xs text-slate-400 mt-1">Every gemstone and 18K gold creation carries government & international assay seals.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-[#3B0764]/40 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Lifetime Atelier Care</h4>
              <p className="text-xs text-slate-400 mt-1">Complimentary annual prong inspection, ultrasonic polishing, and resizing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <span className="text-2xl font-display font-medium tracking-[0.25em] text-slate-100 block mb-3">
              NAYARISH
            </span>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              Haute Joaillerie & High Gemological Artistry. Handcrafted using 100% ethically sourced precious metals and archival natural diamonds.
            </p>
            <div className="text-xs text-slate-500">
              Maison Flagship: Altamount Road, Mumbai<br />
              High Jewelry Atelier: Rue du Rhône, Geneva
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 mb-4">Collections</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Solitaire & Engagement Rings
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Sovereign Chokers & Collars
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Baguette Tennis Bracelets
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Rare Gemstone Chandeliers
                </button>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 mb-4">Patron Services</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('auth')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  VIP Collector Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('cart')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Order Tracking & Cash on Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Immediate Vault Acquisitions
                </button>
              </li>
              <li>
                <span className="text-slate-500">Bespoke Diamond Commissions</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-3">Maison Gazette</h5>
            <p className="text-xs text-slate-400 mb-3">Receive private previews of rare seasonal high-jewelry acquisitions.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Collector Email"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => {
                  showToast({
                    type: 'luxury',
                    title: 'Subscription Enrolled',
                    message: 'Thank you for subscribing to the Maison Nayarish Gazette.',
                  });
                }}
                className="px-4 py-2 bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg text-xs font-medium hover:bg-[#2E1065] transition-colors cursor-pointer shrink-0"
              >
                Join
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-3">
              Complimentary White-Glove Handover across India.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Maison Nayarish Haute Joaillerie Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Mumbai</span>
            <span>·</span>
            <span>New Delhi</span>
            <span>·</span>
            <span>Geneva</span>
            <span>·</span>
            <span>Paris</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
