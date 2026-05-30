import React from 'react';
import { Shield, Server, Cpu, Target, Network } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function About() {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cryptographic Privacy",
      desc: "We enforce zero-knowledge principles. Payloads exist ephemerally, protected by strict AES protocols, and obliterate unconditionally upon expiration."
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Edge Network Distribution",
      desc: "Anchored by decentralized edge nodes to guarantee instantaneous payload retrieval regardless of geographical coordinates."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Frictionless Utility",
      desc: "Engineered specifically to bypass onboarding fatigue. We value your time over your data. A purist approach to digital logistics."
    }
  ];

  return (
    <LayoutContainer 
      title="Manifesto - Sharing It"
      description="The architectural vision behind Sharing It's zero-friction file delivery systems."
    >
      <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32 relative">
        
        {/* Cinematic ambient lighting */}
        <div className="absolute top-40 left-10 w-96 h-96 bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-500 opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center space-y-6 mb-24 relative z-10">
          <span className="section-badge tracking-[0.3em]">Our Manifesto</span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[var(--text-primary)] font-display tracking-tight leading-none">
            Digital logistics, <br/>
            <span className="text-[var(--text-secondary)] italic font-light">re-engineered.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
              The end of bloated cloud drives.
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                Modern file sharing has deteriorated into an exercise in patience. Extortionate quotas, forced account creation, targeted advertising, and perpetual data harvesting have corrupted a fundamental internet utility.
              </p>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                Sharing It was forged as a brutalist rejection of this trend. We built a kinematic staging area: drop an asset, dictate the rules of engagement, secure a cryptographic link, and let the system handle the demolition.
              </p>
            </div>
          </div>

          <div className="p-10 sm:p-12 rounded-[2.5rem] glass-card shadow-2xl border-[var(--border-strong)] bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-muted)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/10 blur-[50px] rounded-bl-full" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--text-primary)] flex items-center justify-center">
                  <Target className="w-6 h-6 text-[var(--bg-base)]" />
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">Core Directives</h3>
              </div>
              
              <ul className="space-y-5">
                {[
                  "Hostility toward advertising revenue models",
                  "Aggressive auto-destruction sequencing",
                  "Mathematical certainty via SHA-256 gates",
                  "Instant visual asset hydration"
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm sm:text-base text-[var(--text-primary)] font-bold">
                    <span className="text-[var(--accent)] font-mono opacity-50">0{i+1}</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-12 relative z-10">
          <h2 className="text-3xl font-extrabold font-display text-[var(--text-primary)] text-center tracking-tight">
            Architectural Primitives
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <div key={i} className="p-8 rounded-[2rem] glass-card border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors space-y-5 bg-[var(--bg-elevated)]/50">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-primary)]">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">{val.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
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
