import { Product, Order, UserProfile, CartItem, BrandSettings, CategoryItem } from '../types';
import { jewelryImages } from '../assets/images';
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  deleteDoc 
} from 'firebase/firestore';

// Initial pre-seeded luxury jewelry pieces in Indian Rupees (INR - ₹)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'The Empress Crown Solitaire Ring',
    price: 185000,
    category: 'Rings',
    imageUrl: jewelryImages.solitaireRing,
    additionalImages: [jewelryImages.solitaireRing],
    description: 'A monument of architectural precision. Hand-hammered 18K yellow gold band crowned by a flawless 3.82-carat emerald-cut D/Flawless diamond held in dual platinum prongs.',
    stockStatus: 'In Stock',
    stock: 3,
    materials: ['18K Royal Yellow Gold', 'PT950 Platinum', 'D-Color Flawless Diamond'],
    caratWeight: '3.82 ct',
    variants: {
      metalTypes: ['18K Royal Yellow Gold', 'PT950 Platinum', '18K Rose Gold'],
      sizes: ['Size 12', 'Size 14', 'Size 16', 'Size 18', 'Size 20']
    },
    specs: {
      origin: 'Maison Nayarish Atelier',
      craftsmanship: '140 Hours Hand-Sculpting & Cold-Chisel Setting',
      certification: 'GIA Diamond Dossier #223591823'
    },
    featured: true,
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'prod-002',
    title: 'Sovereign Byzantine Pavé Choker',
    price: 480000,
    category: 'Necklaces',
    imageUrl: jewelryImages.goldChoker,
    additionalImages: [jewelryImages.goldChoker, jewelryImages.heroBanner],
    description: 'An opus of royal filigree. Hundreds of micropavé round brilliant diamonds and royal violet amethyst cabochons cascade across an articulating 18K gold mesh choker that drapes seamlessly.',
    stockStatus: 'In Stock',
    stock: 2,
    materials: ['18K Royal Gold', 'Violet Amethyst & Sapphires', '12.4 ct F/VVS1 Pavé Diamonds'],
    caratWeight: '12.40 ct total',
    variants: {
      metalTypes: ['18K Royal Gold', '18K White Gold']
    },
    specs: {
      origin: 'Nayarish High Jewelry Vault',
      craftsmanship: 'Articulated Micro-Mesh Hand Assembly (210 Hours)',
      certification: 'SSEF High Jewellery Report #HJ-9941'
    },
    featured: true,
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'prod-003',
    title: 'Astral Baguette Diamond Tennis Bracelet',
    price: 245000,
    category: 'Bracelets',
    imageUrl: jewelryImages.tennisBracelet,
    additionalImages: [jewelryImages.tennisBracelet],
    description: 'Continuous kinetic scintillation. Seamless channel of step-cut baguette diamonds hand-selected for identical color and proportion, flanked by a double-safety concealed box clasp.',
    stockStatus: 'In Stock',
    stock: 5,
    materials: ['18K Two-Tone Gold', 'PT950 Platinum', '8.90 ct Baguette Diamonds (E/VVS)'],
    caratWeight: '8.90 ct total',
    variants: {
      metalTypes: ['18K Two-Tone Gold', '18K White Gold', '18K Yellow Gold'],
      sizes: ['16 cm', '18 cm', '20 cm']
    },
    specs: {
      origin: 'Antwerp Cutting & Nayarish Setting',
      craftsmanship: 'Micro-Channel Tension Alignment',
      certification: 'HRD Antwerp Certified Batch #8812'
    },
    featured: true,
    createdAt: '2026-02-10T14:30:00.000Z'
  },
  {
    id: 'prod-004',
    title: 'Celestial Tanzanite Chandelier Earrings',
    price: 290000,
    category: 'Earrings',
    imageUrl: jewelryImages.heritageEarrings,
    additionalImages: [jewelryImages.heritageEarrings],
    description: 'Dramatic tiered drops featuring rare velvety purplish-blue tanzanite pear-cuts entwined with brilliant pear and marquise diamond halos that catch every ray of ambient candlelight.',
    stockStatus: 'In Stock',
    stock: 2,
    materials: ['18K Yellow Gold', 'Unheated Tanzanite 16.2 ct', 'Pear Diamonds 6.8 ct'],
    caratWeight: '23.0 ct total',
    variants: {
      metalTypes: ['18K Yellow Gold', 'PT950 Platinum']
    },
    specs: {
      origin: 'Merelani Reserve & Nayarish Studio',
      craftsmanship: 'Cascade Balance Engineering (110 Hours)',
      certification: 'Gübelin Gem Lab Report #2308-41'
    },
    featured: true,
    createdAt: '2026-02-18T16:00:00.000Z'
  },
  {
    id: 'prod-005',
    title: 'The Grand Nayarish Heirloom Necklace',
    price: 920000,
    category: 'Diamonds',
    imageUrl: jewelryImages.heroBanner,
    additionalImages: [jewelryImages.heroBanner, jewelryImages.goldChoker],
    description: 'The pinnacle of the Maison. A museum-grade statement collar anchored by an archival 10.15-carat cushion-cut diamond centerpiece surrounded by 48 carats of calibrated marquise and pear diamonds.',
    stockStatus: 'Limited Edition',
    stock: 1,
    materials: ['18K Royal Gold', 'PT950 Platinum', '10.15 ct Center Cushion Diamond', '48 ct Total Diamonds'],
    caratWeight: '58.15 ct total',
    variants: {
      metalTypes: ['18K Royal Gold & Platinum Duo']
    },
    specs: {
      origin: 'Nayarish Master Collection Vault',
      craftsmanship: 'Master Jeweler Signature #001 (320 Hours)',
      certification: 'GIA Master Certificate #11928374'
    },
    featured: true,
    createdAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'prod-006',
    title: 'Aura Pavé Eternity Band',
    price: 94000,
    category: 'Rings',
    imageUrl: jewelryImages.solitaireRing,
    additionalImages: [jewelryImages.solitaireRing],
    description: 'Flawless 360-degree scintillation. Precision French pavé micro-claw setting ensuring maximum light return through every facet of round brilliant ideal-cut diamonds.',
    stockStatus: 'In Stock',
    stock: 7,
    materials: ['18K Royal Gold', '4.2 ct F/VS1 Round Brilliant Diamonds'],
    caratWeight: '4.20 ct total',
    variants: {
      metalTypes: ['18K Royal Yellow Gold', '18K White Gold', 'PT950 Platinum'],
      sizes: ['Size 12', 'Size 14', 'Size 16', 'Size 18']
    },
    specs: {
      origin: 'Maison Nayarish Atelier',
      craftsmanship: 'Micro-Scallop Setting under 40x Microscope',
      certification: 'Nayarish Authenticity Seal & Warranty'
    },
    featured: false,
    createdAt: '2026-02-25T11:00:00.000Z'
  },
  {
    id: 'prod-007',
    title: 'Serpentina Diamond Coil Bangle',
    price: 360000,
    category: 'Bracelets',
    imageUrl: jewelryImages.tennisBracelet,
    additionalImages: [jewelryImages.tennisBracelet],
    description: 'Sculptural ergonomic flex-band rendered in high-polish 18K gold, terminating in pear-shaped diamond finials with natural ruby eyes.',
    stockStatus: 'Made to Order',
    stock: 2,
    materials: ['18K Gold Memory Core', '6.5 ct Diamonds', 'Natural Burmese Rubies'],
    caratWeight: '6.50 ct',
    variants: {
      metalTypes: ['18K Royal Gold', '18K White Gold']
    },
    specs: {
      origin: 'Nayarish Studio Co-Production',
      craftsmanship: 'Patented Titanium Memory Core Coiled with Gold',
      certification: 'Nayarish Joaillerie Certificate'
    },
    featured: false,
    createdAt: '2026-03-01T09:00:00.000Z'
  },
  {
    id: 'prod-008',
    title: 'Nocturne Imperial Tanzanite Ring',
    price: 215000,
    category: 'Diamonds',
    imageUrl: jewelryImages.heritageEarrings,
    additionalImages: [jewelryImages.heritageEarrings],
    description: 'An exceptional 7.4-carat cushion-cut Royal Blue Tanzanite framed by calibrated trapezoid diamond side stones on an 18K yellow gold split shank.',
    stockStatus: 'In Stock',
    stock: 2,
    materials: ['18K Gold', '7.4 ct Royal Tanzanite', '1.8 ct Trapezoid Diamonds'],
    caratWeight: '9.20 ct total',
    variants: {
      metalTypes: ['18K Royal Gold', 'PT950 Platinum'],
      sizes: ['Size 14', 'Size 16', 'Size 18']
    },
    specs: {
      origin: 'Nayarish Atelier',
      craftsmanship: 'Hand-Cut Trapezoid Channel Calibration',
      certification: 'IGI Color Gemstone Certificate #G4819'
    },
    featured: false,
    createdAt: '2026-03-04T15:00:00.000Z'
  }
];

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'Rings', description: 'Solitaire, Crown & Pavé Eternity Bands' },
  { id: 'cat-2', name: 'Necklaces', description: 'Byzantine Collars, Filigree Chokers & Cascades' },
  { id: 'cat-3', name: 'Bracelets', description: 'Baguette Tennis & Serpentina Bangles' },
  { id: 'cat-4', name: 'Diamonds', description: 'GIA Flawless Centerstones & Heirloom Opulence' },
  { id: 'cat-5', name: 'Earrings', description: 'Cascading Chandeliers & Solitaire Drops' }
];

