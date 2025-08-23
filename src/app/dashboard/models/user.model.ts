export interface User {
  id: string;
  name: string;
  password?: string;
  role: 'General User' | 'Admin';
  records: Record[];
}

export interface Record {
  recordId: string;
  title: string;
  status: 'Completed' | 'Pending' | 'Yet To Start';
}

export interface GetRecordResponse {
  message: string;
  success: boolean;
  user: User;
}