import React, { useState } from 'react';
import { ShoppingBag, Globe, Palette, Store, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toast } from 'sonner';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { store, setStore } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    color: '#1e40af',
    description: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setStore({
        ...store,
        name: formData.name,
        subdomain: formData.subdomain.toLowerCase().replace(/\s+/g, '-'),
        color: formData.color,
        description: formData.description
      });
      toast.success('Votre boutique est prête !');
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-slate-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Store size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Donnez un nom à votre aventure</h2>
            <p className="text-slate-500">Choisissez un nom mémorable pour votre boutique en ligne.</p>
            <input 
              autoFocus
              type="text" 
              placeholder="Ex: Dakar Fashion, SenBio Shop..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none text-lg transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Globe size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Votre adresse web</h2>
            <p className="text-slate-500">C'est le lien que vous partagerez sur WhatsApp et Instagram.</p>
            <div className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder="nom-de-ma-boutique"
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none text-lg transition-all pr-32"
                value={formData.subdomain}
                onChange={e => setFormData({...formData, subdomain: e.target.value})}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">.sunu.shop</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <Palette size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Personnalisez le style</h2>
            <p className="text-slate-500">Choisissez la couleur principale de votre marque.</p>
            <div className="grid grid-cols-4 gap-4">
              {['#1e40af', '#dc2626', '#059669', '#7c3aed', '#ea580c', '#000000', '#db2777', '#0891b2'].map(c => (
                <button 
                  key={c}
                  onClick={() => setFormData({...formData, color: c})}
                  className={`h-12 rounded-xl transition-all ${formData.color === c ? 'ring-4 ring-slate-200 scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                >
                  {formData.color === c && <Check size={20} className="mx-auto text-white" />}
                </button>
              ))}
            </div>
            <textarea 
              placeholder="Une courte description pour vos clients..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none transition-all h-32 resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
        )}

        <button 
          disabled={!formData.name && step === 1}
          onClick={handleNext}
          className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 3 ? 'Terminer la création' : 'Continuer'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;