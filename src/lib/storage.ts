export interface Product {
  id: string;
  title: string;
  description: string; // Now stores HTML from Tiptap
  price: number;
  originalPrice?: number;
  images: string[];
  active: boolean; // Which product to show on checkout
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  processed: boolean;
}

const PRODUCTS_KEY = 'checkout_products';
const ORDERS_KEY = 'checkout_orders';
const ADMIN_KEY = 'checkout_admin_password';

// Default product
const DEFAULT_PRODUCT: Product = {
  id: '1',
  title: 'Premium Product',
  description: '<p>High-quality product that solves your needs perfectly. Features include durability, great design, and amazing value.</p>',
  price: 299,
  originalPrice: 499,
  images: ['/placeholder.svg'],
  active: true,
  createdAt: new Date().toISOString()
};

export const storage = {
  // Products
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [DEFAULT_PRODUCT];
  },

  getProduct: (id: string): Product | undefined => {
    const products = storage.getProducts();
    return products.find(p => p.id === id);
  },

  getActiveProduct: (): Product | undefined => {
    const products = storage.getProducts();
    return products.find(p => p.active);
  },
  
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>): Product => {
    const products = storage.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const products = storage.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  },

  deleteProduct: (id: string) => {
    const products = storage.getProducts().filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  setActiveProduct: (id: string) => {
    const products = storage.getProducts();
    products.forEach(p => {
      p.active = p.id === id;
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  // Orders
  getOrders: (): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'processed'>): Order => {
    const orders = storage.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      processed: false
    };
    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  },

  updateOrder: (id: string, updates: Partial<Order>) => {
    const orders = storage.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },

  deleteOrder: (id: string) => {
    const orders = storage.getOrders().filter(o => o.id !== id);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  // Admin password
  getAdminPassword: (): string => {
    const stored = localStorage.getItem(ADMIN_KEY);
    return stored || 'admin123';
  },

  setAdminPassword: (password: string) => {
    localStorage.setItem(ADMIN_KEY, password);
  }
};
