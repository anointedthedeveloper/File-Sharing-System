import React, { useState } from 'react';
import { Mail, MessageSquare, Globe, Send, Loader2, CheckCircle, Network, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function Contact() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Incomplete telemetry.', 'error');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    showToast('Signal transmitted successfully.', 'success');
  };

  return (
    <LayoutContainer title="Communications - Sharing It">
      <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32 relative">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--accent)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center space-y-6 mb-20 relative z-10">
          <span className="section-badge tracking-[0.3em]">Comms Channel</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[var(--text-primary)] font-display tracking-tight leading-tight">
            Initialize Contact
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
            Direct line to the architectural team. Secure your inquiries regarding deployment, infrastructure, or bespoke integrations.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-base)]">
              <h3 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-8">Uplink Vectors</h3>
              <div className="space-y-6">
                {[
                  { icon: Mail, title: 'Direct Transmission', desc: 'support@sharingit.anobyte.online', link: 'mailto:support@sharingit.anobyte.online' },
                  { icon: MessageSquare, title: 'Network Chatter', desc: '@SharingItApp', link: 'https://twitter.com' },
                  { icon: Globe, title: 'Central Hub', desc: 'sharingit.anobyte.online', link: 'https://sharingit.anobyte.online' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-[var(--bg-muted)] border border-[var(--border-strong)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[var(--accent)]/10 group-hover:border-[var(--accent)]/30 transition-all duration-300">
                      <item.icon className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-1">{item.title}</h4>
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors inline-block">{item.desc}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-muted)]/50 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-[var(--text-primary)]">Secure Protocol Active</span>
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed">
                All communications are routed through our encrypted pipeline. Your metadata remains secure.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 border-[var(--border-strong)] shadow-premium-hover bg-[var(--bg-elevated)] min-h-[500px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 blur-[50px] rounded-bl-full" />
              
              {submitted ? (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold font-display text-[var(--text-primary)]">Signal Received.</h3>
                    <p className="text-sm font-medium text-[var(--text-secondary)] max-w-sm mx-auto">
                      Your query is in the queue. Our engineers will respond to your assigned vector shortly.
                    </p>
                  </div>
                  <button onClick={() => { setSubmitted(false); setFormData({ name:'', email:'', subject:'', message:'' }); }} className="btn-ghost !rounded-full !px-8 mt-4">
                    Send Additional Telemetry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">Operator Designation</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input text-sm" placeholder="Identifier" required disabled={loading} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">Return Vector</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input text-sm" placeholder="comms@domain.com" required disabled={loading} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">Classification</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-input text-sm" placeholder="e.g. Infrastructure upgrade" disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">Payload</label>
                    <textarea name="message" rows="5" value={formData.message} onChange={handleChange} className="form-input text-sm resize-none" placeholder="Enter transmission details..." required disabled={loading} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full !py-4.5 !rounded-2xl text-base tracking-wide mt-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Network className="w-5 h-5" /> <span>Transmit Signal</span></>}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </LayoutContainer>
  );
}
