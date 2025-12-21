'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { ModeToggle } from '@/components/mode-toggle';
import { UserPlus, Mail, Lock, User, Check, ArrowRight, Sparkles, Shield, BookOpen, Award, GraduationCap, UserCheck } from 'lucide-react';

type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Split full name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await register({ email, password, firstName, lastName, role });
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-xl">IL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InternLMS
              </span>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center py-12">
          {/* Left Side - Marketing Content */}
          <div className="hidden lg:block space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Start Your Journey
                </span>
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Join Thousands of
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Successful Learners
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Create your account today and unlock access to world-class learning resources, expert mentorship, and career-advancing certifications.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">500+ Courses</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Access comprehensive learning paths across multiple domains</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Expert Mentorship</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Learn from industry professionals with real-world experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Verified Certificates</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Earn credentials recognized by top employers worldwide</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  JD
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-2">
                    &quot;InternLMS transformed my career. The structured learning path and mentor support helped me land my dream job!&quot;
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                    - Jane Doe, Software Engineer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full animate-scale-in delay-200">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-200 dark:border-gray-800">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-fade-in">
                <UserPlus className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <div className="text-center mb-8 animate-fade-in-up delay-100">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Join InternLMS and start learning today
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 animate-fade-in">
                  <Alert variant="error" onClose={() => setError('')}>
                    {error}
                  </Alert>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up delay-200">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Check className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('STUDENT')}
                      className={`p-4 rounded-xl border-2 transition-all text-center hover-scale ${
                        role === 'STUDENT'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 mx-auto">
                        <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Student</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('MENTOR')}
                      className={`p-4 rounded-xl border-2 transition-all text-center hover-scale ${
                        role === 'MENTOR'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2 mx-auto">
                        <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mentor</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('ADMIN')}
                      className={`p-4 rounded-xl border-2 transition-all text-center hover-scale ${
                        role === 'ADMIN'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-300 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-2 mx-auto">
                        <Shield className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                      </div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Admin</div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center animate-fade-in delay-300">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Role Info */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 animate-fade-in delay-400">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Role Descriptions:</p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p><span className="font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1"><GraduationCap className="w-4 h-4" /> Student:</span> Access courses, track progress, earn certificates</p>
                  <p><span className="font-semibold text-purple-600 dark:text-purple-400 inline-flex items-center gap-1"><UserCheck className="w-4 h-4" /> Mentor:</span> Create courses, manage students, provide feedback</p>
                  <p><span className="font-semibold text-pink-600 dark:text-pink-400 inline-flex items-center gap-1"><Shield className="w-4 h-4" /> Admin:</span> Full system access, manage users and content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
