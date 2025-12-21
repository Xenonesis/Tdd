'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { LoadingList } from '@/components/ui/Loading';
import { Users, Check, BarChart3 } from 'lucide-react';

export default function MentorStudentsPage() {
  return (
    <ProtectedRoute allowedRoles={['MENTOR']}>
      <MentorStudentsContent />
    </ProtectedRoute>
  );
}

function MentorStudentsContent() {
  const [studentsProgress, setStudentsProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentsProgress();
  }, []);

  const fetchStudentsProgress = async () => {
    try {
      const response = await axios.get('/progress/students');
      setStudentsProgress(response.data);
    } catch (error) {
      console.error('Error fetching students progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group by student
  const studentMap = new Map();
  studentsProgress.forEach((progress) => {
    if (!studentMap.has(progress.student.id)) {
      studentMap.set(progress.student.id, {
        student: progress.student,
        courses: [],
      });
    }
    studentMap.get(progress.student.id).courses.push(progress);
  });

  const students = Array.from(studentMap.values());
  const totalCompleted = studentsProgress.filter(p => p.isComplete).length;
  const averageProgress = studentsProgress.length > 0 
    ? Math.round(studentsProgress.reduce((acc, p) => acc + p.completionPercentage, 0) / studentsProgress.length) 
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
          <LoadingList count={3} />
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
            Student Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your students' learning progress across all courses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCompleted}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageProgress}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Progress</p>
            </div>
          </div>
        </div>

        {students.length === 0 ? (
          /* Empty State */
          <div className="card p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              No Students Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Assign students to your courses to see their progress here. 
              Go to a course and click "Assign Students" to get started.
            </p>
          </div>
        ) : (
          /* Students List */
          <div className="space-y-6">
            {students.map(({ student, courses }, index) => (
              <div 
                key={student.id} 
                className="card overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Student Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{courses.length}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Courses</p>
                    </div>
                  </div>
                </div>

                {/* Course Progress */}
                <div className="p-6 space-y-4">
                  {courses.map((courseProgress: any) => (
                    <div key={courseProgress.courseId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {courseProgress.courseTitle}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {courseProgress.completionPercentage}%
                          </span>
                          {courseProgress.isComplete && (
                            <Badge variant="success" size="sm" icon={<Check className="w-3.5 h-3.5" />}>Done</Badge>
                          )}
                        </div>
                      </div>
                      <ProgressBar 
                        value={courseProgress.completionPercentage} 
                        showLabel={false}
                        variant={courseProgress.isComplete ? 'success' : 'primary'}
                        size="sm"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {courseProgress.completedChapters} / {courseProgress.totalChapters} chapters completed
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
