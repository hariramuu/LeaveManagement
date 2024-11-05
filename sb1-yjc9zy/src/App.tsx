import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Dashboard } from './components/Dashboard';
import { LeaveForm } from './components/LeaveForm';
import { AuthTabs } from './components/AuthTabs';
import { LogOut, Building2, UserCircle2 } from 'lucide-react';

export default function App() {
  const { currentUser, setCurrentUser, validateCredentials } = useStore();

  const handlePasswordLogin = (username: string, password: string) => {
    const user = validateCredentials(username, password);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleFaceVerified = () => {
    // In a real app, this would verify against stored face data
    // For demo, we'll just log in as the first student
    const firstStudent = useStore.getState().users.find(u => u.role === 'student');
    if (firstStudent) {
      setCurrentUser(firstStudent);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl">
          <div className="text-center">
            <Building2 className="mx-auto h-16 w-16 text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Campus Leave Management</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage leave requests
            </p>
          </div>

          <AuthTabs
            onPasswordLogin={handlePasswordLogin}
            onFaceVerified={handleFaceVerified}
          />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Campus Leave Management
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserCircle2 className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                    <span className="ml-1 text-xs text-gray-500">
                      ({currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)})
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Dashboard role={currentUser.role} />
                    </div>
                    {currentUser.role === 'student' && (
                      <div className="lg:col-span-1">
                        <LeaveForm />
                      </div>
                    )}
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}