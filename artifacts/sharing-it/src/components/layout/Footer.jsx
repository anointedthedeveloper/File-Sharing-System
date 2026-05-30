import { Link } from 'react-router-dom';
import { Globe, ArrowUpRight, Github, Twitter, Layers } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const GITHUB_URL = 'https://github.com/anointedthedeveloper';
const ANOBYTE_URL = 'https://anobyte.online';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: 'Upload Files', path: '/upload' },
      { name: 'Quick Share', path: '/quick-share' },
      { name: 'Dashboard', path: '/dashboard' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Anobyte Technologies', href: ANOBYTE_URL },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  return (
    <footer className="relative w-full mt-auto bg-[var(--bg-base)] overflow-hidden">
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-[var(--accent)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[var(--border-strong)]">
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <img src={logoImg} alt="Sharing It" className="h-10 w-auto relative z-10" />
                <div className="absolute inset-0 bg-[var(--accent)] blur-xl rounded-full scale-150 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              </div>
            </Link>

            <p className="text-base max-w-sm leading-relaxed text-[var(--text-secondary)] font-medium">
              The fastest way to share files with anyone. Upload, set an expiry, and send a link — no sign-up needed.
            </p>

            <div className="flex gap-3">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:shadow-glow transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 hover:shadow-[0_0_20px_rgba(29,161,242,0.2)] transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={ANOBYTE_URL} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:shadow-glow transition-all duration-300">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title: 'Product', items: links.product },
              { title: 'Company', items: links.company },
              { title: 'Legal', items: links.legal },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-extrabold uppercase tracking-[0.25em] mb-6 text-[var(--text-primary)]">
                  {col.title}
                </h3>
                <ul className="space-y-4">
                  {col.items.map((link) => (
                    <li key={link.name}>
                      {link.href ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                        >
                          {link.name}
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative inline-block group"
                        >
                          <span>{link.name}</span>
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
          <p className="text-sm font-bold text-[var(--text-muted)]">
            &copy; {currentYear} Anobyte Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
            <Layers className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Built by</span>
            <a href={ANOBYTE_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-extrabold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
              Anobyte Technologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
