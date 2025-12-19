import Link from 'next/link';
import { Button } from '@/components/ui/shadcn-index';
import { Badge } from '@/components/ui/shadcn-index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn-index';
import { Progress } from '@/components/ui/shadcn-index';

export default function Home() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📚</span>
              </div>
              <span className="text-2xl font-bold text-gradient">InternLMS</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-60 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 mb-8 animate-fadeInDown">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Built with Test-Driven Development
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fadeInUp leading-tight">
              Master Your{' '}
              <span className="text-gradient-hero">Internship</span>{' '}
              Journey
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-fadeInUp stagger-1">
              A comprehensive Learning Management System with role-based access, 
              sequential chapter progression, and automated certificate generation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp stagger-2">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Learning Free
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fadeInUp stagger-3">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Secure Auth</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">3</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">User Roles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">PDF</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Certificates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform provides all the tools for effective internship training and management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group hover-lift transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📚</span>
                </div>
                <CardTitle className="text-xl">Sequential Learning</CardTitle>
                <CardDescription>
                  Progress through chapters in order. No skipping allowed - ensuring complete understanding before moving forward.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Learning Path</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover-lift transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🔐</span>
                </div>
                <CardTitle className="text-xl">Role-Based Access</CardTitle>
                <CardDescription>
                  Students learn, Mentors teach and manage courses, Admins oversee the entire platform securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Security Level</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover-lift transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🎓</span>
                </div>
                <CardTitle className="text-xl">Certificates</CardTitle>
                <CardDescription>
                  Earn official PDF certificates upon 100% course completion. Download and share your achievements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Certificate Quality</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group hover-lift transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Visual progress bars and completion percentages keep you motivated and on track.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Tracking Accuracy</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group hover-lift transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🎥</span>
                </div>
                <CardTitle className="text-xl">Rich Media Content</CardTitle>
                <CardDescription>
                  Courses include images and video links for comprehensive, engaging learning experiences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Media Quality</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group hover-lift transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">✅</span>
                </div>
                <CardTitle className="text-xl">Mentor Approval</CardTitle>
                <CardDescription>
                  Quality control through admin approval ensures only qualified mentors can teach.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Quality Control</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built with Modern{' '}
              <span className="text-gradient">Technology</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enterprise-grade tech stack ensuring performance, security, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">⚛️</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Next.js</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">React Framework</p>
            </div>
            <div className="glass-card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">NestJS</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Backend API</p>
            </div>
            <div className="glass-card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">🗄️</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Prisma</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Database ORM</p>
            </div>
            <div className="glass-card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">🔑</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">JWT Auth</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Secure Sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Three Roles,{' '}
              <span className="text-gradient">One Platform</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Each role has specific permissions and features tailored to their needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student */}
            <Card className="border-t-4 border-emerald-500 hover-lift transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Student</CardTitle>
                    <Badge variant="secondary" className="mt-1">Learner</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>View assigned courses only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>Sequential chapter progression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>Track learning progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>Download completion certificates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Mentor */}
            <Card className="border-t-4 border-indigo-500 hover-lift transition-all relative">
              <div className="absolute -top-3 right-4">
                <Badge variant="outline">Requires Approval</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Mentor</CardTitle>
                    <Badge className="mt-1">Instructor</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">✓</span>
                    <span>Create and manage courses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">✓</span>
                    <span>Add chapters with media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">✓</span>
                    <span>Assign students to courses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">✓</span>
                    <span>Track student progress</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin */}
            <Card className="border-t-4 border-amber-500 hover-lift transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Admin</CardTitle>
                    <Badge variant="destructive" className="mt-1">Administrator</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span>Approve/reject mentors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span>Manage all users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span>View platform analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span>Full system access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join our platform today and take the first step towards mastering your internship skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl" asChild>
              <Link href="/register">
                Create Free Account
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white text-xl">📚</span>
              </div>
              <span className="text-xl font-bold text-white">InternLMS</span>
            </div>
            <p className="text-center md:text-left">
              Built with ❤️ using Test-Driven Development principles
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm">© 2024 InternLMS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
