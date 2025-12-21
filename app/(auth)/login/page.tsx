'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { ModeToggle } from '@/components/mode-toggle';
import { LogIn, Mail, Lock, ArrowRight, Sparkles, GraduationCap, UserCheck, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Welcome Back
                </span>
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Continue Your
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Learning Journey
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Access your courses, track your progress, and achieve your goals with InternLMS.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Personalized Learning</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Track your progress and continue where you left off</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Expert Mentors</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Get guidance from experienced professionals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Verified Certificates</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Earn credentials that matter in your career</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Success</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full animate-scale-in delay-200">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-200 dark:border-gray-800">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-fade-in">
                <LogIn className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <div className="text-center mb-8 animate-fade-in-up delay-100">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to your account to continue
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
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up delay-200">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center animate-fade-in delay-300">
                <p className="text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              {/* Demo Accounts */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200 dark:border-blue-800/30 animate-fade-in delay-400">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Demo Accounts</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800/30 text-center hover-scale">
                    <p className="font-semibold text-green-700 dark:text-green-300 mb-1 flex items-center justify-center gap-2"><GraduationCap className="w-4 h-4" /> Student</p>
                    <p className="text-green-600 dark:text-green-400">student@test.com</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800/30 text-center hover-scale">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center justify-center gap-2"><UserCheck className="w-4 h-4" /> Mentor</p>
                    <p className="text-blue-600 dark:text-blue-400">mentor@test.com</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800/30 text-center hover-scale">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center justify-center gap-2"><Shield className="w-4 h-4" /> Admin</p>
                    <p className="text-purple-600 dark:text-purple-400">admin@test.com</p>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">Password: password123</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
