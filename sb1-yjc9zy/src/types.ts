export type UserRole = 'student' | 'warden' | 'chief_warden' | 'dean';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  password: string;
  branch?: string;
  year?: string;
  phoneNumber?: string;
  digitalSignature?: string;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'forwarded';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentBranch: string;
  studentYear: string;
  studentPhone: string;
  type: 'leave' | 'outing';
  startDate: string;
  endDate: string;
  outTime?: string;
  inTime?: string;
  reason: string;
  documents: Array<{
    name: string;
    url: string;
  }>;
  status: LeaveStatus;
  forwardedTo?: string;
  approvedBy?: string;
  approverSignature?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}