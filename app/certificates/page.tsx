'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingCard } from '@/components/ui/Loading';
import Link from 'next/link';
import { BookOpen, Download, Eye, GraduationCap } from 'lucide-react';

export default function CertificatesPage() {
  return (
    <ProtectedRoute>
      <CertificatesContent />
    </ProtectedRoute>
  );
}

function CertificatesContent() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('/api/certificates/my-certificates');
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId: string, courseTitle: string) => {
    setDownloading(certificateId);
    try {
      const response = await axios.get(`/api/certificates/${certificateId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${courseTitle.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto pt-32 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="skeleton h-9 w-48 mb-3" />
            <div className="skeleton h-5 w-72" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Certificates
            </h1>
            <Badge variant="secondary">{certificates.length}</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Download your course completion certificates
          </p>
        </div>

        {certificates.length === 0 ? (
          /* Empty State */
          <div className="card p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl transform rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center">
                <GraduationCap className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              No Certificates Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Complete a course to earn your first certificate! Certificates are 
              automatically generated when you finish all chapters in a course.
            </p>
            <Link href="/courses">
              <Button icon={<BookOpen className="w-4 h-4" />}>View My Courses</Button>
            </Link>
          </div>
        ) : (
          /* Certificates Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate, index) => (
              <div
                key={certificate.id}
                className="card overflow-hidden animate-fadeInUp group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Certificate Preview */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDAgNTYgMCAyOCAyOCAwIDEgMC01NiAwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <GraduationCap className="w-10 h-10 text-white" />
                      <Badge variant="accent" size="sm">Certificate</Badge>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Course Completion</p>
                      <h3 className="text-xl font-bold line-clamp-2">{certificate.course.title}</h3>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      onClick={() => downloadCertificate(certificate.id, certificate.course.title)}
                      loading={downloading === certificate.id}
                      icon={<Download className="w-5 h-5" />}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        {certificate.course.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {certificate.course.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Issued: {new Date(certificate.issuedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadCertificate(certificate.id, certificate.course.title)}
                      loading={downloading === certificate.id}
                      icon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
