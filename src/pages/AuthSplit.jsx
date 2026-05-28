import React, { useState } from 'react';
import heroImg from '../assets/hero.png';

export default function AuthSplit() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full bg-[#0f1115] flex items-center justify-center p-4 md:p-0 select-none font-sans">
      {/* Main Authentication Container */}
      <div className="relative w-full max-w-5xl h-[650px] bg-[#1a1d24] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row">
        {/* SIGN UP FORM (Left side background layer) */}
        <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-12 transition-all duration-700 ease-in-out ${isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
              <p className="text-slate-400 text-sm">Join us to start sharing securely.</p>
            </div>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">Full Name</label>
                <input type="text" className="w-full bg-[#111318] text-white rounded-xl px-4 py-3 border border-slate-700/50 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">Email Address</label>
                <input type="email" className="w-full bg-[#111318] text-white rounded-xl px-4 py-3 border border-slate-700/50 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">Password</label>
                <input type="password" className="w-full bg-[#111318] text-white rounded-xl px-4 py-3 border border-slate-700/50 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="••••••••" />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 rounded-xl hover:opacity-95 transition shadow-lg shadow-blue-500/10 text-sm mt-2">
                Sign Up
              </button>
            </form>
          </div>
        </div>
        {/* LOGIN FORM (Right side background layer) */}
        <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-12 transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to access your secure workspace.</p>
            </div>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">Email address</label>
                <input type="email" className="w-full bg-[#111318] text-white rounded-xl px-4 py-3 border border-slate-700/50 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">Password</label>
                <input type="password" className="w-full bg-[#111318] text-white rounded-xl px-4 py-3 border border-slate-700/50 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="Enter password..." />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 rounded-xl hover:opacity-95 transition shadow-lg shadow-blue-500/10 text-sm mt-2">
                Sign In
              </button>
            </form>
            <div className="text-center">
              <button className="text-xs text-slate-400 hover:text-white transition underline underline-offset-4">
                Sign in with email code or link
              </button>
            </div>
          </div>
        </div>
        {/* MOVING VISUAL PANEL OVERLAY (Desktop Only) */}
        <div 
          className={`hidden md:flex absolute top-0 bottom-0 w-1/2 h-full bg-gradient-to-br from-[#1e2330] via-[#141722] to-[#0f111a] transition-transform duration-700 ease-in-out z-10 p-12 flex-col justify-between border-slate-800
            ${isLogin ? 'translate-x-0 left-0 border-r' : 'translate-x-full left-0 border-l'}`}
        >
          {/* Subtle Woven Aesthetic Background Asset */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen overflow-hidden">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
          </div>
          {/* Top Panel Brand */}
          <div className="relative z-20 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">S</div>
            <span className="text-white font-semibold tracking-wide">Sharing It?</span>
          </div>
          {/* Center Dynamic Marketing Copy & Hero */}
          <div className="relative z-20 flex flex-col items-center justify-center flex-1 space-y-4">
            <img src={heroImg} alt="Sharing It Hero" className="w-56 rounded-2xl shadow-2xl mb-4" />
            <h3 className="text-2xl font-semibold text-white leading-snug text-center">
              {isLogin ? "Simpler data pipelines start here." : "Secure file delivery in milliseconds."}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm text-center">
              {isLogin 
                ? "Connect your local developer environments and monitor system configurations dynamically."
                : "Experience the ultimate workspace file routing. Fully encrypted, beautifully intuitive."}
            </p>
          </div>
          {/* Bottom Interface Toggles */}
          <div className="relative z-20 text-sm text-slate-400">
            {isLogin ? (
              <span>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-blue-400 hover:text-blue-300 font-medium transition underline ml-1">Register</button></span>
            ) : (
              <span>Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-400 hover:text-blue-300 font-medium transition underline ml-1">Sign In</button></span>
            )}
          </div>
        </div>
        {/* Mobile Toggle Footer (Fallback for small screens) */}
        <div className="md:hidden block text-center pb-8 pt-2 z-20 text-sm text-slate-400">
          {isLogin ? (
            <span>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-blue-400 font-medium underline ml-1">Register</button></span>
          ) : (
            <span>Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-400 font-medium underline ml-1">Sign In</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
