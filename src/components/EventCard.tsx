import React from 'react';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Video
} from 'lucide-react';
import { EventItem } from '../types';
import { formatFCFA, formatFrenchDate } from '../utils/formatters';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onRegister,
}) => {
  const isSoldOut = event.availableTickets <= 0;
  const isFree = event.price === 0;

  const categoryLabels: Record<string, string> = {
    conference: 'Conférence',
    formation: 'Formation',
    atelier: 'Atelier pratique',
    seminaire: 'Séminaire',
    afterwork: 'Networking',
    concert: 'Spectacle / Concert',
  };

  return (
    <div className="group bg-[#131720] rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#0B0D11]">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131720] via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/75 text-slate-200 border border-white/10 backdrop-blur-sm">
          {categoryLabels[event.category] || event.category}
        </div>

        {/* Price tag */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold shadow-md ${
            isFree 
              ? 'bg-emerald-600 text-white' 
              : 'bg-[#FF5500] text-white'
          }`}>
            {formatFCFA(event.price)}
          </span>
        </div>

        {/* Location pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-slate-200 bg-black/75 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm font-sans">
          {event.locationType === 'online' ? (
            <>
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>En Ligne</span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[200px]">{event.city}</span>
            </>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between font-sans">
        <div>
          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-[#FF5500] font-mono font-medium mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatFrenchDate(event.startDate)}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(event)}
            className="text-base font-display font-bold text-white group-hover:text-[#FF5500] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {event.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={event.organizer.logo}
              alt={event.organizer.name}
              className="w-5 h-5 rounded-full object-cover border border-white/15"
            />
            <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
              {event.organizer.name}
            </span>
          </div>

          {isSoldOut ? (
            <span className="text-xs font-mono font-semibold text-rose-400 px-2.5 py-1 rounded bg-rose-500/10">
              Complet
            </span>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className="px-3 py-1.5 rounded-lg text-xs font-display font-semibold text-white bg-white/10 hover:bg-[#FF5500] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Réserver</span>
              <ArrowRight className="w-3 h-3 text-white/70" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
