import React from 'react';
import { ShieldCheck, MapPin, Zap, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'catalog' | 'dashboard' | 'scanner') => void;
  onOpenCreateModal: () => void;
  onOpenGeniusPayModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenCreateModal,
  onOpenGeniusPayModal
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#070A0F] text-slate-400 text-xs font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <svg className="w-4 h-4 text-white" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                  <circle cx="32" cy="32" r="18" />
                  <ellipse cx="32" cy="32" rx="7.5" ry="18" />
                  <path d="M14 32h36" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-base text-white tracking-tight">
                EVENTFLOW CI
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
              La plateforme SaaS nouvelle génération pour l'organisation d'événements et de billetterie sécurisée avec l'agrégateur <strong>GeniusPay</strong> en Côte d'Ivoire.
            </p>
            <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5 font-display">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Plateau & Cocody, Abidjan • Côte d'Ivoire</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-3.5">
              Plateforme
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Explorer les événements
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Espace Organisateur
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scanner')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Guichet de Contrôle QR
                </button>
              </li>
              <li>
                <button onClick={onOpenCreateModal} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Créer une activité
                </button>
              </li>
              {onOpenGeniusPayModal && (
                <li>
                  <button onClick={onOpenGeniusPayModal} className="text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Passerelle GeniusPay
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Solutions & Use Cases */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-3.5">
              Cas d'usages
            </h4>
            <ul className="space-y-2 text-[11px] font-sans">
              <li className="hover:text-white transition-colors">Entreprises & Séminaires</li>
              <li className="hover:text-white transition-colors">Cabinets & Centres de formation</li>
              <li className="hover:text-white transition-colors">Conférences & Salons Tech</li>
              <li className="hover:text-white transition-colors">Festivals & Concerts VIP</li>
            </ul>
          </div>

          {/* Paiements & Sécurité */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-3.5">
              Paiements & Sécurité
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Agrégateur GeniusPay (API v2)</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Wave Côte d'Ivoire (1% frais fixes)</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Orange Money CI (Push instantané)</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span>MTN Mobile Money CI</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Cartes Visa & Mastercard 3DS2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} EVENTFLOW CI. Tous droits réservés. Propulsé par la technologie <strong>GeniusPay</strong>.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sécurité 99.98% Bancaire
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">Conditions Générales</span>
            <span className="hover:text-white cursor-pointer transition-colors">Politique de Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
