import { useState, useEffect, useCallback, useRef } from 'react';

export interface HomeData {
  id: number;
  name: string;
  unit: string;
  currentKw: number;
  todayKwh: number;
  hasEV: boolean;
  hasHeatPump: boolean;
  hasBoiler: boolean;
  hasSolar: boolean;
  supplier: string;
  curtailmentActive: boolean;
  curtailmentType: string;
  batteryAssist: boolean;
  solarProduction: number;
  status: 'normal' | 'curtailment' | 'battery-assist';
}

export interface BatteryData {
  soc: number;
  capacityKwh: number;
  availableKwh: number;
  chargePower: number;
  isCharging: boolean;
  cyclesToday: number;
  temperature: number;
  estimatedDischargeHours: number;
  sourceBreakdown: { grid: number; solar: number };
}

export interface HourlyData {
  hour: string;
  groupDemand: number;
  gridImport: number;
  batteryKw: number;
  batterySoc: number;
  remainingAto: number;
  price: number;
  emsAction: string;
  homes: number[];
}

export interface AIMessage {
  id: number;
  type: 'success' | 'warning' | 'info';
  message: string;
  timestamp: string;
  confidence: number;
}

export interface SimulationHour {
  hour: number;
  label?: string;
  groupDemand: number;
  gridImport: number;
  batteryKw: number;
  batterySoc: number;
  remainingAto: number;
  price: number;
  emsAction: string;
  phase: 'night' | 'morning-peak' | 'midday' | 'evening-peak';
}

export interface SystemEvent {
  id: number;
  timestamp: string;
  type: 'action' | 'warning' | 'info';
  description: string;
}

const HOME_PROFILES = [
  { name: 'Jan de Vries', unit: 'Woning 1', hasEV: true, hasHeatPump: true, hasBoiler: true, hasSolar: true, supplier: 'Eneco', baseLoad: 0.6 },
  { name: 'Anita Bakker', unit: 'Woning 2', hasEV: false, hasHeatPump: true, hasBoiler: true, hasSolar: false, supplier: 'Vattenfall', baseLoad: 0.4 },
  { name: 'Pieter Jansen', unit: 'Woning 3', hasEV: true, hasHeatPump: false, hasBoiler: true, hasSolar: true, supplier: 'Tibber', baseLoad: 0.5 },
  { name: 'Maria van Dijk', unit: 'Woning 4', hasEV: true, hasHeatPump: true, hasBoiler: false, hasSolar: false, supplier: 'Greenchoice', baseLoad: 0.7 },
  { name: 'Willem Smit', unit: 'Woning 5', hasEV: false, hasHeatPump: true, hasBoiler: true, hasSolar: true, supplier: 'Eneco', baseLoad: 0.3 },
  { name: 'Lisa de Boer', unit: 'Woning 6', hasEV: true, hasHeatPump: true, hasBoiler: true, hasSolar: false, supplier: 'NextEnergy', baseLoad: 0.8 },
  { name: 'Tom Hendriks', unit: 'Woning 7', hasEV: true, hasHeatPump: false, hasBoiler: false, hasSolar: true, supplier: 'Vandebron', baseLoad: 0.4 },
  { name: 'Sophie Mulder', unit: 'Woning 8', hasEV: false, hasHeatPump: true, hasBoiler: true, hasSolar: false, supplier: 'Pure Energie', baseLoad: 0.5 },
  { name: 'Bram Peters', unit: 'Woning 9', hasEV: true, hasHeatPump: true, hasBoiler: true, hasSolar: true, supplier: 'Eneco', baseLoad: 0.6 },
  { name: 'Emma van Leeuwen', unit: 'Woning 10', hasEV: false, hasHeatPump: false, hasBoiler: true, hasSolar: false, supplier: 'Oxxio', baseLoad: 0.3 },
];

function getHourFactor(hour: number): number {
  if (hour >= 0 && hour < 6) return 0.4;
  if (hour >= 6 && hour < 7) return 0.8;
  if (hour >= 7 && hour < 10) return 1.8;
  if (hour >= 10 && hour < 12) return 1.0;
  if (hour >= 12 && hour < 14) return 1.2;
  if (hour >= 14 && hour < 17) return 0.9;
  if (hour >= 17 && hour < 19) return 1.9;
  if (hour >= 19 && hour < 22) return 1.6;
  return 0.7;
}

