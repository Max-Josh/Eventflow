import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle2, 
  QrCode,
  Zap
} from 'lucide-react';
import { Registration, EventItem } from '../../types';
import { formatFCFA, formatShortDate, getPaymentMethodDetails } from '../../utils/formatters';

interface ParticipantsTableProps {
  registrations: Registration[];
  events: EventItem[];
  onToggleCheckIn: (id: string) => void;
  onViewTicket: (reg: Registration) => void;
}

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  registrations,
  events,
  onToggleCheckIn,
  onViewTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [checkInFilter, setCheckInFilter] = useState<'all' | 'checked_in' | 'pending'>('all');

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        reg.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg.company && reg.company.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchEvent =
        selectedEventId === 'all' || reg.eventId === selectedEventId;

      const matchCheckIn =
        checkInFilter === 'all' ||
        (checkInFilter === 'checked_in' && reg.checkedIn) ||
        (checkInFilter === 'pending' && !reg.checkedIn);

      return matchSearch && matchEvent && matchCheckIn;
    });
  }, [registrations, searchTerm, selectedEventId, checkInFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Reference',
      'Evenement',
      'Prenom',
      'Nom',
      'Email',
      'Telephone',
      'Entreprise',
      'Montant_FCFA',
      'Moyen_Paiement',
      'Statut_Paiement',
      'Entree_Scanne',
      'Date_Inscription',
    ];

    const rows = filteredRegistrations.map((r) => [
      r.referenceNumber,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.firstName}"`,
      `"${r.lastName}"`,
      r.email,
      r.phone,
      `"${r.company || ''}"`,
      r.amountPaid,
      r.paymentMethod,
      r.paymentStatus,
      r.checkedIn ? 'OUI' : 'NON',
      r.registeredAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `participants_eventflow_ci_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#121726] rounded-3xl border border-white/10 shadow-xl overflow-hidden">
      {/* Header and Toolbar */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <span>Liste des Inscrits & Billetterie</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-display font-semibold bg-indigo-500/20 text-indigo-300">
              {filteredRegistrations.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-display">
            Suivi des encaissements GeniusPay (Mobile Money & Cartes) et validation des billets QR
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-display font-bold text-white border border-white/10 transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exporter CSV / Excel</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="p-4 bg-[#0A0D14] border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher (nom, réf, email)..."
            className="w-full bg-[#121726] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Event filter */}
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="bg-[#121726] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-display"
        >
          <option value="all">Tous les événements</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.title}
            </option>
          ))}
        </select>

        {/* Check-in status filter */}
        <select
          value={checkInFilter}
          onChange={(e) => setCheckInFilter(e.target.value as any)}
          className="bg-[#121726] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-display"
        >
          <option value="all">Tous les statuts d'entrée</option>
          <option value="checked_in">✅ Déjà entré (Scanné)</option>
          <option value="pending">⏳ En attente d'arrivée</option>
        </select>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A0D14] text-slate-400 uppercase font-display font-semibold text-[10px] tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Référence</th>
              <th className="py-3.5 px-4">Participant</th>
              <th className="py-3.5 px-4">Événement</th>
              <th className="py-3.5 px-4">Règlement</th>
              <th className="py-3.5 px-4">Contrôle Accès</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((reg) => {
                const methodInfo = getPaymentMethodDetails(reg.paymentMethod);

                return (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    {/* Reference */}
                    <td className="py-4 px-4 font-mono font-bold text-indigo-400">
                      {reg.referenceNumber}
                    </td>

                    {/* Participant Details */}
                    <td className="py-4 px-4">
                      <div className="font-display font-bold text-white">
                        {reg.firstName} {reg.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400">{reg.email}</div>
                      <div className="text-[10px] text-slate-500">{reg.phone}</div>
                    </td>

                    {/* Event Title */}
                    <td className="py-4 px-4 max-w-[200px]">
                      <div className="text-white/90 truncate font-display font-medium">
                        {reg.eventTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Inscrit le {formatShortDate(reg.registeredAt)}
                      </div>
                    </td>

                    {/* Payment Info */}
                    <td className="py-4 px-4">
                      <div className="font-display font-bold text-white">
                        {formatFCFA(reg.amountPaid)}
                      </div>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-display font-semibold border ${methodInfo.badgeClass}`}>
                        {methodInfo.label}
                      </span>
                    </td>

                    {/* Check-in status */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => onToggleCheckIn(reg.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-display font-bold transition-all cursor-pointer ${
                          reg.checkedIn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#0A0D14] hover:bg-white/5 text-slate-400 border border-white/10'
                        }`}
                      >
                        {reg.checkedIn ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Entré ✅</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-slate-500" />
                            <span>Non scanné</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onViewTicket(reg)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 font-display font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-display">
                  Aucun participant ne correspond à vos filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
