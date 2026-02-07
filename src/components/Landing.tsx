import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Clock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen font-['Poppins',_sans-serif]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1c2431] to-[#2c3e50] text-white py-28 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20"
        >
          <ShoppingBag size={18} className="text-[#2ecc71]" />
          <span className="text-sm font-bold tracking-wide uppercase">Sunuboutique - Commerce Local Sénégalais</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
        >
          Vendez partout, <br className="hidden md:block" /> 
          <span className="text-[#2ecc71]">encaissez sur WhatsApp</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-2xl max-w-3xl mx-auto mb-12 text-[#bdc3c7] leading-relaxed"
        >
          Sunuboutique est la solution la plus simple pour les entrepreneurs sénégalais. 
          Créez votre catalogue en ligne en quelques minutes et recevez vos commandes directement sur votre téléphone.
        </motion.p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <button 
            onClick={() => navigate('/onboarding')}
            className="bg-[#2ecc71] text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-[0_0_20px_rgba(46,204,113,0.4)] transition-all transform hover:scale-105 active:scale-95"
          >
            Lancer ma boutique gratuitement
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95"
          >
            Me connecter
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pourquoi choisir Sunuboutique ?</h2>
          <div className="w-24 h-1.5 bg-[#2ecc71] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Clock className="w-14 h-14 text-[#1a73e8]" />}
            title="Installation Rapide"
            description="Pas besoin de connaissances techniques. En 2 minutes, votre boutique est en ligne et prête à vendre au monde entier."
          />
          <FeatureCard 
            icon={<Smartphone className="w-14 h-14 text-[#2ecc71]" />}
            title="Optimisé WhatsApp"
            description="Chaque produit possède un bouton de commande automatique vers votre numéro WhatsApp. Simplifiez la vie de vos clients."
          />
          <FeatureCard 
            icon={<Zap className="w-14 h-14 text-amber-500" />}
            title="Gestion Simplifiée"
            description="Suivez votre stock en temps réel, gérez vos prix et visualisez vos performances de vente en un clin d'œil."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1c2431] py-16 px-6 text-center mt-auto text-white">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-white p-2 rounded-lg">
             <ShoppingBag className="text-[#1c2431] w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Sunuboutique</span>
        </div>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          &copy; 2026 Sunuboutique - La perfection au service du commerce local au Sénégal. <br />
          Simplifiez vos ventes, augmentez vos revenus.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-10 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-50 text-center flex flex-col items-center"
  >
    <div className="mb-6 bg-slate-50 p-6 rounded-2xl">{icon}</div>
    <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </motion.div>
);

export default Landing;