import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Storefront: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { store, products } = useStore();
  
  useEffect(() => {
    if (store.name) {
      document.title = `${store.name} - Sunuboutique`;
    }
  }, [store.name]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR').replace(/\s/g, ' ');
  };

  const getWhatsAppLink = (productName: string, price: number) => {
    const telephone = store.telephone;
    const message = `Bonjour ${store.name}, je souhaite commander l'article : ${productName} au prix de ${formatPrice(price)} FCFA.`;
    return `https://wa.me/${telephone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-[#f4f4f9] font-['Segoe UI',_sans-serif]">
      {/* Admin Overlay Preview */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-lg tracking-wider"
        >
          <ChevronLeft size={12} /> RETOUR AU TABLEAU DE BORD
        </button>
      </div>

      {/* Banner */}
      <div 
        className="text-white py-16 px-6 text-center"
        style={{ backgroundColor: store.color }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{store.name}</h1>
        <p className="text-lg opacity-90 font-medium">Bienvenue dans ma boutique en ligne</p>
      </div>

      {/* Container */}
      <div className="max-w-[1100px] mx-auto p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div 
            key={p.id} 
            className="bg-white rounded-[15px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all flex flex-col items-center pb-6"
          >
            <div className="w-full h-[220px] bg-slate-50 overflow-hidden">
              <img 
                src={p.image || 'https://via.placeholder.com/180?text=Produit'} 
                alt={p.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="mt-5 mb-2 px-4 font-bold text-xl text-slate-800">{p.name}</h4>
            <p className="text-[#2ecc71] font-bold text-2xl mb-6">
              {formatPrice(p.price)} <small className="text-sm font-semibold">FCFA</small>
            </p>
            <a 
              href={getWhatsAppLink(p.name, p.price)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white no-underline px-8 py-3 rounded-full flex items-center gap-3 font-bold text-sm hover:scale-105 transition-transform active:scale-95 shadow-md"
            >
              <MessageCircle size={20} /> Commander via WhatsApp
            </a>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 px-6">
          <p className="text-slate-400 text-lg">Aucun produit disponible pour le moment.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center p-12 text-slate-400 text-sm">
        Propulsé par <strong className="text-slate-700">Sunuboutique</strong>
      </footer>
    </div>
  );
};

export default Storefront;