function generateHourlyData(): HourlyData[] {
  const data: HourlyData[] = [];
  let batterySoc = 35;
  const ATO_LIMIT = 80;

  for (let h = 0; h < 24; h++) {
    const factor = getHourFactor(h);
    const groupDemand = Math.round((32 + factor * 35 + Math.random() * 8) * 10) / 10;
    const price = Math.round((0.12 + factor * 0.08 + Math.random() * 0.04) * 100) / 100;

    let batteryKw = 0;
    let emsAction = 'Normaal';

    if (h >= 2 && h < 6) {
      batteryKw = Math.min(100, (85 - batterySoc) * 0.8);
      batterySoc = Math.min(100, batterySoc + batteryKw * 0.9 / 20);
      emsAction = 'Batterij opladen';
    } else if ((h >= 7 && h < 10) || (h >= 17 && h < 22)) {
      const need = Math.max(0, groupDemand - ATO_LIMIT + 5);
      batteryKw = -Math.min(100, need, batterySoc * 2);
      batterySoc = Math.max(10, batterySoc + batteryKw * 0.9 / 20);
      emsAction = batteryKw < -30 ? 'Maximale ontlading' : 'Batterij ondersteunt';
    } else if (h >= 18 && h < 19 && groupDemand > ATO_LIMIT * 0.95) {
      emsAction = 'Curtailment EV W3';
      batteryKw = -Math.min(100, groupDemand - ATO_LIMIT + 10, batterySoc * 2);
      batterySoc = Math.max(10, batterySoc + batteryKw * 0.9 / 20);
    } else {
      batterySoc = Math.max(10, batterySoc - 0.5);
      emsAction = 'Stand-by';
    }

    const gridImport = Math.max(0, groupDemand + batteryKw);
    const remainingAto = Math.round((ATO_LIMIT - gridImport) * 10) / 10;

    data.push({
      hour: `${h.toString().padStart(2, '0')}:00`,
      groupDemand,
      gridImport,
      batteryKw: Math.round(batteryKw * 10) / 10,
      batterySoc: Math.round(batterySoc),
      remainingAto,
      price,
      emsAction,
      homes: HOME_PROFILES.map((_, i) => {
        const homeFactor = factor * (0.8 + Math.random() * 0.4);
        return Math.round(HOME_PROFILES[i].baseLoad * homeFactor * 10) / 10;
      }),
    });
  }
  return data;
}

