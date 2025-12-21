'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import axios from '@/lib/axios';
import { LoadingCard, LoadingScreen } from '@/components/ui/Loading';
import { BookOpen } from 'lucide-react';

export default function CoursesPage() {
  return (
    <ProtectedRoute>
      <CoursesContent />
    </ProtectedRoute>
  );
}

function CoursesContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses/my');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
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
            <div className="skeleton h-5 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {courses.length === 0 
              ? 'No courses assigned yet. Contact your mentor to get started!' 
              : `You have ${courses.length} course${courses.length !== 1 ? 's' : ''} assigned.`}
          </p>
        </div>

        {courses.length === 0 ? (
          /* Empty State */
          <div className="card p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              No Courses Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Your mentor will assign courses to you. Once assigned, you'll see your 
              courses here and can start learning right away!
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Check back soon!</span>
            </div>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CourseCard course={course} role={user?.role || 'STUDENT'} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
