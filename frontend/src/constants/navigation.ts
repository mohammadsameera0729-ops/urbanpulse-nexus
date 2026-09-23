import { 
  LayoutDashboard, 
  FilePlus, 
  ListOrdered, 
  Bell, 
  User as UserIcon, 
  Map, 
  Users, 
  Settings, 
  HelpCircle,
  Building2,
  UserCheck,
  Radio
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  section?: string;
}

export const CITIZEN_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/citizen/dashboard', icon: LayoutDashboard },
  { title: 'Report Issue', href: '/citizen/report-complaint', icon: FilePlus },
  { title: 'My Complaints', href: '/citizen/my-complaints', icon: ListOrdered },
  { title: 'Notifications', href: '/citizen/notifications', icon: Bell },
  { title: 'Smart City Map', href: '/map', icon: Map },
  { title: 'Profile', href: '/citizen/profile', icon: UserIcon },
  { title: 'Settings', href: '/citizen/settings', icon: Settings },
  { title: 'Help Center', href: '/help', icon: HelpCircle },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  // ADMIN OPERATIONS
  { title: 'Dashboard Overview', href: '/admin/dashboard', icon: LayoutDashboard, section: 'ADMIN OPERATIONS' },
  { title: 'Complaint Management', href: '/admin/complaints', icon: ListOrdered, section: 'ADMIN OPERATIONS' },
  { title: 'User Management', href: '/admin/users', icon: Users, section: 'ADMIN OPERATIONS' },
  { title: 'Department Management', href: '/admin/departments', icon: Building2, section: 'ADMIN OPERATIONS' },
  { title: 'Staff Management', href: '/admin/staff', icon: UserCheck, section: 'ADMIN OPERATIONS' },
  
  // CITY
  { title: 'Smart City Map', href: '/admin/gis-map', icon: Map, section: 'CITY' },
  { title: 'AI Traffic Monitoring', href: '/admin/traffic', icon: Radio, section: 'CITY' },
  
  // COMMUNICATION
  { title: 'Notifications', href: '/admin/notifications', icon: Bell, section: 'COMMUNICATION' },
  
  // ACCOUNT
  { title: 'Admin Profile', href: '/admin/profile', icon: UserIcon, section: 'ACCOUNT' },
];

export const STAFF_NAV_ITEMS: NavItem[] = [
  { title: 'Staff Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
  { title: 'Smart City Map', href: '/map', icon: Map },
  { title: 'Notifications', href: '/staff/notifications', icon: Bell },
  { title: 'Profile', href: '/staff/profile', icon: UserIcon },
  { title: 'Settings', href: '/staff/settings', icon: Settings },
];

export const PUBLIC_NAV_ITEMS = [
  { title: 'Features', href: '#features' },
  { title: 'Live City Map', href: '/map' },
  { title: 'Help & FAQ', href: '/help' },
];
