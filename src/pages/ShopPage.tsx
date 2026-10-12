import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ShoppingBag, Eye, X, Zap } from 'lucide-react';
import { Product, PageView, CategoryItem } from '../types';
import { formatINR } from '../utils/currency';
import { useToast } from '../components/Toast';

interface ShopPageProps {
  products: Product[];
  categories: CategoryItem[];
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  setCurrentPage: (page: PageView) => void;
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  onSelectProduct,
  onQuickAddToCart,
  onBuyNow,
  initialSearchQuery = '',
  onClearInitialSearch,
}) => {
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // Category list with 'All'
  const categoryNames = useMemo(() => {
    return ['All', ...categories.map((c) => c.name)];
  }, [categories]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (p.price > maxPrice) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchMaterials = p.materials.some((m) => m.toLowerCase().includes(q));
          if (!matchTitle && !matchCategory && !matchDesc && !matchMaterials) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, maxPrice, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onQuickAddToCart(product);
    showToast({
      type: 'luxury',
      title: 'Added to Bag',
      message: `${product.title} placed in your collection bag.`,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(1000000);
    setSearchQuery('');
    setSortBy('featured');
    if (onClearInitialSearch) onClearInitialSearch();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            The Haute Joaillerie Catalog
          </span>
          <h1 className="text-3xl lg:text-4xl font-display font-medium text-slate-100 mt-2 mb-3">
            Rare Diamonds & Sovereign Gold
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
            Every piece is uniquely cast and hand-set using conflict-free natural diamonds and 18-karat royal gold. Cash on Delivery available across India.
          </p>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="bg-[#141E33] border border-purple-900/30 rounded-2xl p-6 mb-10 shadow-xl space-y-6">
          
          {/* Category Tabs (Dynamic) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#3B0764] text-[#D4AF37] border-[#D4AF37] gold-glow'
                    : 'bg-slate-900/70 text-slate-300 border-slate-700/80 hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub-Filters: Search, Price Slider, Sort dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 border-t border-slate-800">
            
            {/* Search Input (5 cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search jewels, carat, or metal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-10 pr-9 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Slider in INR (4 cols) */}
            <div className="md:col-span-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Max Price Ceiling</span>
                </span>
                <span className="tabular-nums font-semibold text-[#D4AF37]">
                  {formatINR(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={1000000}
                step={25000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sort Dropdown (3 cols) */}
            <div className="md:col-span-3">
              <div className="relative">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="featured">Sort: Curated & Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Acquisition: Newest First</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active Filter Chips summary */}
          {(selectedCategory !== 'All' || maxPrice < 1000000 || searchQuery) && (
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <span>Active Filters:</span>
              {selectedCategory !== 'All' && <span>Category: {selectedCategory} ·</span>}
              {maxPrice < 1000000 && <span>Max: {formatINR(maxPrice)} ·</span>}
              {searchQuery && <span>Keyword: "{searchQuery}" ·</span>}
              <button
                onClick={handleResetFilters}
                className="text-[#D4AF37] hover:underline cursor-pointer ml-1"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6 text-xs text-slate-400">
          <span>Showing <strong className="text-slate-100 tabular-nums">{filteredProducts.length}</strong> master jewelry pieces</span>
          <span className="text-emerald-400 font-medium">Free Armored Courier & Cash on Delivery</span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#141E33] border border-slate-800 rounded-2xl p-16 text-center max-w-lg mx-auto">
            <h3 className="text-lg font-display text-slate-200 mb-2">No Matching Jewels Found</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              No pieces match your exact criteria. Adjust the price ceiling or search term to discover available acquisitions.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-lg bg-[#3B0764] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider hover:bg-[#2E1065] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#141E33] border border-slate-800/80 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col shadow-lg hover:shadow-2xl hover:gold-glow"
              >
                {/* Product Image (Click to PDP) */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#0F172A]/85 backdrop-blur-md text-[10px] font-semibold tracking-widest uppercase text-slate-200 border border-slate-700/60">
                      {product.category}
                    </span>
                    {product.stockStatus === 'Limited Edition' && (
                      <span className="px-2 py-0.5 rounded bg-[#3B0764]/90 text-[10px] font-semibold text-[#D4AF37] border border-[#D4AF37]/40">
                        Limited
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-[10px] text-emerald-300 font-semibold border border-emerald-800">
                      COD
                    </span>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
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

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-base font-display font-medium text-slate-100 group-hover:text-[#D4AF37] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Card Bottom: Price and Buy Now & Add to Cart Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold tabular-nums text-[#D4AF37]">
                        {formatINR(product.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {product.stockStatus}
                      </span>
                    </div>

                    {/* Dual Action Buttons: Buy Now & Add to Cart */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onBuyNow(product, 1)}
                        className="py-2.5 px-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all gold-glow cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Buy Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="py-2.5 px-2 rounded-lg bg-[#3B0764] hover:bg-[#2E1065] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
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
        )}

      </div>
    </div>
  );
};
