'use client';

import Link from 'next/link';
import { ProgressBar } from './ui/ProgressBar';
import { BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    mentor?: {
      firstName: string;
      lastName: string;
    };
    totalChapters?: number;
    completedChapters?: number;
    completionPercentage?: number;
    _count?: {
      chapters: number;
      assignments: number;
    };
  };
  role: string;
}

export default function CourseCard({ course, role }: CourseCardProps) {
  const href = role === 'STUDENT' 
    ? `/courses/${course.id}` 
    : role === 'MENTOR' 
    ? `/mentor/courses/${course.id}` 
    : `/admin/courses`;

  const isComplete = course.completionPercentage === 100;
  const hasProgress = typeof course.totalChapters !== 'undefined';
  const chaptersCount = course._count?.chapters || course.totalChapters || 0;
  const studentsCount = course._count?.assignments || 0;

  return (
    <Link href={href} className="block group">
      <div className="card card-hover h-full p-6 relative overflow-hidden">
        {/* Completion Badge */}
        {isComplete && (
          <div className="absolute top-4 right-4">
            <span className="badge-secondary px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          </div>
        )}

        {/* Course Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white">
          <BookOpen className="w-6 h-6" />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Mentor Info */}
        {course.mentor && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
              {course.mentor.firstName[0]}{course.mentor.lastName[0]}
            </div>
            <span>{course.mentor.firstName} {course.mentor.lastName}</span>
          </div>
        )}

        {/* Progress Bar (Student) */}
        {hasProgress && role === 'STUDENT' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">
                {course.completedChapters || 0} / {course.totalChapters} chapters
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {course.completionPercentage || 0}%
              </span>
            </div>
            <ProgressBar 
              value={course.completionPercentage || 0} 
              showLabel={false}
              variant={isComplete ? 'success' : 'primary'}
            />
          </div>
        )}

        {/* Stats (Mentor/Admin) */}
        {role !== 'STUDENT' && (
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {chaptersCount} chapters
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {studentsCount} students
            </span>
          </div>
        )}

        {/* Action Hint */}
        <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span>{role === 'STUDENT' ? 'Continue Learning' : 'View Details'}</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
