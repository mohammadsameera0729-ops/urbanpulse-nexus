import { Priority, ComplaintStatus, Category } from '../types';

export const getStatusBadgeStyle = (status: ComplaintStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700/50';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700/50';
    case 'under_review':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700/50';
    case 'resolved':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50';
    case 'rejected':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-700/50';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

export const getPriorityBadgeStyle = (priority: Priority) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-500 text-white font-semibold shadow-sm animate-pulse';
    case 'high':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'medium':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'low':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
};

export const formatStatusLabel = (status: ComplaintStatus) => {
  switch (status) {
    case 'pending': return 'Pending Review';
    case 'in_progress': return 'In Progress';
    case 'under_review': return 'Under Review';
    case 'resolved': return 'Resolved';
    case 'rejected': return 'Rejected';
    default: return status;
  }
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getGoogleMapsUrl = (
  latitude?: number,
  longitude?: number,
  location?: string | { address?: string; lat?: number; lng?: number }
): string => {
  const hasLat = typeof latitude === 'number' && !isNaN(latitude) && latitude !== 0;
  const hasLng = typeof longitude === 'number' && !isNaN(longitude) && longitude !== 0;

  let locLat: number | undefined;
  let locLng: number | undefined;
  let locText = '';

  if (typeof location === 'object' && location !== null) {
    if (typeof location.lat === 'number' && !isNaN(location.lat) && location.lat !== 0) {
      locLat = location.lat;
    }
    if (typeof location.lng === 'number' && !isNaN(location.lng) && location.lng !== 0) {
      locLng = location.lng;
    }
    locText = (location.address || '').trim();
  } else if (typeof location === 'string') {
    locText = location.trim();
  }

  const finalLat = hasLat ? latitude : locLat;
  const finalLng = hasLng ? longitude : locLng;

  if (
    typeof finalLat === 'number' &&
    typeof finalLng === 'number' &&
    !isNaN(finalLat) &&
    !isNaN(finalLng) &&
    finalLat !== 0 &&
    finalLng !== 0
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${finalLat},${finalLng}`;
  }

  if (locText && locText !== 'Location not provided') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locText)}`;
  }

  return '';
};

export const openGoogleMaps = (
  latitude?: number,
  longitude?: number,
  location?: string | { address?: string; lat?: number; lng?: number }
): void => {
  const url = getGoogleMapsUrl(latitude, longitude, location);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

