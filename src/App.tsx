import React, { useState, useEffect } from 'react';
import { PageView, Product, ProductCategory, CartItem, UserProfile, Order, BrandSettings, CategoryItem } from './types';
import { NayarishStore, storeEvents } from './services/store';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { AuthProfilePage } from './pages/AuthProfilePage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(NayarishStore.getBrandSettings());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load and live event subscription
  useEffect(() => {
    setProducts(NayarishStore.getProducts());
    setCategories(NayarishStore.getCategories());
    setOrders(NayarishStore.getOrders());
    setBrandSettings(NayarishStore.getBrandSettings());
    setCurrentUser(NayarishStore.getCurrentUser());
    setCart(NayarishStore.getCart());

    // Initialize Firestore synchronization
    NayarishStore.initFirestoreSync();

    const unsubProducts = storeEvents.subscribe<Product[]>('products', (p) => setProducts(p));
    const unsubCategories = storeEvents.subscribe<CategoryItem[]>('categories', (c) => setCategories(c));
    const unsubOrders = storeEvents.subscribe<Order[]>('orders', (o) => setOrders(o));
    const unsubBrand = storeEvents.subscribe<BrandSettings>('brand', (b) => setBrandSettings(b));
    const unsubUser = storeEvents.subscribe<UserProfile | null>('user', (u) => setCurrentUser(u));
    const unsubCart = storeEvents.subscribe<CartItem[]>('cart', (c) => setCart(c));

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubBrand();
      unsubUser();
      unsubCart();
    };
  }, []);

  // Scroll to top on page transition
  const handlePageChange = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Product for PDP
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    handlePageChange('product-detail');
  };

  // Add to cart from PDP or Quick Add
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedMetal = '18K Royal Yellow Gold',
    selectedSize?: string
  ) => {
    NayarishStore.addToCart(product, quantity, selectedMetal, selectedSize);
    setIsCartDrawerOpen(true);
  };

  // Instant Buy Now
  const handleBuyNow = (
    product: Product,
    quantity = 1,
    selectedMetal = '18K Royal Yellow Gold',
    selectedSize?: string
  ) => {
    NayarishStore.addToCart(product, quantity, selectedMetal, selectedSize);
    handlePageChange('cart');
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    NayarishStore.updateCartQuantity(index, quantity);
  };

  // Select category from Home and navigate to Shop
  const handleSelectCategory = (cat: ProductCategory) => {
    setSearchQuery('');
    handlePageChange('shop');
  };

  // Handle Search submit from Top Bar
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    handlePageChange('shop');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FDE047]">
      {/* Top Bar Navigation (Adheres strictly to the 1-row 3-zone contract with responsive mobile search) */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        cartCount={totalCartCount}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
        onSearchSubmit={handleSearchSubmit}
        userEmail={currentUser?.email}
        brandSettings={brandSettings}
      />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            featuredProducts={products}
            onSelectProduct={handleSelectProduct}
            setCurrentPage={handlePageChange}
            onSelectCategory={handleSelectCategory}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            products={products}
            categories={categories}
            onSelectProduct={handleSelectProduct}
            onQuickAddToCart={(p) => handleAddToCart(p, 1)}
            onBuyNow={handleBuyNow}
            setCurrentPage={handlePageChange}
            initialSearchQuery={searchQuery}
            onClearInitialSearch={() => setSearchQuery('')}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            setCurrentPage={handlePageChange}
            onSelectProduct={handleSelectProduct}
            allProducts={products}
          />
        )}

        {currentPage === 'cart' && (
          <CartCheckoutPage
            cart={cart}
            currentUser={currentUser}
            onClearCart={() => NayarishStore.clearCart()}
            setCurrentPage={handlePageChange}
          />
        )}

        {currentPage === 'auth' && (
          <AuthProfilePage
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            orders={orders}
            setCurrentPage={handlePageChange}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            products={products}
            categories={categories}
            orders={orders}
            brandSettings={brandSettings}
            setCurrentPage={handlePageChange}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        setCurrentPage={handlePageChange}
      />

      {/* Luxury Maison Footer */}
      <Footer setCurrentPage={handlePageChange} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
