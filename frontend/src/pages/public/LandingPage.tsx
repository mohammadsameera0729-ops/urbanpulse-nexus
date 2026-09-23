import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Radio, 
  MapPin, 
  ArrowRight, 
  LayoutDashboard, 
  Activity,
  Cpu,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Eye,
  Siren,
  Sparkles,
  ChevronRight,
  Droplets,
  Trash2,
  Truck,
  Lightbulb,
  Leaf,
  ShieldAlert,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white pt-16 transition-colors">
      
      {/* ====================================================
          SECTION 1 — HERO (#home)
          ==================================================== */}
      <section id="home" className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" /> Municipal Operations Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC] leading-none">
              UrbanPulse <span className="text-[#2563EB]">Nexus</span>
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-[#2563EB]">
              AI-Powered Smart City Operations Platform
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] leading-relaxed max-w-2xl font-normal">
              A civic operations platform connecting citizens, municipal administrators, departments, and field staff through complaint management, Smart City GIS, traffic monitoring, and role-based municipal workflows for Vijayawada.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link to="/register">
                <button className="px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  Explore Platform <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link to="/login">
                <button className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-[#F8FAFC] font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center gap-2 shadow-sm">
                  <LayoutDashboard className="w-4 h-4 text-[#2563EB]" /> View Live Dashboard
                </button>
              </Link>
            </div>

            {/* Four Truthful Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-[#94A3B8] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Civic Complaints</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-[#94A3B8] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Smart City GIS</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-[#94A3B8] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>6 Departments</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-[#94A3B8] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Role Workflows</span>
              </div>
            </div>
          </div>

          {/* Hero Right Side: Platform Capabilities Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F8FAFC]">
                    Platform Capabilities
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                </span>
              </div>

              {/* Status List Items */}
              <div className="space-y-3">
                
                {/* Item 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">Civic Complaints</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">ACTIVE</span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">Smart City GIS</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">Vijayawada</span>
                </div>

                {/* Item 3 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">Municipal Departments</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">6 Departments</span>
                </div>

                {/* Item 4 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">Traffic Monitoring</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">12 Monitoring Points</span>
                </div>

                {/* Item 5 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-[#94A3B8]">Role Workflows</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">ENABLED</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 2 — OVERVIEW / FEATURE CARDS (#overview)
          ==================================================== */}
      <section id="overview" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Civic Complaints */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-[#94A3B8]">Civic Complaints</span>
              <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Submit, Assign & Track</div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Citizen reporting and municipal resolution workflow</p>
          </div>

          {/* Card 2: Municipal Departments */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-[#94A3B8]">Municipal Departments</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">6 Approved Departments</div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Public Health, Water, Roads, Lighting, Parks & Safety</p>
          </div>

          {/* Card 3: Smart City GIS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-[#94A3B8]">Smart City GIS</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Vijayawada Intelligence</div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Spatial mapping of civic complaints and operational monitoring points</p>
          </div>

          {/* Card 4: Role-Based Operations */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-[#94A3B8]">Role-Based Operations</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Citizen, Staff & Admin</div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Role-based municipal operational access</p>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 3 — CORE FEATURES (#features)
          ==================================================== */}
      <section id="features" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">Enterprise Architecture</h2>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Core Platform Features</p>
        </div>

        {/* 3x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Civic Complaint Management</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Register civic issues with location tagging, category selection, and transparent lifecycle tracking from submission to resolution.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline pt-1">
              Explore Portal <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Smart City GIS</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Interactive Vijayawada geospatial mapping displaying municipal complaint markers and 12 traffic monitoring points.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline pt-1">
              View Smart Map <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Department & Staff Assignment</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Admin ticket routing across 6 approved municipal departments and matching active field staff officers.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline pt-1">
              View Workflows <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Traffic Monitoring Points</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Traffic monitoring intelligence and 12 monitoring points for urban congestion analysis and intersection management.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline pt-1">
              Traffic Monitoring <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Role-Based Portals</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Tailored portal views designed specifically for Citizens, Field Staff Officers, and Municipal Administrators.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline pt-1">
              Sign In <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/50 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Municipal Notifications</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Real-time operational alerts, ticket status update notices, and activity logs across municipal roles.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline pt-1">
              Notifications <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 4 — PUBLIC SECTOR SOLUTIONS (#solutions)
          ==================================================== */}
      <section id="solutions" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">Public Sector Solutions</h2>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Approved Municipal Departments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Department 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/40 transition-all hover:-translate-y-1 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Public Health & Sanitation</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Waste collection management, civic bin overflow clearance, and municipal hygiene maintenance.
            </p>
            <Link to="/login">
              <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#2563EB] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-all">
                Access Portal
              </button>
            </Link>
          </div>

          {/* Department 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/40 transition-all hover:-translate-y-1 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Water Supply & Sewerage</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Drinking water supply monitoring, pipeline leakage repair, and municipal sewerage maintenance.
            </p>
            <Link to="/login">
              <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#2563EB] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-all">
                Access Portal
              </button>
            </Link>
          </div>

          {/* Department 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/40 transition-all hover:-translate-y-1 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Roads & Storm Water Drainage</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Pothole asphalt repair tracking, road surface maintenance, and stormwater drain desilting.
            </p>
            <Link to="/login">
              <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#2563EB] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-all">
                Access Portal
              </button>
            </Link>
          </div>

          {/* Department 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/40 transition-all hover:-translate-y-1 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Street Lighting</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              LED streetlight outage reporting, avenue fixture maintenance, and lighting grid monitoring.
            </p>
            <Link to="/login">
              <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#2563EB] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-all">
                Access Portal
              </button>
            </Link>
          </div>

          {/* Department 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/40 transition-all hover:-translate-y-1 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Parks & Urban Greenery</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Public park maintenance, horticultural trimming, and boundary fence repair tracking.
            </p>
            <Link to="/login">
              <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#2563EB] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-all">
                Access Portal
              </button>
            </Link>
          </div>

          {/* Department 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-[#2563EB]/40 transition-all hover:-translate-y-1 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Public Safety & Emergency Response</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Rapid hazard identification, emergency control room alerts, and multi-agency coordination.
            </p>
            <Link to="/login">
              <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#2563EB] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-all">
                Access Portal
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 5 — TRAFFIC SECTION (#traffic)
          ==================================================== */}
      <section id="traffic" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">Vijayawada Traffic Intelligence</h2>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Traffic Monitoring & Location References</p>
        </div>

        {/* 6 Truthful Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-colors shadow-sm">
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB] w-fit">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Intersection Reference Points</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Monitoring key Vijayawada intersections such as Benz Circle, Eluru Road, and Governorpet.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-colors shadow-sm">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Traffic Flow Monitoring</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Reference location intelligence for urban congestion management and signal planning.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-colors shadow-sm">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
              <Siren className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Emergency Corridor Planning</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Priority route planning for ambulances, fire engines, and emergency dispatch.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-colors shadow-sm">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Road Hazard Identification</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Traffic incident logging for stalled vehicles, potholes, and road obstructions.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-colors shadow-sm">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Spatial Density Mapping</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Zone-based traffic density mapping across municipal sectors in Vijayawada.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-colors shadow-sm">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Multi-Department Coordination</h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Connecting traffic monitoring intelligence with municipal emergency response.
            </p>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 6 — ANALYTICS PREVIEW SECTION (#analytics)
          ==================================================== */}
      <section id="analytics" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">Operational Intelligence</h2>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Municipal Platform Capabilities</p>
        </div>

        {/* Clean Dashboard Preview Container */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">SYSTEM STATUS: ACTIVE</span>
            </div>
            <span className="text-xs font-mono text-[#2563EB]">6 MUNICIPAL DEPARTMENTS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Widget 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Complaint Management</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Active</p>
              <span className="text-[10px] text-slate-400">Full lifecycle tracking</span>
            </div>

            {/* Widget 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Approved Departments</span>
              <p className="text-2xl font-mono font-black text-[#2563EB]">6</p>
              <span className="text-[10px] text-slate-400">Integrated municipal bodies</span>
            </div>

            {/* Widget 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">GIS Location</span>
              <p className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Vijayawada</p>
              <span className="text-[10px] text-slate-400">Andhra Pradesh, India</span>
            </div>

            {/* Widget 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Role Access</span>
              <p className="text-lg font-bold text-indigo-500">3 Roles</p>
              <span className="text-[10px] text-slate-400">Citizen, Staff & Admin</span>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
