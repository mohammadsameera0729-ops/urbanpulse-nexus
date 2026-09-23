import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../../data/landingData';
import { Star, Quote, Sparkles, Building2, UserCheck, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50/70 dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Loved By Citizens & City Chiefs
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted Across Municipal Departments
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            See how UrbanPulse Nexus bridges the gap between residents and city operational crews.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Card className="h-full p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between rounded-3xl relative overflow-hidden">
                {/* Background quote icon watermark */}
                <Quote className="absolute top-4 right-4 w-16 h-16 text-slate-100 dark:text-slate-800/50 pointer-events-none -rotate-12" />

                <div className="space-y-5 relative z-10">
                  {/* Top Bar: User Type Pill + 5 Stars */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                      {testimonial.userType}
                    </span>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 relative z-10">
                  <Avatar
                    src={testimonial.avatar}
                    name={testimonial.name}
                    size="md"
                    className="ring-2 ring-brand-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400">
                      {testimonial.role}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {testimonial.organization}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
