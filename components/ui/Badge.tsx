'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'gray' | 'success' | 'warning';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Badge({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  children,
  className = '' 
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    secondary: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    accent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

interface RoleBadgeProps {
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const roleConfig = {
    STUDENT: { variant: 'secondary' as const, icon: '🎓', label: 'Student' },
    MENTOR: { variant: 'primary' as const, icon: '👨‍🏫', label: 'Mentor' },
    ADMIN: { variant: 'accent' as const, icon: '👑', label: 'Admin' },
  };

  const config = roleConfig[role];

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {config.label}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'locked';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    inactive: { variant: 'danger' as const, label: 'Inactive' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    completed: { variant: 'secondary' as const, label: 'Completed' },
    locked: { variant: 'gray' as const, label: 'Locked' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

export default Badge;
