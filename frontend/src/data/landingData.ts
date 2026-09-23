export interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  category: string;
  badge?: string;
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  details: string[];
}

export interface CityService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  status: string;
  activeUnits: number;
  coverage: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TrafficMetric {
  title: string;
  value: string;
  percentage: number;
  description: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface StatCounter {
  id: string;
  numericValue: number;
  displayValue: string;
  label: string;
  subtext: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  rating: number;
  comment: string;
  userType: 'Citizen' | 'Government Officer' | 'Traffic Control Manager';
}

export interface ActivityLog {
  id: string;
  time: string;
  event: string;
  location: string;
  category: 'Traffic' | 'Infrastructure' | 'AI Trigger' | 'Security';
  status: 'Resolved' | 'Processing' | 'Alert';
}

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'AI Traffic', href: '#traffic' },
  { label: 'Analytics', href: '#analytics' },
];

export const HERO_TRUST_BADGES = [
  { label: 'Civic Complaints', icon: 'FileText' },
  { label: 'Smart City GIS', icon: 'Map' },
  { label: '6 Departments', icon: 'Building2' },
  { label: 'Role-Based Workflows', icon: 'ShieldCheck' },
];

export const FEATURE_CARDS: FeatureItem[] = [
  {
    id: 'complaint-mgmt',
    iconName: 'FileText',
    title: 'Civic Complaint Management',
    description: 'Empower residents to report civic issues, road damage, water leaks, and street hazards with location tagging and status tracking.',
    category: 'Citizen Engagement',
    badge: 'Core Workflow',
  },
  {
    id: 'smart-map',
    iconName: 'Map',
    title: 'Smart City GIS',
    description: 'Interactive Vijayawada spatial mapping displaying complaint locations, municipal zone boundaries, and traffic monitoring points.',
    category: 'Spatial Analytics',
  },
  {
    id: 'dept-management',
    iconName: 'Building2',
    title: 'Department & Staff Assignment',
    description: 'Admin routing of complaints across 6 approved municipal departments and assigned field staff officers.',
    category: 'Operations',
    badge: 'Admin Control',
  },
  {
    id: 'traffic-monitoring',
    iconName: 'Radio',
    title: 'Traffic Monitoring',
    description: 'Traffic monitoring intelligence and key reference locations across major Vijayawada intersections.',
    category: 'Traffic Operations',
  },
  {
    id: 'role-dashboards',
    iconName: 'Shield',
    title: 'Role-Based Municipal Portals',
    description: 'Tailored workspace views for Citizens, Field Staff Officers, and Municipal Administrators.',
    category: 'Security & Access',
  },
  {
    id: 'notifications',
    iconName: 'Bell',
    title: 'Municipal Notifications',
    description: 'Real-time operational alerts, status update notices, and activity logs across municipal roles.',
    category: 'Governance',
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    title: 'Citizen Submits Complaint',
    subtitle: 'Portal Intake',
    description: 'A citizen registers or logs in, fills out complaint details with category and location, and submits it to MongoDB.',
    iconName: 'Smartphone',
    details: ['Location Address', 'Category Selection', 'Instant MongoDB Storage'],
  },
  {
    stepNumber: 2,
    title: 'Admin Reviews & Assigns',
    subtitle: 'Department & Staff Routing',
    description: 'Municipal admin reviews the complaint, selects one of 6 approved departments, and assigns an active field officer.',
    iconName: 'Building2',
    details: ['6 Approved Departments', 'Staff Verification', 'Priority & SLA Assignment'],
  },
  {
    stepNumber: 3,
    title: 'Staff Updates Status',
    subtitle: 'Field Execution',
    description: 'Assigned staff officer views the ticket on their personalized dashboard and updates status (pending -> in_progress -> under_review -> resolved).',
    iconName: 'Wrench',
    details: ['Personalized Staff View', 'Status Progression', 'Staff Remarks'],
  },
  {
    stepNumber: 4,
    title: 'Citizen Sees Resolution',
    subtitle: 'Transparent Completion',
    description: 'The citizen views their dashboard to track real-time resolution progress until the complaint reaches resolved status.',
    iconName: 'CheckCircle',
    details: ['Real-Time Status Updates', 'Complete History Trail', 'Transparent Governance'],
  },
];

