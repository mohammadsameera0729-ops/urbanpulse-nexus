import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { HelpCircle, Phone, Mail, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

export const HelpCenterPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does UrbanPulse AI categorize my reported complaint?',
      a: 'When you submit a complaint title or photo, our computer vision and natural language processing engine analyzes the visual patterns and keywords to assign the correct department (e.g. Public Works or Sanitation) with 96%+ accuracy.',
    },
    {
      q: 'What are the official municipal resolution SLA timelines?',
      a: 'Critical hazard tickets (like main water leaks or broken traffic signals) are dispatched within 2 hours and targeted for resolution within 24 hours. General pothole or streetlight repairs have a 48-72 hour SLA.',
    },
    {
      q: 'Can I track the progress of my complaint in real-time?',
      a: 'Yes! Navigate to "My Complaints" in your citizen portal. Each ticket features a live activity log showing crew assignment, diagnostic notes, and photo proof upon resolution.',
    },
    {
      q: 'How do I report an urgent life-threatening emergency?',
      a: 'For immediate life safety or fire emergencies, do NOT use this web platform. Call 911 or your local emergency dispatch service immediately.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Help Center & Emergency Contacts"
        subtitle="Frequently asked questions, citizen user guides, and direct support hotlines"
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search help articles, FAQs, guides..." />

      {/* Emergency Phone Directory Card */}
      <Card className="bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">Municipal Emergency Hotlines</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
              Water Main Break: <strong>1-800-555-WATER</strong> • Traffic Gridlock Dispatch: <strong>1-800-555-FLOW</strong>
            </p>
          </div>
        </div>
      </Card>

      {/* FAQ Accordions */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-brand-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-2 border-l-2 border-brand-500">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
