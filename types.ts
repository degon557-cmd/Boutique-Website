
export interface CategoryField {
  name: string;
  type: 'text' | 'number' | 'multi-select' | 'dropdown';
  options?: string[];
  required: boolean;
}

export interface Category {
  id: number;
  name: string;
  fields: CategoryField[];
}

export interface Product {
  id: string;
  category_id: number;
  category_name?: string;
  name: string;
  price: number;
  description: string;
  specific_details: { [key: string]: any };
  media_urls: string[];
  created_at: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  account_number: string;
  instructions: string;
  qris_image_url?: string;
}

export type TransactionStatus = 'pending' | 'approved' | 'canceled';

export interface Transaction {
  id: string;
  product_id: string;
  product?: Product;
  payment_method_id: number;
  payment_method?: PaymentMethod;
  proof_url: string;
  status: TransactionStatus;
  guest_name: string;
  guest_address: string;
  date: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
