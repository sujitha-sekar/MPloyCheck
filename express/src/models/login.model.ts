export interface User {
  id: string;
  name: string;
  password: string;
  role: 'General User' | 'Admin';
  records: Record[];
}

export interface Record {
  recordId: string;
  title: string;
  status: 'Completed' | 'Pending';
}

export interface LoginInput {
  id: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  user: User | null;
  message: string;
}