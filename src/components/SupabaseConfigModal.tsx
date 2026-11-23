import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  Key,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface SupabaseConfigModalProps {
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- ==========================================
-- EVENTFLOW CI - Schéma PostgreSQL & Supabase RLS
-- Marché : Côte d'Ivoire & UEMOA
-- Passerelle de Paiement : GeniusPay
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE ORGANISATIONS (Multi-tenant)
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(10) DEFAULT 'CI',
    currency VARCHAR(10) DEFAULT 'XOF',
    is_verified BOOLEAN DEFAULT FALSE,
    geniuspay_merchant_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE ÉVÉNEMENTS & FORMATIONS
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    cover_image_url TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location_type VARCHAR(20) DEFAULT 'in-person',
    address TEXT,
    city VARCHAR(100) DEFAULT 'Abidjan',
    capacity INTEGER NOT NULL DEFAULT 100,
    available_tickets INTEGER NOT NULL DEFAULT 100,
    price_xof NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE INSCRIPTIONS & PARTICIPANTS (GeniusPay)
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE RESTRICT,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(150),
    job_title VARCHAR(150),
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(30) NOT NULL, -- wave, orange_money, mtn_momo, card
    payment_status VARCHAR(30) NOT NULL DEFAULT 'completed',
    geniuspay_reference VARCHAR(100),
    qr_code_signature TEXT NOT NULL,
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les événements publiés sont visibles par tous"
ON public.events FOR SELECT USING (status = 'published');

CREATE POLICY "Les organisateurs gèrent uniquement leurs événements"
ON public.events FOR ALL
USING (auth.uid() IN (
    SELECT user_id FROM public.organization_members WHERE organization_id = events.organization_id
));

-- 6. INDEX DE PERFORMANCE
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_registrations_reference ON public.registrations(reference_number);
CREATE INDEX idx_registrations_event ON public.registrations(event_id);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#121726] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0E1322]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold text-white">
                  Schéma de Base de Données Supabase & RLS
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-display">
                Architecture de tables prêtes pour la production et intégration GeniusPay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-slate-300 space-y-2">
            <div className="font-display font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Comment déployer ce schéma en 1 minute :</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
              <li>Rendez-vous sur votre console <strong>Supabase</strong> (gratuit).</li>
              <li>Ouvrez le menu <strong>SQL Editor</strong> dans la barre latérale.</li>
              <li>Collez le script SQL ci-dessous et cliquez sur <strong>Run</strong>.</li>
            </ol>
          </div>

          {/* Code block */}
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-display font-semibold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le script SQL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="max-h-80 overflow-y-auto p-4 rounded-2xl bg-black/50 border border-white/10 text-[11px] font-mono text-slate-300 leading-relaxed scrollbar-thin">
              <code>{sqlSchema}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#0E1322] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-display font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
