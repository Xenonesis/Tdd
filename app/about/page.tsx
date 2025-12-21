import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/shadcn-index';
import { 
  Users, 
  Award, 
  Globe, 
  Heart, 
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';

const teamMembers = [
  { name: 'Alex Johnson', role: 'CEO & Founder', avatar: 'AJ' },
  { name: 'Sarah Williams', role: 'CTO', avatar: 'SW' },
  { name: 'Michael Chen', role: 'Head of Product', avatar: 'MC' },
  { name: 'Emily Davis', role: 'Lead Designer', avatar: 'ED' },
];

const stats = [
  { value: '10K+', label: 'Active Learners' },
  { value: '500+', label: 'Courses Created' },
  { value: '50+', label: 'Partner Companies' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const values = [
  { 
    icon: <Heart className="w-6 h-6" />, 
    title: 'Learner First', 
    description: 'Every feature we build starts with the question: how does this help our learners succeed?'
  },
  { 
    icon: <Target className="w-6 h-6" />, 
    title: 'Quality Over Quantity', 
    description: 'We believe in structured, sequential learning that builds real skills over time.'
  },
  { 
    icon: <Users className="w-6 h-6" />, 
    title: 'Community Driven', 
    description: 'We build with our community, incorporating feedback to continuously improve.'
  },
  { 
    icon: <Zap className="w-6 h-6" />, 
    title: 'Innovation', 
    description: 'We leverage cutting-edge technology to create the best learning experience possible.'
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">IL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InternLMS
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission is to
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform Learning
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're building the future of education technology, making quality learning accessible to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                <Globe className="w-4 h-4" />
                Our Story
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Building the Future of Education
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                InternLMS was born from a simple observation: traditional learning management systems weren't built for the modern learner. They were clunky, unintuitive, and failed to leverage the latest in educational research.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                We set out to create something different. A platform that combines beautiful design with proven learning methodologies like sequential learning and spaced repetition.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Today, InternLMS powers learning at hundreds of organizations, from startups to Fortune 500 companies. But we're just getting started.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎓</div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Founded in 2024</p>
                  <p className="text-gray-600 dark:text-gray-400">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">The people behind InternLMS</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 group-hover:scale-105 transition-transform">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Join Us on This Journey</h2>
          <p className="text-xl text-white/90 mb-8">
            Whether you're a learner, mentor, or organization, we'd love to have you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/register" className="flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
