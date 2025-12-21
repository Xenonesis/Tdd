'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import Link from 'next/link';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingCard } from '@/components/ui/Loading';
import { BookOpen, Check, GraduationCap, ArrowRight, BarChart3 } from 'lucide-react';

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
      const response = await axios.get('/progress/my');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedCourses = progress.filter(p => p.isComplete).length;
  const inProgressCourses = progress.filter(p => !p.isComplete).length;
  const averageProgress = progress.length > 0 
    ? Math.round(progress.reduce((acc, p) => acc + p.completionPercentage, 0) / progress.length) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto pt-32 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="skeleton h-9 w-48 mb-3" />
            <div className="skeleton h-5 w-64" />
          </div>
          <div className="space-y-6">
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
            My Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 flex items-center gap-4">
            <CircularProgress value={averageProgress} size={80} variant="primary" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageProgress}%</p>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <span className="text-3xl font-bold">{completedCourses}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Courses</p>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <span className="text-3xl font-bold">{inProgressCourses}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Courses</p>
            </div>
          </div>
        </div>

        {/* Course Progress List */}
        <div className="space-y-6">
          {progress.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                No Progress Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Start learning by accessing your assigned courses. Your progress will be tracked automatically.
              </p>
              <Link href="/courses">
                <Button icon={<BookOpen className="w-4 h-4" />}>View Courses</Button>
              </Link>
            </div>
          ) : (
            progress.map((courseProgress, index) => (
              <div 
                key={courseProgress.courseId} 
                className="card p-6 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {courseProgress.courseTitle}
                      </h2>
                      {courseProgress.isComplete && (
                        <Badge variant="success" icon={<Check className="w-3.5 h-3.5" />}>Completed</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Mentor: {courseProgress.mentor.firstName} {courseProgress.mentor.lastName}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          {courseProgress.completedChapters} / {courseProgress.totalChapters} chapters
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {courseProgress.completionPercentage}%
                        </span>
                      </div>
                      <ProgressBar 
                        value={courseProgress.completionPercentage} 
                        showLabel={false}
                        variant={courseProgress.isComplete ? 'success' : 'primary'}
                      />
                    </div>

                    {/* Next Chapter or Completion */}
                    {courseProgress.isComplete ? (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                          Course completed! Download your certificate.
                        </span>
                      </div>
                    ) : courseProgress.nextChapter ? (
                      <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          Next: <span className="font-medium text-indigo-700 dark:text-indigo-300">{courseProgress.nextChapter.title}</span>
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <Link href={courseProgress.isComplete ? '/certificates' : `/courses/${courseProgress.courseId}`}>
                      <Button 
                        variant={courseProgress.isComplete ? 'secondary' : 'primary'}
                        icon={courseProgress.isComplete ? <GraduationCap className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        iconPosition="right"
                      >
                        {courseProgress.isComplete ? 'Get Certificate' : 'Continue'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
