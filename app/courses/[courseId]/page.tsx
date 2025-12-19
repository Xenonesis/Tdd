'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';

export default function CourseViewerPage() {
  return (
    <ProtectedRoute>
      <CourseViewerContent />
    </ProtectedRoute>
  );
}

function CourseViewerContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [params.courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, chaptersRes, progressRes] = await Promise.all([
        axios.get(`/api/courses/${params.courseId}`),
        axios.get(`/api/courses/${params.courseId}/chapters`),
        axios.get(`/api/progress/course/${params.courseId}`),
      ]);

      setCourse(courseRes.data);
      setChapters(chaptersRes.data);
      setProgress(progressRes.data);

      // Select first unlocked chapter
      const firstUnlocked = chaptersRes.data.find((ch: any) => !ch.isLocked);
      if (firstUnlocked) {
        setSelectedChapter(firstUnlocked);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeChapter = async (chapterId: string) => {
    try {
      await axios.post(`/api/progress/${chapterId}/complete`);
      await fetchCourseData(); // Refresh data
      alert('Chapter completed! ✓');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error completing chapter');
    }
  };

  const generateCertificate = async () => {
    try {
      const response = await axios.post(`/api/certificates/course/${params.courseId}`);
      alert('Certificate generated! You can download it from the Certificates page.');
      router.push('/certificates');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error generating certificate');
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
            <button
              onClick={() => router.push('/courses')}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Courses
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
            <p className="text-gray-600 mt-2">{course?.description}</p>
          </div>

          {progress && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
                <span className="text-2xl font-bold text-blue-600">
                  {progress.completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${progress.completionPercentage}%` }}
                />
              </div>
              <p className="text-gray-600">
                {progress.completedChapters} of {progress.totalChapters} chapters completed
              </p>
              {progress.isComplete && (
                <button
                  onClick={generateCertificate}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
                >
                  🎓 Generate Certificate
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chapter List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Chapters</h2>
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => !chapter.isLocked && setSelectedChapter(chapter)}
                      disabled={chapter.isLocked}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        chapter.isLocked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedChapter?.id === chapter.id
                          ? 'bg-blue-100 border-2 border-blue-600'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 font-medium">
                            {index + 1}.
                          </span>
                          <span className={`font-medium ${chapter.isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                            {chapter.title}
                          </span>
                        </div>
                        <div>
                          {chapter.isCompleted && <span className="text-green-600">✓</span>}
                          {chapter.isLocked && <span>🔒</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chapter Content */}
            <div className="lg:col-span-2">
              {selectedChapter ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedChapter.title}
                  </h2>
                  <p className="text-gray-700 mb-6 whitespace-pre-wrap">
                    {selectedChapter.description}
                  </p>

                  {selectedChapter.imageUrl && (
                    <div className="mb-6">
                      <img
                        src={selectedChapter.imageUrl}
                        alt={selectedChapter.title}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}

                  {selectedChapter.videoUrl && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Video</h3>
                      <a
                        href={selectedChapter.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Watch Video →
                      </a>
                    </div>
                  )}

                  {!selectedChapter.isCompleted && (
                    <button
                      onClick={() => completeChapter(selectedChapter.id)}
                      className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                    >
                      Mark as Complete
                    </button>
                  )}

                  {selectedChapter.isCompleted && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-700 font-semibold">✓ Chapter Completed</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">📖</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Chapter
                  </h3>
                  <p className="text-gray-600">
                    Choose a chapter from the list to start learning.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
