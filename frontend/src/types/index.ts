export type Role = 'citizen' | 'admin' | 'staff' | 'guest';

export type UserStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: UserStatus;
  department?: string;
  phone?: string;
  createdAt: string;
  complaintsSubmittedCount?: number;
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintStatus = 'pending' | 'in_progress' | 'under_review' | 'resolved' | 'rejected';

export type Category = 
  | 'Pothole & Roads' 
  | 'Street Lighting' 
  | 'Water & Sewage' 
  | 'Garbage & Waste' 
  | 'Traffic & Signals' 
  | 'Public Transport' 
  | 'Park Maintenance' 
  | 'Noise & Pollution'
  | 'Road Damage'
  | 'Garbage Collection'
  | 'Water Supply'
  | 'Electricity'
  | 'Street Lights'
  | 'Traffic Signal'
  | 'Drainage'
  | 'Public Safety'
  | 'Illegal Parking'
  | 'Noise Pollution'
  | 'Environment'
  | 'Healthcare'
  | 'Education'
  | 'Other';

export interface Location {
  address: string;
  lat: number;
  lng: number;
  zone: string;
}

export interface ComplaintActivity {
  id: string;
  timestamp: string;
  author: string;
  avatar?: string;
  role: string;
  note: string;
  statusChange?: ComplaintStatus;
}

export interface Complaint {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: ComplaintStatus;
  location: Location;
  latitude?: number;
  longitude?: number;
  submittedBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedDepartment: string;
  assignedAgent?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDueDate: string;
  aiConfidenceScore?: number;
  upvotes: number;
  activities: ComplaintActivity[];
}

export interface TrafficSensor {
  id: string;
  name: string;
  zone: string;
  location: [number, number]; // lat, lng
  vehicleCountPerHour: number;
  averageSpeedKmh: number;
  congestionLevel: 'low' | 'moderate' | 'heavy' | 'gridlock';
  status: 'online' | 'warning' | 'offline';
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'complaint' | 'traffic' | 'alert' | 'emergency' | 'complaint_update';
  read: boolean;
  createdAt: string;
  timestamp?: string;
  link?: string;
}

export interface ZoneData {
  id: string;
  name: string;
  population: number;
  activeComplaints: number;
  resolvedComplaintsMonth: number;
  trafficHealthScore: number; // 0 - 100
  slaAdherenceRate: number; // percentage
}

export interface Department {
  id: string;
  name: string;
  headName: string;
  email: string;
  activeTickets: number;
  resolvedTicketsTotal: number;
  avgResolutionHours: number;
  staffCount: number;
}

export interface CityMetric {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedThisMonth: number;
  avgResolutionDays: number;
  aiDetectionRate: number; // percentage
  trafficCongestionIndex: number; // 0 - 100
  activeSensorsCount: number;
}

export * from './traffic';
export * from './trafficIntelligence';
export * from './aiDetection';


