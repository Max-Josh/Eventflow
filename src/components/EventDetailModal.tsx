import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Video,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { EventItem } from '../types';
import { formatFrenchDate, formatFCFA } from '../utils/formatters';

interface EventDetailModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegister: (event: EventItem) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onRegister,
}) => {
  if (!event) return null;

  const isSoldOut = event.availableTickets <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121726] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Cover Image & Close */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0A0D14]">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121726] via-[#121726]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0A0D14]/80 hover:bg-[#0A0D14] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-indigo-500 text-white border border-indigo-400 mb-2">
              {event.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0A0D14] p-3.5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-wider">Date & Heure</div>
              <div className="text-xs font-display font-bold text-white mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">{formatFrenchDate(event.startDate)}</span>
              </div>
            </div>

            <div className="bg-[#0A0D14] p-3.5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-wider">Lieu</div>
              <div className="text-xs font-display font-bold text-white mt-1 flex items-center gap-1.5">
                {event.locationType === 'online' ? (
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="truncate">{event.city}</span>
              </div>
            </div>

            <div className="bg-[#0A0D14] p-3.5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-wider">Disponibilité</div>
              <div className="text-xs font-display font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{event.availableTickets} restantes</span>
              </div>
            </div>

            <div className="bg-[#0A0D14] p-3.5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-wider">Tarif unitaire</div>
              <div className="text-xs font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mt-1">
                {formatFCFA(event.price)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-2">
              Présentation de l'événement
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Location Full Info */}
          <div className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div className="text-xs font-display">
              <span className="font-bold text-white block">Adresse exacte :</span>
              <span className="text-slate-300">{event.address}, {event.city}</span>
            </div>
          </div>

          {/* Organizer card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0D14] border border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={event.organizer.logo}
                alt={event.organizer.name}
                className="w-10 h-10 rounded-full object-cover border border-white/15"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-display font-bold text-white">
                    {event.organizer.name}
                  </span>
                  {event.organizer.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-display">
                  Organisateur officiel vérifié
                </p>
              </div>
            </div>
          </div>

          {/* GeniusPay Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between text-xs font-display">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200">Paiement 100% sécurisé via <strong>GeniusPay</strong> (Wave, Orange, MTN, Carte)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Garanti</span>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl font-display font-semibold text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Fermer
            </button>

            {isSoldOut ? (
              <button
                disabled
                className="px-6 py-3 rounded-xl font-display font-bold text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 cursor-not-allowed"
              >
                Complet (Plus de places disponibles)
              </button>
            ) : (
              <button
                onClick={() => onRegister(event)}
                className="px-8 py-3 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-rose-500 hover:from-indigo-600 hover:to-rose-600 shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Participer ({formatFCFA(event.price)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
