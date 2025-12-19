'use client';

import Link from 'next/link';

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
  };
  role: string;
}

export default function CourseCard({ course, role }: CourseCardProps) {
  const href = role === 'STUDENT' 
    ? `/courses/${course.id}` 
    : role === 'MENTOR' 
    ? `/mentor/courses/${course.id}` 
    : `/admin/courses/${course.id}`;

  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        {course.mentor && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="mr-2">👨‍🏫</span>
            <span>{course.mentor.firstName} {course.mentor.lastName}</span>
          </div>
        )}

        {typeof course.totalChapters !== 'undefined' && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{course.completedChapters || 0} / {course.totalChapters} chapters</span>
              <span className="font-semibold">{course.completionPercentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${course.completionPercentage || 0}%` }}
              />
            </div>
          </div>
        )}

        {course.completionPercentage === 100 && (
          <div className="flex items-center text-green-600 text-sm font-semibold">
            <span className="mr-1">✓</span>
            <span>Completed</span>
          </div>
        )}
      </div>
    </Link>
  );
}
