import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Key, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle
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
      <div className="relative w-full max-w-xl bg-[#131720] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0F1218]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5500]/20 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold text-white">
                  Intégration des Clés GeniusPay
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  config.environment === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Mode {config.environment === 'live' ? 'Production' : 'Test (Sandbox)'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configurez vos clés marchandes pour activer les encaissements Wave, Orange Money, MTN et Carte.
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

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Environment Switcher */}
          <div>
            <label className="text-xs font-mono font-medium text-slate-300 block mb-2 uppercase">
              1. Environnement d'exécution
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
              Utilisez le mode Sandbox pour tester sans débiter de vrai argent, puis passez en Production avec vos clés réelles.
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
                <span>Secret de signature Webhook (Webhook Secret)</span>
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
                <span>URL de Webhook à configurer dans votre espace GeniusPay :</span>
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

          {/* Test connection alert message */}
          {testResult && (
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
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2.5 rounded-xl text-xs font-display font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Test en cours...' : 'Tester mes clés API'}</span>
          </button>

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
              {isSaved ? 'Enregistré !' : 'Enregistrer mes clés'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
