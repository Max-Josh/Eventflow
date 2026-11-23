import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  QrCode, 
  Download, 
  Send,
  ExternalLink,
  Globe
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EventItem } from '../types';
import { formatFCFA, formatFrenchDate } from '../utils/formatters';

interface ShareEventModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const ShareEventModal: React.FC<ShareEventModalProps> = ({ event, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!event) return null;

  // Real public direct registration URL
  const eventUrl = `${window.location.origin}/#${event.slug}`;

  // Ready-to-send WhatsApp / Social message optimized for Ivory Coast
  const promoMessage = `📢 *${event.title.toUpperCase()}*\n\n` +
    `🗓 Date : ${formatFrenchDate(event.startDate)}\n` +
    `📍 Lieu : ${event.address}, ${event.city}\n` +
    `🎟 Tarif : ${event.price === 0 ? 'Gratuit' : formatFCFA(event.price)}\n\n` +
    `👉 *Inscrivez-vous et réservez votre pass en ligne (Wave / Orange Money / MTN) ici :*\n` +
    `${eventUrl}\n\n` +
    `_Nombre de places limité (${event.availableTickets} restantes)._`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(promoMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(promoMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(eventUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(eventUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-[#131720] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0F1218]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5500] flex items-center justify-center text-white">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                Partager et Promouvoir votre formation
              </h3>
              <p className="text-[11px] text-slate-400">
                Lien direct d'inscription et kit de diffusion pour vos participants
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

        {/* Body Content */}
        <div className="p-5 space-y-5">
          {/* Direct Link Section */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1.5 uppercase">
              1. Lien unique d'inscription direct
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={eventUrl}
                className="flex-1 bg-[#0B0D11] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl text-xs font-display font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Partagez ce lien sur vos statuts WhatsApp, bios Instagram, emails ou sites web. Vos participants s'y inscrivent directement.
            </p>
          </div>

          {/* Social Channels Quick Buttons */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1.5 uppercase">
              2. Canaux de diffusion rapide (En 1 clic)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-display font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Statut WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleLinkedInShare}
                className="p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-display font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-sky-400" />
                <span>LinkedIn Pro</span>
              </button>

              <button
                type="button"
                onClick={handleFacebookShare}
                className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-display font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>Facebook / X</span>
              </button>
            </div>
          </div>

          {/* Pre-written WhatsApp Pitch */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-mono font-medium text-slate-300 uppercase">
                3. Texte d'invitation prêt à envoyer (WhatsApp & SMS)
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] text-[#FF5500] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedMessage ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMessage ? 'Texte copié !' : 'Copier le message'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#0B0D11] border border-white/10 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {promoMessage}
            </pre>
          </div>

          {/* QR Code for Printed Posters / Kakemonos */}
          <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
              <QRCodeSVG
                value={eventUrl}
                size={96}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-left space-y-1">
              <span className="text-xs font-display font-bold text-white block">
                QR Code pour vos affiches & roll-ups physiques
              </span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Imprimez ce QR code sur vos flyers, kakemonos au bureau ou en story. Les personnes le scannent avec l'appareil photo de leur smartphone pour ouvrir directement le guichet de paiement GeniusPay.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0F1218] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-display font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
