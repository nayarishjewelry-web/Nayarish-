import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Zap, Shield, Award, Sparkles, Check } from 'lucide-react';
import { Product, PageView } from '../types';
import { formatINR } from '../utils/currency';
import { useToast } from '../components/Toast';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, selectedMetal: string, selectedSize?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedMetal: string, selectedSize?: string) => void;
  setCurrentPage: (page: PageView) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  setCurrentPage,
  onSelectProduct,
  allProducts,
}) => {
  const { showToast } = useToast();

  const [selectedMetal, setSelectedMetal] = useState<string>(
    product.variants.metalTypes[0] || '18K Royal Yellow Gold'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants.sizes ? product.variants.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);

  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [product.imageUrl];

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedMetal, selectedSize || undefined);
    showToast({
      type: 'luxury',
      title: 'Added to Collection Bag',
      message: `${quantity}x ${product.title} (${selectedMetal})`,
    });
  };

  const handleBuy = () => {
    onBuyNow(product, quantity, selectedMetal, selectedSize || undefined);
  };

  const relatedPieces = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0F172A] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog / {product.category}</span>
          </button>
        </div>

        {/* Contiguous PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Gallery Module (Sticky Left, 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-purple-900/40 shadow-2xl group">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded bg-[#0F172A]/85 backdrop-blur-md text-[11px] font-semibold tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/40">
                  {product.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded bg-emerald-950/90 text-emerald-300 text-[11px] font-semibold tracking-wider border border-emerald-800">
                  Cash on Delivery Available
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img ? 'border-[#D4AF37] scale-105' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Gemological Specs Box below image */}
            <div className="bg-[#141E33] border border-slate-800/80 rounded-xl p-6 space-y-3 text-xs text-slate-300">
              <h4 className="font-display text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Gemological Pedigree & BIS Certification</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <p className="text-slate-500 uppercase tracking-wider text-[10px]">Atelier Origin</p>
                  <p className="text-slate-200 font-medium mt-0.5">{product.specs.origin}</p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase tracking-wider text-[10px]">Crafting Protocol</p>
                  <p className="text-slate-200 font-medium mt-0.5">{product.specs.craftsmanship}</p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase tracking-wider text-[10px]">Independent Dossier</p>
                  <p className="text-[#D4AF37] font-medium mt-0.5">{product.specs.certification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module (Sticky Right, 5 cols) */}
          <div className="lg:col-span-5 bg-[#141E33] border border-purple-900/40 rounded-2xl p-8 shadow-2xl gold-border-glow lg:sticky lg:top-28 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>Maison Nayarish</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                {product.caratWeight && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#D4AF37]">{product.caratWeight}</span>
                  </>
                )}
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-display font-medium text-slate-100 tracking-wide leading-tight">
                {product.title}
              </h1>

              {/* Price display in INR */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold font-sans tabular-nums text-[#D4AF37]">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs text-slate-400">All Taxes Included (GST)</span>
              </div>

              {/* Stock status */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span className="text-emerald-300 font-medium">{product.stockStatus}</span>
                <span className="text-slate-500">· Ready for Armored Dispatch</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300/90 leading-relaxed border-t border-b border-slate-800 py-4">
              {product.description}
            </p>

            {/* Metal Variant Selector */}
            {product.variants.metalTypes && product.variants.metalTypes.length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
                  Precious Metal Specification: <span className="text-slate-100 font-semibold">{selectedMetal}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.metalTypes.map((metal) => (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => setSelectedMetal(metal)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        selectedMetal === metal
                          ? 'bg-[#3B0764] text-[#D4AF37] border-[#D4AF37] gold-glow'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector if available */}
            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium">
                    Dimension / Size: <span className="text-slate-100 font-semibold">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Complimentary Resizing</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                        selectedSize === size
                          ? 'bg-[#3B0764] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
                Commission Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900/80">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-semibold tabular-nums text-slate-100">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-slate-400">
                  {product.stock} pieces currently held in vault
                </span>
              </div>
            </div>

            {/* Primary Action Buttons: Buy Now and Add to Cart */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleBuy}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all gold-glow cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Buy Now</span>
              </button>

              <button
                type="button"
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#3B0764] hover:bg-[#2E1065] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-[0.15em] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Haute Joaillerie Bag</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cash on Delivery & Insured Armored Courier Handover</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Individualized GIA Dossier & BIS Hallmark Seal</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Private 30-Day Inspection & Exchange Covenant</span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Creations Section */}
        {relatedPieces.length > 0 && (
          <div className="mt-24 pt-12 border-t border-slate-800">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">Complementary Works</span>
              <h3 className="text-2xl font-display font-medium text-slate-100 mt-1">
                More From The Nayarish Vault
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPieces.map((piece) => (
                <div
                  key={piece.id}
                  className="bg-[#141E33] border border-slate-800 hover:border-[#D4AF37]/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(piece);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="aspect-[4/3] bg-slate-950 overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={piece.imageUrl}
                      alt={piece.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                        {piece.category}
                      </span>
                      <h4
                        onClick={() => {
                          onSelectProduct(piece);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-sm font-semibold text-slate-100 group-hover:text-[#D4AF37] transition-colors truncate cursor-pointer"
                      >
                        {piece.title}
                      </h4>
                      <p className="text-xs font-semibold tabular-nums text-[#D4AF37] mt-2">
                        {formatINR(piece.price)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => onBuyNow(piece, 1, piece.variants.metalTypes[0] || '18K Royal Gold')}
                        className="py-1.5 px-2 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-[11px] font-bold rounded uppercase tracking-wider"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(piece, 1, piece.variants.metalTypes[0] || '18K Royal Gold');
                          showToast({
                            type: 'luxury',
                            title: 'Added to Bag',
                            message: `${piece.title} added to bag.`,
                          });
                        }}
                        className="py-1.5 px-2 bg-[#3B0764] text-[#D4AF37] text-[11px] font-semibold rounded uppercase tracking-wider border border-[#D4AF37]/40"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
