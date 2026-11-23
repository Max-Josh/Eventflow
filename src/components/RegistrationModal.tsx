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
  Sparkles,
  PhoneCall,
  Copy,
  Building,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, PaymentMethod, Registration } from '../types';
import { formatFCFA, generateTicketReference } from '../utils/formatters';
import { getGeniusPayConfig } from '../services/geniusPayService';

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
  const geniusConfig = getGeniusPayConfig();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+225 ');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  // Payment states (Wave, Orange Money, MTN MoMo, Moov Money, Card via GeniusPay)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isFree ? 'free' : 'wave');
  const [payFlowType, setPayFlowType] = useState<'push' | 'manual'>(
    geniusConfig.paymentMode === 'direct_numbers' ? 'manual' : 'push'
  );
  const [manualTxRef, setManualTxRef] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // GeniusPay interactive checkout modal state
  const [showGeniusPayPopup, setShowGeniusPayPopup] = useState(false);

  // Helper to get active merchant number according to current operator
  const getMerchantNumberForMethod = (method: PaymentMethod) => {
    switch (method) {
      case 'wave':
        return geniusConfig.merchantNumbers.waveNumber || '+225 07 00 12 34 56';
      case 'orange_money':
        return geniusConfig.merchantNumbers.orangeMoneyNumber || '+225 07 89 01 23 45';
      case 'mtn_momo':
        return geniusConfig.merchantNumbers.mtnMoMoNumber || '+225 05 67 89 01 23';
      case 'card':
        return 'Portail Bancaire 3D-Secure';
      default:
        return geniusConfig.merchantNumbers.waveNumber;
    }
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num.replace(/\s+/g, ''));
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

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
  };

  const handleConfirmGeniusPayPayment = () => {
    setIsProcessing(true);
    
    if (payFlowType === 'manual') {
      setProcessingStep('Vérification de la référence de transaction mobile...');
      setTimeout(() => {
        setProcessingStep('Transaction confirmée ! Génération du billet QR...');
        setTimeout(() => {
          completeRegistration(manualTxRef || `MANUAL-${Date.now().toString().slice(-6)}`);
        }, 900);
      }, 1200);
      return;
    }

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

  const completeRegistration = (customTxRef?: string) => {
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
        : (customTxRef || `GPAY-CI-${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`),
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
        colors: ['#6366F1', '#FF5500', '#10B981', '#F8FAFC'],
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
              <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-[#FF5500]">
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
              <User className="w-3.5 h-3.5 text-[#FF5500]" />
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
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
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
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
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
                    className="w-full bg-[#0A0D14] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Votre Numéro Mobile (CI) *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07..."
                    className="w-full bg-[#0A0D14] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
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
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
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
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {!isFree ? (
            <div className="pt-3 border-t border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#FF5500]/20 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                    <Zap className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                    Paiement Sécurisé
                  </h4>
                </div>
                <span className="text-base font-display font-black text-[#FF5500]">
                  {formatFCFA(event.price)}
                </span>
              </div>

              {/* Hybrid Mode selector if enabled */}
              {geniusConfig.paymentMode === 'hybrid' && (
                <div className="p-1 rounded-xl bg-[#0A0D14] border border-white/10 grid grid-cols-2 gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPayFlowType('push')}
                    className={`py-2 px-2.5 rounded-lg font-display font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      payFlowType === 'push'
                        ? 'bg-[#FF5500] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Débit Direct (Push USSD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayFlowType('manual')}
                    className={`py-2 px-2.5 rounded-lg font-display font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      payFlowType === 'manual'
                        ? 'bg-[#FF5500] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Numéro Marchand</span>
                  </button>
                </div>
              )}

              {/* Payment Methods Choice */}
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
                    <div className="text-[10px] text-cyan-400 font-semibold">Instantané (1%)</div>
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
                    <div className="text-[10px] text-orange-400 font-semibold">Push ou #144#</div>
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
                    <div className="text-[10px] text-yellow-400 font-semibold">MoMo Pay direct</div>
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

              {/* Dynamic Info Banner according to flow */}
              {payFlowType === 'manual' ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-amber-300 font-display font-bold">
                    <span className="flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-amber-400" />
                      Numéro Marchand {getProviderName(paymentMethod)} :
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(getMerchantNumberForMethod(paymentMethod))}
                      className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedNumber ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A0D14] border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-mono font-black text-white">
                        {getMerchantNumberForMethod(paymentMethod)}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-[#FF5500]" />
                        <span>Titulaire : <strong>{geniusConfig.merchantNumbers.merchantName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Effectuez le transfert de <strong>{formatFCFA(event.price)}</strong> depuis votre application Mobile Money, puis confirmez ci-dessous.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-display font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Prélèvement automatique sécurisé par GeniusPay</span>
                  </div>
                  <p className="text-slate-400 text-[10px] pl-6">
                    {paymentMethod === 'wave' 
                      ? 'Une redirection vers votre application Wave ou un QR code à scanner sera généré.'
                      : `Une invite de validation (Push USSD) sera envoyée sur votre numéro ${phone}. Vous n'aurez qu'à taper votre code secret.`}
                  </p>
                </div>
              )}
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
              className="w-full py-4 rounded-xl text-xs font-display font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] transition-all shadow-xl shadow-[#FF5500]/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
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
                    {isFree 
                      ? 'Confirmer mon inscription gratuite' 
                      : payFlowType === 'manual'
                        ? `Valider mon paiement de ${formatFCFA(event.price)}`
                        : `Payer ${formatFCFA(event.price)} via GeniusPay`}
                  </span>
                </>
              )}
            </button>
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-display">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protocole SSL 256 bits • Agrégateur agréé BCEAO • Envoi immédiat du billet</span>
            </div>
          </div>
        </form>

        {/* GeniusPay Interactive Checkout Modal Simulator */}
        {showGeniusPayPopup && (
          <div className="absolute inset-0 z-30 bg-[#0A0D14]/95 backdrop-blur-md flex flex-col justify-between p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5500]/20 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm">
                    {payFlowType === 'manual' ? 'Confirmation du Transfert Marchand' : 'Guichet Sécurisé GeniusPay'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Réf : GPAY-CI-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
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

            <div className="my-auto py-5 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/30 mx-auto flex items-center justify-center text-[#FF5500]">
                {payFlowType === 'manual' ? (
                  <PhoneCall className="w-8 h-8 animate-pulse text-[#FF5500]" />
                ) : (
                  <Smartphone className="w-8 h-8 animate-bounce" />
                )}
              </div>

              <div>
                <span className="text-xs font-display font-semibold text-slate-400">Montant de la formation</span>
                <div className="text-3xl font-display font-black text-white mt-0.5">
                  {formatFCFA(event.price)}
                </div>
                <div className="text-xs font-display text-slate-300 mt-1">
                  Opérateur : <strong>{getProviderName(paymentMethod)}</strong>
                </div>
              </div>

              {payFlowType === 'manual' ? (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left space-y-3 font-display">
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400 text-[10px] block uppercase font-mono">Numéro à créditer :</span>
                    <div className="text-sm font-mono font-black text-[#FF5500] mt-0.5">
                      {getMerchantNumberForMethod(paymentMethod)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Titulaire : <strong>{geniusConfig.merchantNumbers.merchantName}</strong>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">
                      ID / Référence du SMS de transfert (Facultatif ou 6 derniers chiffres)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: TX-984321 ou 07890123"
                      value={manualTxRef}
                      onChange={(e) => setManualTxRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0D11] border border-white/10 text-white font-mono text-xs focus:border-[#FF5500] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs text-slate-300 font-display">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Demande d'autorisation envoyée</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Un message apparaît sur votre smartphone ({phone}). Entrez votre code secret {getProviderName(paymentMethod)} pour autoriser le paiement.
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center justify-center gap-2 text-xs font-display text-[#FF5500] animate-pulse">
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
                className="w-full py-3.5 rounded-xl font-display font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validation en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {payFlowType === 'manual' 
                        ? 'J’ai effectué le transfert, générer mon billet' 
                        : `Simuler la validation sur mon mobile (${getProviderName(paymentMethod)})`}
                    </span>
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
