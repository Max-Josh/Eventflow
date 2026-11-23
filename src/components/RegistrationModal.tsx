import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Loader2, 
  AlertCircle,
  User,
  Mail,
  Phone,
  Lock,
  Zap,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, PaymentMethod, Registration } from '../types';
import { formatFCFA, generateTicketReference } from '../utils/formatters';

interface RegistrationModalProps {
  event: EventItem | null;
  onClose: () => void;
  onSuccess: (registration: Registration) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  onClose,
  onSuccess,
}) => {
  if (!event) return null;

  const isFree = event.price === 0;

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+225 ');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  // Payment states (Wave, Orange Money, MTN MoMo, Moov Money, Card via GeniusPay)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isFree ? 'free' : 'wave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // GeniusPay interactive checkout modal state
  const [showGeniusPayPopup, setShowGeniusPayPopup] = useState(false);
  const [geniusPayCountdown, setGeniusPayCountdown] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (isFree) {
      setIsProcessing(true);
      setProcessingStep('Validation de l’inscription gratuite...');
      setTimeout(() => {
        completeRegistration();
      }, 1000);
      return;
    }

    // Launch GeniusPay interactive checkout
    setShowGeniusPayPopup(true);
    setGeniusPayCountdown(45);
  };

  const handleConfirmGeniusPayPayment = () => {
    setIsProcessing(true);
    setProcessingStep('Connexion à la passerelle GeniusPay...');
    
    setTimeout(() => {
      setProcessingStep(`Demande envoyée à ${getProviderName(paymentMethod)} via GeniusPay...`);
      setTimeout(() => {
        setProcessingStep('Paiement approuvé par GeniusPay ! Génération du billet QR...');
        setTimeout(() => {
          completeRegistration();
        }, 900);
      }, 1400);
    }, 900);
  };

  const completeRegistration = () => {
    const ref = generateTicketReference();
    const qrPayload = `EVENTFLOW-GPAY-VERIFIED|${ref}|${event.id}|${firstName} ${lastName}|SEC-HMAC256`;

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      referenceNumber: ref,
      firstName,
      lastName,
      email,
      phone,
      company: company || undefined,
      jobTitle: jobTitle || undefined,
      amountPaid: event.price,
      paymentMethod,
      paymentStatus: 'completed',
      transactionReference: isFree 
        ? undefined 
        : `GPAY-CI-${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      qrCodeValue: qrPayload,
      checkedIn: false,
      registeredAt: new Date().toISOString(),
    };

    // Confetti effect
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#FF5A36', '#10B981', '#F8FAFC'],
      });
    } catch {
      // ignore
    }

    setIsProcessing(false);
    setShowGeniusPayPopup(false);
    onSuccess(newRegistration);
  };

  const getProviderName = (method: PaymentMethod) => {
    switch (method) {
      case 'wave': return 'Wave Côte d’Ivoire';
      case 'orange_money': return 'Orange Money CI';
      case 'mtn_momo': return 'MTN Mobile Money CI';
      case 'card': return 'Carte Bancaire (Visa/Mastercard)';
      default: return 'Gratuit';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#121726] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header with modern gradient border */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0E1322]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-indigo-400">
                Inscription & Billetterie
              </span>
              <span className="flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Sécurisé GeniusPay
              </span>
            </div>
            <h3 className="text-lg font-display font-bold text-white mt-1 line-clamp-1">
              {event.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* User Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Informations du participant
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: Jean-Luc"
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ex: Kouamé"
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Adresse E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jeanluc@domaine.ci"
                    className="w-full bg-[#0A0D14] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Numéro Mobile (CI) *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07..."
                    className="w-full bg-[#0A0D14] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Entreprise / Organisation
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Facultatif"
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Fonction / Poste
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Facultatif"
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Section: Powered by GeniusPay */}
          {!isFree ? (
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                    Paiement via GeniusPay
                  </h4>
                </div>
                <span className="text-base font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                  {formatFCFA(event.price)}
                </span>
              </div>

              {/* Payment Methods Choice with modern look */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wave')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'wave'
                      ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-[#0A0D14] border-white/10 text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#1DC4E9] flex items-center justify-center font-display font-black text-slate-900 text-xs shadow-md">
                    W
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-white">Wave CI</div>
                    <div className="text-[10px] text-cyan-400 font-semibold">1% de frais fixes</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'orange_money'
                      ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                      : 'bg-[#0A0D14] border-white/10 text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FF7900] flex items-center justify-center font-display font-black text-white text-xs shadow-md">
                    OM
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-white">Orange Money</div>
                    <div className="text-[10px] text-orange-400 font-semibold">Validation push</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn_momo')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'mtn_momo'
                      ? 'bg-yellow-500/10 border-yellow-400 text-white shadow-lg shadow-yellow-500/10'
                      : 'bg-[#0A0D14] border-white/10 text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FFCC00] flex items-center justify-center font-display font-black text-slate-900 text-xs shadow-md">
                    MTN
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-white">MTN MoMo</div>
                    <div className="text-[10px] text-yellow-400 font-semibold">MoMo Pay instantané</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-500/10 border-indigo-400 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-[#0A0D14] border-white/10 text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-white">Carte Bancaire</div>
                    <div className="text-[10px] text-indigo-400 font-semibold">Visa / Mastercard</div>
                  </div>
                </button>
              </div>

              {/* Security info banner */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transaction chiffrée de bout en bout et protégée par le séquestre <strong>GeniusPay</strong>.</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Cet événement est 100% gratuit. Votre billet avec QR code sécurisé sera généré instantanément.</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-rose-500 hover:from-indigo-600 hover:to-rose-600 transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{processingStep || 'Traitement sécurisé en cours...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isFree ? 'Confirmer mon inscription gratuite' : `Payer ${formatFCFA(event.price)} via GeniusPay`}
                  </span>
                </>
              )}
            </button>
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-display">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protocole SSL 256 bits • Agrégateur agréé GeniusPay • Envoi immédiat du billet</span>
            </div>
          </div>
        </form>

        {/* GeniusPay Interactive Checkout Modal Simulator */}
        {showGeniusPayPopup && (
          <div className="absolute inset-0 z-30 bg-[#0A0D14]/95 backdrop-blur-md flex flex-col justify-between p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm">
                    Guichet Sécurisé GeniusPay
                  </h4>
                  <p className="text-[10px] text-slate-400">Réf : GPAY-CI-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowGeniusPayPopup(false)}
                disabled={isProcessing}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-auto py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-display font-semibold text-slate-400">Montant à régler</span>
                <div className="text-3xl font-display font-black text-white mt-0.5">
                  {formatFCFA(event.price)}
                </div>
                <div className="text-xs font-display text-indigo-300 mt-1">
                  Opérateur : <strong>{getProviderName(paymentMethod)}</strong> ({phone})
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs text-slate-300 font-display">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Autorisation en attente</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Veuillez vérifier l'écran de votre smartphone et valider avec votre code secret Mobile Money.
                </p>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center gap-2 text-xs font-display text-indigo-300 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{processingStep}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={handleConfirmGeniusPayPayment}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Communication GeniusPay...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simuler la validation sur mon mobile ({getProviderName(paymentMethod)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowGeniusPayPopup(false)}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl font-display font-semibold text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Annuler et modifier les informations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
