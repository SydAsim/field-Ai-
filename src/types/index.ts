export type JobStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Pending Review';
export type JobPriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface JobNote {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  content: string;
  type: 'general' | 'technical' | 'safety' | 'client';
}

export interface JobPhoto {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  uploadedBy: string;
  category: 'before' | 'after' | 'diagnostic' | 'nameplate';
}

export interface Job {
  id: string;
  jobNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  siteAddress: string;
  status: JobStatus;
  priority: JobPriority;
  scheduledDate: string;
  scheduledTime: string;
  assignedTechnician: string;
  systemType: string;
  description: string;
  notes: JobNote[];
  photos: JobPhoto[];
  estimatedDuration: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  slaTier: 'Enterprise 24/7' | 'Standard Business' | 'Priority Commercial';
  activeJobsCount: number;
  totalJobsCount: number;
  notes: string;
  avatarInitials: string;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Safety Procedures' | 'Equipment Maintenance' | 'Installation' | 'Troubleshooting' | 'Compliance & Standards';
  description: string;
  updatedAt: string;
  fileSize: string;
  readTime: string;
  tags: string[];
  content: {
    overview: string;
    keyPoints: string[];
    steps: { title: string; instruction: string }[];
    warnings?: string[];
    relatedEquipment: string[];
  };
}

export interface CallMessage {
  id: string;
  speaker: 'user' | 'assistant';
  timestamp: string;
  text: string;
  referenceDocId?: string;
  referenceDocTitle?: string;
}

export interface CallLog {
  id: string;
  date: string;
  time: string;
  duration: string;
  durationSeconds: number;
  caller: string;
  topic: string;
  relatedJobNumber?: string;
  summary: {
    overview: string;
    keyPoints: string[];
    actionItems: string[];
    safetyNotices?: string[];
  };
  messages: CallMessage[];
}

export interface WhatsAppMessage {
  id: string;
  direction: 'incoming' | 'outgoing';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  senderName: string;
}

export interface WhatsAppConversation {
  clientId: string;
  clientName: string;
  clientPhone: string;
  unreadCount: number;
  lastActive: string;
  messages: WhatsAppMessage[];
}

export interface TwilioCallLog {
  id: string;
  direction: 'Inbound' | 'Outbound';
  fromNumber: string;
  toNumber: string;
  duration: string;
  status: 'Completed' | 'Missed' | 'Forwarded to Tech';
  timestamp: string;
  recordingUrl?: string;
  aiTranscribed: boolean;
  notes: string;
}

export type ActivePage = 
  | 'dashboard' 
  | 'assistant' 
  | 'knowledge' 
  | 'jobs' 
  | 'job-detail' 
  | 'clients' 
  | 'communications';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}
