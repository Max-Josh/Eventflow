import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Key, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  PhoneCall,
  Sliders,
  Building,
  Info
} from 'lucide-react';
import { 
  getGeniusPayConfig, 
  saveGeniusPayConfig, 
  testGeniusPayConnection, 
  GeniusPayConfig 
} from '../services/geniusPayService';

interface GeniusPayConfigModalProps {
  onClose: () => void;
}

export const GeniusPayConfigModal: React.FC<GeniusPayConfigModalProps> = ({ onClose }) => {
  const [config, setConfig] = useState<GeniusPayConfig>(getGeniusPayConfig());
  const [activeTab, setActiveTab] = useState<'api_keys' | 'merchant_numbers' | 'payment_mode'>('api_keys');
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Suggested webhook URL
  const webhookUrl = `${window.location.origin}/api/webhooks/geniuspay`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const res = await testGeniusPayConnection(config.publicKey, config.secretKey, config.environment);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    saveGeniusPayConfig(config);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#131720] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0F1218]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/20 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold text-white">
                  Configuration des Paiements & Numéros Marchands
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  config.environment === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {config.environment === 'live' ? '⚡ Production' : '🧪 Sandbox'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gérez les clés d'API GeniusPay et les numéros récepteurs (Wave, Orange, MTN, Moov).
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

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0B0D11] px-5 gap-3 text-xs font-display">
          <button
            type="button"
            onClick={() => setActiveTab('api_keys')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'api_keys'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. Clés API GeniusPay</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('merchant_numbers')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'merchant_numbers'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>2. Numéros Marchands Récepteurs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment_mode')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'payment_mode'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Mode de Traitement</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: API KEYS */}
          {activeTab === 'api_keys' && (
            <div className="space-y-4">
              {/* Environment Switcher */}
              <div>
                <label className="text-xs font-mono font-medium text-slate-300 block mb-2 uppercase">
                  Environnement d'exécution GeniusPay
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0B0D11] border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, environment: 'sandbox' })}
                    className={`py-2 rounded-lg font-display font-bold transition-all cursor-pointer ${
                      config.environment === 'sandbox'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🧪 Mode Test / Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, environment: 'live' })}
                    className={`py-2 rounded-lg font-display font-bold transition-all cursor-pointer ${
                      config.environment === 'live'
                        ? 'bg-[#FF5500] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Mode Production (En direct)
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  En mode Test, les transactions sont simulées sans débit bancaire réel. En Production, les débits sont réels.
                </p>
              </div>

              {/* API Keys Fields */}
              <div className="space-y-3.5">
                {/* Public Key */}
                <div>
                  <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between mb-1.5 uppercase">
                    <span>Clé Publique (Public Key) *</span>
                    <span className="text-[10px] text-slate-500">Format : pk_...</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={config.environment === 'live' ? 'pk_live_...' : 'pk_test_...'}
                      value={config.publicKey}
                      onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-white font-mono text-xs focus:border-[#FF5500] focus:outline-none"
                    />
                    {config.publicKey && (
                      <button
                        type="button"
                        onClick={() => handleCopy(config.publicKey, 'pub')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      >
                        {copiedField === 'pub' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Secret Key */}
                <div>
                  <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between mb-1.5 uppercase">
                    <span>Clé Secrète (Secret Key) *</span>
                    <span className="text-[10px] text-rose-400">Confidentiel • Strictement protégée</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      placeholder={config.environment === 'live' ? 'sk_live_...' : 'sk_test_...'}
                      value={config.secretKey}
                      onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-white font-mono text-xs pr-10 focus:border-[#FF5500] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Webhook Secret */}
                <div>
                  <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between mb-1.5 uppercase">
                    <span>Secret de signature Webhook</span>
                    <span className="text-[10px] text-slate-500">whsec_...</span>
                  </label>
                  <input
                    type="text"
                    placeholder="whsec_..."
                    value={config.webhookSecret}
                    onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-white font-mono text-xs focus:border-[#FF5500] focus:outline-none"
                  />
                </div>

                {/* Webhook URL Endpoint Display */}
                <div className="p-3 rounded-xl bg-[#0B0D11] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                    <span>URL Webhook vérifiée sur GeniusPay :</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(webhookUrl, 'hook')}
                      className="text-[#FF5500] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'hook' ? 'Copié !' : 'Copier'}
                    </button>
                  </span>
                  <div className="font-mono text-xs text-slate-200 select-all truncate">
                    {webhookUrl}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MERCHANT NUMBERS */}
          {activeTab === 'merchant_numbers' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Configurez ici les <strong>numéros de compte officiels</strong> de votre plateforme. Ces numéros seront présentés aux clients lorsqu'ils choisissent de payer par transfert direct.
                </span>
              </div>

              {/* Merchant Name */}
              <div>
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5 mb-1.5 uppercase">
                  <Building className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Nom du titulaire / Société affiché au client *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: EVENTFLOW CI SAS ou KOUAME KOFFI"
                  value={config.merchantNumbers.merchantName}
                  onChange={(e) => setConfig({
                    ...config,
                    merchantNumbers: { ...config.merchantNumbers, merchantName: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-white font-mono text-xs focus:border-[#FF5500] focus:outline-none"
                />
              </div>

              {/* Grid of operator numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Wave Number */}
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-[#1DC4E9]/20 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#1DC4E9] text-slate-900 font-black text-[10px] flex items-center justify-center">
                      W
                    </div>
                    <label className="text-xs font-display font-bold text-white">Numéro Wave Récepteur</label>
                  </div>
                  <input
                    type="text"
                    placeholder="+225 07..."
                    value={config.merchantNumbers.waveNumber}
                    onChange={(e) => setConfig({
                      ...config,
                      merchantNumbers: { ...config.merchantNumbers, waveNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#131720] border border-white/10 text-white font-mono text-xs focus:border-[#1DC4E9] focus:outline-none"
                  />
                </div>

                {/* Orange Money Number */}
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-[#FF7900]/20 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#FF7900] text-white font-black text-[10px] flex items-center justify-center">
                      OM
                    </div>
                    <label className="text-xs font-display font-bold text-white">Numéro Orange Money</label>
                  </div>
                  <input
                    type="text"
                    placeholder="+225 07..."
                    value={config.merchantNumbers.orangeMoneyNumber}
                    onChange={(e) => setConfig({
                      ...config,
                      merchantNumbers: { ...config.merchantNumbers, orangeMoneyNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#131720] border border-white/10 text-white font-mono text-xs focus:border-[#FF7900] focus:outline-none"
                  />
                </div>

                {/* MTN MoMo Number */}
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-[#FFCC00]/20 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#FFCC00] text-slate-900 font-black text-[10px] flex items-center justify-center">
                      MTN
                    </div>
                    <label className="text-xs font-display font-bold text-white">Numéro MTN Mobile Money</label>
                  </div>
                  <input
                    type="text"
                    placeholder="+225 05..."
                    value={config.merchantNumbers.mtnMoMoNumber}
                    onChange={(e) => setConfig({
                      ...config,
                      merchantNumbers: { ...config.merchantNumbers, mtnMoMoNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#131720] border border-white/10 text-white font-mono text-xs focus:border-[#FFCC00] focus:outline-none"
                  />
                </div>

                {/* Moov Money Number */}
                <div className="p-3.5 rounded-xl bg-[#0B0D11] border border-blue-500/20 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                      MV
                    </div>
                    <label className="text-xs font-display font-bold text-white">Numéro Moov Money</label>
                  </div>
                  <input
                    type="text"
                    placeholder="+225 01..."
                    value={config.merchantNumbers.moovMoneyNumber}
                    onChange={(e) => setConfig({
                      ...config,
                      merchantNumbers: { ...config.merchantNumbers, moovMoneyNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#131720] border border-white/10 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Instructions field */}
              <div>
                <label className="text-xs font-mono font-medium text-slate-300 block mb-1.5 uppercase">
                  Instructions ou consigne pour les participants lors du virement
                </label>
                <textarea
                  rows={2}
                  value={config.merchantNumbers.instructions || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    merchantNumbers: { ...config.merchantNumbers, instructions: e.target.value }
                  })}
                  placeholder="Ex: Merci de renseigner votre nom en motif lors du virement..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-white text-xs focus:border-[#FF5500] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT MODE */}
          {activeTab === 'payment_mode' && (
            <div className="space-y-4">
              <label className="text-xs font-mono font-medium text-slate-300 block uppercase">
                Choisissez le comportement présenté aux participants :
              </label>

              <div className="space-y-3">
                {/* Option 1: Gateway Auto */}
                <div 
                  onClick={() => setConfig({ ...config, paymentMode: 'gateway' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    config.paymentMode === 'gateway'
                      ? 'bg-[#FF5500]/10 border-[#FF5500] text-white shadow-md'
                      : 'bg-[#0B0D11] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold text-white text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#FF5500]" />
                      Passerelle Automatique GeniusPay (Recommandé)
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      config.paymentMode === 'gateway' ? 'bg-[#FF5500] text-white' : 'bg-white/10'
                    }`}>
                      {config.paymentMode === 'gateway' ? 'Sélectionné' : 'Choisir'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Le participant reçoit directement une notification USSD Push sur son téléphone (Orange, MTN) ou ouvre l'app Wave avec le QR Code. Le paiement est validé en temps réel par webhook.
                  </p>
                </div>

                {/* Option 2: Direct Numbers */}
                <div 
                  onClick={() => setConfig({ ...config, paymentMode: 'direct_numbers' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    config.paymentMode === 'direct_numbers'
                      ? 'bg-[#FF5500]/10 border-[#FF5500] text-white shadow-md'
                      : 'bg-[#0B0D11] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold text-white text-sm flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-emerald-400" />
                      Transfert Manuel sur les Numéros Marchands
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      config.paymentMode === 'direct_numbers' ? 'bg-[#FF5500] text-white' : 'bg-white/10'
                    }`}>
                      {config.paymentMode === 'direct_numbers' ? 'Sélectionné' : 'Choisir'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Le site affiche votre numéro marchand (ex: Wave, Orange, MTN). Le participant fait le transfert depuis son téléphone puis saisit sa référence de transaction pour recevoir son billet.
                  </p>
                </div>

                {/* Option 3: Hybrid */}
                <div 
                  onClick={() => setConfig({ ...config, paymentMode: 'hybrid' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    config.paymentMode === 'hybrid'
                      ? 'bg-[#FF5500]/10 border-[#FF5500] text-white shadow-md'
                      : 'bg-[#0B0D11] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold text-white text-sm flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400" />
                      Mode Hybride (Proposer les 2 aux participants)
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      config.paymentMode === 'hybrid' ? 'bg-[#FF5500] text-white' : 'bg-white/10'
                    }`}>
                      {config.paymentMode === 'hybrid' ? 'Actif par défaut' : 'Choisir'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Le participant a le choix : soit valider instantanément par push automatique, soit effectuer un transfert vers le numéro récepteur officiel avec justificatif.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test connection alert message */}
          {testResult && activeTab === 'api_keys' && (
            <div className={`p-3 rounded-xl border text-xs font-sans flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-5 border-t border-white/10 bg-[#0F1218]">
          {activeTab === 'api_keys' ? (
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl text-xs font-display font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Test en cours...' : 'Tester mes clés API'}</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono">
              Paramètres Super-Admin • Modifiables à tout moment
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-display font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs font-display font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] shadow-sm transition-colors cursor-pointer"
            >
              {isSaved ? 'Enregistré avec succès !' : 'Enregistrer la configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
