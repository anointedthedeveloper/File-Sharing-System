import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Shield, Share2, Eye, Zap, Key, CheckCircle, ChevronDown, MessageSquare, ArrowRight, Lock, Clock, FileType } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';
import Slideshow from '../components/ui/Slideshow';
import heroImg from '../assets/hero.png';
import symbolImg from '../assets/symbol.png';

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  const features = [
    {
      icon: <UploadCloud className="w-10 h-10" />,
      title: "Frictionless Drop",
      desc: "Drag any file. Get a secure link. Zero onboarding required. It's the fastest way to move data across the web.",
      accent: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Ironclad Gates",
      desc: "Apply cryptographic password locks. Ensure only the eyes you authorize ever see your files.",
      accent: "from-indigo-500 to-violet-500"
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "Auto-Destruction",
      desc: "Set precise expiry nodes. 1 hour, 24 hours, or 7 days. Files wipe permanently, leaving no trace.",
      accent: "from-fuchsia-500 to-pink-500"
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Velocity Tuned",
      desc: "Optimized chunked uploads max out your bandwidth. Experience unthrottled gigabit transfers.",
      accent: "from-sky-400 to-blue-500"
    },
    {
      icon: <FileType className="w-10 h-10" />,
      title: "In-Browser Previews",
      desc: "Stream videos, play audio, and inspect documents without downloading. Immediate gratification.",
      accent: "from-purple-500 to-indigo-400"
    },
    {
      icon: <Share2 className="w-10 h-10" />,
      title: "QR Code Handoff",
      desc: "Bridge desktop to mobile instantly. Scan the auto-generated QR and download directly to your phone.",
      accent: "from-cyan-400 to-teal-400"
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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      quote: "The interface is gorgeous. Being able to set password gates and scan QR codes on my phone is incredibly smooth.",
      author: "Marcus Chen",
      role: "Senior Product Designer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
    },
    {
      quote: "We ship design assets to clients daily. Auto-expiry links mean nothing lingers on the internet longer than it should.",
      author: "Elena Voss",
      role: "Creative Director",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    }
  ];

  const showcaseSlides = [
    {
      content: (
        <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12 items-center min-h-[340px]">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full" />
            <motion.img 
              src={heroImg} 
              alt="Instant sharing" 
              className="w-full max-w-[280px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative z-10" 
              animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
            />
          </div>
          <div className="text-left space-y-4">
            <span className="section-badge"><Zap className="w-3.5 h-3.5" /> Lightning fast</span>
            <h3 className="text-3xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>Drop. Link. Done.</h3>
            <p className="text-base leading-relaxed font-medium text-[var(--text-secondary)]">Guest uploads need no account. Your files get a secure link in seconds — optimized for speed on any connection.</p>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12 items-center min-h-[340px]">
          <div className="flex justify-center order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full" />
            <div className="w-56 h-56 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)] relative z-10 border border-white/10 backdrop-blur-xl">
              <Shield className="w-24 h-24 text-white" />
            </div>
          </div>
          <div className="text-left space-y-4 order-1 md:order-2">
            <span className="section-badge"><Shield className="w-3.5 h-3.5" /> Hardened</span>
            <h3 className="text-3xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>Locks, timers, wipe.</h3>
            <p className="text-base leading-relaxed font-medium text-[var(--text-secondary)]">Password gates, signed download tokens, and auto-expiry nodes keep your data under your rules — not ours.</p>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12 items-center min-h-[340px]">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full" />
            <img src={symbolImg} alt="QR sharing" className="w-48 h-48 object-contain rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 bg-black/40 backdrop-blur-xl border border-white/10 relative z-10" />
          </div>
          <div className="text-left space-y-4">
            <span className="section-badge"><Share2 className="w-3.5 h-3.5" /> Every device</span>
            <h3 className="text-3xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>QR-ready sharing</h3>
            <p className="text-base leading-relaxed font-medium text-[var(--text-secondary)]">Scan from phone to desktop in one motion. Preview images, PDFs, video, and audio without leaving the browser.</p>
          </div>
        </div>
      ),
    },
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
      title="Sharing It - Cinematic Secure File Sharing"
      description="Anobyte software helps you transfer files online free, share files securely, and enjoy an Airdrop-style experience for photos, docs, and media with auto-expiring links."
    >
      
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[100svh] flex flex-col justify-center pt-24 pb-16">
        {/* Cinematic depth elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-base)] to-[var(--bg-base)] pointer-events-none z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)] rounded-full blur-[150px] opacity-[0.08] pointer-events-none mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT: Text + CTAs */}
            <div className="space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="section-badge inline-flex shadow-[0_0_20px_rgba(37,99,235,0.2)] border-blue-500/30 text-blue-500 dark:text-blue-400 bg-blue-500/10"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Next-Gen File Delivery</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter font-display leading-[1.05]"
                style={{ color: 'var(--text-primary)' }}
              >
                Share Files{' '}
                <br className="hidden sm:block" />
                <span className="relative inline-block mt-2">
                  <span className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] opacity-20 blur-xl rounded-lg" />
                  <span className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">Instantly.</span>
                </span>
                <br />
                <span className="text-[var(--text-secondary)]">Securely.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg sm:text-xl font-medium max-w-lg leading-relaxed text-[var(--text-secondary)]"
              >
                Send files to anyone, anywhere — in seconds. No surveillance, no ads, no friction. Just drop, share, and go.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-4"
              >
                <Link to="/upload" className="btn-primary w-full sm:w-auto !rounded-full !px-10 !py-4.5 text-lg">
                  <span>Open Upload Bay</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#features" className="btn-ghost w-full sm:w-auto !rounded-full !px-10 !py-4.5 text-lg">
                  Explore Architecture
                </a>
              </motion.div>
            </div>

            {/* RIGHT: Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center lg:justify-end"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-[100px]" />
              <motion.img
                src={heroImg}
                alt="Sharing It App Interface"
                className="w-full max-w-[500px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative z-10"
                animate={{
                  y: [0, -20, 0],
                  rotateZ: [0, 2, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="features" className="py-24 sm:py-32 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-20">
            <span className="section-badge tracking-[0.3em]">The Paradigm</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] font-display tracking-tight leading-tight">
              Built for <span className="text-[var(--text-secondary)] italic font-light">velocity.</span><br/>
              Engineered for <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">privacy.</span>
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Zero Friction",
                desc: "No account creation, no email verification, no bloated onboarding. Just drop and go.",
                bg: "from-blue-500/10 to-transparent",
                color: "text-blue-500"
              },
              {
                icon: <Share2 className="w-8 h-8" />,
                title: "Maximum Speed",
                desc: "Optimized chunked delivery networks ensure your files transfer at the absolute limit of your bandwidth.",
                bg: "from-indigo-500/10 to-transparent",
                color: "text-indigo-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Privacy by Default",
                desc: "We don't track your data or index your files. What you share is encrypted, delivered, and permanently wiped.",
                bg: "from-cyan-500/10 to-transparent",
                color: "text-cyan-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-8 sm:p-10 rounded-[2.5rem] glass-card overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${item.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--bg-elevated)] shadow-lg mb-8 ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] font-display mb-4">
                    {item.title}
                  </h3>
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SHOWCASE SLIDESHOW */}
      <section className="py-24 sm:py-32 relative overflow-hidden bg-[var(--bg-elevated)] border-y border-[var(--border-strong)]">
        <div className="absolute inset-0 opacity-30 bg-grid-pattern pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
              A cinematic sharing experience
            </h2>
          </div>
          <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl p-2 bg-[var(--bg-muted)]/50 backdrop-blur-3xl border-[var(--border-strong)]">
            <Slideshow slides={showcaseSlides} variant="hero" interval={6000} />
          </div>
        </div>
      </section>

      {/* DETAILED FEATURES */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-2xl mx-auto mb-20">
            <span className="section-badge">Toolkit</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-display tracking-tight">
              Powerful primitives.
            </h2>
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
                className="p-8 rounded-[2rem] glass-card glass-card-hover text-left group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.accent} opacity-5 blur-[50px] group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`inline-flex mb-6 p-4 rounded-2xl bg-[var(--bg-elevated)] shadow-sm text-transparent bg-clip-text bg-gradient-to-br ${feat.accent}`}>
                    {React.cloneElement(feat.icon, { className: "w-8 h-8 text-[var(--text-primary)] group-hover:scale-110 transition-transform duration-500" })}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] font-display mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-base)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--accent)] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-[var(--text-primary)] tracking-tight leading-tight mb-8">
              Stop fighting <br/>
              <span className="text-[var(--text-muted)] italic font-light">with file sharing.</span>
            </h2>
            <Link to="/upload" className="btn-primary !rounded-full !px-12 !py-5 text-xl shadow-[0_20px_50px_-10px_var(--accent-glow)] hover:shadow-[0_30px_60px_-15px_var(--accent-glow)]">
              Start sharing now
            </Link>
          </motion.div>
        </div>
      </section>

    </LayoutContainer>
  );
}
