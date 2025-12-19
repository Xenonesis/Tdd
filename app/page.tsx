import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          Internship Learning Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A comprehensive LMS with role-based access, sequential chapter progression, and automated certificate generation
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-blue-600"
          >
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2">Sequential Learning</h3>
            <p className="text-gray-600 text-sm">
              Chapter-by-chapter progression with locked content until prerequisites complete
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-600 text-sm">
              Students learn, Mentors teach, and Admins manage the platform
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="text-lg font-semibold mb-2">Certificates</h3>
            <p className="text-gray-600 text-sm">
              Earn certificates upon 100% course completion with PDF download
            </p>
          </div>
        </div>

        <div className="mt-16 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong className="block text-blue-600">Frontend</strong>
              Next.js, React, TypeScript, Tailwind CSS
            </div>
            <div>
              <strong className="block text-green-600">Backend</strong>
              NestJS, Prisma, PostgreSQL
            </div>
            <div>
              <strong className="block text-purple-600">Auth</strong>
              JWT, Passport, RBAC Guards
            </div>
            <div>
              <strong className="block text-orange-600">Testing</strong>
              Jest, React Testing Library, Supertest
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 mb-8 text-center text-gray-600">
        <p>Built with Test-Driven Development (TDD) principles</p>
      </footer>
    </div>
  );
}
