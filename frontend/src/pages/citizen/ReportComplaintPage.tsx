import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CITIZEN_COMPLAINT_CATEGORIES, getAutoDepartment } from '../../data/citizenData';
import { Input } from '../../components/auth/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SmartCityMap } from '../../components/maps/SmartCityMap';
import { useAuth } from '../../context/AuthContext';

import {
  FilePlus,
  MapPin,
  UploadCloud,
  X,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { BASE_URL } from '../../config/api';

const API_URL = BASE_URL;

export const ReportComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(
    CITIZEN_COMPLAINT_CATEGORIES[0]
  );
  const [description, setDescription] = useState('');

  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high' | 'critical'
  >('medium');

  const [address, setAddress] = useState(
    'Benz Circle, Vijayawada, Andhra Pradesh'
  );

  const [coords, setCoords] = useState<{
    lat?: number;
    lng?: number;
  }>({});

  const [preferredContact, setPreferredContact] = useState<
    'Email' | 'SMS' | 'Phone'
  >('Email');

  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [submittedData, setSubmittedData] = useState<{
    ticketId: string;
    estimatedHours: string;
    department: string;
  } | null>(null);

  const autoDepartment = getAutoDepartment(category);

  const handleAddSampleImage = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    ];

    if (images.length < 5) {
      setImages([
        ...images,
        sampleImages[images.length % sampleImages.length],
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setTitle('');
    setCategory(CITIZEN_COMPLAINT_CATEGORIES[0]);
    setDescription('');
    setPriority('medium');
    setAddress('Benz Circle, Vijayawada, Andhra Pradesh');
    setPreferredContact('Email');
    setIncidentDate(new Date().toISOString().split('T')[0]);
    setImages([]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!title.trim()) {
      setError('Please enter a complaint title.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a detailed description.');
      return;
    }

    if (!address.trim()) {
      setError('Please enter the complaint location.');
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * AuthContext stores the JWT using:
       * urbanpulse_auth_token
       *
       * We first use the token supplied by AuthContext,
       * then check localStorage/sessionStorage as backup.
       */
      const authToken =
        token ||
        localStorage.getItem('urbanpulse_auth_token') ||
        sessionStorage.getItem('urbanpulse_auth_token');

      if (!authToken) {
        setError('Please log in again. Your login session was not found.');
        setLoading(false);
        return;
      }

      console.log('Submitting complaint to:', `${API_URL}/api/complaints`);
      console.log('Authentication token exists:', !!authToken);

      const response = await fetch(
        `${API_URL}/api/complaints`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            location: address.trim(),
            priority: priority,
            assignedDepartment: autoDepartment,
          }),
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        'Complaint API response:',
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
          `Failed to submit complaint. Server returned ${response.status}.`
        );
      }

      const complaint = data?.complaint;

      const ticketId = complaint?._id
        ? `UPN-2026-${String(complaint._id)
          .slice(-6)
          .toUpperCase()}`
        : `UPN-2026-${Math.floor(
          100000 + Math.random() * 900000
        )}`;

      const estimatedHours =
        priority === 'critical'
          ? '12 - 24 Hours'
          : priority === 'high'
            ? '24 - 48 Hours'
            : priority === 'medium'
              ? '3 - 5 Days'
              : '5 - 7 Days';

      setSubmittedData({
        ticketId,
        estimatedHours,
        department: autoDepartment,
      });

      setError('');

      console.log(
        'Complaint submitted successfully:',
        complaint
      );
    } catch (err: any) {
      console.error(
        'Complaint submission error:',
        err
      );

      if (
        err instanceof TypeError &&
        err.message?.toLowerCase().includes('fetch')
      ) {
        setError(
          'Cannot connect to the backend server. Please verify your connection or backend server status.'
        );
      } else {
        setError(
          err?.message ||
          'Failed to submit complaint. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">

      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Citizen Intake Desk
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Report Civic Infrastructure Issue
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Submit details regarding potholes, street lighting,
          water leaks, or public hazards. AI dispatch will route
          your report directly to field crews.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500 bg-rose-950/40 text-rose-400 text-sm font-bold">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      <AnimatePresence>
        {submittedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 mx-auto flex items-center justify-center shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Verification Confirmed
              </span>

              <h2 className="text-3xl font-black text-white">
                Complaint Submitted Successfully!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Your complaint has been successfully recorded
                in the UrbanPulse Nexus system and is ready
                for dispatch.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-md mx-auto grid grid-cols-2 gap-4 text-left font-mono text-xs">

              <div>
                <span className="text-[10px] text-slate-400 uppercase">
                  Complaint ID
                </span>

                <p className="font-bold text-brand-400 text-sm">
                  {submittedData.ticketId}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase">
                  Est. Resolution
                </span>

                <p className="font-bold text-emerald-400">
                  {submittedData.estimatedHours}
                </p>
              </div>

              <div className="col-span-2 border-t border-slate-700/80 pt-2">
                <span className="text-[10px] text-slate-400 uppercase">
                  Assigned Department
                </span>

                <p className="font-bold text-white flex items-center gap-1.5 mt-0.5 font-sans">
                  <Building2 className="w-3.5 h-3.5 text-brand-400" />
                  {submittedData.department}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">

              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  navigate('/citizen/my-complaints')
                }
                rightIcon={
                  <ArrowRight className="w-4 h-4" />
                }
                className="px-6 font-bold"
              >
                Track My Complaints
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setSubmittedData(null);
                  handleClear();
                }}
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                Submit Another Report
              </Button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORM */}
      {!submittedData && (
        <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl space-y-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* SECTION 1 */}
            <div className="space-y-4">

              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 flex items-center gap-2">
                <FilePlus className="w-4 h-4" />
                1. Incident Overview
              </h3>

              <Input
                label="Complaint Title"
                required
                placeholder="e.g. Hazardous Deep Pothole on Benz Circle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* CATEGORY */}
                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Category{' '}
                    <span className="text-rose-500">*</span>
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as any)
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {CITIZEN_COMPLAINT_CATEGORIES.map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>

                </div>

                {/* PRIORITY */}
                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Urgency Priority{' '}
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">

                    {(
                      [
                        'low',
                        'medium',
                        'high',
                        'critical',
                      ] as const
                    ).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all ${priority === p
                            ? p === 'critical'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                              : p === 'high'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                                : 'bg-brand-600 text-white border-brand-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                      >
                        {p}
                      </button>
                    ))}

                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">

                <div className="flex items-center justify-between">

                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Detailed Description{' '}
                    <span className="text-rose-500">*</span>
                  </label>

                  <span
                    className={`text-[11px] font-mono ${description.length > 450
                        ? 'text-rose-500 font-bold'
                        : 'text-slate-400'
                      }`}
                  >
                    {description.length} / 500 characters
                  </span>

                </div>

                <textarea
                  rows={4}
                  required
                  maxLength={500}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the problem, hazard dimensions, vehicle risk, or specific milestones nearby..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                />

              </div>

              {/* DEPARTMENT */}
              <div className="p-3.5 rounded-2xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-between text-xs">

                <div className="flex items-center gap-2">

                  <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      AI Auto-Suggested Dispatch
                    </span>

                    <p className="font-bold text-slate-900 dark:text-white">
                      {autoDepartment}
                    </p>
                  </div>

                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">
                  98% Match
                </span>

              </div>
            </div>

            {/* SECTION 2 */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">

              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                2. Location Geotagging
              </h3>

              <Input
                label="Street Address / Landmark"
                required
                placeholder="Enter street address"
                leftIcon={
                  <MapPin className="w-4 h-4" />
                }
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />

              <div className="space-y-2">

                <div className="flex items-center justify-between text-xs">

                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Interactive Map Pinpoint
                  </span>

                  <span className="font-mono text-slate-400 text-[11px]">
                    {typeof coords.lat === 'number' && typeof coords.lng === 'number'
                      ? `Lat: ${coords.lat.toFixed(4)} | Lng: ${coords.lng.toFixed(4)}`
                      : 'Location Resolution: Auto-Geotagged'}
                  </span>

                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">

                  <SmartCityMap
                    height="240px"
                    showTrafficSensors={false}
                  />

                </div>
              </div>
            </div>

            {/* SECTION 3 */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">

              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 flex items-center gap-2">
                <UploadCloud className="w-4 h-4" />
                3. Evidence Photos & Attachments
              </h3>

              <div
                onClick={handleAddSampleImage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() =>
                  setIsDragging(false)
                }
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleAddSampleImage();
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${isDragging
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60'
                    : 'border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
              >

                <UploadCloud className="w-8 h-8 text-brand-500 mx-auto mb-2" />

                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Drag and drop photo evidence here, or{' '}
                  <span className="text-brand-600 dark:text-brand-400 underline">
                    browse
                  </span>
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP up to 10MB per image
                </p>

              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">

                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md"
                    >

                      <img
                        src={img}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImage(idx)
                        }
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  ))}

                </div>
              )}
            </div>

            {/* SECTION 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Preferred Contact Method
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {(
                    ['Email', 'SMS', 'Phone'] as const
                  ).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() =>
                        setPreferredContact(method)
                      }
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${preferredContact === method
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      {method}
                    </button>
                  ))}

                </div>
              </div>

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Incident Date
                </label>

                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) =>
                    setIncidentDate(e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />

              </div>
            </div>

            {/* BUTTONS */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                leftIcon={
                  <RotateCcw className="w-4 h-4" />
                }
                className="w-full sm:w-auto"
              >
                Clear Form
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full sm:w-auto px-8 shadow-lg shadow-brand-500/25 font-bold"
                rightIcon={
                  <ArrowRight className="w-4 h-4" />
                }
              >
                Submit Complaint Report
              </Button>

            </div>

          </form>

        </Card>
      )}

    </div>
  );
};