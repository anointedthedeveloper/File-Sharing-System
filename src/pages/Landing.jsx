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
      icon: <UploadCloud className="w-12 h-12 text-blue-500" />,
      title: "Drag & Drop Upload",
      desc: "Simplicity at its core. Grab any file, throw it in, and let us handle the rest. Instantly."
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-500" />,
      title: "Secure Access Control",
      desc: "Protect your links with optional passkeys. Only the recipients you choose get access."
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-500" />,
      title: "Real-time Tracking",
      desc: "Watch your files upload chunk by chunk with gorgeous progress indicators."
    },
    {
      icon: <Share2 className="w-12 h-12 text-blue-500" />,
      title: "QR Code Sharing",
      desc: "Transfer files to mobile devices in a snap. Point your camera, download, and go."
    },
    {
      icon: <Eye className="w-12 h-12 text-blue-500" />,
      title: "File Previews",
      desc: "Preview documents, PDFs, images, text, audio, and videos right in the browser."
    },
    {
      icon: <Key className="w-12 h-12 text-blue-500" />,
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
      title="Sharing It by Anobyte Software - Transfer Files Online Free & Share Files Securely"
      description="Anobyte software helps you transfer files online free, share files securely, and enjoy an Airdrop-style experience for photos, docs, and media with auto-expiring links."
    >
      
      {/* 1. HERO SECTION - full viewport app-like first screen */}
      <section className="relative overflow-hidden min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] flex items-center py-8 sm:py-10 lg:py-12 border-b border-blue-100/60 dark:border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">

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
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Share Files Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="#features"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-full border border-blue-100 dark:border-blue-900/40 bg-white/80 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-blue-100 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  View Features
                </Link>
              </motion.div>

              {/* Trust badges - Technical */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-3 pt-2 flex-wrap"
              >
                {[
                  { icon: <Shield className="w-4 h-4" />, label: 'P2P Encrypted' },
                  { icon: <Zap className="w-4 h-4" />, label: 'Max Speed' },
                  { icon: <Key className="w-4 h-4" />, label: 'Auto-Wiped' },
                ].map(({ icon, label }) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                  >
                    {icon}
                    <span>{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Hero image with drop animation */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97, y: -50 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 60, damping: 16, duration: 0.8 }}
              className="relative flex items-center justify-center order-2 lg:order-1"
            >
              <motion.img
                src={heroImg}
                alt="Sharing It — share files instantly between devices"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl max-h-[42svh] sm:max-h-[48svh] lg:max-h-[62svh] object-contain drop-shadow-2xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 1.5. WHY CHOOSE SHARING IT */}
      <section className="py-20 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Why Choose Sharing It?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Unlike traditional cloud storage, we prioritize speed, privacy, and simplicity over account requirements and storage quotas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-12 h-12" />,
                title: "Zero Friction",
                desc: "No account creation, no email verification, no bloated onboarding. Just drop and go."
              },
              {
                icon: <Share2 className="w-12 h-12" />,
                title: "Speed Over Everything",
                desc: "Optimized peer-to-peer and edge network delivery means your files transfer at the absolute limit of your bandwidth."
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: "Privacy by Default",
                desc: "We don't track your data or index your files. What you share is encrypted, delivered, and permanently wiped."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
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
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between h-64 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-300 group shadow-lg hover:shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50"
              >
                <div>
                  <span className="font-display font-extrabold text-4xl sm:text-5xl bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-indigo-400 group-hover:to-sky-300 transition-all">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
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

      {/* 4. COMPARISON TABLE */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Sharing It vs Traditional Cloud Storage
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              See why modern teams choose Sharing It over Google Drive, Dropbox, and WeTransfer.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Google Drive</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Dropbox</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30">Sharing It</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Account Required", drive: "Yes", dropbox: "Yes", sharing: "No" },
                  { feature: "File Size Limit", drive: "5GB", dropbox: "2GB", sharing: "5GB (Free)" },
                  { feature: "Auto-Expiration", drive: "Manual", dropbox: "Manual", sharing: "Automatic" },
                  { feature: "End-to-End Encryption", drive: "Optional", dropbox: "Optional", sharing: "Default" },
                  { feature: "Password Protection", drive: "No", dropbox: "No", sharing: "Yes" },
                  { feature: "QR Code Sharing", drive: "No", dropbox: "No", sharing: "Yes" },
                  { feature: "File Previews", drive: "Limited", dropbox: "Limited", sharing: "Full" },
                  { feature: "Privacy Tracking", drive: "Yes", dropbox: "Yes", sharing: "None" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{row.drive}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{row.dropbox}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20">{row.sharing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. SECURITY HIGHLIGHTS */}
      <section className="py-20 bg-white/70 dark:bg-[#071327]/90 text-slate-900 dark:text-white rounded-[32px] max-w-7xl mx-auto px-6 sm:px-12 my-12 border border-blue-100/60 dark:border-blue-900/40 relative overflow-hidden shadow-premium dark:shadow-premium-dark">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),transparent_42%,rgba(14,165,233,0.08))] z-0" />
        
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

            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                "Optional SHA-256 download passkeys",
                "Temporary access link signatures",
                "Full automated cron cleanup",
                "100% compliant data control policies"
              ].map((bullet) => (
                <div key={bullet} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
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
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-blue-500/50 dark:border-blue-500/30 bg-white dark:bg-slate-900/60 shadow-lg shadow-blue-500/10'
                      : 'border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-900/40 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </motion.div>
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
                </motion.div>
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
