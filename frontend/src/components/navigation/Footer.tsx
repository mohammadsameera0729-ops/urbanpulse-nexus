import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="w-full py-12 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#0F172A] text-xs text-slate-600 dark:text-[#94A3B8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Col 1: Logo & About (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-md shadow-[#2563EB]/25">
                <Activity className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                UrbanPulse <span className="text-[#2563EB]">Nexus</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed max-w-sm">
              AI-Powered Smart City Operations Platform delivering real-time municipal telemetry, AI traffic monitoring, and GIS incident coordination.
            </p>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F8FAFC]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-[#2563EB] transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a></li>
              <li><a href="#solutions" className="hover:text-[#2563EB] transition-colors">Solutions</a></li>
              <li><a href="#traffic" className="hover:text-[#2563EB] transition-colors">AI Traffic</a></li>
              <li><a href="#analytics" className="hover:text-[#2563EB] transition-colors">Analytics</a></li>
              <li><a href="#contact" className="hover:text-[#2563EB] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Contact Info (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F8FAFC]">
              Contact Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-[#94A3B8]">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>contact@urbanpulse.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>+1 (800) 555-URBAN</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Municipal Command Center, City Core</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 UrbanPulse Nexus. All Rights Reserved.</p>
          <div className="flex items-center gap-4 font-semibold">
            <Link to="/help" className="hover:text-slate-900 dark:hover:text-[#F8FAFC] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/help" className="hover:text-slate-900 dark:hover:text-[#F8FAFC] transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};





