import React from 'react';
import { ShieldCheck, Smartphone, CreditCard, QrCode, Lock } from 'lucide-react';

export const MarqueeBanner: React.FC = () => {
  const partners = [
    { name: 'GeniusPay', label: 'Agrégateur de paiement agréé', code: 'GP' },
    { name: 'Wave Côte d\'Ivoire', label: 'Mobile Money instantané', code: 'WAVE' },
    { name: 'Orange Money CI', label: 'Réseau national', code: 'OM' },
    { name: 'MTN Mobile Money', label: 'MoMo Pay', code: 'MTN' },
    { name: 'Moov Money CI', label: 'Paiement direct', code: 'MOOV' },
    { name: 'Visa & Mastercard', label: 'Cartes bancaires sécurisées', code: 'CARD' },
    { name: 'QR Code Anti-Fraude', label: 'Contrôle portique temps réel', code: 'QR' },
  ];

  return (
    <div className="py-4 border-b border-white/5 bg-[#0D1017] overflow-hidden select-none">
      <div className="flex animate-marquee gap-8 items-center">
        {[...partners, ...partners, ...partners].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#131720] border border-white/5 hover:border-white/15 transition-colors whitespace-nowrap"
          >
            <span className="font-mono text-[10px] font-bold text-[#FF5500] bg-black/40 px-2 py-0.5 rounded border border-white/5">
              {item.code}
            </span>
            <div className="text-left font-sans">
              <span className="text-xs font-semibold text-slate-200 block">{item.name}</span>
              <span className="text-[10px] text-slate-500 block">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
