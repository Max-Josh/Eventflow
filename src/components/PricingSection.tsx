import React from 'react';
import { Check, ShieldCheck, Zap } from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';
import { formatFCFA } from '../utils/formatters';

interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-indigo-600/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-display font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/25 mb-3.5">
            <Zap className="w-3.5 h-3.5" />
            Tarifs Transparents en Francs CFA
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Des formules conçues pour propulser vos activités
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Que vous organisiez un atelier gratuit, un séminaire d'entreprise ou une conférence internationale, EVENTFLOW CI s'associe à <strong>GeniusPay</strong> pour vous offrir les meilleurs taux.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPro = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPro
                    ? 'bg-gradient-to-b from-[#182033] to-[#101524] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2'
                    : 'bg-[#121726] border border-white/10 hover:border-white/20'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-display font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-md">
                    Recommandé • Le plus populaire
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-display font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                  <div className="mt-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                        {plan.price === 0 ? 'Gratuit' : formatFCFA(plan.price).replace(' FCFA', '')}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs text-slate-400 font-display">FCFA / mois</span>
                      )}
                    </div>
                    <div className="mt-2 text-[11px] font-display font-semibold text-indigo-400">
                      Commission GeniusPay : {plan.commissionRate}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="mt-6 space-y-3.5 text-xs text-slate-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-3.5 rounded-xl text-xs font-display font-bold transition-all cursor-pointer ${
                      isPro
                        ? 'bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance banner */}
        <div className="mt-12 p-6 rounded-3xl bg-[#121726] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 max-w-4xl mx-auto">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-display font-bold text-white">Séparation stricte des fonds collectés</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Les montants de vos ventes sont sécurisés sur un compte séquestre régulé par la passerelle GeniusPay. Virement sous 24h ouvrées.
              </p>
            </div>
          </div>
          <div className="shrink-0 font-display font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl">
            Audit conforme BCEAO
          </div>
        </div>
      </div>
    </section>
  );
};
