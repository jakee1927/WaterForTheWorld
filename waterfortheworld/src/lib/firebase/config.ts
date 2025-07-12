// This file is kept for backward compatibility
// New code should import from './init' instead

export * from './init';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  dropletCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  dropletCount: number;
  createdAt: Date;
  updatedAt: Date;
}
