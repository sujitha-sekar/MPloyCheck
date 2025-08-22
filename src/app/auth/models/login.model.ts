export interface LoginInput {
  id: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface User {
  userId: string;
  password: string;
  role: 'General User' | 'Admin';
}