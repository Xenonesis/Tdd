'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RoleBadge } from './ui/Badge';
import { ModeToggle } from './mode-toggle';
import { Home, BookOpen, BarChart3, GraduationCap, Users, Menu, X, ChevronDown, Rocket, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = {
    STUDENT: [
      { href: '/dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
      { href: '/courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
      { href: '/progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
      { href: '/certificates', label: 'Awards', icon: <GraduationCap className="w-4 h-4" /> },
    ],
    MENTOR: [
      { href: '/dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
      { href: '/mentor/courses', label: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
      { href: '/mentor/students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    ],
    ADMIN: [
      { href: '/dashboard', label: 'Overview', icon: <Home className="w-4 h-4" /> },
      { href: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
      { href: '/admin/courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
      { href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  };

  const links = user?.role ? navLinks[user.role] : [];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav 
        className={`
          w-full max-w-6xl transition-all duration-300 ease-in-out
          ${scrolled 
            ? 'bg-white/80 dark:bg-[#0C0C0C]/80 shadow-2xl backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full py-3 px-6' 
            : 'bg-transparent border-transparent py-4 px-4'
          }
        `}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105
              bg-gradient-to-br from-indigo-600 to-violet-600
            `}>
              <Rocket className="text-white w-5 h-5" />
            </div>
            <span className={`
              text-xl font-bold tracking-tight transition-colors duration-300
              ${scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}
            `}>
              InternLMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`
            hidden md:flex items-center gap-1 p-1.5 rounded-full transition-all duration-300
            ${scrolled ? 'bg-gray-100/50 dark:bg-white/5 border border-transparent' : 'bg-white/80 dark:bg-[#0C0C0C]/50 border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-sm'}
          `}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                  flex items-center gap-2 group overflow-hidden
                  ${isActive(link.href)
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                {isActive(link.href) && (
                  <span className="absolute inset-0 bg-gray-900 dark:bg-white rounded-full transition-all duration-300 -z-10" />
                )}
                <span className={`transition-colors duration-200 ${isActive(link.href) ? 'text-white dark:text-black' : ''}`}>
                  {link.label}
                </span>
                {isActive(link.href) && (
                   <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/30 dark:bg-black/20 rounded-full mb-1" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
             <ModeToggle />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`
                  flex items-center gap-3 pl-2 pr-1.5 py-1.5 rounded-full transition-all duration-300
                  hover:bg-gray-100 dark:hover:bg-white/10 border border-transparent
                  ${profileDropdownOpen ? 'bg-gray-100 dark:bg-white/10' : ''}
                `}
              >
                <div className="hidden sm:block text-right mr-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                    {user?.firstName}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
                    {user?.role}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center text-white dark:text-black font-bold shadow-md ring-2 ring-white dark:ring-black/20">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 z-50 animate-scaleIn origin-top-right overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl mb-2">
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user?.firstName?.[0]}
                         </div>
                         <div>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {user?.email}
                            </p>
                         </div>
                       </div>
                       <RoleBadge role={user?.role || 'STUDENT'} />
                    </div>
                    
                    {/* Menu Items */}
                    <div className="space-y-1 mx-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-all group"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-white/20 transition-colors">
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-all group"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-white/20 transition-colors">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                          </svg>
                        </div>
                        <span className="font-medium">Settings</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button - Circular & Floating */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white shadow-sm hover:scale-105 transition-transform"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-2 bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 animate-fade-in-down origin-top">
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all
                    ${isActive(link.href)
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-500/30'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isActive(link.href) ? 'bg-white dark:bg-indigo-500/20' : 'bg-white dark:bg-white/5'}
                  `}>
                    {link.icon}
                  </div>
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
