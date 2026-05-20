import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BatteryCharging, HardHat, Leaf, Check, ArrowRight, Zap } from 'lucide-react';

const roiData = Array.from({ length: 16 }, (_, i) => ({
  jaar: i,
  conservatief: i === 0 ? -175000 : Math.round(-175000 + (i >= 5 ? (i - 5) * 12000 : 0)),
  realistisch: i === 0 ? -175000 : Math.round(-175000 + i * 22000 + i * i * 800),
}));

const scalingData = [
  { hubs: 1, costPerConnection: 49 },
  { hubs: 2, costPerConnection: 42 },
  { hubs: 5, costPerConnection: 35 },
  { hubs: 10, costPerConnection: 29 },
  { hubs: 20, costPerConnection: 22 },
];

const tiers = [
  {
    name: 'Starter',
    price: 29,
    features: ['EMS basis monitoring', 'Rapportage dashboard', 'E-mail alerts', 'Standaard support'],
    recommended: false,
  },
  {
    name: 'Professional',
    price: 49,
    features: ['Alles in Starter', 'AI-voorspelling', 'Batterijoptimalisatie', 'Curtailment beheer', 'Prioriteitssupport'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 79,
    features: ['Alles in Professional', 'Multi-hub beheer', 'API-toegang', 'Wit-label optie', '24/7 support'],
    recommended: false,
  },
];

const chartColors = {
  primary: '#27B296',
  secondary: '#2A2F87',
  accent: '#FF6B35',
  grid: '#252A32',
  text: '#8B95A5',
};

export default function Business() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Business Model</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Financiele projectie en prijsstelling</p>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-success" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Maandelijkse Inkomsten</span>
          </div>
          <div className="text-3xl font-bold">€ 1,087</div>
          <div className="text-sm text-muted-foreground">€ 13,044/jaar</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-success">
            <TrendingUp size={12} /> +8% vs vorige maand
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BatteryCharging size={16} className="text-secondary" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Investering Batterij</span>
          </div>
          <div className="text-3xl font-bold">€ 175,000</div>
          <div className="text-sm text-muted-foreground">Terugverdientijd: 8.2 jaar</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <HardHat size={16} className="text-warning" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Besparing Netverzwaring</span>
          </div>
          <div className="text-3xl font-bold">€ 85,000</div>
          <div className="text-sm text-muted-foreground">Vermeden kosten</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={16} className="text-success" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CO2-reductie</span>
          </div>
          <div className="text-3xl font-bold">12.4 ton</div>
          <div className="text-sm text-muted-foreground">per jaar (≡ 28 auto's)</div>
        </div>
      </div>

      {/* ROI Chart + Pricing */}
      <div className="grid grid-cols-2 gap-5">
        {/* ROI Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold mb-4">15-jaar ROI Projectie</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="jaar" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={{ stroke: chartColors.grid }} tickLine={false} />
                <YAxis tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid #252A32', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`€${v.toLocaleString('nl-NL')}`, '']} />
                <Line type="monotone" dataKey="realistisch" stroke={chartColors.primary} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="conservatief" stroke={chartColors.text} strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-primary rounded" /> Realistisch</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #8B95A5 0, #8B95A5 4px, transparent 4px, transparent 8px)' }} /> Conservatief</span>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="flex items-stretch gap-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex-1 bg-card rounded-xl p-4 border flex flex-col ${
                tier.recommended
                  ? 'border-primary ring-1 ring-primary/20'
                  : 'border-border'
              }`}
            >
              {tier.recommended && (
                <span className="self-start px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider mb-3">
                  Aanbevolen
                </span>
              )}
              <h4 className="text-lg font-semibold">{tier.name}</h4>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold">€{tier.price}</span>
                <span className="text-sm text-muted-foreground">/maand</span>
              </div>
              <ul className="space-y-2 flex-1">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <Check size={12} className="text-success mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  tier.recommended
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border hover:bg-muted'
                }`}
              >
                Selecteren
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scaling */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold mb-4">Opschaling naar Meerdere Hubs</h3>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Zap size={20} className="text-primary" />
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Zap key={i} size={16} className="text-primary" />
              ))}
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
            <div className="flex items-center gap-0.5 flex-wrap max-w-[60px]">
              {Array.from({ length: 12 }, (_, i) => (
                <Zap key={i} size={10} className="text-primary/60" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Huidig:</span>
              <span className="font-medium ml-1">1 hub, 10 aansluitingen</span>
            </div>
            <div>
              <span className="text-muted-foreground">Potentieel:</span>
              <span className="font-medium ml-1">20 hubs, 400 aansluitingen</span>
            </div>
          </div>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scalingData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="hubs" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={{ stroke: chartColors.grid }} tickLine={false} label={{ value: 'Aantal hubs', position: 'insideBottom', offset: -2, fill: chartColors.text, fontSize: 11 }} />
              <YAxis tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={false} tickLine={false} unit=" €" />
              <Tooltip contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid #252A32', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`€${v}`, 'Kosten per aansluiting']} />
              <Bar dataKey="costPerConnection" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
