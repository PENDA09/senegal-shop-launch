import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Plus, 
  DollarSign, 
  Users, 
  X, 
  Trash2, 
  Palette, 
  Globe, 
  CreditCard,
  ExternalLink,
  AlertTriangle,
  Upload
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { toast } from 'sonner';
import Subscription from './Subscription';

interface DashboardProps {
  onLogout: () => void;
  onPreview: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onPreview }) => {
  const { store, products, addProduct, removeProduct, setStore, userPlan } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings' | 'subscription'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Mode',
    description: '',
    stock: '',
    image: null as File | null
  });

  const productLimit = (userPlan.plan === 'Gratuit' || userPlan.plan === 'Standard') ? 20 : Infinity;
  const isLimitReached = products.length >= productLimit;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      toast.error('Limite de produits atteinte ! Veuillez passer au plan Pro.');
      return;
    }

    const p: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      description: newProduct.description,
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    };
    addProduct(p);
    setShowAddProduct(false);
    toast.success('Produit ajouté avec succès!');
    setNewProduct({ name: '', price: '', category: 'Mode', description: '', stock: '', image: null });
  };

  const SidebarItem = ({ icon: Icon, label, id }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
      style={activeTab === id ? { backgroundColor: store.color } : {}}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins',_sans-serif]">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg" style={{ backgroundColor: store.color }}>
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 truncate">{store.name}</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Vue d'ensemble" id="overview" />
          <SidebarItem icon={Package} label="Produits" id="products" />
          <SidebarItem icon={ShoppingBag} label="Commandes" id="orders" />
          <SidebarItem icon={CreditCard} label="Abonnement" id="subscription" />
          <SidebarItem icon={Settings} label="Paramètres" id="settings" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'overview' && 'Bonjour, Entrepreneur 👋'}
              {activeTab === 'products' && 'Mes Produits'}
              {activeTab === 'orders' && 'Commandes Récentes'}
              {activeTab === 'settings' && 'Configuration'}
              {activeTab === 'subscription' && 'Mon Abonnement'}
            </h2>
            <p className="text-slate-500 text-sm">Gérez votre boutique Sunuboutique en temps réel.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors"
              style={{ color: store.color, backgroundColor: `${store.color}15` }}
            >
              <ExternalLink size={18} />
              Voir ma boutique
            </button>
            <button 
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-semibold transition-colors shadow-md"
              style={{ backgroundColor: store.color }}
            >
              <Plus size={18} />
              Nouveau Produit
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Ventes Totales" value="1.250.000 FCFA" change="+12.5%" icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard title="Commandes" value="45" change="+8%" icon={ShoppingBag} color="text-blue-600" bg="bg-blue-50" />
                <StatCard title="Visiteurs" value="1,240" change="+24%" icon={Users} color="text-purple-600" bg="bg-purple-50" />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">Performances de vente</h3>
                <div className="h-64 bg-slate-50 rounded-xl flex items-end justify-between p-6 gap-2">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-lg transition-all hover:opacity-80 cursor-pointer" style={{ height: `${h}%`, backgroundColor: store.color }}></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
               <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-3">
                   <Package className="text-slate-400" />
                   <span className="font-medium">Plan actuel : <strong>{userPlan.plan}</strong></span>
                 </div>
                 <div className="text-sm font-bold">
                   {products.length} / {productLimit === Infinity ? '∞' : productLimit} produits
                 </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                          onClick={() => removeProduct(product.id)}
                          className="p-2 bg-white/90 backdrop-blur rounded-lg text-slate-600 hover:text-red-600 transition-colors shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold px-2 py-1 rounded uppercase tracking-wide" style={{ backgroundColor: `${store.color}15`, color: store.color }}>{product.category}</span>
                        <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {product.stock} en stock
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{product.name}</h4>
                      <p className="text-lg font-extrabold text-slate-900 mb-4">{product.price.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && <Subscription />}

          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="text-blue-600" /> Identité de la boutique
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom de la boutique</label>
                    <input 
                      type="text" 
                      value={store.name}
                      onChange={e => setStore({...store, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone (WhatsApp)</label>
                    <input 
                      type="text" 
                      value={store.telephone}
                      onChange={e => setStore({...store, telephone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ex: 221770000000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Palette className="text-purple-600" /> Apparence
                </h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Couleur de marque</label>
                  <div className="flex flex-wrap gap-3">
                    {['#1a73e8', '#dc2626', '#059669', '#7c3aed', '#ea580c', '#000000'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setStore({...store, color: c})}
                        className={`w-10 h-10 rounded-full transition-all ${store.color === c ? 'ring-4 ring-slate-200 scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => toast.success('Paramètres enregistrés !')}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                style={{ backgroundColor: store.color }}
              >
                Enregistrer les modifications
              </button>
            </div>
          )}
        </div>
      </main>

      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[15px] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Nouveau Produit</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-center text-slate-600 mb-4 text-sm">
                Plan actuel : <strong>{userPlan.plan}</strong> ({products.length}/{productLimit === Infinity ? '∞' : productLimit})
              </p>

              {isLimitReached ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center">
                  <AlertTriangle className="mx-auto mb-2 text-red-600" />
                  <strong>Limite atteinte !</strong><br />
                  Vous avez atteint le maximum de {productLimit} produits. <br />
                  <button 
                    onClick={() => { setActiveTab('subscription'); setShowAddProduct(false); }}
                    className="text-red-800 font-bold underline mt-2 hover:no-underline"
                  >
                    Passez au plan Pro ici.
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <input 
                    required
                    type="text" 
                    placeholder="Nom du produit"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input 
                    required
                    type="number" 
                    placeholder="Prix de vente (FCFA)"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input 
                    required
                    type="number" 
                    placeholder="Quantité en stock"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Image du produit</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer group">
                      <Upload className="mx-auto text-slate-300 group-hover:text-blue-500 mb-2" />
                      <span className="text-sm text-slate-500">Cliquez pour uploader (JPG, PNG)</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-lg"
                    style={{ backgroundColor: store.color }}
                  >
                    Enregistrer le produit
                  </button>
                </form>
              )}

              <button 
                onClick={() => setShowAddProduct(false)}
                className="w-full text-center mt-4 text-sm text-slate-400 hover:text-blue-600 transition-all"
              >
                ← Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-emerald-500 text-sm font-bold">{change}</span>
    </div>
    <p className="text-slate-500 font-medium mb-1">{title}</p>
    <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
  </div>
);

export default Dashboard;