import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Shield, Zap, UploadCloud, Share2, MessageSquare, Terminal } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: 'general', name: 'General', icon: <Terminal className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'features', name: 'Architecture', icon: <Zap className="w-4 h-4" /> },
    { id: 'upload', name: 'Payloads', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'sharing', name: 'Nodes', icon: <Share2 className="w-4 h-4" /> },
  ];

  const faqs = {
    general: [
      { q: "What is Sharing It?", a: "Sharing It is a cinematic, zero-friction file delivery protocol. Built by Anobyte, it provides an Airdrop-style experience engineered for speed, privacy, and aesthetic superiority." },
      { q: "Is the protocol free?", a: "Yes. The base tier is completely free for up to 50MB guest payloads. Authenticated operators receive 1GB limits." },
      { q: "Do I need clearance (an account)?", a: "No. Guest operations are fully supported. Authenticated accounts merely unlock expanded limits and a personal telemetry dashboard." },
      { q: "What payload types are supported?", a: "The protocol is agnostic. Documents, media, binaries, archives — if it has a file extension, we can transmit it." },
      { q: "Are there hard limits?", a: "Guest nodes cap at 50MB to preserve network velocity. Authenticated nodes push 1GB per payload." },
    ],
    security: [
      { q: "Is the data encrypted?", a: "Absolute. Payloads are encrypted via AES-256 during transit and rest. Our infrastructure is hosted within SOC-2 compliant facilities." },
      { q: "Can I enforce cryptographic locks?", a: "Yes. You can append passkeys to any node. Extraction is physically impossible without the correct sequence." },
      { q: "Are payloads indexed?", a: "Never. Nodes are invisible to search engines. Obscurity by default." },
      { q: "What is the data retention policy?", a: "Ephemeral. Payloads auto-destruct based on your parameters (1h, 24h, 7d). Once purged, the data is unrecoverable." },
      { q: "Do you harvest telemetry?", a: "Zero third-party tracking. We hold only the metadata required to operate the node." },
    ],
    features: [
      { q: "How does the UI track progress?", a: "Via real-time WebSocket updates, providing precise, chunk-by-chunk visualizations of the transfer." },
      { q: "What is the QR protocol?", a: "Instant optical bridging. Scan the generated QR matrix to bypass URL entry and extract directly to mobile." },
      { q: "Can I monitor extractions?", a: "Authenticated operators access a Dashboard that logs fetch counts and node statuses in real-time." },
      { q: "Do payloads require downloading to view?", a: "No. The interface features an in-browser hydration engine for media, PDFs, and text." },
      { q: "Is P2P supported?", a: "Yes. The 'Quick Share' module establishes a direct WebRTC tunnel between devices, bypassing cloud storage entirely." },
    ],
    upload: [
      { q: "How do I deploy a payload?", a: "Drag and drop the asset into the staging area, define your parameters, and initialize the broadcast." },
      { q: "Are concurrent deployments supported?", a: "Yes. The engine handles multiple streams simultaneously to saturate available bandwidth." },
      { q: "How fast is the network?", a: "We utilize distributed edge caches. Your deployment speed is bottlenecked solely by your local ISP." },
      { q: "Can I deploy via mobile?", a: "The interface is fully responsive. Select assets directly from your device's native file picker." },
      { q: "Does the system compress files?", a: "By default, raw images are compressed to optimize transit. You can disable this if absolute pixel-perfection is required. Binaries are never altered." },
    ],
    sharing: [
      { q: "How do I distribute the node?", a: "Copy the generated URL or display the QR code. The node is live instantly." },
      { q: "Do receivers need accounts?", a: "No. The extraction UI is entirely open to anyone holding the correct URL and passkey." },
      { q: "Can I revoke access?", a: "Authenticated operators can purge any active node from their Dashboard, instantly terminating all access." },
      { q: "What happens when a node expires?", a: "The URL returns a 404 response and the underlying data is wiped from our storage buckets." },
      { q: "Are concurrent extractions allowed?", a: "Yes. A single node can serve multiple receivers simultaneously until it expires." },
    ],
  };

  return (
    <LayoutContainer title="Knowledge Base - Sharing It">
      <div className="min-h-screen py-24 sm:py-32 px-6 lg:px-8 relative">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-6">
            <span className="section-badge tracking-[0.3em]">Knowledge Base</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
              Operational Directives
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium max-w-2xl mx-auto">
              Comprehensive documentation covering protocol mechanics, security parameters, and deployment strategies.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-lg'
                    : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {faqs[activeCategory].map((faq, index) => (
                <motion.div
                  key={`${activeCategory}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card rounded-[1.5rem] overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'border-[var(--accent)]/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-bold font-display text-[var(--text-primary)] pr-8">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${openFaq === index ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'bg-[var(--bg-muted)] border-[var(--border)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                      <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-8 pb-6 pt-0">
                          <div className="w-full h-px bg-[var(--border)] mb-4" />
                          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-20 text-center">
            <div className="inline-block p-8 rounded-[2rem] glass-card border-[var(--border-strong)] bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-muted)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 blur-[40px] rounded-full" />
              <h3 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-3 relative z-10">Unresolved anomalies?</h3>
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 relative z-10">Establish contact with our engineering team for bespoke support.</p>
              <a href="/contact" className="btn-primary !rounded-full relative z-10">
                <MessageSquare className="w-4 h-4" /> Initialize Contact
              </a>
            </div>
          </div>

        </div>
      </div>
    </LayoutContainer>
  );
}
