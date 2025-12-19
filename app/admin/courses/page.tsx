'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import { Badge, RoleBadge } from '@/components/ui/Badge';
import { LoadingTable } from '@/components/ui/Loading';

export default function AdminCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminCoursesContent />
    </ProtectedRoute>
  );
}

function AdminCoursesContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/all');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalChapters = courses.reduce((acc, c) => acc + (c._count?.chapters || 0), 0);
  const totalStudents = courses.reduce((acc, c) => acc + (c._count?.assignments || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="skeleton h-9 w-48 mb-3" />
            <div className="skeleton h-5 w-64" />
          </div>
          <LoadingTable rows={5} cols={5} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of all courses in the system
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalChapters}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Chapters</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enrollments</p>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          /* Empty State */
          <div className="card p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              No Courses Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Courses will appear here once mentors create them.
            </p>
          </div>
        ) : (
          /* Courses Table */
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Mentor</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Chapters</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Students</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course, index) => (
                    <tr 
                      key={course.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                            <span className="text-xl">📚</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {course.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {course.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                            {course.mentor.firstName[0]}{course.mentor.lastName[0]}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {course.mentor.firstName} {course.mentor.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="primary" size="sm">
                          {course._count.chapters} chapters
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={course._count.assignments > 0 ? 'secondary' : 'gray'} size="sm">
                          {course._count.assignments} students
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(course.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
