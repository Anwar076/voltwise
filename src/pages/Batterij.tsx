import { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Bar
} from 'recharts';
import { BatteryCharging, Thermometer, ArrowUp, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const chartColors = {
  primary: '#27B296',
  secondary: '#2A2F87',
  accent: '#FF6B35',
  grid: '#252A32',
  text: '#8B95A5',
};

export default function Batterij() {
  const { battery, hourlyData } = useEnergyData();
  const [aiMode, setAiMode] = useState(true);
  const [manualMode, setManualMode] = useState<'Opladen' | 'Houden' | 'Ontladen'>('Opladen');
  const [powerLimit, setPowerLimit] = useState(42);

  const schedule = [
    { time: '02:00–06:00', action: 'Opladen', socFrom: '45%', socTo: '85%', reason: 'Lage prijs + lage groepsvraag' },
    { time: '06:00–17:30', action: 'Houden', socFrom: '85%', socTo: '82%', reason: 'Stand-by voor piek' },
    { time: '17:30–21:00', action: 'Ontladen', socFrom: '82%', socTo: '35%', reason: 'Piekvraag afdekken' },
    { time: '21:00–02:00', action: 'Houden', socFrom: '35%', socTo: '35%', reason: 'Geen actie nodig' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Batterij</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Centrale batterij beheer en monitoring</p>
        </div>
      </div>

      {/* Battery Hero */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-center gap-12">
          {/* Left metrics */}
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground mb-1">Laadvermogen</div>
              <div className={`text-lg font-bold flex items-center justify-center gap-1 ${battery.chargePower > 0 ? 'text-success' : 'text-warning'}`}>
                {battery.chargePower > 0 ? <ArrowUp size={14} /> : <ArrowUp size={14} className="rotate-180" />}
                {battery.chargePower > 0 ? '+' : ''}{battery.chargePower} kW
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground mb-1">Cycli vandaag</div>
              <div className="text-lg font-bold">{battery.cyclesToday}</div>
            </div>
          </div>

          {/* Battery visual */}
          <div className="relative">
            <div className="w-40 h-64 border-2 border-border rounded-3xl relative overflow-hidden bg-muted/20">
              {/* Fill */}
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-700 rounded-b-3xl"
                style={{
                  height: `${battery.soc}%`,
                  background: 'linear-gradient(to top, #2A2F87, #27B296)',
                }}
              >
                {/* Wave animation */}
                <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
                  <div className="w-[200%] h-full animate-battery-wave" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  }} />
                </div>
              </div>
              {/* Terminal bump */}
              <div className="absolute -top-2 right-8 w-10 h-2 bg-border rounded-t-sm" />
              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{battery.soc}%</span>
                <span className="text-sm text-muted-foreground mt-1">{battery.availableKwh} kWh</span>
              </div>
            </div>
            <div className="flex justify-center mt-3 gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Net: {battery.sourceBreakdown.grid}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Zon: {battery.sourceBreakdown.solar}%</span>
            </div>
          </div>

          {/* Right metrics */}
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><Thermometer size={12} /> Temperatuur</div>
              <div className="text-lg font-bold">{battery.temperature}°C</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground mb-1">Resterende ontlading</div>
              <div className="text-lg font-bold">{battery.estimatedDischargeHours} uur</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel + History */}
      <div className="grid grid-cols-2 gap-5">
        {/* Control Panel */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-warning" />
            <h3 className="text-base font-semibold">Handmatige Bediening</h3>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-2 mb-4 p-1 bg-muted/50 rounded-lg">
            {(['Opladen', 'Houden', 'Ontladen'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setManualMode(mode)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  manualMode === mode && !aiMode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                disabled={aiMode}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Power limit slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Laad/ontlaad limiet</span>
              <span className="font-bold">{powerLimit} kW</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={powerLimit}
              onChange={e => setPowerLimit(Number(e.target.value))}
              disabled={aiMode}
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 kW</span>
              <span>100 kW</span>
            </div>
          </div>

          {/* AI toggle */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <div>
              <div className="text-sm font-medium">Automatische AI-sturing</div>
              <div className="text-xs text-muted-foreground">Laat de AI-engine beslissingen nemen</div>
            </div>
            <Switch checked={aiMode} onCheckedChange={setAiMode} />
          </div>

          {aiMode && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10 text-sm">
              <span className="text-primary font-medium">AI stuurt automatisch</span> — laadvoorbereiding 02:00, ontlading 18:30
            </div>
          )}
        </div>

        {/* Battery History Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold mb-4">Batterij Activiteit — 24 Uur</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="socFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.secondary} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={chartColors.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={{ stroke: chartColors.grid }} tickLine={false} interval={2} />
                <YAxis yAxisId="soc" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <YAxis yAxisId="kw" orientation="right" tick={{ fill: chartColors.text, fontSize: 11 }} axisLine={false} tickLine={false} domain={[-100, 100]} unit=" kW" />
                <Tooltip contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid #252A32', borderRadius: 8, fontSize: 12 }} />
                <ReferenceLine yAxisId="kw" y={0} stroke={chartColors.grid} />
                <Area yAxisId="soc" type="monotone" dataKey="batterySoc" fill="url(#socFill)" stroke={chartColors.secondary} strokeWidth={2} dot={false} />
                <Bar yAxisId="kw" dataKey="batteryKw" fill={chartColors.primary} opacity={0.6} radius={[2, 2, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold mb-4">Laad/Ontlaad Schema</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Tijdvenster</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Actie</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Verwachte SOC</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Reden</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedule.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{row.time}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.action === 'Opladen' ? 'bg-secondary/10 text-secondary' :
                      row.action === 'Ontladen' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <BatteryCharging size={12} />
                      {row.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums">{row.socFrom} → {row.socTo}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
