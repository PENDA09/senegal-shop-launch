export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface Store {
  name: string;
  subdomain: string;
  description: string;
  logo: string;
  currency: string;
  color: string;
  telephone: string;
}

export type PlanType = 'Gratuit' | 'Standard' | 'Business Pro';

export interface UserPlan {
  plan: PlanType;
  expirationDate: string;
}

export interface Order {
  id: string;
  customerName: string;
  productName: string;
  date: string;
  status: 'Payé' | 'En attente' | 'Annulé';
  total: number;
}