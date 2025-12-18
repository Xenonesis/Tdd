'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {user?.firstName}!
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-medium">{user?.role}</p>
              </div>
            </div>

            {user?.role === 'ADMIN' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="font-semibold text-blue-900">Admin Panel</h3>
                <p className="text-sm text-blue-700">
                  You have full access to all features including certificate generation.
                </p>
              </div>
            )}

            {user?.role === 'MENTOR' && (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <h3 className="font-semibold text-green-900">Mentor Panel</h3>
                <p className="text-sm text-green-700">
                  You can generate certificates for students.
                </p>
              </div>
            )}

            {user?.role === 'STUDENT' && (
              <div className="mt-6 p-4 bg-purple-50 rounded-md">
                <h3 className="font-semibold text-purple-900">Student Panel</h3>
                <p className="text-sm text-purple-700">
                  View your certificates and learning progress here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
