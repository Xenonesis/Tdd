'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import Link from 'next/link';

export default function ProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressContent />
    </ProtectedRoute>
  );
}

function ProgressContent() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get('/api/progress/my');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
            <p className="text-gray-600 mt-2">Track your learning journey</p>
          </div>

          <div className="space-y-6">
            {progress.map((courseProgress) => (
              <div key={courseProgress.courseId} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {courseProgress.courseTitle}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Mentor: {courseProgress.mentor.firstName} {courseProgress.mentor.lastName}
                    </p>
                  </div>
                  <Link
                    href={`/courses/${courseProgress.courseId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    Continue →
                  </Link>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {courseProgress.completedChapters} / {courseProgress.totalChapters} chapters
                    </span>
                    <span className="font-semibold text-lg">
                      {courseProgress.completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        courseProgress.isComplete ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${courseProgress.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {courseProgress.isComplete ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-700 font-semibold">
                      ✓ Course Completed!
                    </span>
                    <Link
                      href="/certificates"
                      className="text-green-700 hover:text-green-800 font-medium underline"
                    >
                      View Certificate →
                    </Link>
                  </div>
                ) : courseProgress.nextChapter ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium mb-1">Next Chapter:</p>
                    <p className="text-blue-900 font-semibold">{courseProgress.nextChapter.title}</p>
                  </div>
                ) : null}
              </div>
            ))}

            {progress.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Progress Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start learning by accessing your assigned courses.
                </p>
                <Link
                  href="/courses"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  View Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
