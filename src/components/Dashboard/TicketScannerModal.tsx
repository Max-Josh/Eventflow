import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  Search,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Registration } from '../../types';

interface TicketScannerModalProps {
  registrations: Registration[];
  onCheckIn: (registrationId: string) => void;
  onClose: () => void;
}

export const TicketScannerModal: React.FC<TicketScannerModalProps> = ({
  registrations,
  onCheckIn,
  onClose,
}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'already_used' | 'not_found';
    registration?: Registration;
    message?: string;
  }>({ status: 'idle' });

  // Quick test references
  const pendingSample = registrations.find(r => !r.checkedIn);
  const checkedInSample = registrations.find(r => r.checkedIn);

  const handleVerify = (codeToTest?: string) => {
    const rawInput = (codeToTest || scannedCode).trim();
    if (!rawInput) return;

    // Search by referenceNumber or QR code value
    const match = registrations.find(
      r => r.referenceNumber.toLowerCase() === rawInput.toLowerCase() ||
           r.qrCodeValue.toLowerCase().includes(rawInput.toLowerCase()) ||
           `${r.firstName} ${r.lastName}`.toLowerCase().includes(rawInput.toLowerCase())
    );

    if (!match) {
      setScanResult({
        status: 'not_found',
        message: 'Billet non reconnu ou invalide dans le système.',
      });
      return;
    }

    if (match.checkedIn) {
      setScanResult({
        status: 'already_used',
        registration: match,
        message: `ALERTE FRAUDE : Ce billet a déjà été composté à l'entrée à ${match.checkedInAt ? new Date(match.checkedInAt).toLocaleTimeString('fr-FR') : 'une heure antérieure'} !`,
      });
      return;
    }

    // Mark as checked in
    onCheckIn(match.id);
    setScanResult({
      status: 'success',
      registration: { ...match, checkedIn: true },
      message: 'ACCÈS AUTORISÉ : Signature vérifiée, entrée validée pour ce participant.',
    });
  };

  const totalScanned = registrations.filter(r => r.checkedIn).length;
  const totalRegistrations = registrations.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#121726] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0E1322]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold text-white">
                  Contrôle d’Accès • Scanneur QR
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                  Temps Réel
                </span>
              </div>
              <p className="text-xs text-slate-400 font-display">
                Détection instantanée anti-doublon et validation portique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Virtual Camera Viewport with laser scan animation */}
          <div className="relative w-full h-44 rounded-2xl bg-black border border-white/10 overflow-hidden flex flex-col items-center justify-center">
            {/* Animated laser beam */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line shadow-[0_0_12px_#10B981]" />

            <Camera className="w-10 h-10 text-slate-600 mb-2 animate-pulse" />
            <span className="text-xs font-display text-slate-400 font-medium">
              Viseur Caméra / Lecteur Laser USB actif
            </span>
            <span className="text-[10px] text-emerald-400 font-display mt-1">
              Positionnez le QR Code du billet face à la caméra
            </span>
          </div>

          {/* Manual Input Search */}
          <div className="space-y-2">
            <label className="block text-[11px] font-display font-medium text-slate-300">
              Saisir manuellement le code du billet ou le nom du participant :
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="Ex: EF-2026-8942 ou Jean Kouamé"
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => handleVerify()}
                className="px-5 py-2.5 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 transition-all cursor-pointer shadow-md"
              >
                Valider
              </button>
            </div>
          </div>

          {/* Quick Test Shortcuts */}
          <div className="p-3.5 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-2">
            <span className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-wider block">
              Tests rapides en direct :
            </span>
            <div className="flex flex-wrap gap-2">
              {pendingSample && (
                <button
                  onClick={() => {
                    setScannedCode(pendingSample.referenceNumber);
                    handleVerify(pendingSample.referenceNumber);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-display flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tester billet valide ({pendingSample.referenceNumber})</span>
                </button>
              )}
              {checkedInSample && (
                <button
                  onClick={() => {
                    setScannedCode(checkedInSample.referenceNumber);
                    handleVerify(checkedInSample.referenceNumber);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-display flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Tester doublon ({checkedInSample.referenceNumber})</span>
                </button>
              )}
            </div>
          </div>

          {/* Scan result display */}
          {scanResult.status !== 'idle' && (
            <div
              className={`p-4 rounded-2xl border text-xs font-display space-y-2 transition-all ${
                scanResult.status === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                  : scanResult.status === 'already_used'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                  : 'bg-rose-500/15 border-rose-500 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {scanResult.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {scanResult.status === 'already_used' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                {scanResult.status === 'not_found' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                <span>{scanResult.message}</span>
              </div>

              {scanResult.registration && (
                <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Titulaire :</span>
                    <span className="font-bold text-white">
                      {scanResult.registration.firstName} {scanResult.registration.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Événement :</span>
                    <span className="font-bold text-white truncate block">
                      {scanResult.registration.eventTitle}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Live Attendance Counter */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-display">
            <span className="text-slate-400">Total composté aujourd'hui :</span>
            <span className="text-sm font-bold text-emerald-400">
              {totalScanned} / {totalRegistrations} participants
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
