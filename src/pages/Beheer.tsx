import { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Settings, BatteryCharging, Users, Zap, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function Beheer() {
  const { atoLimit } = useEnergyData();
  const [importLimit, setImportLimit] = useState(atoLimit);
  const [exportLimit, setExportLimit] = useState(50);
  const [warningThreshold, setWarningThreshold] = useState(80);
  const [overschrijdingsAlarm, setOverschrijdingsAlarm] = useState(true);
  const [predictionHorizon, setPredictionHorizon] = useState('24');
  const [batteryReserve, setBatteryReserve] = useState(15);
  const [curtailmentVoortijd, setCurtailmentVoortijd] = useState(10);
  const [feePerConnection, setFeePerConnection] = useState(49);
  const [platformFee, setPlatformFee] = useState(599);
  const [batteryFee, setBatteryFee] = useState(199);

  const curtailmentPriority = [
    { name: 'EV-laders', active: true, maxReduction: 75 },
    { name: 'Warmtepompen', active: true, maxReduction: 50 },
    { name: 'Boilers', active: true, maxReduction: 100 },
    { name: 'Airconditioning', active: false, maxReduction: 100 },
  ];

  const totalMonthly = 10 * feePerConnection + platformFee + batteryFee;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Beheer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Systeeminstellingen en configuratie</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Column 1 */}
        <div className="space-y-5">
          {/* ATO Settings */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={16} className="text-primary" />
              <h3 className="text-base font-semibold">Groeps-ATO Instellingen</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Import limiet (kW)</label>
                <input
                  type="number"
                  value={importLimit}
                  onChange={e => setImportLimit(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Export limiet (kW)</label>
                <input
                  type="number"
                  value={exportLimit}
                  onChange={e => setExportLimit(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Huidig gebruik: 67.4/80 kW (84%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Overschrijdingsalarm</span>
                <Switch checked={overschrijdingsAlarm} onCheckedChange={setOverschrijdingsAlarm} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Drempelwaarschuwing (%)</span>
                  <span>{warningThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={warningThreshold}
                  onChange={e => setWarningThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Opslaan
              </button>
            </div>
          </div>

          {/* Battery Clusters */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BatteryCharging size={16} className="text-secondary" />
              <h3 className="text-base font-semibold">Batterijclusters</h3>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cluster A</span>
                <span className="text-xs text-success">Actief</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">250 kWh capaciteit</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Aansluitingen</span>
              <span className="font-medium">11/20</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
              <div className="h-full rounded-full bg-secondary transition-all" style={{ width: '55%' }} />
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-5">
          {/* User Management */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-primary" />
              <h3 className="text-base font-semibold">Gebruikersbeheer</h3>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {[
                { name: 'Jan de Vries', meter: 'SVM-2024-001', role: 'Bewoner' },
                { name: 'Anita Bakker', meter: 'SVM-2024-002', role: 'Bewoner' },
                { name: 'Pieter Jansen', meter: 'SVM-2024-003', role: 'Bewoner' },
                { name: 'Maria van Dijk', meter: 'SVM-2024-004', role: 'Bewoner' },
                { name: 'Willem Smit', meter: 'SVM-2024-005', role: 'Bewoner' },
              ].map((u, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.meter}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex-shrink-0">{u.role}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
              + Gebruiker toevoegen
            </button>
          </div>

          {/* Curtailment Priority */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-warning" />
              <h3 className="text-base font-semibold">Curtailment Prioriteiten</h3>
            </div>
            <div className="space-y-3">
              {curtailmentPriority.map((item, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{i + 1}. {item.name}</span>
                    <Switch checked={item.active} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Max reductie</span>
                    <span>{item.maxReduction}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-success/5 rounded-lg border border-success/10">
              <div className="text-xs font-medium text-success mb-1">Nooit uitschakelen</div>
              <div className="text-xs text-muted-foreground">Verlichting, Koelkasten, Medische apparatuur</div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-5">
          {/* EMS Rules */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-info" />
              <h3 className="text-base font-semibold">EMS Regels</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Voorspellingshorizon</label>
                <select
                  value={predictionHorizon}
                  onChange={e => setPredictionHorizon(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="24">24 uur</option>
                  <option value="48">48 uur</option>
                  <option value="72">72 uur</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Batterij minimale reserve</span>
                  <span>{batteryReserve}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={batteryReserve}
                  onChange={e => setBatteryReserve(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Curtailment voorafstijd</span>
                  <span>{curtailmentVoortijd} min</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={curtailmentVoortijd}
                  onChange={e => setCurtailmentVoortijd(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Opslaan
              </button>
            </div>
          </div>

          {/* Service Fee */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-success" />
              <h3 className="text-base font-semibold">Servicefee Configuratie</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Fee per aansluiting (€/maand)</label>
                <input
                  type="number"
                  value={feePerConnection}
                  onChange={e => setFeePerConnection(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">EMS platform fee (€/maand)</label>
                <input
                  type="number"
                  value={platformFee}
                  onChange={e => setPlatformFee(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Batterijbeheer fee (€/maand)</label>
                <input
                  type="number"
                  value={batteryFee}
                  onChange={e => setBatteryFee(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="p-3 bg-success/5 rounded-lg border border-success/10">
                <div className="text-xs text-success font-medium mb-1">Totale maandelijkse inkomsten</div>
                <div className="text-2xl font-bold">€ {totalMonthly.toLocaleString('nl-NL')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  10 × €{feePerConnection} + €{platformFee} + €{batteryFee}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
