'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { LoadingCard } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';

export default function MentorCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={['MENTOR']}>
      <MentorCoursesContent />
    </ProtectedRoute>
  );
}

function MentorCoursesContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/my');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post('/api/courses', newCourse);
      setShowCreateModal(false);
      setNewCourse({ title: '', description: '' });
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating course');
    } finally {
      setCreating(false);
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
            <div className="skeleton h-5 w-72" />
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
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your courses
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Courses</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalChapters}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chapters</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
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
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Create your first course to start teaching. Add chapters, assign students, and track their progress.
            </p>
            <Button onClick={() => setShowCreateModal(true)} icon={<span>+</span>}>
              Create Your First Course
            </Button>
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
                <CourseCard course={course} role={user?.role || 'MENTOR'} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Course Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewCourse({ title: '', description: '' });
        }}
        title="Create New Course"
        description="Fill in the details to create a new course"
      >
        <form onSubmit={createCourse} className="space-y-5">
          <Input
            label="Course Title"
            required
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            placeholder="e.g., Introduction to Web Development"
          />
          <Textarea
            label="Description"
            required
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            placeholder="Describe what students will learn in this course..."
            rows={4}
          />
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setShowCreateModal(false);
                setNewCourse({ title: '', description: '' });
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating} fullWidth>
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
