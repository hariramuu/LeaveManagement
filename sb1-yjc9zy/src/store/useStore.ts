import { create } from 'zustand';
import { User, LeaveRequest } from '../types';

interface Store {
  currentUser: User | null;
  users: User[];
  leaveRequests: LeaveRequest[];
  notifications: Array<{
    id: string;
    userId: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
  setCurrentUser: (user: User | null) => void;
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  validateCredentials: (identifier: string, password: string) => User | null;
  addNotification: (userId: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const sampleUsers: User[] = [
  {
    id: 'STU001',
    name: 'John Smith',
    role: 'student',
    email: 'john.smith@university.edu',
    password: 'student123',
    branch: 'Computer Science',
    year: '3rd Year',
    phoneNumber: '+1234567890',
  },
  {
    id: 'WAR001',
    name: 'Dr. James Carter',
    role: 'warden',
    email: 'james.carter@university.edu',
    password: 'warden123',
    digitalSignature: 'data:image/png;base64,iVBORw0K...', // Base64 signature image
  },
  {
    id: 'CW001',
    name: 'Dr. Emily Brown',
    role: 'chief_warden',
    email: 'emily.brown@university.edu',
    password: 'chief123',
    digitalSignature: 'data:image/png;base64,iVBORw0K...',
  },
  {
    id: 'DEAN001',
    name: 'Prof. Michael Wilson',
    role: 'dean',
    email: 'michael.wilson@university.edu',
    password: 'dean123',
    digitalSignature: 'data:image/png;base64,iVBORw0K...',
  },
];

export const useStore = create<Store>((set, get) => ({
  currentUser: null,
  users: sampleUsers,
  leaveRequests: [],
  notifications: [],
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addLeaveRequest: (request) => {
    set((state) => ({
      leaveRequests: [request, ...state.leaveRequests],
    }));
    // Add notification for wardens
    const wardens = get().users.filter(u => u.role === 'warden');
    wardens.forEach(warden => {
      get().addNotification(
        warden.id,
        `New leave request from ${request.studentName}`
      );
    });
  },
  
  updateLeaveRequest: (id, updates) => {
    set((state) => ({
      leaveRequests: state.leaveRequests.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      ),
    }));
    
    const request = get().leaveRequests.find(r => r.id === id);
    if (request) {
      // Notify student about status change
      get().addNotification(
        request.studentId,
        `Your leave request has been ${updates.status}`
      );
      
      // Notify next authority if forwarded
      if (updates.forwardedTo) {
        get().addNotification(
          updates.forwardedTo,
          `A leave request has been forwarded to you by ${get().currentUser?.name}`
        );
      }
    }
  },
  
  validateCredentials: (identifier, password) => {
    const user = get().users.find(
      (u) => (u.role === 'student' ? u.id === identifier : u.email === identifier) && 
      u.password === password
    );
    return user || null;
  },
  
  addNotification: (userId, message) => {
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          userId,
          message,
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },
  
  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
}));