'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';

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
      const response = await axios.get('/api/progress/students');
      setStudentsProgress(response.data);
    } catch (error) {
      console.error('Error fetching students progress:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Progress</h1>
            <p className="text-gray-600 mt-2">
              Track your students' learning progress
            </p>
          </div>

          {students.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Yet</h3>
              <p className="text-gray-600">
                Assign students to your courses to see their progress here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {students.map(({ student, courses }) => (
                <div key={student.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h2>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Enrolled Courses</p>
                      <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {courses.map((courseProgress: any) => (
                      <div key={courseProgress.courseId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {courseProgress.courseTitle}
                          </h3>
                          <span className="text-lg font-bold text-blue-600">
                            {courseProgress.completionPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              courseProgress.isComplete ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${courseProgress.completionPercentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {courseProgress.completedChapters} / {courseProgress.totalChapters} chapters completed
                        </p>
                        {courseProgress.isComplete && (
                          <span className="inline-block mt-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
