import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ShieldCheck,
  Share2,
  Lock,
  Zap
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Registration, EventItem } from '../types';
import { formatFrenchDate, formatFCFA, getPaymentMethodDetails } from '../utils/formatters';

interface DigitalTicketModalProps {
  registration: Registration | null;
  event: EventItem | null;
  onClose: () => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  registration,
  event,
  onClose,
}) => {
  if (!registration || !event) return null;

  const paymentInfo = getPaymentMethodDetails(registration.paymentMethod);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Billet EVENTFLOW CI - ${event.title}`,
        text: `Voici mon billet pour ${event.title}. Réf: ${registration.referenceNumber}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Lien du billet copié ! Référence : ${registration.referenceNumber}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#131720] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-6 sm:p-7">
          {/* Header Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF5500] flex items-center justify-center shadow-md font-display font-black text-white text-xs">
                EF
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight text-white">
                EVENTFLOW CI
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-display font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Billet Vérifié & Sécurisé
            </span>
          </div>

          {/* Ticket Card Visual with sleek dark luxury styling */}
          <div className="mt-4 bg-[#0B0D11] rounded-3xl border border-[#FF5500]/30 p-6 shadow-inner relative overflow-hidden">
            {/* Event Title */}
            <div className="text-[11px] font-mono font-bold text-[#FF5500] uppercase tracking-wider mb-1">
              {event.category.toUpperCase()}
            </div>
            <h2 className="text-base sm:text-lg font-display font-extrabold text-white leading-snug">
              {event.title}
            </h2>

            {/* Date & Location */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-300 font-display">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>{formatFrenchDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{event.city} • {event.address}</span>
              </div>
            </div>

            {/* Dashed separation line with ticket cutouts */}
            <div className="relative my-6">
              <div className="border-t-2 border-dashed border-white/10" />
              <div className="absolute -left-9 -top-3 w-6 h-6 rounded-full bg-[#131720]" />
              <div className="absolute -right-9 -top-3 w-6 h-6 rounded-full bg-[#131720]" />
            </div>

            {/* QR Code Section with Anti-Fraud Hologram */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-xl relative">
                <QRCodeSVG
                  value={registration.qrCodeValue}
                  size={148}
                  level="H"
                  includeMargin={false}
                />
                {/* Security Stamp */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <ShieldCheck className="w-16 h-16 text-indigo-900" />
                </div>
              </div>

              {/* Reference number */}
              <div className="mt-3 text-center">
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-400 block">
                  Numéro de référence
                </span>
                <span className="font-mono text-sm font-bold text-[#FF5500]">
                  {registration.referenceNumber}
                </span>
              </div>
            </div>

            {/* Participant Details */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-display">
              <div>
                <span className="text-[10px] text-slate-400 block">Titulaire du Pass</span>
                <span className="font-bold text-white block truncate">
                  {registration.firstName} {registration.lastName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Montant Réglé</span>
                <span className="font-bold text-emerald-400 block">
                  {registration.amountPaid === 0 ? 'Gratuit' : formatFCFA(registration.amountPaid)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Passerelle de Paiement</span>
                <span className="font-semibold text-slate-300 block truncate flex items-center gap-1">
                  <Zap className="w-3 h-3 text-sky-400" />
                  GeniusPay
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Statut d'accès</span>
                <span className={`font-bold block ${registration.checkedIn ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {registration.checkedIn ? 'Déjà composté' : 'Valide pour entrée'}
                </span>
              </div>
            </div>

            {/* Security footer note */}
            <div className="mt-4 p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-[10px] text-slate-400 font-display">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Billet infalsifiable crypté HMAC-SHA256. Présentez ce QR Code au portique d'entrée.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-xl font-display font-semibold text-xs text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partager</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
