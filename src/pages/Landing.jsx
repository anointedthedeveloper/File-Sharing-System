import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Shield, Share2, Eye, Zap, Key, CheckCircle, ChevronDown, MessageSquare, ArrowRight } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';
import heroImg from '../assets/hero.png';

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const features = [
    {
      icon: <UploadCloud className="w-6 h-6 text-blue-500" />,
      title: "Drag & Drop Upload",
      desc: "Simplicity at its core. Grab any file, throw it in, and let us handle the rest. Instantly."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Secure Access Control",
      desc: "Protect your links with optional passkeys. Only the recipients you choose get access."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: "Real-time Tracking",
      desc: "Watch your files upload chunk by chunk with gorgeous progress indicators."
    },
    {
      icon: <Share2 className="w-6 h-6 text-blue-500" />,
      title: "QR Code Sharing",
      desc: "Transfer files to mobile devices in a snap. Point your camera, download, and go."
    },
    {
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      title: "File Previews",
      desc: "Preview documents, PDFs, images, text, audio, and videos right in the browser."
    },
    {
      icon: <Key className="w-6 h-6 text-blue-500" />,
      title: "Auto-Expiry Nodes",
      desc: "Set files to automatically self-destruct after download, 1 hour, 1 day, or 7 days."
    }
  ];

  const steps = [
    { number: "01", title: "Drop Files", desc: "Select files or drag them into the upload bay. Guest uploads are fully supported." },
    { number: "02", title: "Set Rules", desc: "Decide when your link expires or add password locks to encrypt downloads." },
    { number: "03", title: "Share Instantly", desc: "Distribute your secure link, email it directly, or display the visual QR code." }
  ];

  const testimonials = [
    {
      quote: "Sharing It has replaced heavy file systems for our engineering team. Quick shares, auto-destruction, and neat previews.",
      author: "Sarah Jenkins",
      role: "Lead Front-end Architect",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "The interface is gorgeous. Being able to set password gates and scan QR codes on my phone is incredibly smooth.",
      author: "Marcus Chen",
      role: "Senior Product Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    }
  ];

  const faqs = [
    {
      q: "How secure is Sharing It?",
      a: "Sharing It prioritizes your privacy. In production, your files are stored in secure Supabase Storage buckets using unique generated file names. Share links can be optional password-locked and auto-expired, deleting records entirely upon reaching limits."
    },
    {
      q: "Can I delete a file after sharing it?",
      a: "Absolutely! Authenticated users have access to a personal Dashboard tracking share histories. You can review download metrics, check timer statuses, copy links, or delete files permanently at any time."
    },
    {
      q: "Is there a file size limit?",
      a: "Guest shares are capped at 50MB per file to maintain blazing quick bandwidth. Logged-in users enjoy larger boundaries up to 1GB per file upload."
    }
  ];

  return (
    <LayoutContainer 
      title="Sharing It - Share Files Instantly, Securely, Effortlessly"
      description="Send files to anyone, anywhere in seconds. Secure, auto-expiring file sharing with password protection and QR codes."
    >
      
      {/* 1. HERO SECTION — two-column layout matching reference image */}
      <section className="relative overflow-hidden pt-4 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-12">

        {/* Soft background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-100/60 dark:bg-blue-900/10 blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-100/50 dark:bg-indigo-900/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* LEFT: Text + CTAs */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 text-left">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Next-Gen File Sharing Platform</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.1]"
              >
                Share Files{' '}
                <span className="text-blue-600 dark:text-blue-400">Instantly.</span>
                <br />
                Securely.
                <br />
                Effortlessly.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed"
              >
                Send files to anyone, anywhere — in seconds. No sign-up required. Just drop, share, and go.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1 sm:pt-2"
              >
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Share Files Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Create Free Account
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-5 pt-2"
              >
                {[
                  { icon: <Shield className="w-4 h-4 text-blue-500" />, label: 'End-to-end secure' },
                  { icon: <Zap className="w-4 h-4 text-blue-500" />, label: 'No sign-up needed' },
                  { icon: <Key className="w-4 h-4 text-blue-500" />, label: 'Auto-expires' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {icon}
                    <span>{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 60, damping: 16 }}
              className="relative flex items-center justify-center order-2 lg:order-1"
            >
              <img
                src={heroImg}
                alt="Sharing It — share files instantly between devices"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl rounded-3xl object-contain drop-shadow-2xl"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/20 border-y border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              How Sharing It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Share critical files in three fluid, simple steps with complete local encryption controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between h-64 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div>
                  <span className="font-display font-extrabold text-4xl sm:text-5xl text-blue-600/10 dark:text-blue-400/10 group-hover:text-blue-500/20 transition-colors">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Everything You Need to Share
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowered with tools to facilitate lightning quick uploads, custom timers, and direct phone downloads.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {features.map((feat) => (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                className="p-6 sm:p-8 rounded-3xl glass-card glass-card-hover border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center border border-blue-100/30 dark:border-blue-900/30">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 4. SECURITY HIGHLIGHTS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-[40px] max-w-7xl mx-auto px-6 sm:px-12 my-12 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent z-0" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Hardened Storage Core</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Your Files, Your Control. Locked Forever.
            </h2>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              We encrypt file names in storage and grant download permissions using signed tokens. Expired files are scrubbed from servers to protect confidentiality.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "Optional SHA-256 download passkeys",
                "Temporary access link signatures",
                "Full automated cron cleanup",
                "100% compliant data control policies"
              ].map((bullet) => (
                <li key={bullet} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm aspect-square bg-white dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-premium dark:shadow-premium-dark">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Storage Node Active</span>
                </div>
                <Shield className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>

              <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 text-left py-4 flex-grow">
                <p className="text-blue-600 dark:text-blue-400"># encrypting file_hash</p>
                <p className="text-slate-400 dark:text-slate-600">&gt; generating security signature...</p>
                <p><span className="text-emerald-600 dark:text-emerald-400">passphrase:</span> "sha256-verified-key"</p>
                <p><span className="text-emerald-600 dark:text-emerald-400">expiry_node:</span> "self_destruct_active"</p>
                <p className="text-slate-400 dark:text-slate-600">&gt; credentials matching successful</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Security Level</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-display">100% Secure Storage</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 6. FAQ SECTION */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Got questions? We have compiled answers to help you get the most out of Sharing It.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-900/40 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Ready to share files beautifully?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Upload files as a guest instantly or sign up to preserve histories and unlock storage extensions.
          </p>
          <div className="pt-2">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Launch Share Panel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </LayoutContainer>
  );
}
