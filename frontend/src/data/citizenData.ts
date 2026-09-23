import { Category } from '../types';

export interface CitizenStat {
  id: string;
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  gradient: string;
  sparkline: number[];
}

export const APPROVED_DEPARTMENTS = [
  'Public Health & Sanitation',
  'Water Supply & Sewerage',
  'Roads & Storm Water Drainage',
  'Street Lighting',
  'Parks & Urban Greenery',
  'Public Safety & Emergency Response',
] as const;

export const CATEGORY_TO_DEPARTMENT_MAP: Record<string, string> = {
  // Public Health & Sanitation
  'Garbage not collected': 'Public Health & Sanitation',
  'Garbage accumulation / waste dumping': 'Public Health & Sanitation',

  // Water Supply & Sewerage
  'Water pipeline leakage': 'Water Supply & Sewerage',
  'Water supply problem': 'Water Supply & Sewerage',

  // Roads & Storm Water Drainage
  'Pothole / damaged road': 'Roads & Storm Water Drainage',
  'Drainage / waterlogging problem': 'Roads & Storm Water Drainage',

  // Street Lighting
  'Street light not working': 'Street Lighting',

  // Parks & Urban Greenery
  'Park / greenery maintenance problem': 'Parks & Urban Greenery',
  'Fallen/damaged tree or branch': 'Parks & Urban Greenery',

  // Public Safety & Emergency Response
  'Public safety hazard': 'Public Safety & Emergency Response',
};

export const getAutoDepartment = (cat: string): string => {
  if (CATEGORY_TO_DEPARTMENT_MAP[cat]) {
    return CATEGORY_TO_DEPARTMENT_MAP[cat];
  }

  const catLower = cat.toLowerCase();

  if (
    catLower.includes('garbage') ||
    catLower.includes('sanitation') ||
    catLower.includes('waste') ||
    catLower.includes('dumping')
  ) {
    return 'Public Health & Sanitation';
  }

  if (
    catLower.includes('water') ||
    catLower.includes('pipeline') ||
    catLower.includes('leakage')
  ) {
    return 'Water Supply & Sewerage';
  }

  if (
    catLower.includes('pothole') ||
    catLower.includes('road') ||
    catLower.includes('drainage') ||
    catLower.includes('waterlogging')
  ) {
    return 'Roads & Storm Water Drainage';
  }

  if (catLower.includes('light') || catLower.includes('street')) {
    return 'Street Lighting';
  }

  if (
    catLower.includes('park') ||
    catLower.includes('greenery') ||
    catLower.includes('tree') ||
    catLower.includes('branch')
  ) {
    return 'Parks & Urban Greenery';
  }

  if (catLower.includes('safety') || catLower.includes('hazard')) {
    return 'Public Safety & Emergency Response';
  }

  return 'Public Health & Sanitation';
};

export const CITIZEN_COMPLAINT_CATEGORIES: Category[] = Object.keys(
  CATEGORY_TO_DEPARTMENT_MAP
) as Category[];

export const MOCK_DEPARTMENTS = [
  { id: 'dept-1', name: 'Public Health & Sanitation', code: 'PHS' },
  { id: 'dept-2', name: 'Water Supply & Sewerage', code: 'WSS' },
  { id: 'dept-3', name: 'Roads & Storm Water Drainage', code: 'RSD' },
  { id: 'dept-4', name: 'Street Lighting', code: 'STL' },
  { id: 'dept-5', name: 'Parks & Urban Greenery', code: 'PUG' },
  { id: 'dept-6', name: 'Public Safety & Emergency Response', code: 'PSE' },
];




