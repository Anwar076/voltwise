import { useEnergyData } from '@/hooks/useEnergyData';
import {
  Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Line, ComposedChart
} from 'recharts';
import {
  Activity, Battery, Zap, TrendingDown, AlertTriangle,
  Info, CheckCircle, Home, Thermometer, Droplets, Clock
} from 'lucide-react';
import { useState } from 'react';

const chartColors = {
  primary: '#27B296',
  secondary: '#2A2F87',
  accent: '#FF6B35',
  info: '#4A90D9',
  grid: '#252A32',
  text: '#8B95A5',
};

function formatDate() {
  const now = new Date();
  const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export default function Dashboard() {
  const data = useEnergyData();
  const [selectedHome, setSelectedHome] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('Vandaag');

  const timeRanges = ['Vandaag', 'Week', 'Maand', 'Jaar'];

  const demandPercent = Math.round((data.groupDemand / data.atoLimit) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overzicht</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                timeRange === range
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Card 1 — Group Demand */}
        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all hover:shadow-glow">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Actuele Groepsvraag</div>
          <div className="text-3xl font-bold tabular-nums">{data.groupDemand.toFixed(1)} <span className="text-lg font-semibold text-muted-foreground">kW</span></div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">{demandPercent}% van Groeps-ATO</span>
              <span className="font-medium">Resterend: {data.remainingAto.toFixed(1)} kW</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${demandPercent}%`,
                  background: demandPercent > 90
                    ? 'linear-gradient(90deg, #27B296, #FF6B35)'
                    : demandPercent > 75
                    ? 'linear-gradient(90deg, #27B296, #F59E0B)'
                    : '#27B296'
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 2 — Battery */}
        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all hover:shadow-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Batterij Laadniveau</span>
            <Battery size={16} className="text-secondary" />
          </div>
          <div className="text-3xl font-bold tabular-nums">{data.battery.soc}<span className="text-lg text-muted-foreground">%</span></div>
          <div className="mt-2 text-xs text-muted-foreground">
            {data.battery.availableKwh} kWh / {data.battery.capacityKwh} kWh beschikbaar
          </div>
          <div className="mt-2.5 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${data.battery.soc}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-success font-medium">
            Laadvermogen: {data.battery.chargePower > 0 ? '+' : ''}{data.battery.chargePower} kW
          </div>
        </div>

        {/* Card 3 — Optimization */}
        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all hover:shadow-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Netcongestie Vermeden</span>
            <TrendingDown size={16} className="text-primary" />
          </div>
          <div className="text-3xl font-bold tabular-nums text-primary">{data.congestionReduction}%</div>
          <div className="mt-2 text-xs text-success font-medium">
            Geschatte besparing vandaag: &euro;{data.dailySavings},-
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              {data.hourlyData.slice(0, 12).map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-primary/60"
                  style={{ height: `${Math.max(4, (h.groupDemand / 120) * 20)}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Energy Flow + AI Panel */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left — Live Energy Flow */}
        <div className="col-span-7 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Live Energiestroom</h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Energy Flow Diagram */}
          <div className="relative h-[340px] flex flex-col items-center">
            {/* Grid operator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border">
              <Zap size={16} className="text-primary" />
              <span className="text-sm font-medium">Netbeheerder Liander</span>
              <span className="text-xs text-muted-foreground ml-1">380V</span>
            </div>

            {/* Flow line down */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-primary/40 to-primary/20 relative overflow-hidden">
              <div className="absolute w-1.5 h-1.5 rounded-full bg-primary animate-flow-particle" />
            </div>

            {/* ATO limit */}
            <div className="flex items-center gap-3 px-4 py-2 bg-warning/5 rounded-lg border border-warning/20">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Groeps-ATO</div>
                <div className="text-sm font-bold">{data.atoLimit} kW</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Huidig</div>
                <div className={`text-sm font-bold ${demandPercent > 90 ? 'text-warning' : 'text-primary'}`}>
                  {data.groupDemand.toFixed(1)} kW
                </div>
              </div>
              <div className="w-24">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${demandPercent}%`,
                      background: demandPercent > 90 ? '#FF6B35' : demandPercent > 75 ? '#F59E0B' : '#27B296'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Flow to hub */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-primary/10 relative overflow-hidden">
              <div className="absolute w-1.5 h-1.5 rounded-full bg-primary animate-flow-particle" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Hub cabinet */}
            <div className="flex items-center gap-3 px-5 py-3 bg-primary/5 rounded-xl border-2 border-primary/30 animate-pulse-glow">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold">Energiehuisje</div>
                <div className="text-xs text-muted-foreground">Hubkast + EMS</div>
              </div>
              <div className="w-px h-8 bg-border ml-2" />
              <div className="text-center px-2">
                <div className="text-xs text-muted-foreground">11 Meters</div>
                <div className="text-xs font-medium">10 + Batterij</div>
              </div>
            </div>

            {/* Branching lines */}
            <div className="w-full px-8 mt-2">
              <div className="grid grid-cols-11 gap-1">
                {data.homes.map((home, i) => (
                  <button
                    key={home.id}
                    onClick={() => setSelectedHome(selectedHome === home.id ? null : home.id)}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all hover:bg-muted/50 ${
                      selectedHome === home.id ? 'bg-muted ring-1 ring-primary/40' : ''
                    }`}
                  >
                    <Home size={14} className={
                      home.status === 'curtailment' ? 'text-warning' :
                      home.status === 'battery-assist' ? 'text-info' :
                      'text-primary'
                    } />
                    <span className="text-[10px] font-medium">{i + 1}</span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{home.currentKw.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Home detail tooltip */}
            {selectedHome !== null && (
              <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg animate-slide-up">
                {(() => {
                  const home = data.homes.find(h => h.id === selectedHome);
                  if (!home) return null;
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Home size={16} className="text-primary" />
                        <div>
                          <div className="text-sm font-medium">{home.name} — {home.unit}</div>
                          <div className="text-xs text-muted-foreground">Leverancier: {home.supplier}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Huidig</div>
                          <div className="text-sm font-bold">{home.currentKw.toFixed(1)} kW</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Vandaag</div>
                          <div className="text-sm font-bold">{home.todayKwh.toFixed(1)} kWh</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {home.hasEV && <Zap size={14} className={home.curtailmentActive ? 'text-warning' : 'text-primary'} />}
                          {home.hasHeatPump && <Thermometer size={14} className="text-muted-foreground" />}
                          {home.hasBoiler && <Droplets size={14} className="text-muted-foreground" />}
                        </div>
                        <button onClick={() => setSelectedHome(null)} className="text-muted-foreground hover:text-foreground">
                          <span className="sr-only">Sluiten</span>
                          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right — AI Hub Intelligence Engine */}
        <div className="col-span-5 bg-card border border-border rounded-xl p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 animate-pulse" />
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} className="text-secondary" />
            <h3 className="text-base font-semibold">Hub Intelligence Engine</h3>
          </div>

          <div className="space-y-3">
            {data.aiMessages.map(msg => (
              <div
                key={msg.id}
                className={`relative pl-3 pr-3 py-3 bg-muted/30 rounded-lg border-l-[3px] ${
                  msg.type === 'success' ? 'border-l-success' :
                  msg.type === 'warning' ? 'border-l-warning' :
                  'border-l-info'
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.type === 'success' ? <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" /> :
                   msg.type === 'warning' ? <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" /> :
                   <Info size={14} className="text-info mt-0.5 flex-shrink-0" />}
                  <p className="text-sm leading-relaxed flex-1">{msg.message}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> {msg.timestamp}
                  </span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    msg.type === 'success' ? 'bg-success/10 text-success' :
                    msg.type === 'warning' ? 'bg-warning/10 text-warning' :
                    'bg-info/10 text-info'
                  }`}>
                    {msg.confidence}% zekerheid
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="text-xs font-medium text-primary mb-1">AI-actie</div>
            <p className="text-sm">Batterij voorbereid op ontlading om 18:30</p>
          </div>
        </div>
      </div>

      {/* Live Group Demand Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Live Groepsvraag — 24 Uur</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-success">
            <Activity size={12} className="animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.hourlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fill: chartColors.text, fontSize: 11 }}
                axisLine={{ stroke: chartColors.grid }}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: chartColors.text, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 120]}
                unit=" kW"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D0F12',
                  border: '1px solid #252A32',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'groupDemand') return [`${value} kW`, 'Groepsvraag'];
                  if (name === 'gridImport') return [`${value} kW`, 'Netafname'];
                  return [value, name];
                }}
              />
              <ReferenceLine y={80} stroke={chartColors.accent} strokeDasharray="6 3" label={{ value: 'Groeps-ATO (80 kW)', fill: chartColors.accent, fontSize: 10, position: 'right' }} />
              <ReferenceLine y={125} stroke="#E8453A" strokeDasharray="6 3" strokeOpacity={0.5} label={{ value: 'Onbeheerd (125 kW)', fill: '#E8453A', fontSize: 10, position: 'right' }} />
              <Area
                type="monotone"
                dataKey="groupDemand"
                fill="url(#demandFill)"
                stroke={chartColors.primary}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="gridImport"
                stroke={chartColors.info}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
          <span>Laatste update: {new Date().toLocaleTimeString('nl-NL')}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-0.5 bg-primary rounded" /> Groepsvraag
            <span className="inline-block w-3 h-0.5 bg-info rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #4A90D9 0, #4A90D9 3px, transparent 3px, transparent 6px)' }} /> Netafname
          </span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Individual Meters */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold mb-4">Individuele Meters (10)</h3>
          <div className="grid grid-cols-5 gap-2">
            {data.homes.map(home => (
              <button
                key={home.id}
                onClick={() => setSelectedHome(selectedHome === home.id ? null : home.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all hover:shadow-md ${
                  home.status === 'curtailment'
                    ? 'border-warning/30 bg-warning/5'
                    : home.status === 'battery-assist'
                    ? 'border-info/30 bg-info/5'
                    : 'border-border bg-muted/20 hover:border-primary/30'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  home.status === 'curtailment' ? 'bg-warning' :
                  home.status === 'battery-assist' ? 'bg-info' :
                  'bg-success'
                }`} />
                <Home size={14} className="text-muted-foreground" />
                <span className="text-[10px] font-medium">{home.unit.replace('Woning ', 'W')}</span>
                <span className="text-sm font-bold tabular-nums">{home.currentKw.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">kW</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Events */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold mb-4">Systeemgebeurtenissen</h3>
          <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
            {data.systemEvents.map(event => (
              <div key={event.id} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  event.type === 'action' ? 'bg-success' :
                  event.type === 'warning' ? 'bg-warning' :
                  'bg-info'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{event.timestamp}</div>
                  <div className="text-sm">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Brain(props: { size?: number; className?: string }) {
  return (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}
