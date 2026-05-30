import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Shield, Share2, Zap, Clock, QrCode, CheckCircle, ChevronDown, ArrowRight, Wifi, Lock, FileType } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';
import Slideshow from '../components/ui/Slideshow';
import heroImg from '../assets/hero.png';
import symbolImg from '../assets/symbol.png';

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  const features = [
    {
      icon: <UploadCloud className="w-8 h-8" />,
      title: "Easy Upload",
      desc: "Drag and drop any file. Get a shareable link in seconds. No account needed.",
      accent: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Password Protection",
      desc: "Add a password to your file link so only the people you trust can download it.",
      accent: "from-indigo-500 to-violet-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Auto-Expiry",
      desc: "Choose when your link expires — 1 hour, 24 hours, or 7 days. After that, it's gone for good.",
      accent: "from-fuchsia-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      desc: "Files upload and download at full speed. No throttling, no waiting.",
      accent: "from-sky-400 to-blue-500"
    },
    {
      icon: <FileType className="w-8 h-8" />,
      title: "Preview Without Downloading",
      desc: "View images, videos, PDFs, and audio directly in your browser before downloading.",
      accent: "from-purple-500 to-indigo-400"
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR Code Sharing",
      desc: "Every file gets a QR code. Scan it with your phone to download instantly — no typing needed.",
      accent: "from-cyan-400 to-teal-400"
    }
  ];

  const steps = [
    { number: "01", title: "Pick Your Files", desc: "Select files from your device or drag them into the upload area. Works without an account." },
    { number: "02", title: "Set Your Options", desc: "Choose an expiry time and optionally add a password to protect your download link." },
    { number: "03", title: "Share Your Link", desc: "Copy the link, email it, or show the QR code — whoever has it can download your file." }
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
            <span className="section-badge"><Zap className="w-3.5 h-3.5" /> Upload in seconds</span>
            <h3 className="text-3xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>Drop it. Link it. Done.</h3>
            <p className="text-base leading-relaxed font-medium text-[var(--text-secondary)]">No sign-up required for guests. Upload a file and get a shareable link immediately — optimized for speed on any device.</p>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12 items-center min-h-[340px]">
          <div className="flex justify-center order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full" />
            <div className="w-56 h-56 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)] relative z-10 border border-white/10">
              <Shield className="w-24 h-24 text-white" />
            </div>
          </div>
          <div className="text-left space-y-4 order-1 md:order-2">
            <span className="section-badge"><Shield className="w-3.5 h-3.5" /> Stay in control</span>
            <h3 className="text-3xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>Your rules, your file.</h3>
            <p className="text-base leading-relaxed font-medium text-[var(--text-secondary)]">Add a password, pick an expiry time, and your file link automatically stops working when you want it to.</p>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12 items-center min-h-[340px]">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full" />
            <img src={symbolImg} alt="QR code sharing" className="w-48 h-48 object-contain rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 bg-black/40 backdrop-blur-xl border border-white/10 relative z-10" />
          </div>
          <div className="text-left space-y-4">
            <span className="section-badge"><QrCode className="w-3.5 h-3.5" /> Scan from your phone</span>
            <h3 className="text-3xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>QR code included</h3>
            <p className="text-base leading-relaxed font-medium text-[var(--text-secondary)]">Every file gets a QR code automatically. Just point your phone camera at the screen and download straight to your device.</p>
          </div>
        </div>
      ),
    },
  ];

  const faqs = [
    {
      q: "Do I need to create an account?",
      a: "No! Anyone can upload and share files without signing up. Creating a free account just gives you extra benefits like a dashboard to manage your files, larger upload limits, and download tracking."
    },
    {
      q: "How secure is Sharing It?",
      a: "Your files are stored securely and links can be password-protected. You can also set an expiry time, after which the link stops working and the file is deleted — leaving no trace."
    },
    {
      q: "Can I delete a file after sharing?",
      a: "Yes. If you have an account, your Dashboard shows all your shared files. You can delete them at any time, check how many times they've been downloaded, or copy the link again."
    },
    {
      q: "How big can my files be?",
      a: "Guest users can upload files up to 50 MB. Signed-in users can upload up to 1 GB per file."
    },
    {
      q: "What is Quick Share?",
      a: "Quick Share lets you send files directly from one device to another in real time — like AirDrop but for any browser. Both devices just need to visit the Quick Share page and use the same room code."
    }
  ];

  return (
    <LayoutContainer
      title="Sharing It — Free Secure File Sharing"
      description="Share files with anyone in seconds. No account needed. Add a password, set an expiry, and get a shareable link or QR code instantly."
    >

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[100svh] flex flex-col justify-center pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-base)] to-[var(--bg-base)] pointer-events-none z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)] rounded-full blur-[150px] opacity-[0.08] pointer-events-none mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="section-badge inline-flex shadow-[0_0_20px_rgba(37,99,235,0.2)] border-blue-500/30 text-blue-500 dark:text-blue-400 bg-blue-500/10"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Free File Sharing — No Sign-Up Needed</span>
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
                Upload any file, get a shareable link or QR code, and control exactly who can access it and for how long. No account required.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-4"
              >
                <Link to="/upload" className="btn-primary w-full sm:w-auto !rounded-full !px-10 !py-4 text-lg">
                  <span>Start Sharing</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#how-it-works" className="btn-ghost w-full sm:w-auto !rounded-full !px-10 !py-4 text-lg">
                  See How It Works
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex items-center gap-6 pt-2"
              >
                {[
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, label: "No account needed" },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, label: "QR code included" },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, label: "Auto-expiry links" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]">
                    {item.icon} {item.label}
                  </div>
                ))}
              </motion.div>
            </div>

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
                animate={{ y: [0, -20, 0], rotateZ: [0, 2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 sm:py-32 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
            <span className="section-badge">3 Simple Steps</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-display tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-[var(--text-secondary)] font-medium">
              Sharing a file takes less than 30 seconds, start to finish.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative p-8 rounded-[2.5rem] glass-card text-left group"
              >
                <div className="text-6xl font-extrabold font-display text-[var(--accent)]/20 mb-4 group-hover:text-[var(--accent)]/30 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] font-display mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="features" className="py-24 sm:py-32 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-20">
            <span className="section-badge">Why Sharing It?</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] font-display tracking-tight leading-tight">
              Fast. <span className="text-[var(--text-secondary)] italic font-light">Secure.</span>{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Simple.</span>
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
                title: "No Sign-Up Required",
                desc: "Just pick a file and share. No forms, no email verification, no account creation needed.",
                bg: "from-blue-500/10 to-transparent",
                color: "text-blue-500"
              },
              {
                icon: <Share2 className="w-8 h-8" />,
                title: "Works on Any Device",
                desc: "Share from your laptop, phone, or tablet. Recipients can open links on any device too.",
                bg: "from-indigo-500/10 to-transparent",
                color: "text-indigo-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "You Stay in Control",
                desc: "Add passwords, set expiry times, and delete files whenever you want. Your files, your rules.",
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
              Everything you need to share files
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
            <span className="section-badge">Features</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-display tracking-tight">
              Everything included, nothing extra.
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
                  <div className={`inline-flex mb-6 p-4 rounded-2xl bg-[var(--bg-elevated)] shadow-sm`}>
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

      {/* QUICK SHARE CALLOUT */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden border-[var(--border-strong)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent-secondary)]/5 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mx-auto shadow-lg">
                <Wifi className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--text-primary)]">
                Need to share right now?
              </h3>
              <p className="text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
                Use Quick Share to send files directly from one device to another in real time — no upload, no link, no waiting. Like AirDrop, but for any browser.
              </p>
              <Link to="/quick-share" className="btn-primary !rounded-full !px-10 !py-4 text-base inline-flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Try Quick Share
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="section-badge">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden border-[var(--border-strong)]"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-[var(--text-primary)] tracking-tight leading-tight mb-6">
              Ready to share?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] font-medium mb-10">
              It's free, it takes 30 seconds, and no account is needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/upload" className="btn-primary !rounded-full !px-12 !py-5 text-xl shadow-[0_20px_50px_-10px_var(--accent-glow)] hover:shadow-[0_30px_60px_-15px_var(--accent-glow)]">
                Start Sharing Now
              </Link>
              <Link to="/auth?tab=register" className="btn-ghost !rounded-full !px-10 !py-5 text-base">
                Create a Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </LayoutContainer>
  );
}