export const CITY_SERVICES: CityService[] = [
  {
    id: 'public-health',
    title: 'Public Health & Sanitation',
    description: 'Municipal waste management, bin overflow clearance, and civic sanitation control.',
    iconName: 'Trash2',
    status: 'Active',
    activeUnits: 6,
    coverage: '100%',
  },
  {
    id: 'water-supply',
    title: 'Water Supply & Sewerage',
    description: 'Drinking water supply monitoring, pipeline leakage repair, and municipal sewerage maintenance.',
    iconName: 'Droplets',
    status: 'Active',
    activeUnits: 6,
    coverage: '100%',
  },
  {
    id: 'roads-drainage',
    title: 'Roads & Storm Water Drainage',
    description: 'Pothole asphalt repair tracking, road surface maintenance, and stormwater drain desilting.',
    iconName: 'Truck',
    status: 'Active',
    activeUnits: 6,
    coverage: '100%',
  },
  {
    id: 'street-lighting',
    title: 'Street Lighting',
    description: 'LED streetlight outage repair, avenue fixture inspection, and lighting grid maintenance.',
    iconName: 'Lightbulb',
    status: 'Active',
    activeUnits: 6,
    coverage: '100%',
  },
  {
    id: 'parks-greenery',
    title: 'Parks & Urban Greenery',
    description: 'Public park maintenance, horticultural trimming, and boundary fence maintenance.',
    iconName: 'Leaf',
    status: 'Active',
    activeUnits: 6,
    coverage: '100%',
  },
  {
    id: 'public-safety',
    title: 'Public Safety & Emergency Response',
    description: 'Emergency hazard identification, road obstruction clearance, and control room alerts.',
    iconName: 'ShieldAlert',
    status: 'Active',
    activeUnits: 6,
    coverage: '100%',
  },
];

export const TRAFFIC_METRICS: TrafficMetric[] = [
  {
    title: 'Vijayawada Reference Points',
    value: '6 Locations',
    percentage: 100,
    description: 'Reference traffic monitoring locations across Vijayawada intersections.',
    status: 'optimal',
  },
];

export const STATS_COUNTERS: StatCounter[] = [
  {
    id: 'departments',
    numericValue: 6,
    displayValue: '6',
    label: 'Municipal Departments',
    subtext: 'Approved municipal bodies integrated on platform',
    iconName: 'Building',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Vijayawada Municipal Admin',
    role: 'Municipal Administrator',
    organization: 'Vijayawada Municipal Corporation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'UrbanPulse Nexus streamlines civic complaint routing across our 6 municipal departments efficiently.',
    userType: 'Government Officer',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is UrbanPulse Nexus?',
    answer: 'UrbanPulse Nexus is an AI-powered smart city operations platform connecting citizens, municipal administrators, departments, and field staff through complaint management, GIS mapping, traffic monitoring references, and role-based municipal workflows.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'How does Civic Complaint Management work?',
    answer: 'Citizens log into the Citizen Portal to submit civic complaints (e.g. potholes, water leaks, or streetlight outages). The complaint is stored in MongoDB and routed to Admin, who assigns it to matching staff across 6 approved municipal departments.',
    category: 'Citizens',
  },
  {
    id: 'faq-3',
    question: 'What departments are supported?',
    answer: 'UrbanPulse Nexus currently manages 6 approved municipal departments: Public Health & Sanitation, Water Supply & Sewerage, Roads & Storm Water Drainage, Street Lighting, Parks & Urban Greenery, and Public Safety & Emergency Response.',
    category: 'Departments',
  },
  {
    id: 'faq-4',
    question: 'What is included in the Smart City GIS?',
    answer: 'The Smart City GIS feature provides interactive mapping for Vijayawada, showing complaint locations, municipal boundaries, and traffic monitoring reference points.',
    category: 'GIS & Traffic',
  },
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    time: 'Recent',
    event: 'Municipal complaint management active',
    location: 'Vijayawada Zone',
    category: 'Infrastructure',
    status: 'Resolved',
  },
];
