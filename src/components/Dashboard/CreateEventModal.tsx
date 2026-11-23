import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon,
  Zap,
  ShieldCheck
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

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('conference');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [locationType, setLocationType] = useState<LocationType>('in-person');
  const [address, setAddress] = useState('Sofitel Hôtel Ivoire, Cocody');
  const [city, setCity] = useState('Abidjan');
  const [capacity, setCapacity] = useState<number>(100);
  const [price, setPrice] = useState<number>(15000);
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || 'Une activité professionnelle d’exception organisée en Côte d’Ivoire.',
      category,
      coverImage,
      startDate: startDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      locationType,
      address,
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
        email: 'organisateur@eventflow.ci',
        phone: '+225 07 00 11 22 33',
        verified: true,
      },
      features: [
        'Accès complet à la session',
        'Billet numérique QR Code sécurisé',
        'Support pédagogique et attestation de présence',
      ],
      createdAt: new Date().toISOString(),
    };

    onCreate(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#121726] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0E1322]">
          <div>
            <span className="text-[10px] font-display font-extrabold uppercase tracking-wider text-indigo-400">
              Assistant Création
            </span>
            <h3 className="text-lg font-display font-bold text-white mt-0.5">
              Publier un événement ou une formation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
              Titre de l'activité *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Conférence E-Commerce & Logistique Abidjan 2026"
              className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category & Format */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-display"
              >
                <option value="conference">Conférence</option>
                <option value="formation">Formation certifiante</option>
                <option value="atelier">Atelier pratique</option>
                <option value="seminaire">Séminaire</option>
                <option value="afterwork">Networking / Afterwork</option>
                <option value="concert">Concert / Événement</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                Format
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-display"
              >
                <option value="in-person">En Présentiel</option>
                <option value="online">En Ligne (Webinaire)</option>
                <option value="hybrid">Hybride</option>
              </select>
            </div>
          </div>

          {/* Location & City */}
          {locationType !== 'online' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Ville (Côte d'Ivoire)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Abidjan"
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                  Adresse / Salle
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Sofitel Hôtel Ivoire, Cocody"
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Date & Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                Date & Heure de début
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
                Capacité (Nombre max de places)
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
              Tarif par participant (en FCFA - tapez 0 si gratuit)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-display font-bold"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-display font-bold text-indigo-400">
                FCFA (GeniusPay)
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-display font-medium text-slate-300 mb-1">
              Description de l'activité
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détaillez les objectifs, le programme et ce que les participants vont apprendre..."
              className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Choose visual */}
          <div>
            <label className="block text-[11px] font-display font-medium text-slate-300 mb-2">
              Illustration de couverture
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_IMAGES.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Choix ${i}`}
                  onClick={() => setCoverImage(img)}
                  className={`w-14 h-10 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                    coverImage === img ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publier et activer les encaissements GeniusPay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
