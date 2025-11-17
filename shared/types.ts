export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for backend mock auth
  role: 'user' | 'admin';
  credits: number;
}
export type DeedStatus = 'pending' | 'verified' | 'rejected';
export interface Deed {
  id: string;
  userId: string;
  userName?: string; // Joined in queries
  deedType: string; // Title of the deed from catalog
  description: string;
  proofUrl: string;
  status: DeedStatus;
  creditsAwarded: number;
  createdAt: number; // epoch millis
  verifiedAt?: number; // epoch millis
  verifiedBy?: string; // admin user id
}
export interface DeedCatalogItem {
  id: string;
  title: string;
  description: string;
  category: string;
  creditValue: number;
  illustrationUrl: string;
}