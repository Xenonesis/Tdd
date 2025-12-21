'use client';

import { BookOpen, Check, Clock, TrendingUp, Calendar, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'course_started' | 'chapter_completed' | 'certificate_earned' | 'course_assigned';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 5 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (displayedActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedActivities.map((activity, index) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-fadeInUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`w-10 h-10 rounded-xl ${activity.color} flex items-center justify-center flex-shrink-0`}>
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm">{activity.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.description}</p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
            {getTimeAgo(activity.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface QuickStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient: string;
}

export function QuickStatCard({ title, value, change, changeType = 'neutral', icon, gradient }: QuickStatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Background */}
      <div className={`absolute inset-0 ${gradient} opacity-90`} />
      
      {/* Content */}
      <div className="relative z-10 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {change && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
              changeType === 'positive' ? 'bg-green-500/20 text-green-100' :
              changeType === 'negative' ? 'bg-red-500/20 text-red-100' :
              'bg-white/20 text-white'
            }`}>
              {change}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-white/80 text-sm font-medium">{title}</p>
      </div>

      {/* Decorative Circle */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
    </div>
  );
}

interface CourseRecommendation {
  id: string;
  title: string;
  description: string;
  chaptersCount: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CourseRecommendationsProps {
  recommendations: CourseRecommendation[];
}

export function CourseRecommendations({ recommendations }: CourseRecommendationsProps) {
  const difficultyColors = {
    Beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    Advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No recommendations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((course, index) => (
        <div
          key={course.id}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {course.title}
            </h4>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${difficultyColors[course.difficulty]}`}>
              {course.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {course.chaptersCount} chapters
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.estimatedTime}
              </span>
            </div>
            <Link
              href={`/courses/${course.id}`}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

interface StreakCalendarProps {
  streakDays: number;
  weekData: boolean[];
}

export function StreakCalendar({ streakDays, weekData }: StreakCalendarProps) {
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/80 text-sm font-medium">Learning Streak</p>
          <p className="text-3xl font-bold">{streakDays} days</p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
          <span className="text-2xl">🔥</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {dayLabels.map((day, index) => (
          <div key={index} className="text-center">
            <span className="text-xs text-white/60">{day}</span>
            <div
              className={`mt-1 w-full aspect-square rounded-lg flex items-center justify-center ${
                weekData[index] ? 'bg-white/30' : 'bg-white/10'
              }`}
            >
              {weekData[index] && <Check className="w-4 h-4" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UpcomingDeadline {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
}

interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadline[];
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / 86400000);

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `In ${days} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getUrgencyColor = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / 86400000);

    if (days <= 1) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    if (days <= 3) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
  };

  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deadlines.map((deadline) => (
        <div
          key={deadline.id}
          className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{deadline.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{deadline.course}</p>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-lg ${getUrgencyColor(deadline.dueDate)}`}>
            {formatDate(deadline.dueDate)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: Date;
  locked?: boolean;
}

interface AchievementsShowcaseProps {
  badges: AchievementBadge[];
}

export function AchievementsShowcase({ badges }: AchievementsShowcaseProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`
            relative group cursor-pointer
            ${badge.locked ? 'opacity-40' : ''}
          `}
          title={badge.description}
        >
          <div className={`
            w-full aspect-square rounded-xl flex items-center justify-center text-2xl
            ${badge.locked 
              ? 'bg-gray-100 dark:bg-gray-800' 
              : 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30'
            }
          `}>
            {badge.locked ? '🔒' : badge.icon}
          </div>
          <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 truncate">
            {badge.name}
          </p>
          
          {/* Tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {badge.description}
          </div>
        </div>
      ))}
    </div>
  );
}
