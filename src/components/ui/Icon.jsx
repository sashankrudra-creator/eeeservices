import { Activity, Cable, Camera, Cpu, Droplets, Factory, Fan, FileCheck, Flame, Gauge, HardHat, Magnet, Radar, Radio, ScanLine, Settings, ShieldCheck, Sun, Truck, Users, Wrench, Zap } from 'lucide-react';

// Icons are referenced by name in /src/data so that data files stay plain JS.
// Add a new icon here to use it by name elsewhere.
const MAP = { Activity, Cable, Camera, Cpu, Droplets, Factory, Fan, FileCheck, Flame, Gauge, HardHat, Magnet, Radar, Radio, ScanLine, Settings, ShieldCheck, Sun, Truck, Users, Wrench, Zap };

export default function Icon({ name, size = 24, ...props }) {
  const C = MAP[name] || Zap;
  return <C size={size} aria-hidden="true" {...props} />;
}
