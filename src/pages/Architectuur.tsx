import { useState } from 'react';
import {
  Cpu, BatteryCharging, Gauge, Sun, Database,
  LayoutDashboard, Settings, Bell, Server, ArrowRight
} from 'lucide-react';

interface NodeData {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  color: string;
  description: string;
  role: string;
  dataFlow: string;
  status: string;
}

const nodes: NodeData[] = [
  { id: 'meters', label: 'Slimme Meters (11x)', icon: <Gauge size={18} />, x: 50, y: 60, color: '#27B296', description: 'Lezen live verbruiksdata van 10 woningen en 1 batterijmeter elke 15 minuten via P1-poort of remote connectie.', role: 'Input: kWh, kW, import/export status', dataFlow: 'Verzendt: verbruiksdata elke 15 min', status: 'Actief' },
  { id: 'grid', label: 'Netbeheerder API', icon: <Server size={18} />, x: 50, y: 120, color: '#8B95A5', description: 'Groeps-ATO limieten en transportcapaciteit van de netbeheerder (Liander).', role: 'Input: ATO limieten, capaciteitsdata', dataFlow: 'Ontvangt: 80 kW import, 50 kW export', status: 'Actief' },
  { id: 'pricing', label: 'Dynamische Prijzen API', icon: <Database size={18} />, x: 50, y: 180, color: '#F59E0B', description: 'Realtime en dag-vooruit elektriciteitsprijzen van EPEX/Entsoe.', role: 'Input: €/kWh prijzen per uur', dataFlow: 'Ontvangt: uurprijzen 24h vooruit', status: 'Actief' },
  { id: 'weather', label: 'Weer API', icon: <Sun size={18} />, x: 50, y: 240, color: '#4A90D9', description: 'Weersvoorspelling voor zonne-opbrengst en warmtepomp-gedrag.', role: 'Input: Temperatuur, bewolking, zon', dataFlow: 'Ontvangt: 48h weersvoorspelling', status: 'Actief' },
  { id: 'battery-api', label: 'Batterij Vendor API', icon: <BatteryCharging size={18} />, x: 50, y: 300, color: '#2A2F87', description: 'Directe sturing van de batterij-inverter voor laden/ontladen.', role: 'Input/Output: SOC, laadvermogen, temperatuur', dataFlow: 'Bidirectioneel: commando + status', status: 'Actief' },
  { id: 'users', label: 'Gebruikersdatabase', icon: <Database size={18} />, x: 50, y: 360, color: '#8B95A5', description: 'Bewonersprofielen, apparaatinstellingen en curtailment-prioriteiten.', role: 'Input: Gebruikersprofielen', dataFlow: 'Leest: prioriteiten, apparaten', status: 'Actief' },
  { id: 'ems', label: 'EMS Intelligence Engine', icon: <Cpu size={22} />, x: 380, y: 210, color: '#27B296', description: 'Het centrale brein: voorspelt, optimaliseert en stuurt alle componenten.', role: 'Processing: Prediction, Optimization, Curtailment, Battery Control, Alert', dataFlow: 'Verwerkt alle input → beslissingen', status: 'Actief' },
  { id: 'dashboard', label: 'Hub Dashboard', icon: <LayoutDashboard size={18} />, x: 710, y: 60, color: '#27B296', description: 'Real-time monitoring dashboard voor operators en beheerders.', role: 'Output: Visualisatie, rapportage', dataFlow: 'Toont: live data, voorspellingen', status: 'Actief' },
  { id: 'admin', label: 'Beheerdersdashboard', icon: <Settings size={18} />, x: 710, y: 140, color: '#8B95A5', description: 'Configuratiepaneel voor ATO-limieten, curtailment en gebruikers.', role: 'Output: Instellingen, configuratie', dataFlow: 'Stuurt: systeeminstellingen', status: 'Actief' },
  { id: 'battery-ctrl', label: 'Batterij Stuursysteem', icon: <BatteryCharging size={18} />, x: 710, y: 220, color: '#2A2F87', description: 'Lokaal systeem dat batterijcommando\'s omzet in fysieke acties.', role: 'Output: Laad/ontlaad commando\'s', dataFlow: 'Verzendt: setpoints naar inverter', status: 'Actief' },
  { id: 'events', label: 'Event Engine & Logs', icon: <Bell size={18} />, x: 710, y: 300, color: '#FF6B35', description: 'Audit logging, alerting en rapportage voor compliance.', role: 'Output: Logs, alerts, rapporten', dataFlow: 'Slaat op: alle beslissingen + data', status: 'Actief' },
];

const connections = [
  { from: 'meters', to: 'ems' },
  { from: 'grid', to: 'ems' },
  { from: 'pricing', to: 'ems' },
  { from: 'weather', to: 'ems' },
  { from: 'battery-api', to: 'ems' },
  { from: 'users', to: 'ems' },
  { from: 'ems', to: 'dashboard' },
  { from: 'ems', to: 'admin' },
  { from: 'ems', to: 'battery-ctrl' },
  { from: 'ems', to: 'events' },
];

