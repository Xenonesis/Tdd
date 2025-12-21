'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';
import { LoadingScreen } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { GraduationCap, Check, BookOpen, ChevronLeft, ChevronRight, PartyPopper, Video } from 'lucide-react';

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
  const [completing, setCompleting] = useState(false);
  const [generating, setGenerating] = useState(false);

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

      // Select first unlocked or first completed chapter
      const firstUnlocked = chaptersRes.data.find((ch: any) => !ch.isLocked && !ch.isCompleted);
      const firstChapter = chaptersRes.data[0];
      setSelectedChapter(firstUnlocked || firstChapter);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeChapter = async (chapterId: string) => {
    setCompleting(true);
    try {
      await axios.post(`/api/progress/${chapterId}/complete`);
      await fetchCourseData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error completing chapter');
    } finally {
      setCompleting(false);
    }
  };

  const generateCertificate = async () => {
    setGenerating(true);
    try {
      await axios.post(`/api/certificates/course/${params.courseId}`);
      router.push('/certificates');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error generating certificate');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading course..." />;
  }

  const currentIndex = selectedChapter ? chapters.findIndex(c => c.id === selectedChapter.id) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button & Title */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/courses')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Courses</span>
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {course?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{course?.description}</p>
            </div>
            {/* Circular Progress */}
            {progress && (
              <div className="flex-shrink-0">
                <CircularProgress 
                  value={progress.completionPercentage} 
                  size={80}
                  variant={progress.isComplete ? 'success' : 'primary'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Course Completion Banner */}
        {progress?.isComplete && (
          <div className="mb-6">
            <Alert variant="success" title={<span className="flex items-center gap-2"><PartyPopper className="w-5 h-5" /> Congratulations! Course Completed!</span>}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span>You've completed all chapters. You can now generate your certificate.</span>
                <Button
                  onClick={generateCertificate}
                  loading={generating}
                  variant="secondary"
                  size="sm"
                  icon={<GraduationCap className="w-4 h-4" />}
                >
                  Generate Certificate
                </Button>
              </div>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter List (Sidebar) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Chapters
                <Badge variant="gray" size="sm">{chapters.length}</Badge>
              </h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => !chapter.isLocked && setSelectedChapter(chapter)}
                    disabled={chapter.isLocked}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                      chapter.isLocked
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : selectedChapter?.id === chapter.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500'
                        : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {/* Chapter Number/Status */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                      chapter.isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : chapter.isLocked
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        : 'bg-indigo-500 text-white'
                    }`}>
                      {chapter.isCompleted ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : chapter.isLocked ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {/* Chapter Title */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        chapter.isLocked ? 'text-gray-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {chapter.title}
                      </p>
                      {chapter.isLocked && (
                        <p className="text-xs text-gray-400">Complete previous</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Content (Main) */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedChapter ? (
              <div className="card p-6 lg:p-8">
                {/* Chapter Header */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>Chapter {currentIndex + 1} of {chapters.length}</span>
                  {selectedChapter.isCompleted && (
                    <Badge variant="success" size="sm" icon={<Check className="w-3.5 h-3.5" />}>Completed</Badge>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedChapter.title}
                </h2>

                {/* Content */}
                <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedChapter.description}
                  </p>

                  {/* Image */}
                  {selectedChapter.imageUrl && (
                    <div className="my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={selectedChapter.imageUrl}
                        alt={selectedChapter.title}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Video Link */}
                  {selectedChapter.videoUrl && (
                    <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Video Content</p>
                          <a
                            href={selectedChapter.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                          >
                            Watch Video →
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {!selectedChapter.isCompleted ? (
                    <Button
                      onClick={() => completeChapter(selectedChapter.id)}
                      loading={completing}
                      size="lg"
                      icon={<Check className="w-4 h-4" />}
                    >
                      Mark as Complete
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Chapter Completed</span>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex-1 flex justify-end gap-2">
                    {currentIndex > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedChapter(chapters[currentIndex - 1])}
                        icon={<ChevronLeft className="w-4 h-4" />}
                      >
                        Previous
                      </Button>
                    )}
                    {currentIndex < chapters.length - 1 && !chapters[currentIndex + 1]?.isLocked && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedChapter(chapters[currentIndex + 1])}
                        iconPosition="right"
                        icon={<ChevronRight className="w-4 h-4" />}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Chapter
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a chapter from the list to start learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
