import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  Database, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  HardDrive,
  Globe,
  Lock,
  Clock,
  Layout,
  RefreshCw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  // General Settings State
  const [cityName, setCityName] = useState('Vijayawada');
  const [municipalityName, setMunicipalityName] = useState('Vijayawada Municipal Corporation');
  const [defaultLanguage, setDefaultLanguage] = useState('English (India)');
  const [defaultTimeZone, setDefaultTimeZone] = useState('(UTC+05:30) India Standard Time');
  const [systemTheme, setSystemTheme] = useState('Dark Blue Theme (Default)');

  // Security Settings State
  const [passwordPolicy, setPasswordPolicy] = useState('Enterprise Strict (Min 12 Chars, Symbols & Numbers)');
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [loginAttemptLimit, setLoginAttemptLimit] = useState('5 Attempts');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  // Application Settings State
  const [defaultDashboard, setDefaultDashboard] = useState('Admin Control Center');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('1 Minute');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [timeFormat, setTimeFormat] = useState('24-Hour (HH:mm)');

  // Backup State
  const [lastBackupTime, setLastBackupTime] = useState('2026-07-29 04:00 AM (Completed)');
  const [backupFrequency, setBackupFrequency] = useState('Daily at 04:00 AM');
  
  // Feedback Notices
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  // Save Handler
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveNotice('System settings updated and propagated successfully across municipal nodes.');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  // Reset Handler
  const handleResetSettings = () => {
    setCityName('Vijayawada');
    setMunicipalityName('Vijayawada Municipal Corporation');
    setDefaultLanguage('English (India)');
    setDefaultTimeZone('(UTC+05:30) India Standard Time');
    setSystemTheme('Dark Blue Theme (Default)');
    setPasswordPolicy('Enterprise Strict (Min 12 Chars, Symbols & Numbers)');
    setSessionTimeout('30 Minutes');
    setTwoFactorAuth(true);
    setLoginAttemptLimit('5 Attempts');
    setEmailNotifications(true);
    setSmsNotifications(true);
    setSystemAlerts(true);
    setEmergencyAlerts(true);
    setDefaultDashboard('Admin Control Center');
    setAutoRefreshInterval('1 Minute');
    setDateFormat('YYYY-MM-DD');
    setTimeFormat('24-Hour (HH:mm)');

    setSaveNotice('System settings restored to default enterprise parameters.');
    setTimeout(() => setSaveNotice(null), 3500);
  };

  // Manual Backup Handler
  const handleRunManualBackup = () => {
    setBackupNotice('Initiating manual database & telemetry backup snapshot...');
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      setLastBackupTime(`${now} (Completed Manual Snapshot)`);
      setBackupNotice('Manual backup completed successfully. Database snapshot saved to secure cloud vault.');
    }, 1500);
    setTimeout(() => setBackupNotice(null), 4500);
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white max-w-5xl mx-auto">
      
      {/* ====================================================
          1. HEADER (Only One Button: Save Changes)
          ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure system preferences, security and application settings.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSaveAll()}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {saveNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {saveNotice}
        </div>
      )}

      {backupNotice && (
        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <RefreshCw className="w-4 h-4 shrink-0 animate-spin" /> {backupNotice}
        </div>
      )}

      {/* ====================================================
          2. SETTINGS SECTIONS
          ==================================================== */}

      {/* SECTION 1: GENERAL SETTINGS */}
      <Card className="p-6 bg-[#111827] border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">General Settings</h3>
            <p className="text-xs text-slate-400">Basic municipal organization parameters and platform language</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">City Name</label>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Municipality Name</label>
            <input
              type="text"
              value={municipalityName}
              onChange={(e) => setMunicipalityName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Default Language</label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="English (India)">English (India)</option>
              <option value="English (US)">English (US)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Default Time Zone</label>
            <select
              value={defaultTimeZone}
              onChange={(e) => setDefaultTimeZone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
              <option value="(UTC+00:00) UTC">(UTC+00:00) Coordinated Universal Time (UTC)</option>
              <option value="(UTC+01:00) Central European Time">(UTC+01:00) Central European Time</option>
              <option value="(UTC+05:30) India Standard Time">(UTC+05:30) India Standard Time</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-slate-300 mb-1">System Theme</label>
            <select
              value={systemTheme}
              onChange={(e) => setSystemTheme(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="Dark Blue Theme (Default)">Dark Blue Theme (Enterprise Default)</option>
              <option value="System Preference">System Preference</option>
              <option value="Light Mode">Light Mode</option>
            </select>
          </div>
        </div>
      </Card>

      {/* SECTION 2: SECURITY SETTINGS */}
      <Card className="p-6 bg-[#111827] border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Security Settings</h3>
            <p className="text-xs text-slate-400">Configure authentication policies, session timeouts and login safety</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Password Policy</label>
            <select
              value={passwordPolicy}
              onChange={(e) => setPasswordPolicy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="Enterprise Strict (Min 12 Chars, Symbols & Numbers)">Enterprise Strict (Min 12 Chars, Symbols & Numbers)</option>
              <option value="Standard (Min 8 Chars)">Standard (Min 8 Chars)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Session Timeout</label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="15 Minutes">15 Minutes</option>
              <option value="30 Minutes">30 Minutes</option>
              <option value="60 Minutes">60 Minutes</option>
              <option value="120 Minutes">120 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Login Attempt Limit</label>
            <select
              value={loginAttemptLimit}
              onChange={(e) => setLoginAttemptLimit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="3 Attempts">3 Attempts</option>
              <option value="5 Attempts">5 Attempts</option>
              <option value="10 Attempts">10 Attempts</option>
            </select>
          </div>

          {/* Two-Factor Authentication Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="font-bold text-white">Two-Factor Authentication (2FA)</p>
              <span className="text-[10px] text-slate-400">Require 2FA verification for administrator accounts</span>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* SECTION 3: NOTIFICATION SETTINGS */}
      <Card className="p-6 bg-[#111827] border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Notification Settings</h3>
            <p className="text-xs text-slate-400">Manage automated municipal dispatch and operational channel toggles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="font-bold text-white">Email Notifications</p>
              <span className="text-[10px] text-slate-400">Receive complaint SLA and department email dispatches</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="font-bold text-white">SMS Notifications</p>
              <span className="text-[10px] text-slate-400">Receive emergency SMS notifications on mobile device</span>
            </div>
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="font-bold text-white">System Alerts</p>
              <span className="text-[10px] text-slate-400">Display in-app system telemetry status warnings</span>
            </div>
            <input
              type="checkbox"
              checked={systemAlerts}
              onChange={(e) => setSystemAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="font-bold text-white">Emergency Alerts</p>
              <span className="text-[10px] text-slate-400">High priority civil defense and severe event broadcasts</span>
            </div>
            <input
              type="checkbox"
              checked={emergencyAlerts}
              onChange={(e) => setEmergencyAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* SECTION 4: APPLICATION SETTINGS */}
      <Card className="p-6 bg-[#111827] border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Application Settings</h3>
            <p className="text-xs text-slate-400">Default dashboard view, telemetry refresh rate and date/time formatting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Default Dashboard</label>
            <select
              value={defaultDashboard}
              onChange={(e) => setDefaultDashboard(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="Admin Control Center">Admin Control Center</option>
              <option value="AI Traffic Command">AI Traffic Command</option>
              <option value="GIS Smart Map">GIS Smart Map</option>
              <option value="Citizen Portal">Citizen Portal</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Auto Refresh Interval</label>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="30 Seconds">30 Seconds</option>
              <option value="1 Minute">1 Minute</option>
              <option value="5 Minutes">5 Minutes</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-29)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (07/29/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (29/07/2026)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Time Format</label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="24-Hour (HH:mm)">24-Hour (HH:mm - e.g. 14:30)</option>
              <option value="12-Hour (AM/PM)">12-Hour (AM/PM - e.g. 02:30 PM)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* SECTION 5: BACKUP SETTINGS */}
      <Card className="p-6 bg-[#111827] border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Backup Settings</h3>
              <p className="text-xs text-slate-400">Database snapshot frequency and instant cloud backup vault triggers</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRunManualBackup}
            leftIcon={<HardDrive className="w-4 h-4 text-emerald-400" />}
            className="border-slate-800 bg-slate-900 text-slate-200 hover:text-white text-xs font-bold"
          >
            Run Manual Backup
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Last Backup Status</span>
            <p className="font-mono font-bold text-emerald-400">{lastBackupTime}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Backup Frequency</span>
            <p className="font-mono font-bold text-white">{backupFrequency}</p>
          </div>
        </div>
      </Card>

      {/* ====================================================
          3. SAVE SECTION (BOTTOM OF PAGE)
          ==================================================== */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetSettings}
          leftIcon={<RotateCcw className="w-4 h-4 text-slate-400" />}
          className="border-slate-800 text-slate-400 hover:text-white font-bold"
        >
          Reset Settings
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => handleSaveAll()}
          leftIcon={<Save className="w-4 h-4" />}
          className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
        >
          Save Changes
        </Button>
      </div>

    </div>
  );
};
