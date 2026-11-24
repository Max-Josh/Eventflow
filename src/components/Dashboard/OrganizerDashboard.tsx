import React, { useState } from 'react';
import { 
  PlusCircle, 
  QrCode, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Smartphone, 
  CheckCircle2, 
  Share2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { EventItem, Registration } from '../../types';
import { formatFCFA, formatShortDate } from '../../utils/formatters';
import { ParticipantsTable } from './ParticipantsTable';

interface OrganizerDashboardProps {
  events: EventItem[];
  registrations: Registration[];
  onOpenCreateModal: () => void;
  onOpenScannerModal: () => void;
  onToggleCheckIn: (id: string) => void;
  onViewTicket: (reg: Registration) => void;
  onSelectEvent: (event: EventItem) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  events,
  registrations,
  onOpenCreateModal,
  onOpenScannerModal,
  onToggleCheckIn,
  onViewTicket,
  onSelectEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'participants'>('overview');

  // Compute live KPIs
  const totalRevenue = registrations.reduce((acc, curr) => acc + (curr.paymentStatus === 'completed' ? curr.amountPaid : 0), 0);
  const totalRegistrations = registrations.length;
  const checkedInCount = registrations.filter(r => r.checkedIn).length;
  const attendanceRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

  // Payment Breakdown
  const waveCount = registrations.filter(r => r.paymentMethod === 'wave').length;
  const omCount = registrations.filter(r => r.paymentMethod === 'orange_money').length;
  const mtnCount = registrations.filter(r => r.paymentMethod === 'mtn_momo').length;
  const moovCount = registrations.filter(r => r.paymentMethod === 'moov_money').length;
  const cardCount = registrations.filter(r => r.paymentMethod === 'card').length;
  const freeCount = registrations.filter(r => r.paymentMethod === 'free').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Top Banner / Welcome in clean pro style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#131720] border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF5500] shrink-0 flex items-center justify-center text-white font-display font-black text-lg">
            EF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold text-white">
                Côte d’Ivoire Innovation Hub
              </h1>
              <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400" title="Compte vérifié">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Compte Organisateur Certifié</span>
              <span>•</span>
              <span className="text-slate-400">Abidjan, Côte d'Ivoire</span>
            </div>
          </div>
        </div>

        {/* Action CTAs for Organizer */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenScannerModal}
            className="px-3.5 py-2 rounded-xl bg-[#0B0D11] hover:bg-white/5 text-slate-200 border border-white/10 text-xs font-display font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#FF5500]" />
            <span>Scanner les Entrées</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-display font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer un événement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#131720] rounded-xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
            <span>Recettes Encaissées</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-slate-300">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white">
            {formatFCFA(totalRevenue)}
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1 font-sans">
            <ShieldCheck className="w-3.5 h-3.5" /> Séquestre garanti
          </div>
        </div>

        {/* Total Registrations */}
        <div className="bg-[#131720] rounded-xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
            <span>Inscriptions Enregistrées</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white">
            {totalRegistrations} <span className="text-xs text-slate-500 font-normal">participants</span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 font-sans">
            Sur {events.length} activités publiées
          </div>
        </div>

        {/* Check-ins / Scanned */}
        <div className="bg-[#131720] rounded-xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
            <span>Billets Scannés à l'Entrée</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-slate-300">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white">
            {checkedInCount} <span className="text-xs text-slate-500 font-normal">/ {totalRegistrations}</span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 font-sans">
            Taux de présence : {attendanceRate}%
          </div>
        </div>

        {/* Mobile Money Share */}
        <div className="bg-[#131720] rounded-xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
            <span>Répartition des Ventes</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-slate-300">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1 text-xs font-mono font-bold">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
              Wave:{waveCount}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400">
              OM:{omCount}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
              MTN:{mtnCount}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
              Moov:{moovCount}
            </span>
            {cardCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                CB:{cardCount}
              </span>
            )}
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 font-sans">
            {freeCount} pass gratuits inclus
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-sans">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'events'
              ? 'bg-white text-slate-900 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Mes Événements ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'participants'
              ? 'bg-white text-slate-900 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Participants & Billetterie ({registrations.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Vos événements en cours
              </h3>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs text-[#FF5500] hover:underline font-sans cursor-pointer"
              >
                Tout voir →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="bg-[#131720] rounded-xl p-4 border border-white/10 hover:border-white/20 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/40 text-slate-300">
                        {evt.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {formatFCFA(evt.price)}
                      </span>
                    </div>
                    <h4 className="text-xs font-display font-bold text-white line-clamp-1">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-emerald-400">
                      {evt.availableTickets} places dispo
                    </span>
                    <button
                      onClick={() => onSelectEvent(evt)}
                      className="text-[#FF5500] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>Aperçu public</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Participants */}
          <ParticipantsTable
            registrations={registrations}
            events={events}
            onToggleCheckIn={onToggleCheckIn}
            onViewTicket={onViewTicket}
          />
        </div>
      )}

      {/* Tab: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Gestion de votre catalogue
            </h3>
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] text-xs font-display font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nouveau</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#131720] rounded-2xl p-4 border border-white/10 flex gap-4"
              >
                <img
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between font-sans">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {evt.city} • {formatShortDate(evt.startDate)}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {formatFCFA(evt.price)}
                      </span>
                    </div>
                    <h4 className="text-xs font-display font-bold text-white mt-0.5 line-clamp-1">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Jauge : {evt.capacity} • Restantes : {evt.availableTickets}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => onSelectEvent(evt)}
                      className="px-2.5 py-1 rounded bg-[#0B0D11] hover:bg-white/10 text-xs text-white cursor-pointer"
                    >
                      Voir la page
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.origin + '#' + evt.slug);
                        alert(`Lien de l'événement copié !`);
                      }}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Participants Only */}
      {activeTab === 'participants' && (
        <ParticipantsTable
          registrations={registrations}
          events={events}
          onToggleCheckIn={onToggleCheckIn}
          onViewTicket={onViewTicket}
        />
      )}
    </div>
  );
};
