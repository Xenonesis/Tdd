import Link from 'next/link';
import { Button } from '@/components/ui/shadcn-index';
import { Badge } from '@/components/ui/shadcn-index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn-index';
import { Progress } from '@/components/ui/shadcn-index';
import { ModeToggle } from '@/components/mode-toggle';
import { BookOpen, Lock, GraduationCap, BarChart, PlayCircle, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen gradient-mesh font-sans text-gray-900 dark:text-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition-colors">
              <span className="font-bold">I</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">InternLMS</span>
          </Link>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button className="rounded-full px-6 font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-shadow bg-primary-600 hover:bg-primary-700 text-white border-0" asChild>
              <Link href="/register">
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 mb-8 animate-fadeInDown backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">
                v2.0 with TDD
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 animate-fadeInUp text-gray-900 dark:text-white">
              Master Your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 hover-lift inline-block cursor-default pb-2">Internship Journey</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeInUp stagger-1 font-light">
              The modern learning platform designed for professional growth. 
              Sequential chapters, role-based workflows, and automated certification.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp stagger-2">
              <Button size="lg" className="h-12 px-8 rounded-full text-base shadow-xl shadow-primary-500/20 hover:translate-y-[-2px] transition-all bg-primary-600 hover:bg-primary-700 text-white" asChild>
                <Link href="/register">
                  Start Learning Free
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 shadow-sm text-gray-700 dark:text-gray-300" asChild>
                <Link href="/login">
                  Live Demo
                </Link>
              </Button>
            </div>

            {/* Abstract Visual/Stats */}
            <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fadeInUp stagger-3">
              <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                 <div className="text-sm font-medium text-gray-500">Verified Certificates</div>
              </div>
              <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold text-gray-900 dark:text-white">Zero</div>
                 <div className="text-sm font-medium text-gray-500">Setup Cost</div>
              </div>
              <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold text-gray-900 dark:text-white">Pro</div>
                 <div className="text-sm font-medium text-gray-500">Mentorship Access</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Precision Engineered Tools</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">Everything you need, nothing you don't.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Sequential Learning", desc: "Unlock knowledge step-by-step. No skipping ensures mastery.", icon: BookOpen },
                { title: "Role-Based Access", desc: "Distinct interfaces for Students, Mentors, and Admins.", icon: Lock },
                { title: "Smart Certificates", desc: "Auto-generated, verifiable PDF certificates designed for LinkedIn.", icon: GraduationCap },
                { title: "Progress Analytics", desc: "Visual data tracking for every milestone achieved.", icon: BarChart },
                { title: "Rich Media Support", desc: "Seamless integration of video, audio, and interactive content.", icon: PlayCircle },
                { title: "Quality Assurance", desc: "Rigorous mentor approval workflows built-in.", icon: CheckCircle },
              ].map((feature, i) => (
                <Card key={i} className={`glass-card border-0 shadow-sm hover:shadow-md transition-all duration-300 group bg-white/50 dark:bg-gray-800/50`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed mt-2 text-gray-500 dark:text-gray-400">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section - Minimal */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                {/* Student */}
                <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                   <div className="text-4xl mb-4">🎓</div>
                   <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Student</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Focus on learning paths and achieving certification with distraction-free interfaces.</p>
                </div>
                {/* Mentor */}
                <div className="p-8 rounded-3xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
                   <div className="text-4xl mb-4">👨‍🏫</div>
                   <h3 className="text-xl font-bold mb-2 text-primary-900 dark:text-primary-100">Mentor</h3>
                   <p className="text-sm text-primary-700/70 dark:text-primary-300/70">Tools to create courseware, track cohorts, and validate student milestones.</p>
                </div>
                {/* Admin */}
                <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                   <div className="text-4xl mb-4">🛡️</div>
                   <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Admin</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Complete system oversight, analytics, and user management capabilities.</p>
                </div>
             </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 relative text-center px-4 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-50/50 dark:to-primary-900/20 pointer-events-none" />
           <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">Ready to excel?</h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10">Join thousands of interns mastering their craft today.</p>
              <Button size="lg" className="rounded-full px-10 py-6 text-lg shadow-2xl shadow-primary-500/30 hover:scale-105 transition-transform bg-primary-600 hover:bg-primary-700 text-white" asChild>
                <Link href="/register">Get Started Now</Link>
              </Button>
           </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
           <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 InternLMS Inc. All rights reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <Link href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Privacy</Link>
              <Link href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Terms</Link>
              <Link href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Contact</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
