import React, { useState } from 'react';
import { Mail, MessageSquare, Globe, Send, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function Contact() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all mandatory fields.', 'error');
      return;
    }

    setLoading(true);
    // Simulate submission delay
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    showToast('Your message has been dispatched successfully!', 'success');
  };

  return (
    <LayoutContainer 
      title="Contact Support - Sharing It"
      description="Connect with the Sharing It team for feedback, questions, or storage inquiries."
    >
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
            Get in Touch
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have questions about auto-expiry nodes, storage scales, or integration modules? We are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Sidebar Directories Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 space-y-6">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Support Channels</h3>
              
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">General Enquiries</h4>
                    <a href="mailto:support@sharingit.app" className="text-sm text-slate-700 dark:text-slate-300 font-semibold hover:underline">
                      support@sharingit.app
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Live Updates</h4>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-sm text-slate-700 dark:text-slate-300 font-semibold hover:underline">
                      @SharingItApp
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Developer Hub</h4>
                    <a href="https://sharingit.app" target="_blank" rel="noreferrer" className="text-sm text-slate-700 dark:text-slate-300 font-semibold hover:underline">
                      sharingit.app
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Interactive Contact Form */}
          <div className="lg:col-span-8">
            <div className="p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
              
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30 text-emerald-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Message Transmitted!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for connecting with us. A portfolio architect will review your parameters and follow up shortly.
                  </p>
                  <button 
                    onClick={() => { setSubmitted(false); setFormData({ name:'', email:'', subject:'', message:'' }); }}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="form-input text-sm" 
                        placeholder="Alex Dev"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="form-input text-sm" 
                        placeholder="you@example.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange}
                      className="form-input text-sm" 
                      placeholder="Enterprise storage expansion"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message Description *</label>
                    <textarea 
                      name="message" 
                      rows="5"
                      value={formData.message} 
                      onChange={handleChange}
                      className="form-input text-sm" 
                      placeholder="Draft your query here..."
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching parameters...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Dispatch Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </LayoutContainer>
  );
}
