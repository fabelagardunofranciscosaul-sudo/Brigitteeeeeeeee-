import React from 'react';
import { Activity, ShieldCheck, Thermometer, Wifi, VolumeX, Cpu, Zap } from 'lucide-react';
import { EnvironmentStatus, AssistantMode } from '../types/assistant';

interface EnvironmentRadarWidgetProps {
  envStatus: EnvironmentStatus;
  mode: AssistantMode;
  onTriggerEmergencyTone: () => void;
}

export const EnvironmentRadarWidget: React.FC<EnvironmentRadarWidgetProps> = ({
  envStatus,
  mode,
  onTriggerEmergencyTone,
}) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0e111a] p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h4 className="font-tech text-xs font-bold text-white tracking-wider uppercase">
            TELEMETRÍA DE ENTORNO & RED
          </h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] uppercase">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            <span>Temp Entorno</span>
          </div>
          <div className="text-base font-bold text-white mt-1">
            {envStatus.ambientTemp}°C
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] uppercase">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span>Latencia Red</span>
          </div>
          <div className="text-base font-bold text-white mt-1">
            {envStatus.wifiLatencyMs} ms
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] uppercase">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Dispositivos Hogar</span>
          </div>
          <div className="text-base font-bold text-white mt-1">
            {envStatus.homeDevicesOnline} Activos
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Ruido Acústico</span>
          </div>
          <div className="text-base font-bold text-white mt-1">
            {envStatus.noiseLevelDb} dB
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[11px] font-mono">
        <span className="text-zinc-400">
          Ubicación detectada: <span className="text-zinc-200">{envStatus.activeLocation}</span>
        </span>
        <button
          onClick={onTriggerEmergencyTone}
          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-tech uppercase"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sirena de Emergencia</span>
        </button>
      </div>
    </div>
  );
};
