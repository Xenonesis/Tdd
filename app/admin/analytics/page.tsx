'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';
import { LoadingCard } from '@/components/ui/Loading';
import { Users, BookOpen, GraduationCap, UserCheck } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminAnalyticsContent />
    </ProtectedRoute>
  );
}

function AdminAnalyticsContent() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto pt-32 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="skeleton h-9 w-48 mb-3" />
            <div className="skeleton h-5 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const userTotal = stats?.users?.total || 1;
  const studentPercent = Math.round((stats?.users?.students || 0) / userTotal * 100);
  const mentorPercent = Math.round((stats?.users?.mentors || 0) / userTotal * 100);
  const adminPercent = Math.round((stats?.users?.admins || 0) / userTotal * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Platform Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of platform statistics and performance metrics
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Total Users</p>
                <p className="text-4xl font-bold">{stats?.users?.total || 0}</p>
                <p className="text-white/60 text-sm mt-2">All registered users</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Total Courses</p>
                <p className="text-4xl font-bold">{stats?.courses || 0}</p>
                <p className="text-white/60 text-sm mt-2">Active courses</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Certificates</p>
                <p className="text-4xl font-bold">{stats?.certificates || 0}</p>
                <p className="text-white/60 text-sm mt-2">Issued certificates</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Active Mentors</p>
                <p className="text-4xl font-bold">{stats?.users?.activeMentors || 0}</p>
                <p className="text-white/60 text-sm mt-2">Approved & teaching</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Distribution */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              User Distribution
            </h2>
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <CircularProgress value={100} size={200} strokeWidth={20} showLabel={false} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {stats?.users?.total || 0}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Students</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {stats?.users?.students || 0} ({studentPercent}%)
                  </span>
                </div>
                <ProgressBar value={studentPercent} showLabel={false} variant="success" size="sm" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mentors</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {stats?.users?.mentors || 0} ({mentorPercent}%)
                  </span>
                </div>
                <ProgressBar value={mentorPercent} showLabel={false} variant="primary" size="sm" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admins</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {stats?.users?.admins || 0} ({adminPercent}%)
                  </span>
                </div>
                <ProgressBar value={adminPercent} showLabel={false} variant="warning" size="sm" />
              </div>
            </div>
          </div>

          {/* Mentor Status */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Mentor Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Active Mentors</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Approved and teaching</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats?.users?.activeMentors || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Pending Approval</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting admin review</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {stats?.users?.pendingMentors || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-500 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Inactive Mentors</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deactivated accounts</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {(stats?.users?.mentors || 0) - (stats?.users?.activeMentors || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.courses || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Courses Created</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.certificates || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Certificates Issued</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.users?.total || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {((stats?.users?.activeMentors || 0) / (stats?.users?.mentors || 1) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Mentor Approval Rate</p>
          </div>
        </div>
      </main>
    </div>
  );
}
