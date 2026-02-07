import React, { useState } from 'react';
import { Tag, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../context/StoreContext';

const Subscription: React.FC = () => {
  const { userPlan, setPlan } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });
  const [reduction, setReduction] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const codeSaisi = couponCode.trim().toUpperCase();
    
    // Simulating coupon logic
    if (codeSaisi === 'SUNU20') {
      setReduction(20);
      setMessage({ text: 'Code appliqué ! Vous bénéficiez de -20% sur votre abonnement.', type: 'success' });
      toast.success('Code promo appliqué !');
    } else {
      setReduction(0);
      setMessage({ text: 'Code promo invalide ou expiré.', type: 'error' });
      toast.error('Code promo invalide.');
    }
  };

  const plans = [
    {
      name: 'STANDARD' as const,
      price: 3000,
      features: ['Limite 20 produits', '1 boutique', 'Ventes & Factures'],
      badge: null,
      color: '#1c2431'
    },
    {
      name: 'BUSINESS PRO' as const,
      price: 5000,
      features: ['Produits illimités', '3 boutiques', 'Commandes en ligne'],
      badge: 'POPULAIRE',
      color: '#9b51e0'
    }
  ];

  const calculatePrice = (basePrice: number) => {
    if (reduction > 0) {
      return basePrice * (1 - reduction / 100);
    }
    return basePrice;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Promo Card / Plan Actuel */}
      <div className="bg-[#3b33b5] text-white p-8 rounded-[15px] max-w-[600px] mx-auto shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4"> Abonnement {userPlan.plan}</h2>
        <p className="mb-2 opacity-90">Il vous reste environ 14 jours.</p>
        <p className="font-bold uppercase tracking-wide">
          DATE D'ÉCHÉANCE : <span className="font-normal">{userPlan.expirationDate}</span>
        </p>
      </div>

      {/* Plans Section */}
      <div className="flex flex-wrap gap-5 justify-center mt-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`bg-white p-6 rounded-[10px] w-[250px] border-2 shadow-sm transition-all hover:shadow-md relative ${
              plan.name === 'BUSINESS PRO' ? 'border-[#9b51e0]' : 'border-gray-100'
            }`}
          >
            {plan.badge && (
              <div className="bg-[#9b51e0] text-white px-2 py-1 absolute top-[-10px] right-3 rounded-[5px] text-[0.8em] font-bold">
                {plan.badge}
              </div>
            )}
            <h3 className={`text-lg font-bold mb-2 ${plan.name === 'BUSINESS PRO' ? 'text-[#9b51e0]' : 'text-slate-900'}`}>
              {plan.name}
            </h3>
            <p className="text-2xl font-bold mb-4">
              {reduction > 0 && plan.name === 'BUSINESS PRO' ? (
                <span className="flex flex-col">
                  <span className="line-through text-gray-300 text-sm">{plan.price.toLocaleString()} FCFA</span>
                  <span>{calculatePrice(plan.price).toLocaleString()} <small className="text-sm font-normal">FCFA/mois</small></span>
                </span>
              ) : (
                <span>{plan.price.toLocaleString()} <small className="text-sm font-normal">FCFA/mois</small></span>
              )}
            </p>
            <ul className="text-left text-sm space-y-2 mb-6 text-slate-600">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => {
                setPlan(plan.name);
                toast.success(`Abonnement ${plan.name} activé !`);
              }}
              disabled={userPlan.plan === plan.name}
              className={`w-full py-2.5 rounded-[5px] font-bold text-white transition-all ${
                userPlan.plan === plan.name ? 'bg-gray-300 cursor-not-allowed' : ''
              }`}
              style={{ backgroundColor: userPlan.plan === plan.name ? undefined : plan.color }}
            >
              {userPlan.plan === plan.name ? 'Plan Actuel' : "S'abonner"}
            </button>
          </div>
        ))}
      </div>

      {/* Coupon Form */}
      <div className="bg-white p-6 rounded-[10px] max-w-[600px] mx-auto shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Tag size={20} className="text-[#1c2431]" /> Vous avez un code promo ?
        </h4>
        <form onSubmit={handleApplyCoupon} className="flex gap-3">
          <input 
            type="text" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Entrez votre code (ex: SUNU20)" 
            required 
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-[5px] outline-none focus:ring-2 focus:ring-[#1c2431] transition-all"
          />
          <button 
            type="submit"
            className="bg-[#1c2431] text-white px-6 py-2.5 rounded-[5px] font-bold hover:opacity-90 transition-all"
          >
            Appliquer
          </button>
        </form>
        {message.text && (
          <p className={`mt-3 text-[0.9em] font-medium ${message.type === 'success' ? 'text-[#2ecc71]' : 'text-[#e74c3c]'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Subscription;