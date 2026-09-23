import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AISettingsConfig } from '../../types/aiDetection';
import { DEFAULT_AI_SETTINGS } from '../../data/aiDetectionData';
import { Sliders, Save, CheckCircle2, Bell, Video, Car, Users, ShieldAlert, Siren, Cpu } from 'lucide-react';

export const AISettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<AISettingsConfig>(DEFAULT_AI_SETTINGS);
  const [savedToast, setSavedToast] = useState(false);

  const handleToggle = (key: keyof AISettingsConfig) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Sliders className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AI Object Detection Parameters & Threshold Settings
            </h3>
            <p className="text-xs text-slate-400">
              Configure edge inference confidence cutoffs, feature classification toggles, and notification rules.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          leftIcon={<Save className="w-4 h-4" />}
          className="shadow-lg shadow-brand-500/20 text-xs font-bold"
        >
          Save AI Settings (UI)
        </Button>
      </div>

      {/* Toast Notification */}
      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          AI Engine settings saved & synced to all 105 optical edge nodes!
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Threshold & Mode Configuration */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <Cpu className="w-4 h-4 text-brand-400" />
            Inference Engine Thresholds
          </h4>

          {/* Confidence Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Confidence Cutoff Threshold</span>
              <span className="text-emerald-400 font-bold">{settings.confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={settings.confidenceThreshold}
              onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <p className="text-[11px] text-slate-500">
              Only detections with confidence &gt;= {settings.confidenceThreshold}% will trigger alerts.
            </p>
          </div>

          {/* Detection Mode Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300">Detection Inference Mode</span>
            <div className="grid grid-cols-3 gap-2">
              {(['High Precision', 'Balanced', 'High Speed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSettings({ ...settings, detectionMode: mode })}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    settings.detectionMode === mode
                      ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Detection Feature Toggles
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <Car className="w-4 h-4 text-sky-400" /> Vehicle Detection
              </span>
              <input
                type="checkbox"
                checked={settings.vehicleDetection}
                onChange={() => handleToggle('vehicleDetection')}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" /> Pedestrian Detection
              </span>
              <input
                type="checkbox"
                checked={settings.pedestrianDetection}
                onChange={() => handleToggle('pedestrianDetection')}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Accident Detection
              </span>
              <input
                type="checkbox"
                checked={settings.accidentDetection}
                onChange={() => handleToggle('accidentDetection')}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <Siren className="w-4 h-4 text-amber-400" /> Emergency Priority
              </span>
              <input
                type="checkbox"
                checked={settings.emergencyVehicleDetection}
                onChange={() => handleToggle('emergencyVehicleDetection')}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-cyan-400" /> Push Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={() => handleToggle('enableNotifications')}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-400" /> HD Stream Recording
              </span>
              <input
                type="checkbox"
                checked={settings.enableRecording}
                onChange={() => handleToggle('enableRecording')}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
};
