import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  QrCode, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  CreditCard,
  Lock,
  Building,
  Check
} from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onCreateClick: () => void;
  onScannerClick: () => void;
  onOpenGeniusPayConfig?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onCreateClick,
  onScannerClick,
  onOpenGeniusPayConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'ticket' | 'metrics'>('checkout');

  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-16 lg:pb-24 border-b border-white/5 bg-[#0B0D11] bg-subtle-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Tag */}
        <div className="flex justify-start sm:justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-display font-medium text-slate-300 bg-[#131720] border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
            <span>Billetterie & Encaissement en Côte d'Ivoire</span>
            <span className="text-slate-600">/</span>
            <span className="text-[#FF5500] font-semibold">Agrégateur GeniusPay certifié</span>
          </div>
        </div>

        {/* Clear, direct, no-BS headline */}
        <div className="text-left sm:text-center max-w-3xl sm:mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.12]">
            Vendez vos billets. Encaissez en Mobile Money. Sans friction.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl sm:mx-auto font-sans">
            La solution technique complète pour les conférences, formations, salons et spectacles à Abidjan. Intégration native <strong>GeniusPay</strong> (Wave, Orange Money, MTN, Carte bancaire) et contrôle d'accès sur smartphone.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-start sm:justify-center gap-3">
            <button
              onClick={onCreateClick}
              className="px-6 py-3.5 rounded-xl font-display font-semibold text-xs sm:text-sm text-white bg-[#FF5500] hover:bg-[#E04B00] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Créer un événement</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl font-display font-medium text-xs sm:text-sm text-slate-200 bg-[#131720] hover:bg-[#1A202C] border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Voir les événements</span>
            </button>

            <button
              onClick={onScannerClick}
              className="px-5 py-3.5 rounded-xl font-display font-medium text-xs sm:text-sm text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Scanner les billets</span>
            </button>
          </div>

          {/* Technical highlights bar */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center justify-start sm:justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-sans">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>0% de frais sur les billets gratuits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Reversement automatique sous 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>QR code anti-doublon crypté</span>
            </div>
          </div>
        </div>

        {/* Real Product Interactive Showcase */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-[#131720] border border-white/10 overflow-hidden shadow-2xl">
          {/* Top navigation tabs */}
          <div className="flex border-b border-white/10 bg-[#0F1218] px-4 pt-2 gap-2 text-xs font-display">
            <button
              onClick={() => setActiveTab('checkout')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'checkout'
                  ? 'border-[#FF5500] text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              1. Guichet GeniusPay Mobile Money
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'ticket'
                  ? 'border-[#FF5500] text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              2. Billet & QR Code sécurisé
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'metrics'
                  ? 'border-[#FF5500] text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              3. Dashboard & Rapprochement bancaire
            </button>
          </div>

          {/* Interactive display area */}
          <div className="p-6 sm:p-8">
            {activeTab === 'checkout' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-[#FF5500] uppercase font-bold tracking-wider">
                    MODULE D'ENCAISSEMENT
                  </span>
                  <h3 className="text-xl font-display font-bold text-white">
                    Paiement direct Wave, Orange Money et MTN
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Le participant saisit son numéro de téléphone ivoirien. GeniusPay initie un push USSD ou un débit immédiat sur son application Wave. Le billet est généré dès validation bancaire.
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
                    <span className="px-2.5 py-1 rounded bg-black/40 border border-white/5 font-mono">Commission : 2,5%</span>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Fonds cantonnés</span>
                  </div>
                </div>

                <div className="bg-[#0B0D11] rounded-xl border border-white/10 p-4 space-y-2.5 font-sans">
                  <div className="text-[11px] text-slate-400 pb-2 border-b border-white/10 flex justify-between">
                    <span>Opérateur de paiement</span>
                    <span className="text-white font-mono">Montant : 15 000 FCFA</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131720] border border-cyan-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#1DC4E9] text-slate-900 font-black text-[10px] flex items-center justify-center">W</div>
                      <span className="text-white font-medium">Wave Côte d'Ivoire</span>
                    </div>
                    <span className="text-cyan-400 text-[10px] font-mono">Validation push</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131720] border border-orange-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#FF7900] text-white font-black text-[10px] flex items-center justify-center">OM</div>
                      <span className="text-white font-medium">Orange Money CI</span>
                    </div>
                    <span className="text-orange-400 text-[10px] font-mono">#144# ou Push</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131720] border border-yellow-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#FFCC00] text-slate-900 font-black text-[10px] flex items-center justify-center">MTN</div>
                      <span className="text-white font-medium">MTN MoMo Pay</span>
                    </div>
                    <span className="text-yellow-400 text-[10px] font-mono">*133#</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ticket' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    SÉCURITÉ PORTIQUE
                  </span>
                  <h3 className="text-xl font-display font-bold text-white">
                    Un pass nominatif, horodaté et infalsifiable
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Chaque ticket porte une signature cryptographique unique. Le scanner d'entrée vérifie instantanément si le billet a déjà été validé, bloquant les captures d'écran et les copies multiples.
                  </p>
                </div>

                <div className="bg-[#0B0D11] rounded-xl border border-white/10 p-5 text-center font-sans">
                  <div className="w-28 h-28 bg-white mx-auto rounded-lg p-2.5 flex items-center justify-center shadow-lg">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <div className="mt-3">
                    <span className="font-mono text-xs font-bold text-white block">EF-2026-8942-CI</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Signature HMAC-SHA256 valide</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-[#FF5500] uppercase font-bold tracking-wider">
                    GESTION ORGANISATEUR
                  </span>
                  <h3 className="text-xl font-display font-bold text-white">
                    Visibilité nette sur vos encaissements
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Suivez le volume des ventes en temps réel, exportez la liste des participants au format Excel/CSV et demandez le virement de vos fonds directement sur votre compte bancaire d'entreprise.
                  </p>
                </div>

                <div className="bg-[#0B0D11] rounded-xl border border-white/10 p-4 space-y-3 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total collecté ce mois</span>
                    <span className="text-white font-mono font-bold text-base">4 850 000 FCFA</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div className="bg-[#FF5500] h-1.5 rounded-full w-[78%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>390 billets vendus</span>
                    <span className="text-emerald-400">Prêt pour virement</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
