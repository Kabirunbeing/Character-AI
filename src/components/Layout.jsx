import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/create', label: 'Create' },
    { path: '/characters', label: 'Characters' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-off-black border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110">⚔️</span>
              <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-pure-white group-hover:text-neon-green transition-colors">
                RolePlayForge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-neon-green text-pure-black font-bold shadow-neon-green'
                      : 'text-pure-white hover:bg-white/5 hover:text-neon-green'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-pure-white hover:bg-white/5 hover:text-neon-green transition-all"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 pt-2 space-y-2 fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-neon-green text-pure-black font-bold shadow-neon-green'
                      : 'text-pure-white hover:bg-white/5 hover:text-neon-green'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-off-black border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 text-sm font-mono">RolePlayForge • Frontend MVP • Mock Responses</p>
          <div className="mt-3 flex justify-center space-x-4">
            <span className="text-neon-green text-xs font-bold">■</span>
            <span className="text-neon-cyan text-xs font-bold">■</span>
            <span className="text-neon-yellow text-xs font-bold">■</span>
            <span className="text-neon-pink text-xs font-bold">■</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
