import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Package, Layers, Image as ImageIcon, BarChart3, Plus, Trash2, 
  Edit3, ArrowLeft, RefreshCw, X, Sparkles, DollarSign, Banknote, CheckCircle2,
  Upload, RotateCcw, Eye, Smartphone, Monitor, Check
} from 'lucide-react';
import { Product, Order, PageView, BrandSettings, CategoryItem } from '../types';
import { NayarishStore } from '../services/store';
import { jewelryImages } from '../assets/images';
import { formatINR } from '../utils/currency';
import { useToast } from '../components/Toast';

interface AdminPageProps {
  products: Product[];
  categories: CategoryItem[];
  orders: Order[];
  brandSettings: BrandSettings;
  setCurrentPage: (page: PageView) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  categories,
  orders,
  brandSettings,
  setCurrentPage,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'branding' | 'analytics'>('products');

  // Product Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState<number>(185000);
  const [newCategory, setNewCategory] = useState<string>(categories[0]?.name || 'Rings');
  const [newImageUrl, setNewImageUrl] = useState(jewelryImages.solitaireRing);
  const [newStock, setNewStock] = useState<number>(3);
  const [newDescription, setNewDescription] = useState('');
  const [newMaterials, setNewMaterials] = useState('18K Royal Gold, VVS1 Natural Diamonds');
  const [newCaratWeight, setNewCaratWeight] = useState('3.5 ct');

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Branding Settings Form State & File Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [brandForm, setBrandForm] = useState<BrandSettings>({
    logoMode: brandSettings?.logoMode || 'text',
    brandName: brandSettings?.brandName || 'NAYARISH',
    tagline: brandSettings?.tagline || '',
    logoImageUrl: brandSettings?.logoImageUrl || '',
    logoHeight: brandSettings?.logoHeight || 32,
  });

  // Sync form when brandSettings prop updates
  useEffect(() => {
    if (brandSettings) {
      setBrandForm({
        logoMode: brandSettings.logoMode || 'text',
        brandName: brandSettings.brandName || 'NAYARISH',
        tagline: brandSettings.tagline || '',
        logoImageUrl: brandSettings.logoImageUrl || '',
        logoHeight: brandSettings.logoHeight || 32,
      });
    }
  }, [brandSettings]);