const INITIAL_BRAND_SETTINGS: BrandSettings = {
  logoMode: 'text',
  brandName: 'NAYARISH',
  logoImageUrl: '',
  logoHeight: 32,
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    userId: 'user-vip-001',
    customerName: 'Ananya Singhania',
    email: 'nayarishjewelry@gmail.com',
    phone: '+91 98200 44912',
    items: [
      {
        productId: 'prod-001',
        title: 'The Empress Crown Solitaire Ring',
        price: 185000,
        quantity: 1,
        selectedMetal: '18K Royal Yellow Gold',
        selectedSize: 'Size 14',
        imageUrl: jewelryImages.solitaireRing
      }
    ],
    subtotal: 185000,
    discount: 18500,
    couponCode: 'ROYAL10',
    shippingFee: 0,
    total: 166500,
    shippingAddress: {
      fullName: 'Ananya Singhania',
      street: '42 Altamount Road, Penthouse',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400026',
      country: 'India'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending Handover',
    orderStatus: 'Crafting',
    createdAt: '2026-10-09T18:42:00.000Z',
    trackingNumber: 'NYR-COD-99412'
  },
  {
    id: 'ORD-9818',
    userId: 'user-vip-002',
    customerName: 'Rohit Mehta',
    email: 'rohit@mehta-holdings.in',
    phone: '+91 99801 12044',
    items: [
      {
        productId: 'prod-003',
        title: 'Astral Baguette Diamond Tennis Bracelet',
        price: 245000,
        quantity: 1,
        selectedMetal: '18K Two-Tone Gold',
        selectedSize: '18 cm',
        imageUrl: jewelryImages.tennisBracelet
      }
    ],
    subtotal: 245000,
    discount: 0,
    shippingFee: 0,
    total: 245000,
    shippingAddress: {
      fullName: 'Rohit Mehta',
      street: 'Prithviraj Road, Lutyens',
      city: 'New Delhi',
      state: 'Delhi',
      zip: '110011',
      country: 'India'
    },
    paymentMethod: 'CARD',
    paymentStatus: 'Paid',
    orderStatus: 'Dispatched',
    createdAt: '2026-10-05T11:20:00.000Z',
    trackingNumber: 'NYR-ARMORED-77281'
  }
];

