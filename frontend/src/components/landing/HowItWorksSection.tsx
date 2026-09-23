import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKFLOW_STEPS } from '../../data/landingData';
import { Smartphone, Cpu, Wrench, CheckCircle2, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

const stepIconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
  Cpu: <Cpu className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
  Wrench: <Wrench className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
  CheckCircle: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
};

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> End-To-End Automation Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How UrbanPulse Nexus Operates
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            From the moment a citizen submits a ticket to complete resolution, our automated AI engine drives seamless execution.
          </p>
        </div>

        {/* Desktop Connected Horizontal Timeline */}
        <div className="relative mb-12">
          {/* Connector Line behind steps */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(activeStep / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive ? 'scale-105' : 'hover:scale-102 opacity-90'
                  }`}
                >
                  <Card
                    className={`p-6 rounded-2xl border transition-all duration-300 h-full flex flex-col justify-between ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 border-brand-500 shadow-xl shadow-brand-500/10 ring-2 ring-brand-500/20'
                        : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Step Badge & Icon */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-colors ${
                            isActive
                              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                              : isPassed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isPassed ? <Check className="w-6 h-6 stroke-[3]" /> : stepIconMap[step.iconName]}
                        </div>

                        <span
                          className={`text-xs font-black font-mono px-3 py-1 rounded-full ${
                            isActive
                              ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          STEP 0{step.stepNumber}
                        </span>
                      </div>

                      {/* Step Header */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                          {step.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Bullet Highlights */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      {step.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step Visual Preview Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
                  Step {activeStep + 1} Deep Dive
                </span>
                <h4 className="text-2xl font-bold text-white">
                  {WORKFLOW_STEPS[activeStep].title} Workflow
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {WORKFLOW_STEPS[activeStep].description} Integrated with UrbanPulse Neural Dispatch engines for 100% data trace.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {WORKFLOW_STEPS[activeStep].details.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-sky-300"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Simulation Status</span>
                  <span className="text-emerald-400 font-bold">Active Engine</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-600/30 text-brand-400">
                      {stepIconMap[WORKFLOW_STEPS[activeStep].iconName]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{WORKFLOW_STEPS[activeStep].subtitle}</p>
                      <p className="text-[10px] text-slate-400">Latency: 42ms</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-400" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
