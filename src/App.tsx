import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeBanner } from './components/MarqueeBanner';
import { FeaturedEventsSlider } from './components/FeaturedEventsSlider';
import { SecurityShowcaseSection } from './components/SecurityShowcaseSection';
import { EventCatalog } from './components/EventCatalog';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { EventDetailModal } from './components/EventDetailModal';
import { RegistrationModal } from './components/RegistrationModal';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { CreateEventModal } from './components/Dashboard/CreateEventModal';
import { TicketScannerModal } from './components/Dashboard/TicketScannerModal';
import { OrganizerDashboard } from './components/Dashboard/OrganizerDashboard';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { GeniusPayConfigModal } from './components/GeniusPayConfigModal';
import { AdminPanelModal } from './components/Admin/AdminPanelModal';
import { ShareEventModal } from './components/ShareEventModal';
import { AuthModal } from './components/AuthModal';

import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from './data/mockData';
import { EventItem, Registration, UserRole } from './types';

export function App() {
  // Global Data State with persistent cache
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('eventflow_events');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_EVENTS;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem('eventflow_registrations');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REGISTRATIONS;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('eventflow_events', JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('eventflow_registrations', JSON.stringify(registrations));
    } catch {
      // ignore
    }
  }, [registrations]);

  // Purge test registrations
  const handlePurgeRegistrations = () => {
    setRegistrations([]);
    try {
      localStorage.removeItem('eventflow_registrations');
    } catch {
      // ignore
    }
  };

  // Navigation & View States
  const [currentView, setCurrentView] = useState<'catalog' | 'dashboard' | 'scanner'>('catalog');
  const [role, setRole] = useState<UserRole>('organizer');

  // Modal States
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);
  const [selectedEventForShare, setSelectedEventForShare] = useState<EventItem | null>(null);
  const [activeTicket, setActiveTicket] = useState<Registration | null>(null);
  const [activeTicketEvent, setActiveTicketEvent] = useState<EventItem | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isGeniusPayModalOpen, setIsGeniusPayModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Actions
  const handleCreateEvent = (newEvent: EventItem) => {
    setEvents([newEvent, ...events]);
  };

  const handleRegisterSuccess = (newRegistration: Registration) => {
    // 1. Add registration
    setRegistrations([newRegistration, ...registrations]);

    // 2. Decrement available tickets for the event
    setEvents(prev =>
      prev.map(e => {
        if (e.id === newRegistration.eventId) {
          return {
            ...e,
            availableTickets: Math.max(0, e.availableTickets - 1),
          };
        }
        return e;
      })
    );

    // 3. Close registration modal & open ticket modal
    setSelectedEventForRegister(null);
    const relatedEvent = events.find(e => e.id === newRegistration.eventId) || null;
    setActiveTicketEvent(relatedEvent);
    setActiveTicket(newRegistration);
  };

  const handleToggleCheckIn = (id: string) => {
    setRegistrations(prev =>
      prev.map(r => {
        if (r.id === id) {
          const isNowChecked = !r.checkedIn;
          return {
            ...r,
            checkedIn: isNowChecked,
            checkedInAt: isNowChecked ? new Date().toISOString() : undefined,
          };
        }
        return r;
      })
    );
  };

  const handleViewTicketFromDashboard = (reg: Registration) => {
    const matchedEvent = events.find(e => e.id === reg.eventId) || null;
    setActiveTicketEvent(matchedEvent);
    setActiveTicket(reg);
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F3F4F6] flex flex-col selection:bg-[#FF5500] selection:text-white font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenGeniusPayModal={() => setIsGeniusPayModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        role={role}
        onRoleChange={setRole}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreClick={() => {
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onCreateClick={() => setIsCreateModalOpen(true)}
              onScannerClick={() => setIsScannerModalOpen(true)}
            />

            {/* Marquee Banner */}
            <MarqueeBanner />

            {/* Featured Events Slider */}
            <FeaturedEventsSlider
              events={events}
              onSelectEvent={setSelectedEventForDetail}
              onRegisterEvent={setSelectedEventForRegister}
            />

            {/* Security Showcase Section */}
            <SecurityShowcaseSection />

            {/* Event Catalog Grid & Filters */}
            <EventCatalog
              events={events}
              onSelectEvent={setSelectedEventForDetail}
              onRegisterEvent={setSelectedEventForRegister}
            />

            {/* Pricing Section */}
            <PricingSection
              onSelectPlan={() => {
                setIsCreateModalOpen(true);
              }}
            />
          </>
        )}

        {currentView === 'dashboard' && (
          <OrganizerDashboard
            events={events}
            registrations={registrations}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenScannerModal={() => setIsScannerModalOpen(true)}
            onToggleCheckIn={handleToggleCheckIn}
            onViewTicket={handleViewTicketFromDashboard}
            onSelectEvent={setSelectedEventForDetail}
          />
        )}

        {currentView === 'scanner' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-widest">
                Interface Portique d’Entrée
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
                Contrôle d'accès & Scanner QR Code
              </h1>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto font-sans">
                Vérifiez la validité des billets en direct sur smartphone ou lecteur laser. Détection automatique des doublons.
              </p>
            </div>
            
            <TicketScannerModal
              registrations={registrations}
              onCheckIn={handleToggleCheckIn}
              onClose={() => setCurrentView('dashboard')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentView}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Modals */}
      {isAdminModalOpen && (
        <AdminPanelModal
          onClose={() => setIsAdminModalOpen(false)}
          onOpenGeniusPayConfig={() => {
            setIsAdminModalOpen(false);
            setIsGeniusPayModalOpen(true);
          }}
          onOpenSupabaseConfig={() => {
            setIsAdminModalOpen(false);
            setIsSupabaseModalOpen(true);
          }}
          onPurgeRegistrations={handlePurgeRegistrations}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(newRole) => {
            setRole(newRole);
            if (newRole === 'admin') {
              setIsAdminModalOpen(true);
            } else if (newRole === 'organizer') {
              setCurrentView('dashboard');
            } else {
              setCurrentView('catalog');
            }
          }}
        />
      )}

      {selectedEventForDetail && (
        <EventDetailModal
          event={selectedEventForDetail}
          onClose={() => setSelectedEventForDetail(null)}
          onRegister={(evt) => {
            setSelectedEventForDetail(null);
            setSelectedEventForRegister(evt);
          }}
        />
      )}

      {selectedEventForRegister && (
        <RegistrationModal
          event={selectedEventForRegister}
          onClose={() => setSelectedEventForRegister(null)}
          onSuccess={handleRegisterSuccess}
        />
      )}

      {selectedEventForShare && (
        <ShareEventModal
          event={selectedEventForShare}
          onClose={() => setSelectedEventForShare(null)}
        />
      )}

      {activeTicket && (
        <DigitalTicketModal
          registration={activeTicket}
          event={activeTicketEvent}
          onClose={() => setActiveTicket(null)}
        />
      )}

      {isCreateModalOpen && (
        <CreateEventModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      )}

      {isScannerModalOpen && currentView !== 'scanner' && (
        <TicketScannerModal
          registrations={registrations}
          onCheckIn={handleToggleCheckIn}
          onClose={() => setIsScannerModalOpen(false)}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseConfigModal
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      )}

      {isGeniusPayModalOpen && (
        <GeniusPayConfigModal
          onClose={() => setIsGeniusPayModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
