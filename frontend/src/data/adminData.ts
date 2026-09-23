import { Complaint, User, Department, NotificationItem, Category, Priority, ComplaintStatus } from '../types';

export interface StaffMember {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  assignedCases: number;
  completedCases: number;
  performanceScore: number;
  availability: 'Available' | 'On Field' | 'Busy' | 'On Leave';
  avatar: string;
}

export interface AdminDepartmentCard {
  id: string;
  name: string;
  code: string;
  headName: string;
  headAvatar: string;
  staffCount: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  avgResolutionHours: number;
  slaAdherenceRate: number;
  budgetUtilized: string;
  status: 'Optimal' | 'High Load' | 'Critical SLA';
}

export const ADMIN_12_DEPARTMENTS: AdminDepartmentCard[] = [
  {
    id: 'dept-1',
    name: 'Public Health & Sanitation',
    code: 'PHS',
    headName: 'Dr. Ramesh Babu',
    headAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    staffCount: 24,
    pendingComplaints: 5,
    resolvedComplaints: 142,
    avgResolutionHours: 12,
    slaAdherenceRate: 98.5,
    budgetUtilized: '₹4.2L / ₹5.0L',
    status: 'Optimal',
  },
  {
    id: 'dept-2',
    name: 'Water Supply & Sewerage',
    code: 'WSS',
    headName: 'Srinivas Rao',
    headAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    staffCount: 18,
    pendingComplaints: 3,
    resolvedComplaints: 98,
    avgResolutionHours: 14,
    slaAdherenceRate: 96.8,
    budgetUtilized: '₹3.8L / ₹4.5L',
    status: 'Optimal',
  },
  {
    id: 'dept-3',
    name: 'Roads & Storm Water Drainage',
    code: 'RSD',
    headName: 'K. Venkateswara Rao',
    headAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    staffCount: 22,
    pendingComplaints: 6,
    resolvedComplaints: 110,
    avgResolutionHours: 16,
    slaAdherenceRate: 95.2,
    budgetUtilized: '₹5.1L / ₹6.0L',
    status: 'Optimal',
  },
  {
    id: 'dept-4',
    name: 'Street Lighting',
    code: 'STL',
    headName: 'M. Krishna Murthy',
    headAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    staffCount: 14,
    pendingComplaints: 2,
    resolvedComplaints: 85,
    avgResolutionHours: 8,
    slaAdherenceRate: 99.0,
    budgetUtilized: '₹2.9L / ₹3.2L',
    status: 'Optimal',
  },
  {
    id: 'dept-5',
    name: 'Parks & Urban Greenery',
    code: 'PUG',
    headName: 'Lakshmi Prasanna',
    headAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    staffCount: 12,
    pendingComplaints: 2,
    resolvedComplaints: 64,
    avgResolutionHours: 18,
    slaAdherenceRate: 97.1,
    budgetUtilized: '₹1.8L / ₹2.2L',
    status: 'Optimal',
  },
  {
    id: 'dept-6',
    name: 'Public Safety & Emergency Response',
    code: 'PSE',
    headName: 'G. Appa Rao',
    headAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    staffCount: 30,
    pendingComplaints: 1,
    resolvedComplaints: 175,
    avgResolutionHours: 4,
    slaAdherenceRate: 100,
    budgetUtilized: '₹6.5L / ₹7.0L',
    status: 'Optimal',
  },
];
