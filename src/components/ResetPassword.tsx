import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, resetPassword } from '../lib/supabase';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre adresse email.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      setSubmitted(true);
      toast.success('Lien de réinitialisation envoyé ! Vérifiez votre boîte mail.');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Vérifiez vos emails</h2>
          <p className="text-slate-600 mb-8">
            Nous avons envoyé un lien de réinitialisation de mot de passe à <strong>{email}</strong>.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4 font-['Inter',_sans-serif]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1a73e8] mb-2">Mot de passe oublié ?</h2>
          <p className="text-slate-600">Entrez votre email pour recevoir un lien de réinitialisation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-100 rounded-xl focus:border-[#1a73e8] focus:ring-0 outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Envoyer le lien
          </button>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-slate-600 hover:text-[#1a73e8] transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;