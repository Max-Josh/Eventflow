import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  CheckCircle2, 
  Upload,
  Sparkles
} from 'lucide-react';
import { EventItem, EventCategory, LocationType } from '../../types';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (newEvent: EventItem) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
];

// Heures courantes pour conférences & formations
const COMMON_HOURS = [
  '08:00', '08:30', '09:00', '09:30', '10:00',
  '14:00', '14:30', '15:00', '16:00',
  '18:00', '18:30', '19:00', '20:00'
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onCreate,
}) => {
  // Calcul d'une date par défaut : Samedi prochain
  const getNextSaturdayDate = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('conference');
  const [locationType, setLocationType] = useState<LocationType>('in-person');
  const [selectedDate, setSelectedDate] = useState<string>(getNextSaturdayDate());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [address, setAddress] = useState('Sofitel Hôtel Ivoire, Cocody');
  const [city, setCity] = useState('Abidjan');
  const [capacity, setCapacity] = useState<number>(100);
  const [price, setPrice] = useState<number>(15000);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0]);

  // Raccourcis de dates rapides
  const setQuickDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Concaténation de la date choisie et de l'heure choisie
    const fullStartDate = `${selectedDate}T${selectedTime}:00`;
    const startDateObj = new Date(fullStartDate);
    const endDateObj = new Date(startDateObj.getTime() + 4 * 3600000); // +4h par défaut

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || 'Session d’exception organisée en Côte d’Ivoire. Encaissement sécurisé et places limitées.',
      category,
      coverImage,
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString(),
      locationType,
      address: locationType === 'online' ? 'Webinaire en direct (Lien envoyé après inscription)' : address,
      city,
      capacity: Number(capacity) || 50,
      availableTickets: Number(capacity) || 50,
      price: Number(price) || 0,
      currency: 'XOF',
      status: 'published',
      organizer: {
        id: 'org-current',
        name: 'Mon Organisation CI',
        logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
        email: 'contact@eventflow.ci',
        phone: '+225 07 00 11 22 33',
        verified: true,
      },
      features: [
        'Accès complet à la session',
        'Billet officiel QR Code infalsifiable',
        'Support et documentation inclus',
      ],
      createdAt: new Date().toISOString(),
    };

    onCreate(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#131720] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0F1218]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5500]">
              ASSISTANT CRÉATION
            </span>
            <h3 className="text-base font-display font-bold text-white mt-0.5">
              Publier un événement ou une formation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Titre */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
              Titre de l'activité *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Masterclass E-Commerce & Logistique Abidjan 2026"
              className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
            />
          </div>

          {/* Catégorie et Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500] cursor-pointer"
              >
                <option value="formation">Formation certifiante</option>
                <option value="conference">Conférence & Sommet</option>
                <option value="atelier">Atelier pratique (Workshop)</option>
                <option value="seminaire">Séminaire d'entreprise</option>
                <option value="afterwork">Networking / Afterwork</option>
                <option value="concert">Spectacle / Concert / Événement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                Format
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
                className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500] cursor-pointer"
              >
                <option value="in-person">Présentiel (Salle physique)</option>
                <option value="online">En Ligne (Webinaire / Visio)</option>
                <option value="hybrid">Hybride (Salle + Reetransmission)</option>
              </select>
            </div>
          </div>

          {/* SÉLECTEUR ERGONOMIQUE DE DATE & HEURE (Plus de saisie compliquée) */}
          <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#FF5500] uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date & Heure de début (Sélection simple)</span>
              </label>

              {/* Raccourcis de dates rapides */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <span>Raccourcis :</span>
                <button
                  type="button"
                  onClick={() => setQuickDate(3)}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  Dans 3j
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  Samedi prochain
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(14)}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  Dans 2 sem.
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Choix Date */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  1. Choisir le jour :
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    style={{ colorScheme: 'dark' }}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#131720] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500] cursor-pointer"
                  />
                </div>
              </div>

              {/* Choix Heure */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  2. Choisir l'heure de début :
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="flex-1 bg-[#131720] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF5500] cursor-pointer"
                  >
                    {COMMON_HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    style={{ colorScheme: 'dark' }}
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    title="Ou spécifier une minute précise"
                    className="w-24 bg-[#131720] border border-white/15 rounded-xl px-2 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF5500] text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lieu & Ville si présentiel */}
          {locationType !== 'online' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                  Ville (Côte d'Ivoire)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Abidjan"
                  className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                  Salle / Lieu de l'activité
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Sofitel Hôtel Ivoire, Cocody"
                  className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>
          )}

          {/* Capacité & Tarif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                Capacité (Places max)
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                Tarif du Pass (0 si gratuit)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#FF5500]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#FF5500]">
                  FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
              Description de l'activité
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détaillez les objectifs, le public ciblé et les compétences qui seront acquises..."
              className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500] leading-relaxed"
            />
          </div>

          {/* Affiches / Couverture */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-2 uppercase">
              Illustration de l'affiche
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_IMAGES.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Choix ${i}`}
                  onClick={() => setCoverImage(img)}
                  className={`w-16 h-11 object-cover rounded-xl cursor-pointer border-2 transition-all shrink-0 ${
                    coverImage === img ? 'border-[#FF5500] scale-105 shadow-md shadow-[#FF5500]/30' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bouton de soumission sobre & pro */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-display font-semibold text-white bg-[#FF5500] hover:bg-[#E04B00] shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Publier et activer les encaissements GeniusPay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
