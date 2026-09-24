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

// Known real geographical coordinates for Vijayawada sub-localities / landmarks
const VIJAYAWADA_FRONTEND_LOCALITIES: Array<{ keywords: string[]; lat: number; lng: number }> = [
  { keywords: ['dabakotlu', 'daba kotlu'], lat: 16.5385, lng: 80.6260 },
  { keywords: ['benz circle', 'benzcircle', 'benz'], lat: 16.5016, lng: 80.6436 },
  { keywords: ['singh nagar', 'singhnagar', 'ajit singh nagar'], lat: 16.5360, lng: 80.6300 },
  { keywords: ['prakash nagar', 'prakashnagar'], lat: 16.5265, lng: 80.6275 },
  { keywords: ['ramavarappadu', 'ramvarpadu', 'ring road'], lat: 16.5280, lng: 80.6800 },
  { keywords: ['governorpet', 'governor pet'], lat: 16.5115, lng: 80.6235 },
  { keywords: ['moghalrajpuram', 'mogalrajpuram', 'jammi chettu'], lat: 16.5050, lng: 80.6500 },
  { keywords: ['labbipet', 'labbi pet'], lat: 16.5040, lng: 80.6370 },
  { keywords: ['auto nagar', 'autonagar', '100 feet road'], lat: 16.4980, lng: 80.6720 },
  { keywords: ['gunadala', 'esi hospital'], lat: 16.5260, lng: 80.6610 },
  { keywords: ['satyanarayanapuram', 'satyanarayana puram'], lat: 16.5230, lng: 80.6280 },
  { keywords: ['bhavanipuram', 'bhavani puram', 'swathi theatre'], lat: 16.5280, lng: 80.5900 },
  { keywords: ['patamata', 'patamata lanka', 'high school road'], lat: 16.4950, lng: 80.6540 },
  { keywords: ['one town', 'onetown', 'kaleswara rao', 'kr market', 'tarapet'], lat: 16.5160, lng: 80.6120 },
  { keywords: ['two town', 'twotown', 'hanumanpet'], lat: 16.5180, lng: 80.6200 },
  { keywords: ['kanuru', 'tadigadapa'], lat: 16.4880, lng: 80.6850 },
  { keywords: ['gollapudi'], lat: 16.5450, lng: 80.5750 },
  { keywords: ['gandhinagar', 'gandhi nagar', 'music college'], lat: 16.5170, lng: 80.6300 },
  { keywords: ['eluru road'], lat: 16.5180, lng: 80.6350 },
  { keywords: ['mg road', 'bandar road'], lat: 16.5030, lng: 80.6400 },
  { keywords: ['tadepalli', 'manipal hospital'], lat: 16.4840, lng: 80.6050 },
  { keywords: ['enikepadu', 'prasadampadu'], lat: 16.5250, lng: 80.7020 },
  { keywords: ['chuttugunta'], lat: 16.5150, lng: 80.6400 },
  { keywords: ['payakapuram'], lat: 16.5430, lng: 80.6320 },
  { keywords: ['machavaram'], lat: 16.5120, lng: 80.6480 },
  { keywords: ['suryaraopet', 'surayaraopet'], lat: 16.5100, lng: 80.6300 },
  { keywords: ['kedareswarapet', 'kedareswara pet'], lat: 16.5220, lng: 80.6250 },
  { keywords: ['vidyadharapuram'], lat: 16.5320, lng: 80.6000 },
  { keywords: ['christurajupuram', 'chisturajupuram'], lat: 16.5020, lng: 80.6450 },
  { keywords: ['ntr circle', 'ntr statue'], lat: 16.4950, lng: 80.6520 },
  { keywords: ['prakasam barrage'], lat: 16.5060, lng: 80.6050 },
  { keywords: ['kanaka durga', 'durga temple', 'indrakeeladri'], lat: 16.5150, lng: 80.6080 },
  { keywords: ['railway station', 'station road'], lat: 16.5175, lng: 80.6200 },
  { keywords: ['bus stand', 'pnbs', 'pandit nehru'], lat: 16.5080, lng: 80.6170 },
  { keywords: ['control room', 'police control room'], lat: 16.5110, lng: 80.6200 },
  { keywords: ['pvp square', 'trendset', 'icon mall'], lat: 16.5035, lng: 80.6385 },
  { keywords: ['ramesh hospital'], lat: 16.5010, lng: 80.6550 },
  { keywords: ['poranki', 'kamineni'], lat: 16.4780, lng: 80.6980 },
  { keywords: ['siddhartha', 'vr siddhartha', 'pb siddhartha'], lat: 16.4880, lng: 80.6550 },
  { keywords: ['gurrnanak', 'guru nanak'], lat: 16.4990, lng: 80.6580 },
];

export const resolveVijayawadaLocationFrontend = (locationText?: string): { lat: number; lng: number } => {
  if (!locationText || typeof locationText !== 'string' || !locationText.trim()) {
    return { lat: 16.5062, lng: 80.6480 };
  }

  const clean = locationText.trim().toLowerCase();

  for (const item of VIJAYAWADA_FRONTEND_LOCALITIES) {
    if (item.keywords.some((kw) => clean.includes(kw))) {
      return { lat: item.lat, lng: item.lng };
    }
  }

  // Deterministic fallback for any Vijayawada location string
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 100) - 50) * 0.0001;
  const lngOffset = ((Math.abs(hash >> 3) % 100) - 50) * 0.0001;

  return {
    lat: Number((16.5062 + latOffset).toFixed(6)),
    lng: Number((80.6480 + lngOffset).toFixed(6)),
  };
};

