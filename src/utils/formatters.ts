/**
 * Format numbers as FCFA / XOF currency
 * e.g. 25000 -> "25 000 FCFA"
 */
export function formatFCFA(amount: number): string {
  if (amount === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

/**
 * Format date string into human friendly French date
 * e.g. "2026-11-20T09:00:00" -> "Samedi 20 Novembre 2026 à 09:00"
 */
export function formatFrenchDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Generate unique ticket reference number
 * e.g. "EF-CI-9842"
 */
export function generateTicketReference(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EF-CI-${random}`;
}

export function getPaymentMethodDetails(method: string) {
  switch (method) {
    case 'wave':
      return {
        label: 'Wave Côte d’Ivoire',
        color: '#1dc4e9',
        badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        fee: '0% de frais',
      };
    case 'orange_money':
      return {
        label: 'Orange Money CI',
        color: '#ff7900',
        badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        fee: '1% de frais',
      };
    case 'mtn_momo':
      return {
        label: 'MTN Mobile Money',
        color: '#ffcc00',
        badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        fee: '1% de frais',
      };
    case 'moov_money':
      return {
        label: 'Moov Money CI',
        color: '#0066b3',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        fee: '1% de frais',
      };
    case 'card':
      return {
        label: 'Carte Bancaire (Visa/Mastercard)',
        color: '#6366f1',
        badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        fee: '2% de frais',
      };
    default:
      return {
        label: 'Gratuit',
        color: '#10b981',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        fee: 'Aucun frais',
      };
  }
}
