import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword, supabase } from '../lib/supabase';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ResetPasswordToken = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (Supabase handles the token in the URL automatically)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Le lien de réinitialisation est invalide ou a expiré.");
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) throw error;

      setSuccess(true);
      toast.success('Votre mot de passe a été mis à jour avec succès.');
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Mot de passe mis à jour !</h2>
          <p className="text-slate-600 mb-8">
            Votre nouveau mot de passe est enregistré. Vous allez être redirigé vers la page de connexion.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-4 rounded-xl transition-all"
          >
            Se connecter maintenant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4 font-['Inter',_sans-serif]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1a73e8] mb-2">Nouveau mot de passe</h2>
          <p className="text-slate-600">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-100 rounded-xl focus:border-[#1a73e8] focus:ring-0 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordToken;