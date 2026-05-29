import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Shield, Zap, UploadCloud, Share2, Lock, FileText, Users, Clock, Globe, Smartphone, Database, CheckCircle, X } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: 'general', name: 'General', icon: <HelpCircle className="w-6 h-6" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-6 h-6" /> },
    { id: 'features', name: 'Features', icon: <Zap className="w-6 h-6" /> },
    { id: 'upload', name: 'Upload', icon: <UploadCloud className="w-6 h-6" /> },
    { id: 'sharing', name: 'Sharing', icon: <Share2 className="w-6 h-6" /> },
  ];

  const faqs = {
    general: [
      {
        question: "What is Sharing It?",
        answer: "Sharing It is a secure, fast, and free file sharing service that allows you to transfer files online without any size limitations. Built by Anobyte Software, it provides an Airdrop-style experience for documents, photos, and media with enterprise-grade security."
      },
      {
        question: "Is Sharing It really free?",
        answer: "Yes! Sharing It offers a generous free tier that allows you to share files without any cost. For users who need advanced features like larger storage limits, custom branding, and priority support, we offer premium plans."
      },
      {
        question: "Do I need to create an account?",
        answer: "No, you can share files without creating an account. However, creating a free account gives you access to additional features like file management, sharing history, and increased storage limits."
      },
      {
        question: "What file types can I share?",
        answer: "You can share any file type including documents (PDF, DOC, TXT), images (JPG, PNG, GIF), videos (MP4, MOV), audio files (MP3, WAV), archives (ZIP, RAR), and more. There are no restrictions on file types."
      },
      {
        question: "Is there a file size limit?",
        answer: "Free users can share files up to 5GB. Premium users enjoy unlimited file sizes with even faster transfer speeds. Our chunked upload system ensures large files transfer smoothly."
      },
    ],
    security: [
      {
        question: "How secure is my data?",
        answer: "Your files are encrypted using AES-256 encryption during transfer and storage. We use end-to-end encryption for sensitive files, and our servers are hosted in secure, SOC 2 compliant data centers."
      },
      {
        question: "Can I password protect my shares?",
        answer: "Yes, you can add optional password protection to any file share. Only recipients with the correct password can access your files. You can also set expiration dates for additional security."
      },
      {
        question: "Who can see my files?",
        answer: "Only people with the share link (and password, if set) can access your files. Your files are private by default and are not indexed by search engines. You have full control over who accesses your content."
      },
      {
        question: "Do you store my files permanently?",
        answer: "Files are stored based on your plan settings. Free accounts have a 7-day retention period, while premium users can choose from 30-day, 90-day, or permanent storage options. You can delete files at any time."
      },
      {
        question: "Is my data shared with third parties?",
        answer: "Never. We do not sell, rent, or share your data with third parties. Your privacy is our top priority. We only use your data to provide the file sharing service."
      },
    ],
    features: [
      {
        question: "What is real-time tracking?",
        answer: "Our real-time tracking feature shows you the exact progress of your file uploads and downloads. You can see transfer speeds, time remaining, and chunk-by-chunk progress with beautiful visual indicators."
      },
      {
        question: "How does QR code sharing work?",
        answer: "Every share generates a unique QR code. Recipients can scan the code with their smartphone camera to instantly access the download link. Perfect for quick transfers between devices."
      },
      {
        question: "Can I track who downloads my files?",
        answer: "Yes, premium users get detailed analytics showing when files were downloaded, from what location, and by whom. You can also set download limits and expiration dates."
      },
      {
        question: "What is the workspace feature?",
        answer: "The workspace is your personal dashboard where you can manage all your shared files, view download history, organize files into folders, and access advanced sharing options."
      },
      {
        question: "Can I customize my share links?",
        answer: "Premium users can create custom, branded share links with their own domain. This is perfect for businesses and professionals who want a consistent brand experience."
      },
    ],
    upload: [
      {
        question: "How do I upload files?",
        answer: "Simply drag and drop your files into the upload zone, or click to browse your computer. Our intelligent upload system handles multiple files simultaneously and resumes automatically if interrupted."
      },
      {
        question: "What happens if my upload is interrupted?",
        answer: "Our chunked upload system automatically resumes interrupted uploads from where they left off. You won't lose progress even if you close the browser or lose internet connection."
      },
      {
        question: "Can I upload multiple files at once?",
        answer: "Absolutely! You can upload multiple files simultaneously. Our parallel upload system maximizes your bandwidth for the fastest possible transfer speeds."
      },
      {
        question: "How fast are the uploads?",
        answer: "Upload speed depends on your internet connection, but our optimized servers ensure you get maximum speeds. Most users experience speeds close to their maximum bandwidth capacity."
      },
      {
        question: "Can I upload from my phone?",
        answer: "Yes! Sharing It is fully responsive and works perfectly on mobile devices. You can upload files directly from your phone's camera roll or file manager."
      },
    ],
    sharing: [
      {
        question: "How do I share files?",
        answer: "After uploading, you'll get a unique share link. Simply copy this link and send it to anyone via email, messaging apps, or social media. Recipients can download the files instantly."
      },
      {
        question: "Can recipients download without an account?",
        answer: "Yes, recipients can download files without creating an account. They just need the share link (and password if you set one). No sign-up required."
      },
      {
        question: "How long do share links last?",
        answer: "You can set custom expiration dates for your shares. Free links last 7 days by default, while premium users can choose from 30 days, 90 days, or never expire."
      },
      {
        question: "Can I revoke a share link?",
        answer: "Yes, you can revoke or delete any share link at any time from your dashboard. Once revoked, the link becomes invalid and no one can access the files."
      },
      {
        question: "Can I share with multiple people?",
        answer: "Yes, share links can be accessed by anyone who has them. There's no limit to how many people can download your files. For sensitive content, consider using password protection."
      },
    ],
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <LayoutContainer
      title="FAQ - Sharing It by Anobyte Software"
      description="Find answers to common questions about our secure file sharing service. Learn about features, security, upload limits, and more."
    >
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.5)] mb-6"
          >
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-300/90 max-w-2xl mx-auto">
            Everything you need to know about Sharing It. Can't find your answer? Contact our support team.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenFaq(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <AnimatePresence mode="wait">
            {faqs[activeCategory].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative overflow-hidden rounded-2xl border bg-slate-900/75 backdrop-blur-xl ${
                  openFaq === index ? 'border-blue-400/50 shadow-[0_0_40px_-10px_rgba(56,189,248,0.3)]' : 'border-white/10'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <p className="text-slate-300/90 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-sky-400/10 p-8 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.1),_transparent_70%)]" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
              <p className="text-slate-300/90 mb-6">Our support team is here to help you with any questions or issues.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white font-semibold shadow-lg shadow-blue-500/25"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Support</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </LayoutContainer>
  );
}
