'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LoadingScreen } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';
import { Plus, UserPlus, BookOpen, Users } from 'lucide-react';

export default function MentorCourseDetailPage() {
  return (
    <ProtectedRoute allowedRoles={['MENTOR']}>
      <MentorCourseDetailContent />
    </ProtectedRoute>
  );
}

function MentorCourseDetailContent() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showAssignStudentModal, setShowAssignStudentModal] = useState(false);
  
  // Form States
  const [newChapter, setNewChapter] = useState({ title: '', description: '', imageUrl: '', videoUrl: '' });
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [creating, setCreating] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [params.courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, chaptersRes, studentsRes, allStudentsRes] = await Promise.all([
        axios.get(`/api/courses/${params.courseId}`),
        axios.get(`/api/courses/${params.courseId}/chapters`),
        axios.get(`/api/courses/${params.courseId}/students`),
        axios.get('/api/users?role=STUDENT'),
      ]);

      setCourse(courseRes.data);
      setChapters(chaptersRes.data);
      setStudents(studentsRes.data);
      
      // Filter out already assigned students
      const assignedIds = new Set(studentsRes.data.map((s: any) => s.id));
      setAvailableStudents(allStudentsRes.data.filter((s: any) => !assignedIds.has(s.id)));
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post(`/api/courses/${params.courseId}/chapters`, {
        ...newChapter,
        order: chapters.length + 1,
      });
      setShowAddChapterModal(false);
      setNewChapter({ title: '', description: '', imageUrl: '', videoUrl: '' });
      fetchCourseData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error adding chapter');
    } finally {
      setCreating(false);
    }
  };

  const assignStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    
    setAssigning(true);
    try {
      await axios.post(`/api/courses/${params.courseId}/assign`, {
        studentId: selectedStudentId,
      });
      setShowAssignStudentModal(false);
      setSelectedStudentId('');
      fetchCourseData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error assigning student');
    } finally {
      setAssigning(false);
    }
  };

  const removeStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to remove this student from the course?')) return;
    
    try {
      await axios.delete(`/api/courses/${params.courseId}/students/${studentId}`);
      fetchCourseData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error removing student');
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading course..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/mentor/courses')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Courses</span>
        </button>

        {/* Course Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course?.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{course?.description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="primary" size="sm">{chapters.length} Chapters</Badge>
              <Badge variant="secondary" size="sm">{students.length} Students</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chapters Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Chapters
              </h2>
              <Button
                size="sm"
                onClick={() => setShowAddChapterModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Chapter
              </Button>
            </div>

            {chapters.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Chapters Yet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Add your first chapter to start building your course content.
                </p>
                <Button size="sm" onClick={() => setShowAddChapterModal(true)}>
                  Add First Chapter
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <div 
                    key={chapter.id} 
                    className="card p-4 flex items-center gap-4 animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {chapter.description.substring(0, 60)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {chapter.imageUrl && (
                        <span className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs" title="Has image">
                          🖼️
                        </span>
                      )}
                      {chapter.videoUrl && (
                        <span className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs" title="Has video">
                          🎥
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Students Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5" /> Enrolled Students
              </h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAssignStudentModal(true)}
                disabled={availableStudents.length === 0}
                icon={<UserPlus className="w-4 h-4" />}
              >
                Assign Student
              </Button>
            </div>

            {availableStudents.length === 0 && students.length === 0 && (
              <Alert variant="info" className="mb-4">
                No students registered yet. Students need to register before they can be assigned to courses.
              </Alert>
            )}

            {students.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Students Yet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Assign students to this course to let them start learning.
                </p>
                {availableStudents.length > 0 && (
                  <Button size="sm" variant="secondary" onClick={() => setShowAssignStudentModal(true)}>
                    Assign First Student
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student, index) => (
                  <div 
                    key={student.id} 
                    className="card p-4 flex items-center gap-4 animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {student.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                      onClick={() => removeStudent(student.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Chapter Modal */}
      <Modal
        isOpen={showAddChapterModal}
        onClose={() => {
          setShowAddChapterModal(false);
          setNewChapter({ title: '', description: '', imageUrl: '', videoUrl: '' });
        }}
        title="Add New Chapter"
        description="Create a new chapter for this course"
        size="lg"
      >
        <form onSubmit={addChapter} className="space-y-5">
          <Input
            label="Chapter Title"
            required
            value={newChapter.title}
            onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
            placeholder="e.g., Introduction to React"
          />
          <Textarea
            label="Description / Content"
            required
            value={newChapter.description}
            onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
            placeholder="Write the chapter content here..."
            rows={6}
          />
          <Input
            label="Image URL (optional)"
            value={newChapter.imageUrl}
            onChange={(e) => setNewChapter({ ...newChapter, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="Video URL (optional)"
            value={newChapter.videoUrl}
            onChange={(e) => setNewChapter({ ...newChapter, videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddChapterModal(false);
                setNewChapter({ title: '', description: '', imageUrl: '', videoUrl: '' });
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating} fullWidth>
              Add Chapter
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Student Modal */}
      <Modal
        isOpen={showAssignStudentModal}
        onClose={() => {
          setShowAssignStudentModal(false);
          setSelectedStudentId('');
        }}
        title="Assign Student"
        description="Select a student to enroll in this course"
      >
        <form onSubmit={assignStudent} className="space-y-5">
          {availableStudents.length === 0 ? (
            <Alert variant="warning">
              All available students are already enrolled in this course.
            </Alert>
          ) : (
            <div className="space-y-2">
              <label className="label">Select Student</label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {availableStudents.map((student) => (
                  <label
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStudentId === student.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="student"
                      value={student.id}
                      checked={selectedStudentId === student.id}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                    {selectedStudentId === student.id && (
                      <svg className="w-5 h-5 text-indigo-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAssignStudentModal(false);
                setSelectedStudentId('');
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={assigning} 
              disabled={!selectedStudentId}
              fullWidth
            >
              Assign Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
