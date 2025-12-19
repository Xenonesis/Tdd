'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';

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
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    fetchCourseData();
    fetchAvailableStudents();
  }, [params.courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, chaptersRes] = await Promise.all([
        axios.get(`/api/courses/${params.courseId}`),
        axios.get(`/api/courses/${params.courseId}/chapters`),
      ]);

      setCourse(courseRes.data);
      setChapters(chaptersRes.data);
      setStudents(courseRes.data.assignments?.map((a: any) => a.student) || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get('/api/users/students');
      setAvailableStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${params.courseId}/chapters`, newChapter);
      setShowChapterModal(false);
      setNewChapter({ title: '', description: '', imageUrl: '', videoUrl: '' });
      fetchCourseData();
      alert('Chapter added successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error adding chapter');
    }
  };

  const assignStudents = async () => {
    try {
      await axios.post(`/api/courses/${params.courseId}/assign`, {
        studentIds: selectedStudents,
      });
      setShowAssignModal(false);
      setSelectedStudents([]);
      fetchCourseData();
      alert('Students assigned successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error assigning students');
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
          <button
            onClick={() => router.push('/mentor/courses')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Courses
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
            <p className="text-gray-600 mb-4">{course?.description}</p>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>📚 {chapters.length} chapters</span>
              <span>👥 {students.length} students</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chapters Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Chapters</h2>
                <button
                  onClick={() => setShowChapterModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  + Add Chapter
                </button>
              </div>

              {chapters.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-4xl mb-3">📖</div>
                  <p className="text-gray-600 mb-4">No chapters yet</p>
                  <button
                    onClick={() => setShowChapterModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    Add First Chapter
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-start">
                        <span className="text-gray-500 font-semibold mr-3">{index + 1}.</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                            {chapter.imageUrl && <span>🖼️ Image</span>}
                            {chapter.videoUrl && <span>🎥 Video</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Students Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Assigned Students</h2>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  + Assign Students
                </button>
              </div>

              {students.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="text-gray-600 mb-4">No students assigned yet</p>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    Assign Students
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md divide-y">
                  {students.map((student) => (
                    <div key={student.id} className="p-4">
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Chapter</h2>
            <form onSubmit={addChapter}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  required
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={newChapter.description}
                  onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={newChapter.imageUrl}
                  onChange={(e) => setNewChapter({ ...newChapter, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  value={newChapter.videoUrl}
                  onChange={(e) => setNewChapter({ ...newChapter, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowChapterModal(false);
                    setNewChapter({ title: '', description: '', imageUrl: '', videoUrl: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Students Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assign Students</h2>
            <div className="mb-6 space-y-2">
              {availableStudents.map((student) => (
                <label key={student.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student.id]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                      }
                    }}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedStudents([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={assignStudents}
                disabled={selectedStudents.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Assign ({selectedStudents.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
