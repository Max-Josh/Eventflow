import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Zap, 
  Database, 
  Sliders, 
  Key, 
  Lock, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  AlertTriangle,
  Server,
  PhoneCall,
  Building
} from 'lucide-react';
import { getGeniusPayConfig } from '../../services/geniusPayService';

interface AdminPanelModalProps {
  onClose: () => void;
  onOpenGeniusPayConfig: () => void;
  onOpenSupabaseConfig: () => void;
  onPurgeRegistrations?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  onClose,
  onOpenGeniusPayConfig,
  onOpenSupabaseConfig,
  onPurgeRegistrations,
}) => {
  const [activeTab, setActiveTab] = useState<'geniuspay' | 'database' | 'security'>('geniuspay');
  const geniusConfig = getGeniusPayConfig();

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'gateway': return '⚡ Débit Push Automatique (GeniusPay)';
      case 'direct_numbers': return '📱 Transfert sur Numéros Marchands';
      default: return '🔀 Hybride (Push Auto + Numéros Marchands)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-3xl bg-[#131720] border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0F1218]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold text-white">
                  Console d'Administration Système
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Accès Restreint Super-Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Seul l'administrateur système a les droits de paramétrage de la passerelle et de la base de données.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-white/10 bg-[#0B0D11] px-5 gap-4 text-xs font-display">
          <button
            onClick={() => setActiveTab('geniuspay')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'geniuspay'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Paramétrage GeniusPay & Numéros</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'database'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base de Données & RLS (Supabase)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Journal d'Audit & Sécurité</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'geniuspay' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                    <span>Passerelle Marchande & Numéros de Réception</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Gestion des clés GeniusPay et des numéros Wave, Orange Money, MTN et Moov de la plateforme.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenGeniusPayConfig();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-display font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                >
                  Configurer les Clés & Numéros
                </button>
              </div>

              {/* Mode & Environment Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Mode de Paiement Actif</span>
                  <div className="font-bold text-[#FF5500] text-[11px] truncate">{getModeLabel(geniusConfig.paymentMode)}</div>
                  <span className="text-[10px] text-slate-400 block">Présenté aux participants</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Environnement API</span>
                  <div className="font-bold text-emerald-400">
                    {geniusConfig.environment === 'live' ? '⚡ Production (Live)' : '🧪 Sandbox (Test)'}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Passerelle GeniusPay</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Titulaire Marchand</span>
                  <div className="font-bold text-white truncate">{geniusConfig.merchantNumbers.merchantName}</div>
                  <span className="text-[10px] text-emerald-400 block">Compte certifié</span>
                </div>
              </div>

              {/* Configured Merchant Numbers Overview */}
              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-bold text-white uppercase flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#FF5500]" />
                    Numéros Récepteurs Officiels Actifs
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Modifiables par Super-Admin</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#131720] border border-white/5">
                    <span className="text-[10px] text-[#1DC4E9] font-bold block">Wave CI</span>
                    <span className="font-mono text-white text-xs">{geniusConfig.merchantNumbers.waveNumber || 'Non défini'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131720] border border-white/5">
                    <span className="text-[10px] text-[#FF7900] font-bold block">Orange Money</span>
                    <span className="font-mono text-white text-xs">{geniusConfig.merchantNumbers.orangeMoneyNumber || 'Non défini'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131720] border border-white/5">
                    <span className="text-[10px] text-[#FFCC00] font-bold block">MTN MoMo</span>
                    <span className="font-mono text-white text-xs">{geniusConfig.merchantNumbers.mtnMoMoNumber || 'Non défini'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131720] border border-white/5">
                    <span className="text-[10px] text-blue-400 font-bold block">Moov Money</span>
                    <span className="font-mono text-white text-xs">{geniusConfig.merchantNumbers.moovMoneyNumber || 'Non défini'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Protection RBAC active :</strong> Les organisateurs d'événements ne peuvent ni voir ni modifier ces numéros et clés. Seul le Super-Administrateur a la pleine gouvernance.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                    <span>Base de Données PostgreSQL & Supabase</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">PostgreSQL 16</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Schéma de données relationnel, Row Level Security (RLS) et pooler de connexion Supavisor.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSupabaseConfig();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-display font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                >
                  Voir le Schéma SQL & RLS
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Politique de Sécurité RLS</span>
                  <div className="font-bold text-white">Isolation Multi-Tenant stricte</div>
                  <p className="text-[11px] text-slate-400">
                    Chaque organisateur ne peut requêter que ses propres événements. Les tables financières sont inaccessibles en direct.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Protection Anti-Surbooking</span>
                  <div className="font-bold text-white">Verrous Atomiques SQL</div>
                  <p className="text-[11px] text-slate-400">
                    Décrémentation des jauges sous transaction étanche pour éviter toute survente lors des ouvertures de billetterie.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Statut du Chiffrement TLS / SSL</span>
                  <span className="font-mono text-emerald-400 font-bold">Actif • TLS 1.3 / AES-256</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Vérification Signature Webhook GeniusPay</span>
                  <span className="font-mono text-emerald-400 font-bold">HMAC SHA-256 Strict</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Tentatives de Scan Doublons Bloquées</span>
                  <span className="font-mono text-[#FF5500] font-bold">14 alertes interceptées</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Conformité Réglementaire Monétique</span>
                  <span className="font-mono text-white font-bold">Norme Bancaire BCEAO / UEMOA</span>
                </div>
              </div>

              {/* Purge / Reset Test Data */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-display font-bold text-rose-300">
                    Nettoyage du Registre de Test
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supprime toutes les inscriptions et billets de test pour démarrer avec une base vierge.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Confirmez-vous la purge définitive de toutes les inscriptions de test ?')) {
                      onPurgeRegistrations?.();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-display font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  Purger les tests enregistrés
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#0F1218] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Connecté sous le rôle : <strong>SUPER_ADMINISTRATOR</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-display font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Fermer la console
          </button>
        </div>
      </div>
    </div>
  );
};
