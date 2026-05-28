import React from 'react';
import { Shield, Server, Users, Award, CheckCircle } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function About() {
  const values = [
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      title: "Privacy First",
      desc: "We build systems that respect your storage limits and confidentiality, purging access points when expired."
    },
    {
      icon: <Server className="w-5 h-5 text-blue-500" />,
      title: "Resilient Infrastructure",
      desc: "Powered by Supabase's cloud PostgreSQL architectures and storage clusters to assure global availability."
    },
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      title: "Developer Focused",
      desc: "Designed to help developers share templates, mock archives, and visual images seamlessly."
    }
  ];

  return (
    <LayoutContainer 
      title="About Sharing It - Secure Auto-Expiring File Sharing"
      description="Learn about Sharing It's privacy-focused sharing, visual systems and secure credentials handling."
    >
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
            The Sharing It Vision
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Architecting the next-generation simple sharing node for developers, creators, and modern teams.
          </p>
        </div>

        {/* Vision details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 text-left">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Why We Built Sharing It
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              We realized that traditional file sharing platforms have become heavy, ad-ridden, and slow. Sharing a simple archive, document, or code template shouldn't require logging in, dodging popups, or leaving files permanently sitting on the cloud.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Sharing It was designed as a lightweight, beautiful SaaS alternative: dropping a file, picking rules, getting a sharing node, and having it auto-destruct to preserve storage space.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-bold font-display text-slate-900 dark:text-white">Core Commitments</h3>
            </div>
            
            <ul className="space-y-3.5">
              {[
                "Zero third-party advertisement structures",
                "Self-destruct automation policies",
                "Optional SHA-256 password protections",
                "Instant visual responsive previews"
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <CheckCircle className="w-4.5 h-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="text-center space-y-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Our Architectural Foundations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {values.map((val) => (
              <div 
                key={val.title}
                className="p-6.5 rounded-3xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center border border-blue-100/20 dark:border-blue-900/20">
                  {val.icon}
                </div>
                <h3 className="font-bold font-display text-slate-900 dark:text-white">{val.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </LayoutContainer>
  );
}
