import { useState, useEffect, useRef } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Play, Pause, RotateCcw, SkipForward, Zap, BatteryCharging, TrendingDown, Clock } from 'lucide-react';

export default function Simulatie() {
  const { simulationData } = useEnergyData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentHour, setCurrentHour] = useState(14);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speeds = [1, 5, 10, 20];
  const current = simulationData[currentHour];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentHour(h => (h + 1) % 24);
      }, 1000 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed]);

  const phaseColors = {
    night: 'bg-secondary/10 border-secondary/20',
    'morning-peak': 'bg-warning/10 border-warning/20',
    midday: 'bg-success/5 border-success/10',
    'evening-peak': 'bg-warning/15 border-warning/30',
  };

  const phaseLabels = {
    night: 'Nacht — Batterij opladen',
    'morning-peak': 'Ochtendpiek — Batterij ondersteunt',
    midday: 'Middag — Lage vraag',
    'evening-peak': 'Avondpiek — Maximale ontlading',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">24-Uurs Simulatie</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Bekijk de volledige dagcyclus van de energiehub</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between">
          {/* Time display */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Huidige tijd</div>
            <div className="text-4xl font-bold tabular-nums">{current.hour.toString().padStart(2, '0')}:00</div>
          </div>

          {/* Play/Pause */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentHour(0)}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-glow"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button
              onClick={() => setCurrentHour((currentHour + 1) % 24)}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Speed */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            {speeds.map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  speed === s ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Timeline slider */}
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={23}
            value={currentHour}
            onChange={e => setCurrentHour(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold mb-3">Dagfases</h3>
        <div className="relative h-12 flex rounded-lg overflow-hidden">
          {simulationData.map((h, i) => (
            <div
              key={i}
              className={`flex-1 ${phaseColors[h.phase]} border-r border-border/30 relative transition-all ${
                i === currentHour ? 'ring-2 ring-primary ring-inset z-10' : ''
              }`}
              title={`${h.hour}:00 — ${phaseLabels[h.phase]}`}
            >
              {i === currentHour && (
                <div className="absolute inset-x-0 -top-1 flex justify-center">
                  <div className="w-0.5 h-1 bg-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {Array.from(new Set(simulationData.map(s => s.phase))).map(phase => (
            <span key={phase} className={`px-2 py-0.5 rounded ${phaseColors[phase]}`}>
              {phaseLabels[phase as keyof typeof phaseLabels]}
            </span>
          ))}
        </div>
      </div>

      {/* Current State */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Zap size={18} className="mx-auto mb-2 text-primary" />
          <div className="text-xs text-muted-foreground">Groepsvraag</div>
          <div className="text-xl font-bold tabular-nums">{current.groupDemand} kW</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <BatteryCharging size={18} className="mx-auto mb-2 text-secondary" />
          <div className="text-xs text-muted-foreground">Batterij</div>
          <div className={`text-xl font-bold tabular-nums ${current.batteryKw < 0 ? 'text-warning' : 'text-success'}`}>
            {current.batteryKw > 0 ? '+' : ''}{current.batteryKw} kW
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <TrendingDown size={18} className="mx-auto mb-2 text-accent" />
          <div className="text-xs text-muted-foreground">Resterend ATO</div>
          <div className={`text-xl font-bold tabular-nums ${current.remainingAto < 10 ? 'text-error' : current.remainingAto < 20 ? 'text-warning' : 'text-success'}`}>
            {current.remainingAto} kW
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Clock size={18} className="mx-auto mb-2 text-info" />
          <div className="text-xs text-muted-foreground">EMS-actie</div>
          <div className="text-sm font-bold mt-1">{current.emsAction}</div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted z-10">
              <tr>
                {['Uur', 'Groepsvraag (kW)', 'Netafname (kW)', 'Batterij (kW)', 'SOC (%)', 'ATO resterend (kW)', 'Prijs (€/kWh)', 'EMS-actie'].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {simulationData.map((row, i) => (
                <tr
                  key={i}
                  className={`transition-colors ${
                    i === currentHour
                      ? 'bg-primary/5 border-l-2 border-l-primary'
                      : 'hover:bg-muted/20'
                  }`}
                >
                  <td className="px-3 py-2.5 text-sm font-medium tabular-nums">{row.hour.toString().padStart(2, '0')}:00</td>
                  <td className="px-3 py-2.5 text-sm tabular-nums">{row.groupDemand}</td>
                  <td className="px-3 py-2.5 text-sm tabular-nums">{row.gridImport}</td>
                  <td className={`px-3 py-2.5 text-sm tabular-nums font-medium ${row.batteryKw < 0 ? 'text-warning' : row.batteryKw > 0 ? 'text-success' : ''}`}>
                    {row.batteryKw > 0 ? '+' : ''}{row.batteryKw}
                  </td>
                  <td className="px-3 py-2.5 text-sm tabular-nums">{row.batterySoc}%</td>
                  <td className={`px-3 py-2.5 text-sm tabular-nums font-medium ${row.remainingAto < 10 ? 'text-error' : row.remainingAto < 20 ? 'text-warning' : 'text-success'}`}>
                    {row.remainingAto}
                  </td>
                  <td className="px-3 py-2.5 text-sm tabular-nums">€{row.price.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-xs">{row.emsAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold mb-3">Dagelijkse Samenvatting</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Totale netafname</span>
              <span className="font-medium">1.240 kWh</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Batterij cycli</span>
              <span className="font-medium">1.2</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Congestie vermeden</span>
              <span className="font-medium text-success">37%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Geschatte besparing</span>
              <span className="font-medium text-success">€48,-</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Curtailment</span>
              <span className="font-medium text-warning">42 min (Woning 3 EV)</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold mb-3">EMS Beslissingen Log</h3>
          <div className="space-y-3 text-sm max-h-[200px] overflow-y-auto pr-1">
            {[
              { time: '02:00', desc: 'Start batterij opladen (Lage prijs: €0.12)' },
              { time: '06:00', desc: 'Stop opladen, SOC: 85%' },
              { time: '07:15', desc: 'Ochtendpiek: batterij ondersteunt met 25 kW' },
              { time: '17:45', desc: 'Avondpiek verwacht: ontlading voorbereid' },
              { time: '18:15', desc: 'Curtailment: Woning 3 EV verlaagd (groepslimiet 95%)' },
              { time: '18:45', desc: 'Maximale ontlading: 100 kW, piek afgedekt' },
              { time: '21:00', desc: 'Ontlading stop, SOC: 28%' },
            ].map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs text-muted-foreground tabular-nums mt-0.5 w-10 flex-shrink-0">{entry.time}</span>
                <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm">{entry.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
