import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InternLMS - Transform Your Learning Journey",
    template: "%s | InternLMS",
  },
  description: "A comprehensive Learning Management System for interns, mentors, and organizations. Sequential learning paths, real-time progress tracking, and automated certifications.",
  keywords: ["LMS", "Learning Management System", "Internship", "Online Learning", "Education", "Courses", "Certificates"],
  authors: [{ name: "InternLMS Team" }],
  creator: "InternLMS",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://internlms.com",
    siteName: "InternLMS",
    title: "InternLMS - Transform Your Learning Journey",
    description: "A comprehensive Learning Management System for interns, mentors, and organizations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InternLMS - Learning Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InternLMS - Transform Your Learning Journey",
    description: "A comprehensive Learning Management System for interns, mentors, and organizations.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
