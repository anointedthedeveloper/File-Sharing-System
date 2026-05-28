import React, { useState } from 'react';
import heroImg from '../assets/hero.png';
import symbolImg from '../assets/symbol.png';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';

export default function AuthSplit() {
  const [isLogin, setIsLogin] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Slideshow images and copy
  const slides = [
    {
      img: heroImg,
      title: 'Secure file delivery in milliseconds.',
      desc: 'Experience the ultimate workspace file routing. Fully encrypted, beautifully intuitive.'
    },
    {
      img: symbolImg,
      title: 'Share instantly, anywhere.',
      desc: 'Send files to anyone, on any device, with a single link. No app required.'
    },
    {
      img: heroImg,
      title: 'Your data, your control.',
      desc: 'Privacy-first design. You decide who accesses your files.'
    }
  ];
  const [slideIdx, setSlideIdx] = useState(0);
  // Auto-advance slideshow every 4s
  React.useEffect(() => {
    const t = setTimeout(() => setSlideIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearTimeout(t);
  }, [slideIdx]);

  const shellClass = isDark
    ? 'bg-[linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-slate-100'
    : 'bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eef4ff_100%)] text-slate-900';

  const panelClass = isDark
    ? 'bg-[#111827]/95 border-slate-800 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.95)]'
    : 'bg-white/95 border-slate-200 shadow-[0_24px_80px_-35px_rgba(148,163,184,0.45)]';

  const visualClass = isDark
    ? 'bg-[linear-gradient(135deg,#111827_0%,#172033_45%,#0b1120_100%)] border-slate-800 text-slate-100'
    : 'bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_45%,#eef2ff_100%)] border-slate-200 text-slate-900';

  const inputClass = isDark
    ? 'w-full bg-[#0b1220] text-white rounded-2xl border border-slate-700/70 px-4 py-3 text-sm shadow-inner shadow-slate-950/70 placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/35 transition-all'
    : 'w-full bg-white text-slate-900 rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all';

  return (
    <div className={`min-h-screen w-full ${shellClass} select-none font-sans`}>
      <Navbar />
      <main className="flex flex-col min-h-[calc(100vh-4rem)] items-stretch justify-center px-0 py-0 md:px-4 md:py-4">
        <div className={`relative flex flex-col md:flex-row w-full min-h-[calc(100vh-4rem)] overflow-hidden border-y md:min-h-[calc(100vh-6rem)] md:rounded-none md:border ${panelClass}`}>
        {/* SIGN UP FORM (Left side background layer) */}
        <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 transition-all duration-700 ease-in-out ${isLogin ? 'opacity-0 pointer-events-none absolute md:static' : 'opacity-100 static'}`}>
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Account</h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Join us to start sharing securely.</p>
            </div>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Full Name</label>
                <input type="text" className={inputClass} placeholder="John Doe" />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Email Address</label>
                <input type="email" className={inputClass} placeholder="you@example.com" />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Password</label>
                <input type="password" className={inputClass} placeholder="••••••••" />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 rounded-xl hover:opacity-95 transition shadow-lg shadow-blue-500/10 text-sm mt-2">
                Sign Up
              </button>
            </form>
          </div>
        </div>
        {/* LOGIN FORM (Right side background layer) */}
        <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-0 pointer-events-none absolute md:static' : 'opacity-100 static'}`}>
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome Back</h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Enter your credentials to access your secure workspace.</p>
            </div>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Email address</label>
                <input type="email" className={inputClass} placeholder="you@example.com" />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Password</label>
                <input type="password" className={inputClass} placeholder="Enter password..." />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 rounded-xl hover:opacity-95 transition shadow-lg shadow-blue-500/10 text-sm mt-2">
                Sign In
              </button>
            </form>
            <div className="text-center">
              <button className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} text-xs transition underline underline-offset-4`}>
                Sign in with email code or link
              </button>
            </div>
          </div>
        </div>
        {/* VISUAL PANEL (Slideshow, Brand, Toggles) */}
        <div
          className={`flex flex-col items-center justify-between border-t md:border-t-0 md:border-l md:static md:w-1/2 w-full z-10 p-6 md:p-12 ${visualClass}
            ${isLogin ? 'order-3 md:order-none' : 'order-3 md:order-none'}`}
        >
          {/* Subtle Woven Aesthetic Background Asset */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen overflow-hidden">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px]" />
          </div>
          {/* Top Panel Brand */}
          <div className="relative z-20 flex items-center gap-2 mb-4">
            <img src={symbolImg} alt="Brand Symbol" className="w-10 h-10 rounded-lg shadow-md bg-blue-600 p-1" />
            <span className={`font-semibold tracking-wide text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Sharing It?</span>
          </div>
          {/* Slideshow */}
          <div className="relative z-20 flex flex-col items-center justify-center flex-1 space-y-4 w-full max-w-xs mx-auto">
            <img src={slides[slideIdx].img} alt="Slide visual" className="w-44 h-44 object-contain rounded-2xl shadow-2xl mb-2 transition-all duration-500" />
            <h3 className={`text-xl font-semibold leading-snug text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{slides[slideIdx].title}</h3>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm leading-relaxed text-center`}>{slides[slideIdx].desc}</p>
            {/* Slideshow dots */}
            <div className="flex gap-2 justify-center mt-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border-2 ${i === slideIdx ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-slate-400'} transition-all`}
                  onClick={() => setSlideIdx(i)}
                  aria-label={`Go to slide ${i+1}`}
                />
              ))}
            </div>
          </div>
          {/* Bottom Interface Toggles */}
          <div className="relative z-20 text-sm text-slate-400 mt-6">
            {isLogin ? (
              <span>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-blue-500 hover:text-blue-600 font-medium transition underline ml-1">Register</button></span>
            ) : (
              <span>Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-500 hover:text-blue-600 font-medium transition underline ml-1">Sign In</button></span>
            )}
          </div>
        </div>
        {/* Mobile: Hide extra toggle, handled in visual panel */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
