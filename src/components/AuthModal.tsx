import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Sliders,
  Database,
  Zap
} from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('organizer');
  const [email, setEmail] = useState('organisateur@eventflow.ci');
  const [password, setPassword] = useState('••••••••••••');
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'admin') {
      setEmail('admin@eventflow.ci');
    } else if (role === 'organizer') {
      setEmail('organisateur@eventflow.ci');
    } else {
      setEmail('participant@eventflow.ci');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (selectedRole === 'admin' && adminPin !== 'ADMIN2026' && adminPin.trim() !== '') {
      setIsLoading(false);
      setError('Code d’accès Administrateur incorrect. Veuillez vérifier.');
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      onSuccess(selectedRole);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-md bg-[#131720] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0F1218]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
              selectedRole === 'admin' ? 'bg-rose-600' : 'bg-[#FF5500]'
            }`}>
              {selectedRole === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                {selectedRole === 'admin' ? 'Espace Super Administrateur' : 'Connexion à votre compte'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {selectedRole === 'admin' 
                  ? 'Accès restreint : Paramètres & Infrastructure uniquement'
                  : 'Gérez vos réservations et vos événements'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Role selector: 3 Roles */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1.5 uppercase">
              Sélectionnez votre profil
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0B0D11] border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => handleRoleSelect('participant')}
                className={`py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedRole === 'participant'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Participant
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('organizer')}
                className={`py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedRole === 'organizer'
                    ? 'bg-[#FF5500] text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Organisateur
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Warning banner for admin role */}
          {selectedRole === 'admin' && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Zone Administrateur Unique</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Seul l'administrateur a le droit de configurer la base de données PostgreSQL / Supabase et les clés marchandes de <strong>GeniusPay</strong>.
              </p>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0D11] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0D11] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          {/* Admin Secret Code if admin selected */}
          {selectedRole === 'admin' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-mono font-bold text-rose-400">
                  Clé Secrète Admin (PIN)
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Défaut: ADMIN2026</span>
              </div>
              <input
                type="text"
                placeholder="ADMIN2026"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full bg-[#0B0D11] border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-rose-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-display font-semibold text-xs text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              selectedRole === 'admin' 
                ? 'bg-rose-600 hover:bg-rose-500' 
                : 'bg-[#FF5500] hover:bg-[#E04B00]'
            }`}
          >
            {isLoading ? (
              <span>Vérification des autorisations...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>
                  {selectedRole === 'admin' 
                    ? 'Déverrouiller le Panneau Administrateur' 
                    : selectedRole === 'organizer'
                    ? 'Accéder à l’Espace Organisateur'
                    : 'Accéder à mes réservations'
                  }
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
