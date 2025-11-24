export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Platform =
  | 'LINKEDIN'
  | 'TWITTER'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'TIKTOK'
  | 'YOUTUBE'
  | 'MALT'
  | 'UPWORK'
  | 'FIVERR'
  | 'FREELANCER';

export type ContactStatus = 'ACTIVE' | 'PENDING' | 'CLOSED';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  platform?: Platform;
  dueDate?: Date;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  platform: Platform;
  status: ContactStatus;
  notes?: string;
  lastContact?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: string; // Ex: "LINKEDIN", "TIKTOK", "CLIENTS", etc.
  currentValue: number; // Valeur actuelle (ex: 150 followers)
  targetValue: number; // Valeur cible (ex: 1000 followers)
  unit: string; // Ex: "followers", "connections", "clients", "%"
  targetDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  platform: Platform;
  content: string;
  scheduledFor?: Date;
  published: boolean;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  platform: Platform;
  metric: string;
  value: number;
  date: Date;
  createdAt: Date;
}

export interface PostTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  platforms: Platform[];
  tags: string[];
}

export interface FreelancePlatform {
  id: string;
  name: string;
  platform: Platform;
  description: string;
  category: 'freelance' | 'social';
  logo: string;
  website: string;
  hasAccount: boolean;
  setupGuide: {
    steps: string[];
    tips: string[];
  };
}
