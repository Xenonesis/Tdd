'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { LoadingScreen } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { Users, BookOpen, BarChart3, GraduationCap, Check, Clock } from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'ADMIN') {
        const response = await axios.get('/api/users/stats');
        setStats(response.data);
      } else if (user?.role === 'MENTOR') {
        const response = await axios.get('/api/courses/my');
        setStats({ courses: response.data });
      } else if (user?.role === 'STUDENT') {
        const [coursesRes, progressRes] = await Promise.all([
          axios.get('/api/courses/my'),
          axios.get('/api/progress/my').catch(() => ({ data: [] })),
        ]);
        setStats({ courses: coursesRes.data, progress: progressRes.data });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = {
    ADMIN: [
      { href: '/admin/users', icon: <Users className="w-8 h-8" />, title: 'User Management', desc: 'Manage users and approve mentors', color: 'from-blue-500 to-indigo-600' },
      { href: '/admin/courses', icon: <BookOpen className="w-8 h-8" />, title: 'All Courses', desc: 'View all courses in the system', color: 'from-emerald-500 to-teal-600' },
      { href: '/admin/analytics', icon: <BarChart3 className="w-8 h-8" />, title: 'Analytics', desc: 'View platform statistics', color: 'from-purple-500 to-pink-600' },
    ],
    MENTOR: [
      { href: '/mentor/courses', icon: <BookOpen className="w-8 h-8" />, title: 'My Courses', desc: 'Create and manage your courses', color: 'from-blue-500 to-indigo-600' },
      { href: '/mentor/students', icon: <Users className="w-8 h-8" />, title: 'Students', desc: 'Track student progress', color: 'from-emerald-500 to-teal-600' },
    ],
    STUDENT: [
      { href: '/courses', icon: <BookOpen className="w-8 h-8" />, title: 'My Courses', desc: 'Access your assigned courses', color: 'from-blue-500 to-indigo-600' },
      { href: '/progress', icon: <BarChart3 className="w-8 h-8" />, title: 'Progress', desc: 'Track your learning progress', color: 'from-emerald-500 to-teal-600' },
      { href: '/certificates', icon: <GraduationCap className="w-8 h-8" />, title: 'Certificates', desc: 'Download your certificates', color: 'from-purple-500 to-pink-600' },
    ],
  };

  const cards = user?.role ? dashboardCards[user.role] : [];

  if (loading) {
    return <LoadingScreen text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.firstName}!
            </h1>
            <Badge variant={user?.role === 'ADMIN' ? 'accent' : user?.role === 'MENTOR' ? 'primary' : 'secondary'}>
              {user?.role}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening in your dashboard today.
          </p>
        </div>

        {/* Stats Cards (Admin & Student) */}
        {user?.role === 'ADMIN' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold mt-1">{stats.users?.total || 0}</p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold mt-1">{stats.courses || 0}</p>
                </div>
                <BookOpen className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Certificates</p>
                  <p className="text-3xl font-bold mt-1">{stats.certificates || 0}</p>
                </div>
                <GraduationCap className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Pending Mentors</p>
                  <p className="text-3xl font-bold mt-1">{stats.users?.pendingMentors || 0}</p>
                </div>
                <Clock className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {user?.role === 'STUDENT' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Enrolled Courses</p>
                  <p className="text-3xl font-bold mt-1">{stats.courses?.length || 0}</p>
                </div>
                <BookOpen className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold mt-1">{stats.progress?.filter((p: any) => p.isComplete)?.length || 0}</p>
                </div>
                <Check className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold mt-1">{stats.progress?.filter((p: any) => !p.isComplete)?.length || 0}</p>
                </div>
                <BarChart3 className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {user?.role === 'MENTOR' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">My Courses</p>
                  <p className="text-3xl font-bold mt-1">{stats.courses?.length || 0}</p>
                </div>
                <BookOpen className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.courses?.reduce((acc: number, c: any) => acc + (c._count?.assignments || 0), 0) || 0}
                  </p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Chapters</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.courses?.reduce((acc: number, c: any) => acc + (c._count?.chapters || 0), 0) || 0}
                  </p>
                </div>
                <BookOpen className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="card card-hover p-6 group animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {card.desc}
              </p>
              <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                <span>Go to {card.title}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
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
