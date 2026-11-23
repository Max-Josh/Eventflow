export type UserRole = 'organizer' | 'participant' | 'admin';

export type EventCategory = 
  | 'conference' 
  | 'formation' 
  | 'atelier' 
  | 'seminaire' 
  | 'afterwork' 
  | 'concert' 
  | 'networking';

export type EventStatus = 'draft' | 'published' | 'closed' | 'cancelled';

export type LocationType = 'in-person' | 'online' | 'hybrid';

export type PaymentMethod = 'wave' | 'orange_money' | 'mtn_momo' | 'card' | 'free';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Organizer {
  id: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
  verified: boolean;
  website?: string;
  bio?: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'email' | 'phone';
  required: boolean;
  options?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  coverImage: string;
  startDate: string; // ISO
  endDate: string; // ISO
  locationType: LocationType;
  address: string;
  city: string;
  capacity: number;
  availableTickets: number;
  price: number; // in FCFA (0 for free)
  currency: 'XOF';
  status: EventStatus;
  organizer: Organizer;
  speakers?: Array<{
    name: string;
    role: string;
    company: string;
    avatar: string;
  }>;
  customFields?: CustomField[];
  features?: string[];
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  referenceNumber: string; // e.g. EF-2026-8942
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionReference?: string;
  qrCodeValue: string;
  checkedIn: boolean;
  checkedInAt?: string;
  registeredAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number; // in FCFA per month
  description: string;
  popular?: boolean;
  features: string[];
  commissionRate: string;
  ctaText: string;
}