const flowSteps = [
  { icon: <Gauge size={18} />, text: 'Slimme meters lezen verbruik' },
  { icon: <Cpu size={18} />, text: 'EMS berekent groepsbelasting' },
  { icon: <Server size={18} />, text: 'Vergelijkt met Groeps-ATO' },
  { icon: <BatteryCharging size={18} />, text: 'Controleert batterij SOC' },
  { icon: <Cpu size={18} />, text: 'Neemt beslissing' },
  { icon: <ArrowRight size={18} />, text: 'Batterijcommando verzonden' },
];

export default function Architectuur() {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Systeemarchitectuur</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Technische architectuur van het Voltwise EMS platform</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left sidebar - details */}
        <div className="col-span-3 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3">Component Details</h3>
            {hoveredNode ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span style={{ color: hoveredNode.color }}>{hoveredNode.icon}</span>
                  <span className="font-medium text-sm">{hoveredNode.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{hoveredNode.description}</p>
                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-medium mb-1">Rol</div>
                  <p className="text-xs text-muted-foreground">{hoveredNode.role}</p>
                </div>
                <div className="pt-1">
                  <div className="text-xs font-medium mb-1">Datastroom</div>
                  <p className="text-xs text-muted-foreground">{hoveredNode.dataFlow}</p>
                </div>
                <div className="pt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs">{hoveredNode.status} — Laatste update: 14:30</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Hover over een component voor details</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2">Legenda</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#27B296' }} />
                <span>Input / Live data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#8B95A5' }} />
                <span>Administratief / Config</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#2A2F87' }} />
                <span>Batterij systeem</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FF6B35' }} />
                <span>Events / Logging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm border-2" style={{ borderColor: '#27B296' }} />
                <span>Centrale engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture diagram */}
        <div className="col-span-9 bg-card border border-border rounded-xl p-5">
          <div className="relative" style={{ height: 440 }}>
            <svg width="100%" height="100%" viewBox="0 0 800 420" className="overflow-visible">
              {/* Connection lines */}
              {connections.map((conn, i) => {
                const from = nodes.find(n => n.id === conn.from)!;
                const to = nodes.find(n => n.id === conn.to)!;
                const isRight = to.x > from.x;
                return (
                  <g key={i}>
                    <line
                      x1={from.x + (isRight ? 120 : 60)}
                      y1={from.y + 16}
                      x2={to.x - (isRight ? 0 : 60)}
                      y2={to.y + 16}
                      stroke={from.color}
                      strokeWidth="1.5"
                      strokeDasharray="6 3"
                      opacity={0.5}
                      className="animate-flow-dash"
                    />
                    {/* Animated dot */}
                    <circle r="3" fill={from.color} opacity={0.8}>
                      <animateMotion
                        dur={`${2 + i * 0.3}s`}
                        repeatCount="indefinite"
                        path={`M${from.x + (isRight ? 120 : 60)},${from.y + 16} L${to.x - (isRight ? 0 : 60)},${to.y + 16}`}
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const isCenter = node.id === 'ems';
                const w = isCenter ? 220 : 140;
                const h = isCenter ? 80 : 32;
                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={node.x}
                      y={node.y}
                      width={w}
                      height={h}
                      rx={isCenter ? 12 : 8}
                      fill={isCenter ? 'hsl(210 15% 8% / 0.9)' : 'hsl(210 12% 14%)'}
                      stroke={node.color}
                      strokeWidth={isCenter ? 2 : 1}
                      opacity={hoveredNode?.id === node.id ? 1 : 0.9}
                      className="transition-all duration-150"
                      style={isCenter ? { filter: `drop-shadow(0 0 12px ${node.color}40)` } : undefined}
                    />
                    <foreignObject x={node.x + 8} y={node.y + 6} width={w - 16} height={h - 12}>
                      <div
                        className={`flex items-center gap-2 ${isCenter ? 'h-full justify-center' : ''}`}
                        style={{ color: node.color }}
                      >
                        {node.icon}
                        <span className={`font-medium ${isCenter ? 'text-base' : 'text-xs'} truncate`} style={{ color: '#E8EBF0' }}>
                          {node.label}
                        </span>
                      </div>
                    </foreignObject>
                    {isCenter && (
                      <foreignObject x={node.x + 12} y={node.y + 42} width={w - 24} height={30}>
                        <div className="flex justify-center gap-2 text-[9px] text-muted-foreground">
                          <span>Prediction</span>
                          <span>·</span>
                          <span>Optimization</span>
                          <span>·</span>
                          <span>Curtailment</span>
                          <span>·</span>
                          <span>Alert</span>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Data Flow Steps */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold mb-4">Data Flow</h3>
        <div className="flex items-center justify-between">
          {flowSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary mb-1.5">
                  {step.icon}
                </div>
                <span className="text-[10px] text-muted-foreground max-w-[80px] leading-tight">{step.text}</span>
              </div>
              {i < flowSteps.length - 1 && (
                <ArrowRight size={14} className="text-muted-foreground mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
          <span>Dashboard update: <span className="font-medium text-foreground">Real-time (elke 5 sec)</span></span>
          <span>Logopslag: <span className="font-medium text-foreground">Elke minuut</span></span>
        </div>
      </div>
    </div>
  );
}
