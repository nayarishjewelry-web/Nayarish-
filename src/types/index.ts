export type ProductCategory = string;

export type StockStatus = 'In Stock' | 'Made to Order' | 'Limited Edition' | 'Sold Out';

export interface Product {
  id: string;
  title: string;
  price: number; // In INR (₹)
  category: ProductCategory;
  imageUrl: string;
  additionalImages?: string[];
  description: string;
  stockStatus: StockStatus;
  stock: number;
  materials: string[];
  caratWeight?: string;
  variants: {
    metalTypes: string[];
    sizes?: string[];
  };
  specs: {
    origin: string;
    craftsmanship: string;
    certification: string;
  };
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMetal: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type PaymentMethodType = 'COD' | 'CARD';

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone?: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    selectedMetal: string;
    selectedSize?: string;
    imageUrl: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'Paid' | 'Pending Handover' | 'Processing';
  orderStatus: 'Confirmed' | 'Crafting' | 'Dispatched' | 'Delivered';
  createdAt: string;
  trackingNumber: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: ShippingAddress;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface BrandSettings {
  logoMode: 'text' | 'image' | 'both';
  brandName: string;
  tagline?: string;
  logoImageUrl: string;
  logoHeight: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export type PageView = 'home' | 'shop' | 'product-detail' | 'cart' | 'auth' | 'admin';
