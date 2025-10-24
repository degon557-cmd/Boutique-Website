
import { Product, Category, PaymentMethod, Transaction, Contact, TransactionStatus } from '../types';

// Mock Data
let mockCategories: Category[] = [
  {
    id: 1,
    name: "Baju",
    fields: [
      { name: "Sizes", type: "multi-select", options: ["S", "M", "L", "XL"], required: true },
      { name: "Material", type: "text", required: true },
      { name: "Color", type: "dropdown", options: ["Red", "Blue", "Green", "Black", "White"], required: false }
    ]
  },
  {
    id: 2,
    name: "Emas",
    fields: [
      { name: "Weight (grams)", type: "number", required: true },
      { name: "Purity (karat)", type: "dropdown", options: ["18K", "22K", "24K"], required: true }
    ]
  },
  {
    id: 3,
    name: "Kalung",
    fields: [
        { name: "Length (cm)", type: "number", required: true },
        { name: "Material", type: "text", required: true },
    ]
  }
];

let mockProducts: Product[] = [
  {
    id: 'prod_1',
    category_id: 1,
    name: 'Kemeja Batik Premium',
    price: 500000,
    description: 'Kemeja batik lengan panjang dengan bahan katun primisima yang adem dan nyaman dipakai.',
    specific_details: { "Sizes": ["L", "XL"], "Material": "Katun Primisima", "Color": "Blue" },
    media_urls: ['https://picsum.photos/seed/kemeja/600/400'],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod_2',
    category_id: 2,
    name: 'Cincin Emas Murni',
    price: 5000000,
    description: 'Cincin emas murni 24 karat dengan desain elegan dan minimalis.',
    specific_details: { "Weight (grams)": 5, "Purity (karat)": "24K" },
    media_urls: ['https://picsum.photos/seed/cincin/600/400'],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod_3',
    category_id: 3,
    name: 'Kalung Mutiara',
    price: 1200000,
    description: 'Kalung dengan liontin mutiara air tawar asli, cocok untuk acara formal.',
    specific_details: { "Length (cm)": 45, "Material": "Perak 925, Mutiara" },
    media_urls: ['https://picsum.photos/seed/kalung/600/400'],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod_4',
    category_id: 1,
    name: 'Gamis Modern',
    price: 750000,
    description: 'Gamis modern dengan bahan satin silk yang mewah dan flowy.',
    specific_details: { "Sizes": ["M", "L"], "Material": "Satin Silk", "Color": "White" },
    media_urls: ['https://picsum.photos/seed/gamis/600/400'],
    created_at: new Date().toISOString()
  }
];

let mockPayments: PaymentMethod[] = [
  { id: 1, name: "BCA", account_number: "1234567890", instructions: "Transfer ke rekening BCA a/n Boutique-Ku dan unggah bukti transfer.", qris_image_url: "https://picsum.photos/seed/qris1/200" },
  { id: 2, name: "BNI", account_number: "0987654321", instructions: "Transfer ke rekening BNI a/n Boutique-Ku dan unggah bukti transfer.", qris_image_url: "https://picsum.photos/seed/qris2/200" }
];

let mockTransactions: Transaction[] = [];
let mockContacts: Contact[] = [];

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Public APIs
export const getProducts = async (query: string = '', categoryId: string = ''): Promise<Product[]> => {
  await simulateDelay(500);
  let filteredProducts = mockProducts.map(p => ({...p, category_name: mockCategories.find(c => c.id === p.category_id)?.name || 'Uncategorized'}));
  
  if (categoryId) {
    filteredProducts = filteredProducts.filter(p => p.category_id === parseInt(categoryId));
  }
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category_name?.toLowerCase().includes(lowerQuery)
    );
  }
  
  return filteredProducts;
};

export const getCategories = async (): Promise<Category[]> => {
  await simulateDelay(200);
  return mockCategories;
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    await simulateDelay(200);
    return mockPayments;
}

