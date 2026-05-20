import { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import {
  Search, Download, ArrowUpDown, Zap, Thermometer,
  Droplets, ChevronDown, Home
} from 'lucide-react';

export default function Verbruikers() {
  const { homes } = useEnergyData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Alle');
  const [sortCol, setSortCol] = useState<'name' | 'kw' | 'kwh'>('kw');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filters = ['Alle', 'Woningen', 'Curtailment actief'];

  const filtered = homes
    .filter(h => {
      if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.unit.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === 'Curtailment actief') return h.curtailmentActive;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortCol === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortCol === 'kw') cmp = a.currentKw - b.currentKw;
      else cmp = a.todayKwh - b.todayKwh;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const toggleSort = (col: 'name' | 'kw' | 'kwh') => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Verbruikers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">10 woningen/bedrijven aangesloten op de energiehub</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek op naam of unit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  filter === f ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm hover:bg-muted transition-colors">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                {[
                  { key: 'name' as const, label: 'Gebruiker' },
                  { key: 'kw' as const, label: 'Huidig verbruik' },
                  { key: 'kwh' as const, label: 'Vandaag' },
                ].map(col => (
                  <th key={col.key} className="text-left">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1.5 px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {col.label}
                      <ArrowUpDown size={12} className={sortCol === col.key ? 'text-primary' : ''} />
                    </button>
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Bron</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Flexibele apparaten</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Curtailment</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Leverancier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((home) => (
                <>
                  <tr
                    key={home.id}
                    onClick={() => setExpandedRow(expandedRow === home.id ? null : home.id)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Home size={16} className="text-primary/60" />
                        <div>
                          <div className="text-sm font-medium">{home.name}</div>
                          <div className="text-xs text-muted-foreground">{home.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tabular-nums">{home.currentKw.toFixed(1)} kW</span>
                        <span className="text-xs text-muted-foreground">{home.currentKw > home.todayKwh / 14 ? '↑' : '↓'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm tabular-nums">{home.todayKwh.toFixed(1)} kWh</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 flex rounded-full overflow-hidden w-20">
                          <div className="h-full bg-primary/60" style={{ width: `${home.batteryAssist ? 70 : 100}%` }} />
                          {home.batteryAssist && <div className="h-full bg-secondary/60" style={{ width: '30%' }} />}
                        </div>
                        <span className="text-xs text-muted-foreground">{home.batteryAssist ? '70/30' : '100/0'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {home.hasEV && <Zap size={14} className={home.curtailmentActive ? 'text-warning' : 'text-primary'} />}
                        {home.hasHeatPump && <Thermometer size={14} className="text-muted-foreground" />}
                        {home.hasBoiler && <Droplets size={14} className="text-muted-foreground" />}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {home.curtailmentActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
                          <Zap size={10} /> {home.curtailmentType}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                          Normaal
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground">{home.supplier}</td>
                  </tr>
                  {expandedRow === home.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 bg-muted/20">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Apparaten</h4>
                            <div className="space-y-2">
                              {home.hasEV && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-2"><Zap size={14} className="text-primary" /> EV-lader</span>
                                  <span className="font-medium">{home.curtailmentActive ? '3.7' : '7.4'} kW</span>
                                </div>
                              )}
                              {home.hasHeatPump && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-2"><Thermometer size={14} className="text-muted-foreground" /> Warmtepomp</span>
                                  <span className="font-medium">2.8 kW</span>
                                </div>
                              )}
                              {home.hasBoiler && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Droplets size={14} className="text-muted-foreground" /> Boiler
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Curtailment geschiedenis</h4>
                            <p className="text-sm text-muted-foreground">
                              {home.curtailmentActive
                                ? `EV-lader verlaagd naar 50% om 18:12 (groepslimiet 95%)`
                                : 'Geen curtailment vandaag'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Geschatte kosten</h4>
                            <p className="text-sm text-muted-foreground">
                              Dagelijkse energiekosten (excl. EMS servicefee): ~&euro;{(home.todayKwh * 0.28).toFixed(2)}
                            </p>
                            {home.hasSolar && (
                              <p className="text-sm text-success mt-1">
                                Zonneproductie vandaag: {home.solarProduction} kWh
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>1–{filtered.length} van {homes.length} resultaten</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-50" disabled>
              <ChevronDown size={14} className="rotate-90" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-50" disabled>
              <ChevronDown size={14} className="-rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