export function useEnergyData() {
  const [homes, setHomes] = useState<HomeData[]>(() =>
    HOME_PROFILES.map((profile, i) => ({
      id: i + 1,
      name: profile.name,
      unit: profile.unit,
      currentKw: Math.round(profile.baseLoad * 10) / 10,
      todayKwh: Math.round(profile.baseLoad * 14 + Math.random() * 8),
      hasEV: profile.hasEV,
      hasHeatPump: profile.hasHeatPump,
      hasBoiler: profile.hasBoiler,
      hasSolar: profile.hasSolar,
      supplier: profile.supplier,
      curtailmentActive: i === 2 && new Date().getHours() >= 18,
      curtailmentType: i === 2 ? 'EV -50%' : '',
      batteryAssist: false,
      solarProduction: profile.hasSolar ? Math.round(Math.random() * 3) : 0,
      status: i === 2 && new Date().getHours() >= 18 ? 'curtailment' : 'normal',
    }))
  );

  const [battery, setBattery] = useState<BatteryData>({
    soc: 73,
    capacityKwh: 220,
    availableKwh: 160,
    chargePower: 42,
    isCharging: true,
    cyclesToday: 1.2,
    temperature: 22,
    estimatedDischargeHours: 3.2,
    sourceBreakdown: { grid: 60, solar: 40 },
  });

  const [groupDemand, setGroupDemand] = useState(67.4);
  const [atoLimit] = useState(80);
  const [remainingAto, setRemainingAto] = useState(12.6);
  const [congestionReduction] = useState(37);
  const [dailySavings] = useState(48);
  const [hourlyData] = useState<HourlyData[]>(generateHourlyData);

  const [aiMessages] = useState<AIMessage[]>([
    { id: 1, type: 'success', message: 'Verwachte piek om 18:45. Batterijcapaciteit wordt vanaf 02:00 voorbereid.', timestamp: '14:32', confidence: 94 },
    { id: 2, type: 'warning', message: 'Groepslimiet bijna bereikt. EV-laden bij Woning 3 tijdelijk verlaagd.', timestamp: '18:12', confidence: 89 },
    { id: 3, type: 'info', message: 'Door batterijontlading blijft de totale netvraag onder 80 kW.', timestamp: '18:45', confidence: 97 },
  ]);

  const [systemEvents] = useState<SystemEvent[]>([
    { id: 1, timestamp: '14:30', type: 'action', description: 'Batterij begonnen met ontlading (48 kW)' },
    { id: 2, timestamp: '14:15', type: 'warning', description: 'Woning 7 EV-lader verlaagd naar 3.7 kW' },
    { id: 3, timestamp: '13:45', type: 'info', description: 'Batterij oplaadplanning aangepast (weersverandering)' },
    { id: 4, timestamp: '12:00', type: 'action', description: 'Piekvraag voorspeld: 78.2 kW om 18:45' },
  ]);

  const updateCounter = useRef(0);

  const updateData = useCallback(() => {
    updateCounter.current += 1;

    setHomes(prev => prev.map((home, i) => {
      const profile = HOME_PROFILES[i];
      const hour = new Date().getHours();
      const factor = getHourFactor(hour);
      const randomWalk = (Math.random() - 0.5) * 0.4;
      const newKw = Math.max(0.1, Math.round((profile.baseLoad * factor + randomWalk) * 10) / 10);
      return {
        ...home,
        currentKw: newKw,
        todayKwh: home.todayKwh + (newKw / 720),
        solarProduction: profile.hasSolar && hour >= 8 && hour <= 18
          ? Math.round((Math.sin((hour - 8) * Math.PI / 10) * 4) * 10) / 10
          : 0,
      };
    }));

    setBattery(prev => {
      const hour = new Date().getHours();
      let newSoc = prev.soc;
      let newChargePower = prev.chargePower;
      let isCharging = prev.isCharging;

      if (hour >= 2 && hour < 6) {
        newChargePower = Math.round((42 + Math.random() * 8) * 10) / 10;
        newSoc = Math.min(100, newSoc + 0.15);
        isCharging = true;
      } else if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 22)) {
        newChargePower = -Math.round((35 + Math.random() * 20) * 10) / 10;
        newSoc = Math.max(10, newSoc - 0.2);
        isCharging = false;
      } else {
        newChargePower = Math.round(Math.random() * 5 * 10) / 10;
        newSoc = Math.max(10, newSoc - 0.02);
        isCharging = newChargePower > 0;
      }

      return {
        ...prev,
        soc: Math.round(newSoc),
        availableKwh: Math.round(prev.capacityKwh * newSoc / 100),
        chargePower: newChargePower,
        isCharging,
      };
    });

    setHomes(prev => {
      const total = prev.reduce((sum, h) => sum + h.currentKw, 0);
      const newDemand = Math.round(total * 10) / 10;
      setGroupDemand(newDemand);
      setRemainingAto(Math.round((atoLimit - newDemand) * 10) / 10);
      return prev;
    });
  }, [atoLimit]);

  useEffect(() => {
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, [updateData]);

  const simulationData: SimulationHour[] = hourlyData.map((h, i) => {
    let phase: SimulationHour['phase'] = 'midday';
    if (i >= 0 && i < 6) phase = 'night';
    else if (i >= 6 && i < 10) phase = 'morning-peak';
    else if (i >= 17 && i < 22) phase = 'evening-peak';
    return { ...h, hour: i, phase };
  });

  return {
    homes,
    battery,
    groupDemand,
    atoLimit,
    remainingAto,
    congestionReduction,
    dailySavings,
    hourlyData,
    aiMessages,
    systemEvents,
    simulationData,
  };
}
