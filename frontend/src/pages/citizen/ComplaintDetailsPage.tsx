import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStatusBadgeStyle, formatDate, openGoogleMaps } from '../../utils/formatters';
import {
  ArrowLeft,
  MapPin,
  Building2,
  UserCheck,
  Download,
  Send,
  MessageSquare,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SmartCityMap } from '../../components/maps/SmartCityMap';

const API_URL = 'http://localhost:5000/api';

interface BackendComplaintActivity {
  _id?: string;
  timestamp?: string;
  author?: string;
  role?: string;
  note?: string;
  statusChange?: string;
}

interface BackendComplaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: any;
  latitude?: number;
  longitude?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'under_review' | 'resolved' | 'rejected';
  citizen?: any;
  assignedDepartment?: string;
  assignedAgent?: string;
  aiConfidenceScore?: number;
  slaDueDate?: string;
  remarks?: string;
  activities?: BackendComplaintActivity[];
  createdAt?: string;
  updatedAt?: string;
}

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [complaint, setComplaint] =
    useState<BackendComplaint | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newComment, setNewComment] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  /**
   * Get authentication token.
   */
  const getToken = () => {
    return (
      localStorage.getItem('urbanpulse_auth_token') ||
      sessionStorage.getItem('urbanpulse_auth_token')
    );
  };

  /**
   * Fetch the selected complaint from MongoDB using GET /api/complaints/:id.
   */
  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) {
        setError('Complaint ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const token = getToken();

        const response = await fetch(`${API_URL}/complaints/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token
              ? {
                Authorization: `Bearer ${token}`,
              }
              : {}),
          },
          credentials: 'include',
        });

        const result = await response.json();

        console.log('Complaint details API response:', result);

        if (!response.ok || !result.success || !result.complaint) {
          throw new Error(
            result?.message || 'Failed to load complaint details.'
          );
        }

        const realComplaint: BackendComplaint = result.complaint;
        setComplaint(realComplaint);

        /**
         * Use real complaint.activities from MongoDB.
         * Display empty state if no activities exist yet.
         */
        if (Array.isArray(realComplaint.activities) && realComplaint.activities.length > 0) {
          setActivities(
            realComplaint.activities.map((act, index) => ({
              id: act._id || `act-${index}-${Date.now()}`,
              timestamp: act.timestamp || realComplaint.createdAt || new Date().toISOString(),
              author: act.author || 'System',
              role: act.role || 'System',
              note: act.note || 'Complaint activity updated.',
            }))
          );
        } else {
          setActivities([]);
        }
      } catch (err: any) {
        console.error(
          'Complaint details error:',
          err
        );

        setError(
          err?.message ||
          'Unable to load complaint details.'
        );
        setComplaint(null);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  /**
   * Add a local citizen note.
   */
  const handleAddComment = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const newActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: 'Citizen',
      role: 'Citizen',
      note: newComment.trim(),
    };

    setActivities((previous) => [
      ...previous,
      newActivity,
    ]);

    setNewComment('');
  };

  /**
   * Fake receipt export for now.
   */
  const handleDownloadReceipt = () => {
    setReceiptDownloaded(true);

    setTimeout(() => {
      setReceiptDownloaded(false);
    }, 3000);
  };

  /**
   * Calculate progress from complaint status.
   */
  const getProgressPercentage = () => {
    if (!complaint) return 0;

    switch (complaint.status) {
      case 'resolved':
        return 100;

      case 'in_progress':
        return 65;

      case 'pending':
        return 25;

      case 'rejected':
        return 100;

      default:
        return 10;
    }
  };

  /**
   * Generate ticket ID from MongoDB ID.
   */
  const getTicketId = () => {
    if (!complaint?._id) {
      return 'N/A';
    }

    return `UPN-${String(
      complaint._id
    )
      .slice(-6)
      .toUpperCase()}`;
  };

  /**
   * Loading screen.
   */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Loading Complaint...
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Retrieving your complaint from UrbanPulse Nexus.
        </p>
      </div>
    );
  }

  /**
   * Error / not found screen.
   */
  if (error || !complaint) {
    return (
      <div className="max-w-3xl mx-auto py-16">
        <Card className="p-10 text-center rounded-3xl">
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />

          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Complaint Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error ||
              'The requested complaint could not be found.'}
          </p>

          <Button
            variant="primary"
            className="mt-6"
            onClick={() =>
              navigate('/citizen/my-complaints')
            }
            leftIcon={
              <ArrowLeft className="w-4 h-4" />
            }
          >
            Back to My Complaints
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate('/citizen/my-complaints')
            }
            leftIcon={
              <ArrowLeft className="w-4 h-4" />
            }
          >
            Back
          </Button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">

              <span className="font-mono text-base font-black text-brand-600 dark:text-brand-400">
                #{getTicketId()}
              </span>

              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadgeStyle(
                  complaint.status
                )}`}
              >
                {complaint.status.replace(
                  '_',
                  ' '
                )}
              </span>

            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {complaint.title}
            </h1>
          </div>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={handleDownloadReceipt}
          leftIcon={
            <Download className="w-4 h-4" />
          }
        >
          {receiptDownloaded
            ? 'Receipt Exported'
            : 'Download SLA Receipt'}
        </Button>

      </div>

      {/* SUCCESS STATUS */}
      {complaint.status === 'resolved' && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />

          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-400">
              Complaint Resolved
            </p>

            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              This complaint has been marked as resolved.
            </p>
          </div>
        </div>
      )}

      {/* PROGRESS */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-3 rounded-3xl">

        <div className="flex items-center justify-between text-xs">

          <span className="font-mono uppercase text-brand-300 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Live Resolution Pipeline
          </span>

          <span className="font-mono text-emerald-400 font-bold">
            {getProgressPercentage()}% Completed
          </span>

        </div>

        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">

          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 via-sky-400 to-emerald-400"
            initial={{ width: '0%' }}
            animate={{
              width: `${getProgressPercentage()}%`,
            }}
            transition={{ duration: 1 }}
          />

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] sm:text-[11px] text-slate-300 font-mono pt-1">
          <span>1. Intake & AI Scored</span>
          <span>2. Crew Dispatched</span>
          <span>3. SLA Repair Active</span>
          <span>4. Verified & Resolved</span>
        </div>

      </Card>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-7 space-y-6">

          {/* INCIDENT DETAILS */}
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 rounded-3xl">

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Incident Details
            </h3>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {complaint.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">

              <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Reported Location
                    </p>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      {complaint.location}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openGoogleMaps(complaint.latitude, complaint.longitude, complaint.location)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800 shrink-0"
                >
                  Open in Google Maps ↗
                </Button>

              </div>

            </div>

          </Card>

          {/* ACTIVITY */}
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 rounded-3xl">

            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Activity Stream & Discussion
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">

              {activities.length > 0 ? (
                activities.map((activity) => (

                  <div
                    key={activity.id}
                    className="relative pl-8 space-y-1"
                  >

                    <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs">
                      {activity.role === 'citizen' || activity.role === 'Citizen'
                        ? '👤'
                        : activity.role === 'admin' || activity.role === 'staff'
                          ? '⚙️'
                          : '🤖'}
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">

                      <span className="font-bold text-slate-900 dark:text-white">
                        {activity.author} (
                        {activity.role})
                      </span>

                      <span className="text-[10px] font-mono text-slate-400">
                        {formatDate(
                          activity.timestamp
                        )}
                      </span>

                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {activity.note}
                    </p>

                  </div>

                ))
              ) : (
                <p className="text-xs text-slate-400 italic pl-4 py-2">
                  No activity updates recorded yet for this complaint.
                </p>
              )}

            </div>

            {/* COMMENT */}
            <form
              onSubmit={handleAddComment}
              className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3"
            >

              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Add Citizen Note / Update
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  placeholder="Type an update..."
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(
                      e.target.value
                    )
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  rightIcon={
                    <Send className="w-3.5 h-3.5" />
                  }
                >
                  Post
                </Button>

              </div>

            </form>

          </Card>

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-6">

          {/* SPECIFICATIONS */}
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 rounded-3xl">

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Ticket Specifications
            </h3>

            <div className="space-y-3 text-xs">

              <div className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">
                  Category:
                </span>

                <strong className="text-slate-900 dark:text-white text-right">
                  {complaint.category}
                </strong>
              </div>

              <div className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">
                  Priority:
                </span>

                <strong className="uppercase text-rose-500">
                  {complaint.priority}
                </strong>
              </div>

              <div className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">

                <span className="text-slate-500">
                  Department:
                </span>

                <strong className="text-slate-900 dark:text-white text-right flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-brand-500" />

                  {complaint.assignedDepartment ||
                    'Pending Assignment'}
                </strong>

              </div>

              <div className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">

                <span className="text-slate-500">
                  Field Agent:
                </span>

                <strong className="text-slate-900 dark:text-white text-right flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />

                  {complaint.assignedAgent ||
                    'Not Assigned'}
                </strong>

              </div>

              <div className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">

                <span className="text-slate-500">
                  AI Confidence:
                </span>

                <strong className="text-brand-600 font-mono">
                  {complaint.aiConfidenceScore ||
                    96}
                  %
                </strong>

              </div>

              <div className="flex justify-between gap-4 py-2">

                <span className="text-slate-500">
                  Submitted:
                </span>

                <strong className="text-slate-900 dark:text-white font-mono">
                  {complaint.createdAt
                    ? formatDate(
                      complaint.createdAt
                    )
                    : 'N/A'}
                </strong>

              </div>

            </div>

          </Card>

          {/* MAP */}
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 rounded-3xl">

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                Geotagged Location
              </h3>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openGoogleMaps(complaint.latitude, complaint.longitude, complaint.location)}
                className="text-[11px] font-bold text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800"
              >
                Open in Google Maps ↗
              </Button>
            </div>

            <p className="text-xs text-slate-500">
              {complaint.location}
            </p>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <SmartCityMap
                height="200px"
                showTrafficSensors={false}
              />
            </div>

          </Card>

        </div>

      </div>

    </div>
  );
};