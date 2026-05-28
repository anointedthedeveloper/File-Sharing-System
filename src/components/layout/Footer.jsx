import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Cpu } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: 'Upload Files', path: '/upload' },
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Security Measures', path: '/about#security' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact Support', path: '/contact' },
      { name: 'Official Website', href: 'https://sharingit.app' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ]
  };

  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-10 border-b border-slate-200/50 dark:border-slate-900">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1.5 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoImg} alt="Sharing It" className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Secure, fast, and auto-expiring file sharing designed for modern developers and creators. Share anything, anywhere.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-400 hover:text-blue-500 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="https://anobyte.online" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-400 hover:text-blue-500 transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links columns */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Product</h3>
            <ul className="space-y-2.5">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-2.5">
              {links.company.map((link) => (
                <li key={link.name}>
                  {link.href ? (
                    <a href={link.href} target="_blank" rel="noreferrer" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.path} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom copyright info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {currentYear} Sharing It. All rights reserved.
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Cpu className="w-3.5 h-3.5" />
            <span>Powered by</span>
            <a 
              href="https://anobyte.online" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hover:underline"
            >
              Anobyte
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
