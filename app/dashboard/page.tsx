'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to role-specific dashboard
    if (user?.role === 'STUDENT') {
      router.push('/courses');
    } else if (user?.role === 'MENTOR') {
      router.push('/mentor/courses');
    } else if (user?.role === 'ADMIN') {
      router.push('/admin/analytics');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome, {user?.firstName}!
            </h2>
            <p className="text-gray-600 mb-8">You are logged in as a {user?.role}.</p>

            {user?.role === 'ADMIN' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/users" className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-600 text-sm">Manage users and approve mentors</p>
                </Link>
                <Link href="/admin/courses" className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">All Courses</h3>
                  <p className="text-gray-600 text-sm">View all courses in the system</p>
                </Link>
                <Link href="/admin/analytics" className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-gray-600 text-sm">View platform statistics</p>
                </Link>
              </div>
            )}

            {user?.role === 'MENTOR' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/mentor/courses" className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">My Courses</h3>
                  <p className="text-gray-600 text-sm">Create and manage your courses</p>
                </Link>
                <Link href="/mentor/students" className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Students</h3>
                  <p className="text-gray-600 text-sm">Track student progress</p>
                </Link>
              </div>
            )}

            {user?.role === 'STUDENT' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/courses" className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">My Courses</h3>
                  <p className="text-gray-600 text-sm">Access your assigned courses</p>
                </Link>
                <Link href="/progress" className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Progress</h3>
                  <p className="text-gray-600 text-sm">Track your learning progress</p>
                </Link>
                <Link href="/certificates" className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Certificates</h3>
                  <p className="text-gray-600 text-sm">Download your certificates</p>
                </Link>
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
