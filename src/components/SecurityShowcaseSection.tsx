import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  Zap,
  Server,
  FileCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const SecurityShowcaseSection: React.FC = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(25);
  const [token, setToken] = useState('EF-SEC-8921-XOF');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setToken(`EF-SEC-${Math.floor(1000 + Math.random() * 9000)}-XOF`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const securitySpecs = [
    {
      title: 'Séquestre des fonds & Régulation',
      desc: 'Les encaissements collectés sont isolés sur des comptes séquestres bancaires partenaires régulés par la BCEAO. Les fonds des organisateurs sont juridiquement séparés du compte d\'exploitation.',
      badge: 'Zone UEMOA'
    },
    {
      title: 'QR Code dynamique à jeton rotatif',
      desc: 'Pour les grands événements, le QR code sur l\'application du participant se régénère toutes les 30 secondes. Cela élimine la revente illicite de captures d\'écran à plusieurs personnes.',
      badge: 'Anti-Screen'
    },
    {
      title: 'Vérification locale (Offline-Ready)',
      desc: 'Les portiques de scan peuvent vérifier l\'authenticité cryptographique de la signature même si le réseau 4G de la salle sature le jour J, évitant tout blocage à l\'entrée.',
      badge: 'Haute Disponibilité'
    },
    {
      title: 'Intégrité des webhooks GeniusPay',
      desc: 'Chaque notification de paiement est vérifiée par signature HMAC SHA-256 avec clé secrète partagée. Aucun billet n\'est émis sans confirmation bancaire irréversible.',
      badge: 'Idempotent'
    }
  ];

  return (
    <section className="py-16 border-b border-white/5 bg-[#0D1017]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Architecture de Sécurité & Conformité
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Comment vos ventes et vos accès sont protégés.
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl font-sans">
              La gestion d'une billetterie à fort volume requiert des garanties concrètes : isolation des fonds bancaires, traçabilité des paiements et tolérance aux pannes au portique d'entrée.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#131720] border border-white/10 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Passerelle : GeniusPay Live v2.1</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive QR Security Token Simulator */}
          <div className="lg:col-span-5 bg-[#131720] rounded-2xl border border-white/10 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
              <span className="text-slate-400">Simulation du billet dynamique</span>
              <span className="text-emerald-400 font-bold">● Valide</span>
            </div>

            <div className="flex flex-col items-center justify-center py-4 bg-[#0B0D11] rounded-xl border border-white/5">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <QRCodeSVG
                  value={`EVENTFLOW-PASS|${token}|VERIFIED`}
                  size={150}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rotation du jeton :</span>
                <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded font-mono">
                  {secondsRemaining}s
                </span>
              </div>

              <div className="mt-2 text-[10px] font-mono text-slate-500">
                Signature : sha256:{token}-pass-ci
              </div>
            </div>

            <div className="text-xs text-slate-400 font-sans leading-relaxed">
              Ce système empêche formellement un acheteur d'envoyer la même capture d'écran WhatsApp à 5 personnes différentes. Dès le premier compostage au portique, le numéro de série est verrouillé dans la base de données.
            </div>
          </div>

          {/* Technical Specs List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securitySpecs.map((spec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#131720] border border-white/10 hover:border-white/20 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#FF5500] uppercase tracking-wider bg-[#FF5500]/10 px-2 py-0.5 rounded">
                    {spec.badge}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-display font-bold text-white">
                  {spec.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