  // Handlers for Products
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newPrice <= 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a valid title and price in INR.',
      });
      return;
    }

    try {
      NayarishStore.addProduct({
        title: newTitle.trim(),
        price: Number(newPrice),
        category: newCategory,
        imageUrl: newImageUrl,
        description: newDescription.trim() || 'Exquisite high jewelry handcrafted at Maison Nayarish.',
        stockStatus: newStock > 0 ? 'In Stock' : 'Sold Out',
        stock: Number(newStock),
        materials: newMaterials.split(',').map((m) => m.trim()),
        caratWeight: newCaratWeight.trim(),
        variants: {
          metalTypes: ['18K Royal Yellow Gold', 'PT950 Platinum', '18K Rose Gold'],
          sizes: newCategory.toLowerCase().includes('ring') ? ['Size 12', 'Size 14', 'Size 16', 'Size 18'] : undefined,
        },
        specs: {
          origin: 'Maison Nayarish Atelier',
          craftsmanship: 'Hand-sculpted cold chisel setting (140+ hrs)',
          certification: 'GIA Laboratory Dossier & BIS Hallmark',
        },
        featured: false,
      });

      setIsAddModalOpen(false);
      setNewTitle('');
      setNewPrice(185000);
      setNewDescription('');
      showToast({
        type: 'luxury',
        title: 'Masterpiece Added',
        message: `${newTitle} registered in the active boutique catalog.`,
      });
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Failed to add item',
        message: 'Check fields and try again.',
      });
    }
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    NayarishStore.updateProduct(editingProduct.id, {
      title: editingProduct.title,
      price: Number(editingProduct.price),
      category: editingProduct.category,
      stock: Number(editingProduct.stock),
      stockStatus: editingProduct.stock > 0 ? editingProduct.stockStatus : 'Sold Out',
      description: editingProduct.description,
      caratWeight: editingProduct.caratWeight,
    });

    setEditingProduct(null);
    showToast({
      type: 'success',
      title: 'Item Updated',
      message: 'Catalog specifications synchronized successfully.',
    });
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (confirm(`Are you certain you wish to de-register "${title}" from the catalog?`)) {
      NayarishStore.deleteProduct(id);
      showToast({
        type: 'info',
        title: 'Piece Removed',
        message: `${title} was removed from the active catalog.`,
      });
    }
  };

  const handleResetCatalog = () => {
    if (confirm('Reset entire catalog back to curated default master pieces?')) {
      NayarishStore.resetProducts();
      showToast({
        type: 'luxury',
        title: 'Catalog Restored',
        message: 'Default archival creations re-seeded.',
      });
    }
  };

  // Handlers for Categories
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    NayarishStore.addCategory(newCategoryName, newCategoryDesc);
    setNewCategoryName('');
    setNewCategoryDesc('');
    showToast({
      type: 'luxury',
      title: 'Category Created',
      message: `Category "${newCategoryName}" is now available in catalog filters.`,
    });
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    NayarishStore.updateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
    });
    setEditingCategory(null);
    showToast({
      type: 'success',
      title: 'Category Updated',
      message: 'Category specifications updated.',
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Existing pieces in this category will remain.`)) {
      NayarishStore.deleteCategory(id);
      showToast({
        type: 'info',
        title: 'Category Deleted',
        message: `Category "${name}" removed from navigation.`,
      });
    }
  };

  // Handlers for Branding / Logo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        type: 'error',
        title: 'Unsupported File Format',
        message: 'Please choose an image file (PNG, JPG, SVG, WebP).',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please select an image smaller than 2MB for optimal header performance.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBrandForm((prev) => ({
          ...prev,
          logoImageUrl: result,
          logoMode: prev.logoMode === 'text' ? 'both' : prev.logoMode,
        }));
        showToast({
          type: 'luxury',
          title: 'Logo Image Loaded',
          message: `${file.name} ready. Review the preview and click Save to deploy.`,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLive = () => {
    NayarishStore.updateBrandSettings(brandForm);
    showToast({
      type: 'luxury',
      title: 'Applied Live to Storefront',
      message: 'Header branding is now active across all storefront views.',
    });
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    NayarishStore.updateBrandSettings(brandForm);
    showToast({
      type: 'luxury',
      title: 'Header Branding Saved & Deployed',
      message: 'Header logo and brand settings synchronized to database.',
    });
  };

  const handleResetBranding = () => {
    if (confirm('Restore default Maison Nayarish header wordmark?')) {
      const reset = NayarishStore.resetBrandSettings();
      setBrandForm(reset);
      showToast({
        type: 'info',
        title: 'Branding Restored',
        message: 'Default header wordmark restored.',
      });
    }
  };

  // Analytics
  const totalGrossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const codOrdersCount = orders.filter((o) => o.paymentMethod === 'COD').length;
  const cardOrdersCount = orders.filter((o) => o.paymentMethod === 'CARD').length;
  const lowStockItems = products.filter((p) => p.stock <= 2);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="bg-[#141E33] border border-[#D4AF37]/40 rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl gold-border-glow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#3B0764] to-[#D4AF37] p-0.5 shrink-0">
              <div className="w-full h-full rounded-xl bg-[#0F172A] flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Maison Nayarish · Private Operations & Vault Console
              </span>
              <h1 className="text-2xl font-display font-medium text-slate-100 mt-1">
                Vault Administration & Brand Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('shop')}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit to Storefront</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`pb-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'branding'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Header Logo & Brand</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Orders & Analytics ({orders.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PRODUCT MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-medium text-slate-100">
                  Active Haute Joaillerie Catalog
                </h2>
                <p className="text-xs text-slate-400">
                  Manage master jewelry pieces in Indian Rupees (INR - ₹), adjust vault stocks, or register new acquisitions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetCatalog}
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Seed</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all gold-glow cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Piece</span>
                </button>
              </div>
            </div>

            <div className="bg-[#141E33] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Creation</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (INR)</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-purple-900/30 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-100 truncate max-w-xs">{p.title}</p>
                              <p className="text-[11px] text-slate-500">{p.materials.slice(0, 2).join(' · ')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-300 font-medium">{p.category}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#D4AF37] tabular-nums">
                          {formatINR(p.price)}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums">
                          <span className={`font-semibold ${p.stock <= 2 ? 'text-amber-400' : 'text-slate-200'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                              p.stockStatus === 'In Stock'
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                                : p.stockStatus === 'Limited Edition'
                                ? 'bg-purple-950/60 text-amber-300 border-purple-800'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            {p.stockStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800 rounded transition-colors"
                              title="Edit specifications"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                              title="Delete from catalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CATEGORY MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-medium text-slate-100">
                  Category Classification Management
                </h2>
                <p className="text-xs text-slate-400">
                  Add, update, or remove jewelry collections. Changes immediately update storefront category tabs.
                </p>
              </div>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="bg-[#141E33] border border-purple-900/30 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5">
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                  New Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brooches, Tiaras, Pendants"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="md:col-span-5">
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                  Description / Kicker
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Imperial Brooches & Pins"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all gold-glow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </div>
            </form>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-[#141E33] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-purple-900/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-display font-medium text-slate-100">
                          {cat.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-[#3B0764] text-[10px] font-semibold text-[#D4AF37]">
                          {count} pieces
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {cat.description || 'Curated high jewelry collection.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800 rounded transition-colors"
                        title="Edit category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MAISON BRANDING & HEADER LOGO */}
        {/* ======================================================== */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-medium text-slate-100 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                  <span>Dynamic Header Logo & Maison Identity</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload custom logo images, select royal vector crests, or customize typography with real-time viewport simulation.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleResetBranding}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Reset to default brand wordmark"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyLive}
                  className="px-3.5 py-2 rounded-lg bg-[#3B0764] hover:bg-[#2E1065] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Live</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Settings Form (7 cols) */}
              <form onSubmit={handleSaveBranding} className="lg:col-span-7 bg-[#141E33] border border-purple-900/30 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6">
                
                {/* 1. Presentation Mode */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2 font-semibold flex items-center justify-between">
                    <span>Header Logo Presentation Mode</span>
                    <span className="text-[11px] text-[#D4AF37] font-normal normal-case">
                      {brandForm.logoMode === 'text' ? 'Wordmark only' : brandForm.logoMode === 'image' ? 'Image emblem only' : 'Combined crest & typography'}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    {(['text', 'image', 'both'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setBrandForm({ ...brandForm, logoMode: mode })}
                        className={`py-3 px-2 sm:px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer text-center ${
                          brandForm.logoMode === mode
                            ? 'bg-[#3B0764] text-[#D4AF37] border-[#D4AF37] gold-glow ring-1 ring-[#D4AF37]/50'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                        }`}
                      >
                        {mode === 'text' ? 'Wordmark Text' : mode === 'image' ? 'Logo Image' : 'Both (Crest + Text)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Brand Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                      Brand Name / Wordmark
                    </label>
                    <input
                      type="text"
                      required
                      value={brandForm.brandName}
                      onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                      placeholder="NAYARISH"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 font-serif tracking-widest focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                      Optional Maison Tagline
                    </label>
                    <input
                      type="text"
                      value={brandForm.tagline || ''}
                      onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                      placeholder="HAUTE JOAILLERIE · MUMBAI"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 uppercase tracking-wider text-[11px] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 3. Dynamic Logo Image Source (Upload, Presets, or URL) */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                      Logo Image Asset
                    </label>
                    {brandForm.logoImageUrl && (
                      <button
                        type="button"
                        onClick={() => setBrandForm({ ...brandForm, logoImageUrl: '', logoMode: 'text' })}
                        className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  {/* Direct File Upload Trigger */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3.5 rounded-xl border border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-slate-900/80 hover:bg-[#3B0764]/30 text-slate-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-xs font-semibold group"
                    >
                      <Upload className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                      <span>Upload Logo from Device</span>
                    </button>

                    <div className="flex items-center">
                      <input
                        type="url"
                        value={brandForm.logoImageUrl}
                        onChange={(e) => setBrandForm({ ...brandForm, logoImageUrl: e.target.value, logoMode: brandForm.logoMode === 'text' ? 'both' : brandForm.logoMode })}
                        placeholder="Or paste image URL (PNG, SVG)..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Curated Royal Jewelry Emblem Presets */}
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-medium">
                      Select From Maison Haute Joaillerie Emblems:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setBrandForm({
                          ...brandForm,
                          logoImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23D4AF37"><polygon points="15,75 85,75 95,35 68,55 50,22 32,55 5,35"/><circle cx="5" cy="30" r="4"/><circle cx="50" cy="18" r="5"/><circle cx="95" cy="30" r="4"/><circle cx="32" cy="52" r="3.5"/><circle cx="68" cy="52" r="3.5"/><rect x="20" y="80" width="60" height="6" rx="3"/></svg>',
                          logoMode: brandForm.logoMode === 'text' ? 'both' : brandForm.logoMode,
                        })}
                        className="p-2 bg-slate-900/90 border border-slate-700 hover:border-[#D4AF37] rounded-lg text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="text-base">👑</span>
                        <span className="truncate">Imperial Tiara</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBrandForm({
                          ...brandForm,
                          logoImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23D4AF37" stroke-width="5"><polygon points="50,15 85,38 72,85 28,85 15,38" fill="%233B0764" fill-opacity="0.5"/><polygon points="50,15 85,38 50,85 15,38"/><line x1="15" y1="38" x2="85" y2="38"/><line x1="50" y1="15" x2="50" y2="85"/></svg>',
                          logoMode: brandForm.logoMode === 'text' ? 'both' : brandForm.logoMode,
                        })}
                        className="p-2 bg-slate-900/90 border border-slate-700 hover:border-[#D4AF37] rounded-lg text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="text-base">💎</span>
                        <span className="truncate">Solitaire Crest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBrandForm({
                          ...brandForm,
                          logoImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23D4AF37"><circle cx="50" cy="50" r="44" stroke="%23D4AF37" stroke-width="4" fill="%232E1065"/><text x="50" y="62" font-family="serif" font-size="38" font-weight="bold" text-anchor="middle" fill="%23D4AF37">N</text></svg>',
                          logoMode: brandForm.logoMode === 'text' ? 'both' : brandForm.logoMode,
                        })}
                        className="p-2 bg-slate-900/90 border border-slate-700 hover:border-[#D4AF37] rounded-lg text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="text-base">⚜️</span>
                        <span className="truncate">Maison Seal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBrandForm({
                          ...brandForm,
                          logoImageUrl: jewelryImages.solitaireRing,
                          logoMode: brandForm.logoMode === 'text' ? 'both' : brandForm.logoMode,
                        })}
                        className="p-2 bg-slate-900/90 border border-slate-700 hover:border-[#D4AF37] rounded-lg text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="text-base">💍</span>
                        <span className="truncate">Diamond Ring</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBrandForm({
                          ...brandForm,
                          logoImageUrl: jewelryImages.goldChoker,
                          logoMode: brandForm.logoMode === 'text' ? 'both' : brandForm.logoMode,
                        })}
                        className="p-2 bg-slate-900/90 border border-slate-700 hover:border-[#D4AF37] rounded-lg text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="text-base">📿</span>
                        <span className="truncate">Byzantine Collar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBrandForm({
                          ...brandForm,
                          logoImageUrl: jewelryImages.heritageEarrings,
                          logoMode: brandForm.logoMode === 'text' ? 'both' : brandForm.logoMode,
                        })}
                        className="p-2 bg-slate-900/90 border border-slate-700 hover:border-[#D4AF37] rounded-lg text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="text-base">✨</span>
                        <span className="truncate">Imperial Drops</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Dimension & Height Slider */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="uppercase tracking-wider text-slate-300 font-semibold">
                      Logo Display Height
                    </label>
                    <span className="font-mono text-[#D4AF37] font-bold text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {brandForm.logoHeight}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={64}
                    value={brandForm.logoHeight}
                    onChange={(e) => setBrandForm({ ...brandForm, logoHeight: Number(e.target.value) })}
                    className="w-full accent-[#D4AF37] h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>20px (Compact)</span>
                    <span>32px (Default)</span>
                    <span>48px (Grand)</span>
                    <span>64px (Hero)</span>
                  </div>
                </div>

                {/* 5. Submit Button */}
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs uppercase tracking-[0.15em] hover:brightness-110 transition-all gold-glow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Deploy Branding to Cloud</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveBranding({ preventDefault: () => {} } as any);
                      setCurrentPage('home');
                    }}
                    className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Save and switch to homepage to see live header"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span>View Storefront</span>
                  </button>
                </div>
              </form>

              {/* Live Preview Panel (5 cols) */}
              <div className="lg:col-span-5 bg-[#141E33] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Real-Time Header Simulation</span>
                  </h3>

                  {/* Device Switcher */}
                  <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        previewDevice === 'desktop' ? 'bg-[#3B0764] text-[#D4AF37]' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Desktop View"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        previewDevice === 'mobile' ? 'bg-[#3B0764] text-[#D4AF37]' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Header Container (Dynamically resizes based on selected device) */}
                <div className={`mx-auto transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'}`}>
                  
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 flex justify-between font-mono">
                    <span>{previewDevice === 'mobile' ? 'Mobile Header (375px)' : 'Desktop Header'}</span>
                    <span className="text-[#D4AF37]">Live preview</span>
                  </div>

                  <div className="bg-[#0F172A] rounded-xl border border-purple-900/60 p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-3">
                    
                    {/* Brand Left Section */}
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      {(brandForm.logoMode === 'image' || brandForm.logoMode === 'both') && brandForm.logoImageUrl ? (
                        <img
                          src={brandForm.logoImageUrl}
                          alt="Logo Preview"
                          style={{ height: `${previewDevice === 'mobile' ? Math.min(32, brandForm.logoHeight) : brandForm.logoHeight}px` }}
                          className="max-h-14 w-auto object-contain rounded"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}

                      {(brandForm.logoMode === 'text' || brandForm.logoMode === 'both' || !brandForm.logoImageUrl) && (
                        <div className="flex flex-col">
                          <span className={`${previewDevice === 'mobile' ? 'text-base' : 'text-xl'} font-display font-medium tracking-[0.2em] text-[#F8FAFC] leading-tight`}>
                            {brandForm.brandName || 'NAYARISH'}
                          </span>
                          {brandForm.tagline && (
                            <span className="text-[8px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold mt-0.5 leading-none">
                              {brandForm.tagline}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Nav Items (Visible on desktop simulation) */}
                    {previewDevice === 'desktop' && (
                      <div className="hidden sm:flex items-center gap-3 text-[10px] uppercase tracking-wider text-slate-400">
                        <span className="text-[#D4AF37]">Maison</span>
                        <span>Collections</span>
                        <span>Bespoke</span>
                      </div>
                    )}

                    {/* Right Cluster */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-purple-900/40 flex items-center justify-center text-slate-400 text-[10px]">
                        🔍
                      </div>
                      <div className="px-2 py-1 rounded-full bg-gradient-to-r from-[#3B0764] to-[#2E1065] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-semibold">
                        🛍️ 0
                      </div>
                    </div>

                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Dynamic Real-Time Sync:</strong> Edits propagate instantaneously to the application header across all routes.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Device Responsive:</strong> Scaled automatically for mobile drawer and desktop top-bar navigation.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Cloud & Local Persistence:</strong> Stored securely in Firestore (<code className="text-[#D4AF37]">/settings/branding</code>) and browser local storage.</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ORDERS & ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#141E33] border border-purple-900/40 rounded-2xl p-6 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="uppercase tracking-wider">Gross Acquired Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold tabular-nums text-[#D4AF37]">
                  {formatINR(totalGrossRevenue)}
                </p>
                <p className="text-[11px] text-slate-500">From {totalOrdersCount} settled purchase orders</p>
              </div>

              <div className="bg-[#141E33] border border-purple-900/40 rounded-2xl p-6 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="uppercase tracking-wider">Cash on Delivery (COD)</span>
                  <Banknote className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold tabular-nums text-emerald-300">
                  {codOrdersCount} Orders
                </p>
                <p className="text-[11px] text-slate-500">Pending courier handover at doorstep</p>
              </div>

              <div className="bg-[#141E33] border border-purple-900/40 rounded-2xl p-6 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="uppercase tracking-wider">Card Pre-Paid Orders</span>
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold tabular-nums text-slate-100">
                  {cardOrdersCount} Orders
                </p>
                <p className="text-[11px] text-slate-500">Authorized online via vault</p>
              </div>

              <div className="bg-[#141E33] border border-purple-900/40 rounded-2xl p-6 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="uppercase tracking-wider">Low Stock Warnings</span>
                  <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold tabular-nums text-rose-300">
                  {lowStockItems.length}
                </p>
                <p className="text-[11px] text-slate-500">Reserves ≤ 2 units remaining</p>
              </div>

            </div>

            {/* Recent Orders Log */}
            <div className="bg-[#141E33] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 pb-3 border-b border-slate-800">
                Recent Orders ({orders.length})
              </h3>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No orders lodged yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{o.id}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300">{o.customerName}</span>
                          <span className="text-slate-500">·</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${o.paymentMethod === 'COD' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                            {o.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Pre-Paid Card'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {o.items.length} piece(s) · Tracking: {o.trackingNumber} · {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="font-mono font-bold text-[#D4AF37] text-sm tabular-nums">
                          {formatINR(o.total)}
                        </span>
                        <span className="block text-[10px] uppercase font-semibold text-emerald-400 mt-0.5">
                          {o.orderStatus} · {o.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ADD PRODUCT MODAL */}
        {/* ======================================================== */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141E33] border border-[#D4AF37]/50 rounded-2xl max-w-xl w-full p-6 lg:p-8 shadow-2xl gold-border-glow max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-lg font-display text-slate-100">Add New Masterpiece</h3>
                  <p className="text-xs text-slate-400">Register a new high jewelry creation in INR (₹).</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase text-slate-400 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Royal Sapphire Cascade Necklace"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase text-slate-400 mb-1">Price (INR - ₹) *</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-400 mb-1">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase text-slate-400 mb-1">Vault Stock Count *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-400 mb-1">Carat Weight</label>
                    <input
                      type="text"
                      value={newCaratWeight}
                      onChange={(e) => setNewCaratWeight(e.target.value)}
                      placeholder="e.g. 5.2 ct"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Image Preset / URL *</label>
                  <select
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 mb-2"
                  >
                    <option value={jewelryImages.heroBanner}>Archival Diamond Collar (Generated 16:9)</option>
                    <option value={jewelryImages.solitaireRing}>Emerald Solitaire Ring (Generated 4:3)</option>
                    <option value={jewelryImages.goldChoker}>Sovereign Gold Choker (Generated 4:3)</option>
                    <option value={jewelryImages.tennisBracelet}>Baguette Tennis Bracelet (Generated 4:3)</option>
                    <option value={jewelryImages.heritageEarrings}>Tanzanite Chandelier Earrings (Generated 4:3)</option>
                  </select>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or enter custom image URL"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-400 text-[11px]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Materials Specification</label>
                  <input
                    type="text"
                    value={newMaterials}
                    onChange={(e) => setNewMaterials(e.target.value)}
                    placeholder="18K Royal Gold, VVS1 Natural Diamonds"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe craftsmanship, provenance, and stone cut..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold uppercase tracking-wider hover:brightness-110"
                  >
                    Save Masterpiece
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EDIT PRODUCT MODAL */}
        {/* ======================================================== */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141E33] border border-[#D4AF37]/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl gold-border-glow">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-base font-display text-slate-100">Edit {editingProduct.title}</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase text-slate-400 mb-1">Price (INR - ₹)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-400 mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider hover:brightness-110"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EDIT CATEGORY MODAL */}
        {/* ======================================================== */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141E33] border border-[#D4AF37]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl gold-border-glow">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-base font-display text-slate-100">Edit Category</h3>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="p-1 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase text-slate-400 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider hover:brightness-110"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
