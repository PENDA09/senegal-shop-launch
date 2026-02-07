import React, { createContext, useContext, useState } from 'react';
import { Product, Store, PlanType, UserPlan } from '../types';

interface StoreContextType {
  store: Store;
  products: Product[];
  userPlan: UserPlan;
  setStore: (store: Store) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
  setPlan: (plan: PlanType) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<Store>({
    name: "Boutique Sénégal",
    subdomain: "boutique-senegal",
    description: "Les meilleurs produits du Sénégal livrés chez vous.",
    logo: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/ec5b4ce4-f6f9-4bea-a180-14692f332890/app-logo-d895314d-1770465567050.webp",
    currency: "FCFA",
    color: "#1a73e8",
    telephone: "221770000000"
  });

  const [userPlan, setUserPlan] = useState<UserPlan>({
    plan: 'Gratuit',
    expirationDate: '18 février 2026'
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Boubou Traditionnel Luxe',
      price: 45000,
      description: 'Magnifique boubou brodé à la main, tissu de première qualité.',
      image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ec5b4ce4-f6f9-4bea-a180-14692f332890/product-samples-6c09a2e4-1770465566798.webp',
      category: 'Mode',
      stock: 12
    },
    {
      id: '2',
      name: 'Miel de Casamance Bio',
      price: 7500,
      description: 'Miel pur et naturel récolté dans les forêts de Casamance.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
      category: 'Alimentaire',
      stock: 50
    }
  ]);

  const addProduct = (product: Product) => setProducts([...products, product]);
  const removeProduct = (id: string) => setProducts(products.filter(p => p.id !== id));
  const updateProduct = (updatedProduct: Product) => setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const setPlan = (plan: PlanType) => setUserPlan(prev => ({ ...prev, plan }));

  return (
    <StoreContext.Provider value={{ store, products, userPlan, setStore, addProduct, removeProduct, updateProduct, setPlan }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};

export type { Product, Store };