import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Tag, 
  SlidersHorizontal 
} from 'lucide-react';
import { EventItem } from '../types';
import { EventCard } from './EventCard';

interface EventCatalogProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onRegisterEvent: (event: EventItem) => void;
}

export const EventCatalog: React.FC<EventCatalogProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Tous les événements' },
    { id: 'conference', label: 'Conférences' },
    { id: 'formation', label: 'Formations' },
    { id: 'atelier', label: 'Ateliers' },
    { id: 'afterwork', label: 'Networking' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || evt.category === selectedCategory;

      const matchesCity =
        selectedCity === 'all' ||
        (selectedCity === 'En Ligne' ? evt.locationType === 'online' : evt.city.toLowerCase() === selectedCity.toLowerCase());

      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && evt.price === 0) ||
        (priceFilter === 'paid' && evt.price > 0);

      return matchesSearch && matchesCategory && matchesCity && matchesPrice;
    });
  }, [events, searchTerm, selectedCategory, selectedCity, priceFilter]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider block mb-1">
            EXPLORATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Agenda des conférences et formations
          </h2>
          <p className="mt-1 text-sm text-slate-400 font-sans">
            Sélectionnez votre session et réservez votre pass en Francs CFA via GeniusPay.
          </p>
        </div>

        {/* Quick price pills */}
        <div className="flex items-center gap-1 bg-[#131720] p-1 rounded-xl border border-white/10 text-xs font-sans">
          <button
            onClick={() => setPriceFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              priceFilter === 'all' 
                ? 'bg-[#FF5500] text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({events.length})
          </button>
          <button
            onClick={() => setPriceFilter('free')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              priceFilter === 'free' 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gratuits
          </button>
          <button
            onClick={() => setPriceFilter('paid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              priceFilter === 'paid' 
                ? 'bg-white/15 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Payants
          </button>
        </div>
      </div>

      {/* Search Bar & Category Pills */}
      <div className="mt-6 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par titre, ville, organisateur..."
            className="w-full bg-[#131720] border border-white/10 hover:border-white/20 focus:border-[#FF5500] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 transition-colors focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-sans">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'bg-[#131720] text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="mt-8">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={onSelectEvent}
                onRegister={onRegisterEvent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl bg-[#131720]/40 border border-white/5 font-sans">
            <SlidersHorizontal className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-display font-bold text-white">
              Aucun événement trouvé
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Essayez d'ajuster votre recherche ou réinitialisez les critères de sélection.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedCity('all');
                setPriceFilter('all');
              }}
              className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#FF5500] bg-[#FF5500]/10 hover:bg-[#FF5500]/20 transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
