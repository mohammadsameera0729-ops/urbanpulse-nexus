import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Download, CheckCircle2, Calendar, FileSpreadsheet } from 'lucide-react';

interface TrafficReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrafficReportsModal: React.FC<TrafficReportsModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadReport = (format: string) => {
    setDownloading(true);
    setDownloaded(false);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Traffic Telemetry Reports Generator</h3>
              <p className="text-xs text-slate-400">
                Export comprehensive daily, weekly, or zone-specific traffic flow analytics.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">24-Hour City-Wide Traffic Flow Summary</p>
              <p className="text-[11px] text-slate-400">Includes 105 camera telemetry logs, VPM curves, and incident resolutions.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('PDF')}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="border-slate-800 text-brand-400 hover:bg-slate-800"
            >
              Export PDF
            </Button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">ANPR License Plate & Flow Dataset (CSV)</p>
              <p className="text-[11px] text-slate-400">Raw timestamped telemetry logs for urban planning models.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('CSV')}
              leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
              className="border-slate-800 text-emerald-400 hover:bg-slate-800"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {downloaded && (
          <div className="p-3 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Report generated successfully! Download initialized.
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};
