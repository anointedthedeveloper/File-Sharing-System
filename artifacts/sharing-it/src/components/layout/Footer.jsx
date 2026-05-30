import { Link } from 'react-router-dom';
import { Globe, Cpu, ArrowUpRight } from 'lucide-react';
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
      { name: 'Security', path: '/about#security' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Anobyte', href: ANOBYTE_URL },
    ],
    legal: [
      { name: 'Privacy', path: '/privacy' },
      { name: 'Terms', path: '/terms' },
    ],
  };

  return (
    <footer className="relative w-full mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="absolute inset-x-0 -top-px h-px opacity-60" style={{ background: 'var(--gradient-brand)' }} />

      <div className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={logoImg} alt="Sharing It" className="h-9 w-auto" />
            </Link>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Secure, fast, auto-expiring file sharing — transfer online free with password gates, QR codes, and zero friction.
            </p>
            <div className="flex gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href={ANOBYTE_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Anobyte website"
                className="p-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {[
            { title: 'Product', items: links.product },
            { title: 'Company', items: links.company },
            { title: 'Legal', items: links.legal },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.items.map((link) => (
                  <li key={link.name}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {link.name}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link to={link.path} className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            &copy; {currentYear} Anobyte Software · Sharing It
          </p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Cpu className="w-3.5 h-3.5" />
            <span>Powered by</span>
            <a href={ANOBYTE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold gradient-text hover:underline">
              Anobyte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