const INITIAL_USER: UserProfile = {
  uid: 'user-vip-001',
  email: 'nayarishjewelry@gmail.com',
  displayName: 'Ananya Singhania',
  phone: '+91 98200 44912',
  address: {
    fullName: 'Ananya Singhania',
    street: '42 Altamount Road, Penthouse',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400026',
    country: 'India'
  },
  role: 'admin',
  createdAt: '2026-01-10T00:00:00.000Z'
};

// Local storage keys for state persistence
const STORAGE_KEYS = {
  PRODUCTS: 'nayarish_products_inr_v2',
  ORDERS: 'nayarish_orders_inr_v2',
  USER: 'nayarish_current_user_v2',
  CART: 'nayarish_cart_items_inr_v2',
  BRAND: 'nayarish_brand_settings_v2',
  CATEGORIES: 'nayarish_categories_v2'
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

type Listener<T> = (data: T) => void;

class StoreEmitter {
  private listeners: { [event: string]: Listener<any>[] } = {};

  subscribe<T>(event: string, callback: Listener<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  notify<T>(event: string, data: T) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const storeEvents = new StoreEmitter();

export class NayarishStore {
  // Products Collection
  static getProducts(): Product[] {
    const products = loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!products || products.length === 0) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return products;
  }

  static getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  static addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newProduct, ...products];
    saveToStorage(STORAGE_KEYS.PRODUCTS, updated);
    storeEvents.notify('products', updated);

    if (db) {
      setDoc(doc(db, 'products', newProduct.id), newProduct).catch((e) =>
        console.warn('Firestore add product error:', e)
      );
    }

    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    storeEvents.notify('products', products);

    if (db) {
      setDoc(doc(db, 'products', id), updatedProduct, { merge: true }).catch((e) =>
        console.warn('Firestore update product error:', e)
      );
    }

    return updatedProduct;
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
    storeEvents.notify('products', filtered);

    if (db) {
      deleteDoc(doc(db, 'products', id)).catch((e) =>
        console.warn('Firestore delete product error:', e)
      );
    }

    return true;
  }

  static resetProducts(): void {
    saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    storeEvents.notify('products', INITIAL_PRODUCTS);
    if (db) {
      INITIAL_PRODUCTS.forEach((p) => {
        setDoc(doc(db, 'products', p.id), p).catch(() => {});
      });
    }
  }

  // Categories Collection & Management
  static getCategories(): CategoryItem[] {
    return loadFromStorage<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static addCategory(name: string, description?: string): CategoryItem {
    const categories = this.getCategories();
    const newCat: CategoryItem = {
      id: `cat-${Date.now().toString(36)}`,
      name: name.trim(),
      description: description?.trim()
    };
    const updated = [...categories, newCat];
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
    storeEvents.notify('categories', updated);

    if (db) {
      setDoc(doc(db, 'categories', newCat.id), newCat).catch((e) =>
        console.warn('Firestore category add:', e)
      );
    }
    return newCat;
  }

  static updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    const updated = { ...categories[index], ...updates };
    categories[index] = updated;
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    storeEvents.notify('categories', categories);

    if (db) {
      setDoc(doc(db, 'categories', id), updated, { merge: true }).catch((e) =>
        console.warn('Firestore category update:', e)
      );
    }
    return updated;
  }

  static deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    saveToStorage(STORAGE_KEYS.CATEGORIES, filtered);
    storeEvents.notify('categories', filtered);

    if (db) {
      deleteDoc(doc(db, 'categories', id)).catch((e) =>
        console.warn('Firestore category delete:', e)
      );
    }
    return true;
  }

  // Orders Collection
  static getOrders(): Order[] {
    return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  static getUserOrders(userEmail?: string, userId?: string): Order[] {
    const orders = this.getOrders();
    if (!userEmail && !userId) return orders;
    return orders.filter(o => 
      (userId && o.userId === userId) || 
      (userEmail && o.email.toLowerCase() === userEmail.toLowerCase())
    );
  }

  static createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order {
    const orders = this.getOrders();
    const isCOD = orderData.paymentMethod === 'COD';
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: isCOD ? `NYR-COD-${Math.floor(100000 + Math.random() * 900000)}` : `NYR-VAL-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentStatus: isCOD ? 'Pending Handover' : 'Paid',
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
    storeEvents.notify('orders', updated);

    if (db) {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((e) =>
        console.warn('Firestore create order error:', e)
      );
    }

    // Deduct product stock
    orderData.items.forEach(item => {
      const p = this.getProductById(item.productId);
      if (p) {
        const newStock = Math.max(0, p.stock - item.quantity);
        this.updateProduct(item.productId, {
          stock: newStock,
          stockStatus: newStock === 0 ? 'Sold Out' : p.stockStatus
        });
      }
    });

    return newOrder;
  }

  static updateOrderStatus(id: string, status: Order['orderStatus']): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return false;
    orders[index].orderStatus = status;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    storeEvents.notify('orders', orders);
    return true;
  }

  // Cart Management
  static getCart(): CartItem[] {
    return loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  static saveCart(items: CartItem[]): void {
    saveToStorage(STORAGE_KEYS.CART, items);
    storeEvents.notify('cart', items);
  }

  static addToCart(product: Product, quantity = 1, selectedMetal: string, selectedSize?: string): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && 
              item.selectedMetal === selectedMetal && 
              item.selectedSize === selectedSize
    );
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity, selectedMetal, selectedSize });
    }
    this.saveCart(cart);
    return cart;
  }

  static updateCartQuantity(index: number, quantity: number): CartItem[] {
    const cart = this.getCart();
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    this.saveCart(cart);
    return cart;
  }

  static clearCart(): void {
    this.saveCart([]);
  }

  // Auth & Profile Management
  static getCurrentUser(): UserProfile | null {
    return loadFromStorage<UserProfile | null>(STORAGE_KEYS.USER, INITIAL_USER);
  }

  static setCurrentUser(user: UserProfile | null): void {
    saveToStorage(STORAGE_KEYS.USER, user);
    storeEvents.notify('user', user);
  }

  static async signInWithEmail(email: string, password = ''): Promise<UserProfile> {
    const existing = this.getCurrentUser();
    let uid = existing && existing.email === email ? existing.uid : `usr-${Date.now().toString(36)}`;
    
    if (password && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (err) {
        console.warn('Firebase Auth sign-in fallback to local storage session:', err);
      }
    }

    const user: UserProfile = {
      uid,
      email,
      displayName: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      phone: existing?.phone || '+91 98200 44912',
      address: existing?.address || {
        fullName: email.split('@')[0],
        street: '42 Altamount Road, Penthouse',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400026',
        country: 'India'
      },
      role: email.toLowerCase() === 'nayarishjewelry@gmail.com' ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };
    this.setCurrentUser(user);
    return user;
  }

  static async signUpWithEmail(email: string, password = '', name?: string): Promise<UserProfile> {
    let uid = `usr-${Date.now().toString(36)}`;
    if (password && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (err) {
        console.warn('Firebase Auth sign-up fallback to local storage session:', err);
      }
    }

    const user: UserProfile = {
      uid,
      email,
      displayName: name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      phone: '+91 98200 44912',
      address: {
        fullName: name || email.split('@')[0],
        street: '42 Altamount Road, Penthouse',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400026',
        country: 'India'
      },
      role: email.toLowerCase() === 'nayarishjewelry@gmail.com' ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };
    this.setCurrentUser(user);
    return user;
  }

  static async signOut(): Promise<void> {
    try {
      if (auth) {
        await fbSignOut(auth);
      }
    } catch (e) {
      // ignore
    }
    this.setCurrentUser(null);
  }

  static updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...updates };
    this.setCurrentUser(updated);
    return updated;
  }

  // Maison Branding & Header Logo Management
  static getBrandSettings(): BrandSettings {
    return loadFromStorage<BrandSettings>(STORAGE_KEYS.BRAND, INITIAL_BRAND_SETTINGS);
  }

  static updateBrandSettings(updates: Partial<BrandSettings>): BrandSettings {
    const current = this.getBrandSettings();
    const updated: BrandSettings = { ...current, ...updates };
    saveToStorage(STORAGE_KEYS.BRAND, updated);
    storeEvents.notify('brand', updated);

    if (db) {
      setDoc(doc(db, 'settings', 'branding'), updated, { merge: true }).catch((e) =>
        console.warn('Firestore branding sync error:', e)
      );
    }

    return updated;
  }

  static resetBrandSettings(): BrandSettings {
    saveToStorage(STORAGE_KEYS.BRAND, INITIAL_BRAND_SETTINGS);
    storeEvents.notify('brand', INITIAL_BRAND_SETTINGS);
    if (db) {
      setDoc(doc(db, 'settings', 'branding'), INITIAL_BRAND_SETTINGS).catch((e) =>
        console.warn('Firestore reset branding error:', e)
      );
    }
    return INITIAL_BRAND_SETTINGS;
  }

  static async initFirestoreSync(): Promise<void> {
    try {
      if (!db) return;
      const pSnap = await getDocs(collection(db, 'products'));
      if (!pSnap.empty) {
        const firestoreProducts: Product[] = [];
        pSnap.forEach((d) => {
          firestoreProducts.push({ ...(d.data() as Product), id: d.id });
        });
        saveToStorage(STORAGE_KEYS.PRODUCTS, firestoreProducts);
        storeEvents.notify('products', firestoreProducts);
      } else {
        INITIAL_PRODUCTS.forEach((p) => {
          setDoc(doc(db, 'products', p.id), p).catch(() => {});
        });
      }

      const oSnap = await getDocs(collection(db, 'orders'));
      if (!oSnap.empty) {
        const firestoreOrders: Order[] = [];
        oSnap.forEach((d) => {
          firestoreOrders.push({ ...(d.data() as Order), id: d.id });
        });
        saveToStorage(STORAGE_KEYS.ORDERS, firestoreOrders);
        storeEvents.notify('orders', firestoreOrders);
      }

      const bSnap = await getDoc(doc(db, 'settings', 'branding'));
      if (bSnap.exists()) {
        const brandData = bSnap.data() as BrandSettings;
        saveToStorage(STORAGE_KEYS.BRAND, brandData);
        storeEvents.notify('brand', brandData);
      }
    } catch (err) {
      console.warn('Firestore initial sync notice:', err);
    }
  }
}
