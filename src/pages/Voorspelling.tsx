import { useEnergyData } from '@/hooks/useEnergyData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Line
} from 'recharts';
import { CheckCircle, Clock, Sun, Zap } from 'lucide-react';

const chartColors = {
  primary: '#27B296',
  secondary: '#2A2F87',
  accent: '#FF6B35',
  info: '#4A90D9',
  grid: '#252A32',
  text: '#8B95A5',
};

export default function Voorspelling() {
  const { hourlyData } = useEnergyData();

  const peakHour = hourlyData.reduce((max, h, i) => h.groupDemand > max.demand ? { demand: h.groupDemand, hour: i } : max, { demand: 0, hour: 0 });
  const riskLevel = peakHour.demand > 75 ? 'Laag' : peakHour.demand > 65 ? 'Medium' : 'Laag';
  const riskColor = peakHour.demand > 75 ? 'warning' : 'success';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Voorspelling</h1>
          <p className="text-sm text-muted-foreground mt-0.5">24-uurs groepsvraag voorspelling door AI-engine</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-5">
        {/* Expected Peak */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Verwachte piek</div>
          <div className="text-2xl font-bold">Vanavond {peakHour.hour.toString().padStart(2, '0')}:45</div>
          <div className="mt-1 text-sm text-warning font-medium">{peakHour.demand.toFixed(1)} kW voorspeld</div>
          <div className="mt-2 text-xs text-muted-foreground">Groeps-ATO: 80 kW</div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-warning transition-all"
              style={{ width: `${Math.min(100, (peakHour.demand / 80) * 100)}%` }}
            />
          </div>
        </div>

        {/* Battery Planning */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Batterijplanning</div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-secondary" /> Oplaadvenster</span>
                <span className="font-medium">02:00–06:00</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-secondary/60" style={{ width: '16.7%', marginLeft: '8.3%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-warning" /> Ontlaadvenster</span>
                <span className="font-medium">17:30–21:00</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-warning/60" style={{ width: '14.6%', marginLeft: '72.9%' }} />
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Verwachte SOC om 18:00: <span className="font-medium text-foreground">85%</span>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Risico-analyse</div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${riskColor}/10 text-${riskColor}`}>
            {riskLevel} risico
          </span>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overschrijdingskans</span>
              <span className="font-medium">12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verwachte overschrijding</span>
              <span className="font-medium">0 kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Curtailment nodig</span>
              <span className="font-medium">Onwaarschijnlijk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">24-uurs Groepsvraag Voorspelling</h3>
            <span className="text-xs text-muted-foreground">Laatste update: 14:30</span>
          </div>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="peakGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.04} />
                  <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={{ stroke: chartColors.grid }} tickLine={false} interval={2} />
              <YAxis yAxisId="kw" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 120]} unit=" kW" />
              <YAxis yAxisId="soc" orientation="right" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid #252A32', borderRadius: 8, fontSize: 12 }}
                formatter={(value: number, name: string) => {
                  if (name === 'batterySoc') return [`${value}%`, 'Batterij SOC'];
                  if (name === 'price') return [`€${value.toFixed(2)}`, 'Prijs'];
                  if (name === 'groupDemand') return [`${value} kW`, 'Groepsvraag'];
                  return [value, name];
                }}
              />
              <ReferenceLine yAxisId="kw" y={80} stroke={chartColors.accent} strokeDasharray="6 3" label={{ value: 'Groeps-ATO (80 kW)', fill: chartColors.accent, fontSize: 10, position: 'right' }} />
              <Area yAxisId="kw" type="monotone" dataKey="groupDemand" fill="url(#forecastFill)" stroke={chartColors.primary} strokeWidth={2} dot={false} />
              <Line yAxisId="soc" type="monotone" dataKey="batterySoc" stroke={chartColors.secondary} strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
              <Line yAxisId="kw" type="monotone" dataKey="price" stroke="#F59E0B" strokeWidth={1} strokeDasharray="3 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-primary rounded" /> Groepsvraag</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-secondary rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #2A2F87 0, #2A2F87 4px, transparent 4px, transparent 8px)' }} /> Batterij SOC</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-warning rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 2px, transparent 2px, transparent 4px)' }} /> Prijs</span>
        </div>
      </div>

      {/* AI Advice */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold mb-4">AI Advies</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 pl-3 border-l-[3px] border-l-success py-2">
            <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
            <p className="text-sm">Advies: Batterij volledig opladen tot 06:00. Geen curtailment verwacht vandaag.</p>
          </div>
          <div className="flex items-start gap-3 pl-3 border-l-[3px] border-l-info py-2">
            <Sun size={16} className="text-info mt-0.5 flex-shrink-0" />
            <p className="text-sm">Weersvoorspelling: Zonnig morgenmiddag → lagere netafname verwacht 12:00–16:00.</p>
          </div>
          <div className="flex items-start gap-3 pl-3 border-l-[3px] border-l-primary py-2">
            <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm">Optimale EV-laadtijd: 02:00–06:00 (laagste prijs + batterij beschikbaar)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
