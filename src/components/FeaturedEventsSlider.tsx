import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Flame,
  Check
} from 'lucide-react';
import { EventItem } from '../types';
import { formatFCFA, formatFrenchDate } from '../utils/formatters';

interface FeaturedEventsSliderProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onRegisterEvent: (event: EventItem) => void;
}

export const FeaturedEventsSlider: React.FC<FeaturedEventsSliderProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent,
}) => {
  const featured = events.slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, featured.length]);

  if (featured.length === 0) return null;

  const currentEvent = featured[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <section 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider">
            ÉVÉNEMENTS À LA UNE
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-500 font-sans">
            — Les sessions les plus demandées cette semaine
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            aria-label="Précédent"
            className="w-8 h-8 rounded-lg bg-[#131720] hover:bg-[#1A202C] text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Suivant"
            className="w-8 h-8 rounded-lg bg-[#131720] hover:bg-[#1A202C] text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="rounded-2xl border border-white/10 bg-[#131720] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          {/* Left Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-slate-200">
                  {currentEvent.category}
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {currentEvent.availableTickets} places disponibles
                </span>
              </div>

              <h3 
                onClick={() => onSelectEvent(currentEvent)}
                className="text-2xl sm:text-3xl font-display font-bold text-white hover:text-[#FF5500] transition-colors cursor-pointer leading-tight tracking-tight line-clamp-2"
              >
                {currentEvent.title}
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-400 font-sans leading-relaxed line-clamp-2">
                {currentEvent.description}
              </p>

              <div className="mt-5 space-y-1.5 text-xs text-slate-300 font-sans">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF5500]" />
                  <span>{formatFrenchDate(currentEvent.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{currentEvent.address}, {currentEvent.city}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Tarif</span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-white">
                  {currentEvent.price === 0 ? 'Gratuit' : formatFCFA(currentEvent.price)}
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => onSelectEvent(currentEvent)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-display font-medium text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Programme détaillé
                </button>
                <button
                  onClick={() => onRegisterEvent(currentEvent)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-display font-semibold text-xs text-white bg-[#FF5500] hover:bg-[#E04B00] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Réserver ma place</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-[#0B0D11]">
            <img
              src={currentEvent.coverImage}
              alt={currentEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#131720] via-transparent to-transparent" />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-xs font-sans">
              <span className="text-slate-400">Par</span>
              <span className="text-white font-medium">{currentEvent.organizer.name}</span>
            </div>
          </div>
        </div>

        {/* Bottom Slide Dots */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#0F1218] border-t border-white/5 text-xs">
          <div className="flex items-center gap-1.5">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Aller au slide ${idx + 1}`}
                className={`transition-all rounded-full h-1.5 ${
                  currentIndex === idx ? 'w-6 bg-[#FF5500]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {currentIndex + 1} / {featured.length}
          </span>
        </div>
      </div>
    </section>
  );
};