export const createTransaction = async (data: Omit<Transaction, 'id' | 'date' | 'status' | 'proof_url'> & { proof_file: File }): Promise<Transaction> => {
    await simulateDelay(1000);
    const newTransaction: Transaction = {
        ...data,
        id: `TRX-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        status: 'pending',
        date: new Date().toISOString(),
        proof_url: URL.createObjectURL(data.proof_file),
        product: mockProducts.find(p => p.id === data.product_id),
        payment_method: mockPayments.find(p => p.id === data.payment_method_id)
    };
    mockTransactions.unshift(newTransaction);
    return newTransaction;
}

export const getTransactionStatus = async (transactionId: string): Promise<{ status: TransactionStatus }> => {
    await simulateDelay(1500);
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error("Transaction not found");
    return { status: transaction.status };
}

export const cancelTransaction = async (transactionId: string): Promise<{ success: boolean }> => {
    await simulateDelay(500);
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (transaction && transaction.status === 'pending') {
        transaction.status = 'canceled';
        return { success: true };
    }
    return { success: false };
}

export const submitContactForm = async (data: Omit<Contact, 'id' | 'created_at'>): Promise<Contact> => {
    await simulateDelay(500);
    const newContact: Contact = {
        ...data,
        id: mockContacts.length + 1,
        created_at: new Date().toISOString()
    }
    mockContacts.push(newContact);
    return newContact;
}

// Admin APIs
export const adminLogin = async (username: string, password: string): Promise<{ success: boolean, token?: string }> => {
    await simulateDelay(500);
    // In a real app, this would check against a hashed password from admins.json or a database.
    if (username === 'admin' && password === 'password123') {
        return { success: true, token: 'mock-jwt-token' };
    }
    return { success: false };
}

export const getAdminStats = async () => {
  await simulateDelay(300);
  const approved = mockTransactions.filter(t => t.status === 'approved');
  const totalSales = approved.length;
  const totalRevenue = approved.reduce((sum, t) => sum + (t.product?.price || 0), 0);
  return { totalSales, totalRevenue };
}

export const getAdminTransactions = async (): Promise<Transaction[]> => {
  await simulateDelay(500);
  return mockTransactions.map(t => ({
      ...t,
      product: mockProducts.find(p => p.id === t.product_id),
      payment_method: mockPayments.find(p => p.id === t.payment_method_id)
  }));
}

export const updateTransactionStatus = async (transactionId: string, status: TransactionStatus): Promise<boolean> => {
    await simulateDelay(500);
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = status;
        // Simulate sending notification to admin
        if(status === 'approved') {
            console.log(`Order for ${transaction.guest_name} at ${transaction.guest_address} has been approved.`);
        }
        return true;
    }
    return false;
}

// Dummy functions for CRUD operations. In a real app, these would modify the mock data arrays.
export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  await simulateDelay(500);
  const newProduct = { ...product, id: `prod_${Date.now()}`, created_at: new Date().toISOString() };
  mockProducts.unshift(newProduct);
  return newProduct;
}

export const updateProduct = async (product: Product) => {
  await simulateDelay(500);
  mockProducts = mockProducts.map(p => p.id === product.id ? product : p);
  return product;
}

export const deleteProduct = async (productId: string) => {
  await simulateDelay(500);
  mockProducts = mockProducts.filter(p => p.id !== productId);
  return true;
}

export const addCategory = async (category: Omit<Category, 'id'>) => {
  await simulateDelay(500);
  const newCategory = { ...category, id: Date.now() };
  mockCategories.push(newCategory);
  return newCategory;
}

export const updateCategory = async (category: Category) => {
  await simulateDelay(500);
  mockCategories = mockCategories.map(c => c.id === category.id ? category : c);
  return category;
}

export const deleteCategory = async (categoryId: number) => {
  await simulateDelay(500);
  const isUsed = mockProducts.some(p => p.category_id === categoryId);
  if (isUsed) {
      alert("Cannot delete category as it is currently in use by products.");
      return false;
  }
  mockCategories = mockCategories.filter(c => c.id !== categoryId);
  return true;
}


export const addPaymentMethod = async (payment: Omit<PaymentMethod, 'id'>) => {
  await simulateDelay(500);
  const newPayment = { ...payment, id: Date.now() };
  mockPayments.push(newPayment);
  return newPayment;
}

export const updatePaymentMethod = async (payment: PaymentMethod) => {
  await simulateDelay(500);
  mockPayments = mockPayments.map(p => p.id === payment.id ? payment : p);
  return payment;
}

export const deletePaymentMethod = async (paymentId: number) => {
  await simulateDelay(500);
  mockPayments = mockPayments.filter(p => p.id !== paymentId);
  return true;
}
