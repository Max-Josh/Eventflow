import React from 'react';
import { 
  PlusCircle, 
  LayoutDashboard, 
  QrCode, 
  Database,
  Search,
  Zap,
  ShieldAlert,
  LogIn,
  User,
  LogOut
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: 'catalog' | 'dashboard' | 'scanner';
  onNavigate: (view: 'catalog' | 'dashboard' | 'scanner') => void;
  onOpenCreateModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenGeniusPayModal: () => void;
  onOpenAdminModal: () => void;
  onOpenAuthModal: () => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCreateModal,
  onOpenSupabaseModal,
  onOpenGeniusPayModal,
  onOpenAdminModal,
  onOpenAuthModal,
  role,
  onRoleChange,
}) => {
  const isAdmin = role === 'admin';
  const isOrganizer = role === 'organizer';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B0D11]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onNavigate('catalog')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF5500] flex items-center justify-center text-white font-display font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              EF
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-white tracking-tight">
                  EVENTFLOW
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 text-slate-300 rounded">
                  CI 🇨🇮
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Billetterie officielle Côte d'Ivoire
              </p>
            </div>
          </div>

          {/* Center Navigation - Pro & Discrete */}
          <nav className="hidden md:flex items-center gap-1 bg-[#131720] p-1 rounded-xl border border-white/10 text-xs font-sans">
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                currentView === 'catalog'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Catalogue
            </button>
            
            {(isOrganizer || isAdmin) && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Espace Organisateur
              </button>
            )}

            {(isOrganizer || isAdmin) && (
              <button
                onClick={() => onNavigate('scanner')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  currentView === 'scanner'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Scanner Entrées
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* STRICT ADMIN ONLY: Console & Database & GeniusPay settings */}
            {isAdmin && (
              <button
                onClick={onOpenAdminModal}
                title="Panneau de Contrôle Administrateur"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Console Admin</span>
              </button>
            )}

            {/* Role switch / Auth status */}
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-300 hover:text-white bg-[#131720] hover:bg-[#1A202C] border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{role === 'admin' ? 'Super Admin' : role === 'organizer' ? 'Organisateur' : 'Participant'}</span>
            </button>

            {/* Create event button (Organizer and Admin only) */}
            {(isOrganizer || isAdmin) && (
              <button
                onClick={onOpenCreateModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold text-white bg-[#FF5500] hover:bg-[#E04B00] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Créer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
