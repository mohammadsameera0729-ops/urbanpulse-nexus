import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/auth/Checkbox';
import { ValidationMessage } from '../../components/auth/ValidationMessage';
import { 
  Settings, 
  Sun, 
  Moon, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Save, 
  CheckCircle2, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export const CitizenSettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Settings States
  const [activeTab, setActiveTab] = useState<'theme' | 'notifications' | 'language' | 'privacy' | 'security'>('theme');
  const [saved, setSaved] = useState(false);

  const [notificationsConfig, setNotificationsConfig] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: true,
    emergencyBroadcasts: true,
    dailyDigest: false,
  });

  const [language, setLanguage] = useState('English');
  const [privacyConfig, setPrivacyConfig] = useState({
    anonymousReporting: false,
    publicProfile: true,
    showLocationData: true,
  });

  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Citizen Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Customize system theme, notification channels, privacy controls, and security options.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSaveSettings}
          leftIcon={<Save className="w-4 h-4" />}
          className="shadow-lg shadow-brand-500/20 font-bold"
        >
          Save Preferences
        </Button>
      </div>

      {saved && (
        <ValidationMessage
          type="success"
          title="Settings Saved"
          message="Your citizen portal preferences have been updated."
        />
      )}

      {/* Tabs Bar */}
      <Card className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { key: 'theme', label: 'Theme & Appearance', icon: <Sun className="w-4 h-4" /> },
            { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { key: 'language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
            { key: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
            { key: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === t.key
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Content Area */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        
        {/* 1. Theme Settings */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Theme Preference</h3>
              <p className="text-xs text-slate-500">Choose between light, dark, or system color themes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  theme === 'light'
                    ? 'border-brand-500 bg-brand-50/50 shadow-md ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun className="w-6 h-6 text-amber-500" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</h4>
                    <p className="text-[11px] text-slate-500">High contrast white background</p>
                  </div>
                </div>
                {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </div>

              <div
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  theme === 'dark'
                    ? 'border-brand-500 bg-brand-950/60 shadow-md ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-6 h-6 text-brand-400" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                    <p className="text-[11px] text-slate-500">Sleek slate dark theme</p>
                  </div>
                </div>
                {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-brand-400" />}
              </div>
            </div>
          </div>
        )}

        {/* 2. Notifications Config */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Channels</h3>
              <p className="text-xs text-slate-500">Select how and when UrbanPulse Nexus notifies you.</p>
            </div>

            <div className="space-y-3 pt-2">
              <Checkbox
                checked={notificationsConfig.emailAlerts}
                onChange={(e) => setNotificationsConfig({ ...notificationsConfig, emailAlerts: e.target.checked })}
                label={<span className="font-semibold text-xs">Email Ticket Updates & SLA Alerts</span>}
              />
              <Checkbox
                checked={notificationsConfig.smsAlerts}
                onChange={(e) => setNotificationsConfig({ ...notificationsConfig, smsAlerts: e.target.checked })}
                label={<span className="font-semibold text-xs">SMS Text Messages for High Priority Tickets</span>}
              />
              <Checkbox
                checked={notificationsConfig.pushNotifications}
                onChange={(e) => setNotificationsConfig({ ...notificationsConfig, pushNotifications: e.target.checked })}
                label={<span className="font-semibold text-xs">Mobile Browser Push Notifications</span>}
              />
              <Checkbox
                checked={notificationsConfig.emergencyBroadcasts}
                onChange={(e) => setNotificationsConfig({ ...notificationsConfig, emergencyBroadcasts: e.target.checked })}
                label={<span className="font-semibold text-xs text-rose-500">Emergency Civil Defense Broadcast Alerts</span>}
              />
            </div>
          </div>
        )}

        {/* 3. Language */}
        {activeTab === 'language' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Language Preference</h3>
              <p className="text-xs text-slate-500">Select your preferred system language.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {['English', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center ${
                    language === lang
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Privacy Controls */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Privacy & Geolocation</h3>
              <p className="text-xs text-slate-500">Manage data privacy and ticket visibility.</p>
            </div>

            <div className="space-y-3 pt-2">
              <Checkbox
                checked={privacyConfig.anonymousReporting}
                onChange={(e) => setPrivacyConfig({ ...privacyConfig, anonymousReporting: e.target.checked })}
                label={<span className="font-semibold text-xs">Anonymous Complaint Reporting Mode</span>}
              />
              <Checkbox
                checked={privacyConfig.publicProfile}
                onChange={(e) => setPrivacyConfig({ ...privacyConfig, publicProfile: e.target.checked })}
                label={<span className="font-semibold text-xs">Show Name on Public GIS Map Tickets</span>}
              />
              <Checkbox
                checked={privacyConfig.showLocationData}
                onChange={(e) => setPrivacyConfig({ ...privacyConfig, showLocationData: e.target.checked })}
                label={<span className="font-semibold text-xs">Attach High Precision GPS Telemetry to Reports</span>}
              />
            </div>
          </div>
        )}

        {/* 5. Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Authentication</h3>
              <p className="text-xs text-slate-500">Manage account security and 2FA protection.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">Require authenticator app code on login</p>
                </div>
              </div>

              <Button
                variant={twoFactor ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTwoFactor(!twoFactor)}
              >
                {twoFactor ? 'Enabled' : 'Enable 2FA'}
              </Button>
            </div>
          </div>
        )}

      </Card>

    </div>
  );
};
