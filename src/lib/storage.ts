export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
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

const PRODUCT_KEY = 'checkout_product';
const ORDERS_KEY = 'checkout_orders';
const ADMIN_KEY = 'checkout_admin_password';

// Default product
const DEFAULT_PRODUCT: Product = {
  id: '1',
  title: 'Premium Product',
  description: 'High-quality product that solves your needs perfectly. Features include durability, great design, and amazing value.',
  price: 299,
  images: ['/placeholder.svg']
};

export const storage = {
  // Product
  getProduct: (): Product => {
    const stored = localStorage.getItem(PRODUCT_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PRODUCT;
  },
  
  saveProduct: (product: Product) => {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(product));
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
