'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I get started as a student?',
    answer: 'Simply register for an account as a student, and your mentor will assign courses to you. Once assigned, you can access your courses from the dashboard and start learning immediately. Progress is tracked automatically as you complete chapters.',
  },
  {
    question: 'How do mentors create and manage courses?',
    answer: 'Mentors can create courses through the mentor dashboard. Each course can have multiple chapters with text, images, and video content. Mentors can assign courses to specific students and track their progress in real-time.',
  },
  {
    question: 'What is sequential learning and why is it important?',
    answer: 'Sequential learning means you must complete chapters in order - you cannot skip ahead. This ensures a solid foundation as concepts build upon each other, leading to better retention and understanding of the material.',
  },
  {
    question: 'How do certificates work?',
    answer: 'Certificates are automatically generated when you complete 100% of a course. Each certificate includes your name, course details, completion date, and a unique certificate ID that can be verified. You can download certificates as PDFs.',
  },
  {
    question: 'What roles are available in the system?',
    answer: 'There are three roles: Students can view assigned courses and track progress, Mentors can create courses and assign them to students, and Admins have full system access including user management and platform analytics.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely! We use enterprise-grade security with JWT authentication, role-based access control (RBAC), PostgreSQL database with row-level security, and encrypted data transmission. Your learning data is protected at all levels.',
  },
  {
    question: 'Can I access the platform on mobile devices?',
    answer: 'Yes! InternLMS is fully responsive and works beautifully on all devices - desktop, tablet, and mobile. You can learn anywhere, anytime, with a consistent experience across all your devices.',
  },
  {
    question: 'How do I become a mentor?',
    answer: 'To become a mentor, register with the mentor role option. Your account will be placed in pending status until an admin approves it. Once approved, you can start creating courses and teaching students.',
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-8">
          {item.question}
        </span>
        <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-indigo-100 dark:bg-indigo-900/30 rotate-180' : ''}`}>
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Got Questions?
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about InternLMS
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@internlms.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
