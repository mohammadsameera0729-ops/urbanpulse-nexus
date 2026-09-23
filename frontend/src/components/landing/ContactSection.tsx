import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare,
  Globe,
  Clock,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'Municipal Procurement',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-900 text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-brand-400" /> Get In Touch
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Connect with Our Smart City Specialists
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Have questions about deploying UrbanPulse Nexus for your city or municipal agency? Speak with our solution architects today.
          </p>
        </div>

        {/* 2 Column Layout: Info Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Address, Phone, Email & Social Icons */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Global Command Headquarters
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our team provides 24/7 technical assistance and municipal deployment consulting for government agencies worldwide.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                <div className="p-3 rounded-xl bg-brand-600/20 text-brand-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Office Address</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    UrbanPulse Nexus Tower, 500 Technology Plaza, Suite 1200<br />
                    San Francisco, CA 94107, USA
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Phone Support</h4>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    +1 (800) 555-URBAN / +1 (415) 890-4200
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    Mon - Fri: 24 Hours Emergency Desk Active
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                <div className="p-3 rounded-xl bg-sky-600/20 text-sky-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Email Enquiries</h4>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    contact@urbanpulse-nexus.gov.io
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Average response time: &lt; 2 Hours
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Follow UrbanPulse Nexus
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="#twitter"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-brand-600 hover:border-brand-500 hover:text-white flex items-center justify-center text-slate-300 transition-all"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#linkedin"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-brand-600 hover:border-brand-500 hover:text-white flex items-center justify-center text-slate-300 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#youtube"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-rose-600 hover:border-rose-500 hover:text-white flex items-center justify-center text-slate-300 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-8 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl relative overflow-hidden">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. A Smart City Solutions Specialist will review your request and contact you within 2 business hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', organization: '', subject: 'Municipal Procurement', message: '' });
                    }}
                    className="border-slate-700 text-white hover:bg-slate-800 mt-2"
                  >
                    Send Another Inquiry
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">Send Us a Message</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill in the details below and our technical advisors will get back to you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mayor Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Official Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@citygov.org"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Organization / Department */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">City / Organization</label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Dept of Transportation"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Inquiry Type</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                      >
                        <option value="Municipal Procurement">Municipal Procurement</option>
                        <option value="AI Traffic Integration">AI Traffic Integration</option>
                        <option value="GIS & Mapping Platform">GIS & Mapping Platform</option>
                        <option value="Citizen Portal Setup">Citizen Portal Setup</option>
                        <option value="Technical Partnership">Technical Partnership</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Message Details *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your city size, current infrastructure challenges, or desired platform capabilities..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    rightIcon={<Send className="w-4 h-4" />}
                    className="w-full shadow-lg shadow-brand-500/25 py-3.5 font-bold"
                  >
                    Submit Request
                  </Button>
                </form>
              )}
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
};
