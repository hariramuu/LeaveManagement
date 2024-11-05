import React from 'react';
import { UserCircle2, Users } from 'lucide-react';
import { LoginForm } from './LoginForm';

interface AuthTabsProps {
  onPasswordLogin: (identifier: string, password: string) => void;
}

export function AuthTabs({ onPasswordLogin }: AuthTabsProps) {
  const [activeTab, setActiveTab] = React.useState<'student' | 'staff'>('student');

  return (
    <div className="mt-8">
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'student'
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserCircle2 className="h-4 w-4 mr-2" />
          Student
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'staff'
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          Staff
        </button>
      </div>

      <div className="mt-6">
        <LoginForm
          onSubmit={onPasswordLogin}
          role={activeTab}
        />
      </div>
    </div>
  );
}