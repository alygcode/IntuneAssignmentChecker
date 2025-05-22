/**
 * Type definitions for the application
 */

export interface Policy {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members?: number;
}

export interface Device {
  id: string;
  name: string;
  model?: string;
  osVersion?: string;
  lastSeen?: Date;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  jobTitle?: string;
}

export interface Assignment {
  id: string;
  policyId: string;
  targetType: 'user' | 'group' | 'device' | 'all';
  targetId?: string;
  intent?: 'required' | 'available' | 'uninstall';
  createdAt?: Date;
}
