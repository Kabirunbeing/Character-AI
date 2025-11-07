import { Link } from 'react-router-dom';

export default function About() {
  const version = '1.0.0';
  const buildDate = 'November 2025';

  const features = [
    'Create unlimited fictional characters',
    'Five distinct personality types',
    'Interactive chat interface',
    'Custom avatar system (letters + colors or image upload)',
    'Conversation history with multiple view modes',
    'Advanced analytics and insights',
    'Character templates library',
    'Comprehensive search across all data',
    'Favorites system',
    'Export/Import in multiple formats',
    'Fully offline - no backend required',
    'Complete data privacy',
  ];

  const technologies = [
    { name: 'React 19', description: 'Modern UI library with hooks' },
    { name: 'Vite', description: 'Lightning-fast build tool' },
    { name: 'React Router', description: 'Client-side routing' },
    { name: 'Zustand', description: 'Lightweight state management' },
    { name: 'Tailwind CSS', description: 'Utility-first styling' },
    { name: 'localStorage', description: 'Client-side persistence' },
  ];

  const changelog = [
    {
      version: '1.0.0',
      date: 'November 2025',
      changes: [
        'Initial release',
        'Character creation and management',
        'Interactive chat system',
        'Analytics dashboard',
        'History and search pages',
        'Templates library',
        'Backup and restore',
        'Help documentation',
        '14 fully functional pages',
      ],
    },
  ];

  const roadmap = [
    { title: 'Collections & Tags', status: 'planned', description: 'Organize characters into custom collections' },
    { title: 'Relationship Graph', status: 'planned', description: 'Visualize connections between characters' },
    { title: 'Activity Log', status: 'planned', description: 'Track all user actions and changes' },
    { title: 'Character Compare', status: 'planned', description: 'Side-by-side character comparison' },
    { title: 'Random Generator', status: 'planned', description: 'AI-powered character name generator' },
    { title: 'Trash/Archive', status: 'planned', description: 'Soft delete with restore functionality' },
    { title: 'Theme Customization', status: 'planned', description: 'Custom color schemes and appearance' },
    { title: 'Cloud Sync', status: 'future', description: 'Optional cloud backup (requires backend)' },
    { title: 'Share Characters', status: 'future', description: 'Export characters as shareable links' },
    { title: 'Mobile App', status: 'future', description: 'Native mobile applications' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="fade-in text-center">
        <div className="text-6xl sm:text-8xl font-bold mb-6">
          <span className="text-neon-green">R</span>
          <span className="text-neon-cyan">F</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-pure-white mb-4">
          RolePlayForge
        </h1>
        <p className="text-xl sm:text-2xl text-white/60 mb-2">
          Create. Chat. Explore.
        </p>
        <p className="text-white/40">
          Version {version} • {buildDate}
        </p>
      </div>

      {/* About Section */}
      <div className="card slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-4 flex items-center gap-2">
          <span className="text-neon-green">▸</span> About the Project
        </h2>
        <div className="space-y-4 text-white/70 leading-relaxed">
          <p>
            <strong className="text-pure-white">RolePlayForge</strong> is a professional, feature-rich character roleplay platform 
            built with modern web technologies. It allows you to create fictional characters with unique personalities and 
            engage in immersive conversations that reflect their distinct traits.
          </p>
          <p>
            This application runs entirely in your browser with no backend required. All your data is stored locally using 
            localStorage, ensuring complete privacy and offline functionality. Your characters, conversations, and settings 
            never leave your device.
          </p>
          <p>
            Designed with a minimalist black-and-white aesthetic enhanced by vibrant neon accents, RolePlayForge delivers 
            a modern, professional interface that's both visually striking and highly functional.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="card slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-cyan">▸</span> Core Features
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-pure-black/30 rounded-lg border border-white/10">
              <svg className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/80">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-yellow">▸</span> Built With
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech) => (
            <div key={tech.name} className="p-4 bg-gradient-to-br from-white/5 to-transparent rounded-lg border border-white/10">
              <h3 className="text-lg font-bold text-pure-white mb-2">{tech.name}</h3>
              <p className="text-sm text-white/60">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 slide-up">
        <div className="card bg-gradient-to-br from-neon-green/20 to-transparent border-neon-green/30 text-center">
          <div className="text-4xl font-bold text-neon-green mb-1">14</div>
          <div className="text-sm text-white/60">Pages</div>
        </div>
        <div className="card bg-gradient-to-br from-neon-cyan/20 to-transparent border-neon-cyan/30 text-center">
          <div className="text-4xl font-bold text-neon-cyan mb-1">5</div>
          <div className="text-sm text-white/60">Personalities</div>
        </div>
        <div className="card bg-gradient-to-br from-neon-yellow/20 to-transparent border-neon-yellow/30 text-center">
          <div className="text-4xl font-bold text-neon-yellow mb-1">12</div>
          <div className="text-sm text-white/60">Templates</div>
        </div>
        <div className="card bg-gradient-to-br from-neon-pink/20 to-transparent border-neon-pink/30 text-center">
          <div className="text-4xl font-bold text-neon-pink mb-1">100%</div>
          <div className="text-sm text-white/60">Private</div>
        </div>
      </div>

      {/* Changelog */}
      <div className="card slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-pink">▸</span> Changelog
        </h2>
        <div className="space-y-6">
          {changelog.map((release) => (
            <div key={release.version}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-sm font-bold border border-neon-green/30">
                  v{release.version}
                </span>
                <span className="text-white/40 text-sm">{release.date}</span>
              </div>
              <ul className="space-y-2 pl-4">
                {release.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/70">
                    <span className="text-neon-green mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="card slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-purple">▸</span> Roadmap
        </h2>
        <div className="space-y-3">
          {roadmap.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-pure-black/30 rounded-lg border border-white/10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-pure-white">{item.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'planned' 
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'bg-white/10 text-white/60 border border-white/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-white/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="card bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 border-neon-purple/30 slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-4">Credits & Attribution</h2>
        <p className="text-white/70 mb-6">
          RolePlayForge was built with passion and dedication to create a professional, feature-complete 
          roleplay platform. Special thanks to the open-source community for the amazing tools and libraries 
          that made this project possible.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/characters" className="btn-primary">
            Get Started
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-outline"
          >
            GitHub Repository
          </a>
        </div>
      </div>

      {/* License */}
      <div className="card slide-up text-center">
        <p className="text-white/40 text-sm">
          © 2025 RolePlayForge. Built with React, Vite, and Tailwind CSS.
        </p>
        <p className="text-white/40 text-sm mt-2">
          All data stored locally. No cookies. No tracking. Complete privacy.
        </p>
      </div>
    </div>
  );
}
