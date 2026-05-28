import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Globe, Cpu, Heart } from 'lucide-react';

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
      { name: 'Official Website', href: 'https://anobyte.online' },
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
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-glow">
                <span className="font-display font-bold text-white text-sm">A</span>
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Anobyte
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Secure, fast, and auto-expiring file sharing designed for modern developers and creators. Share anything, anywhere.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-400 hover:text-blue-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://anobyte.online" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-900 text-slate-400 hover:text-blue-500 transition-colors">
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
            &copy; {currentYear} Anobyte. All rights reserved.
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
