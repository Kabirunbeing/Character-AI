import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Avatar from '../components/Avatar';

const CHARACTER_TEMPLATES = [
  {
    id: 'wizard',
    name: 'Merlin the Sage',
    personality: 'wise',
    backstory: 'An ancient wizard who has lived for centuries, possessing vast knowledge of magic and the arcane arts. Speaks in riddles and metaphors, always teaching important life lessons.',
    avatar: 'M',
    avatarColor: '#b026ff',
    category: 'Fantasy',
    tags: ['magic', 'mentor', 'ancient'],
  },
  {
    id: 'detective',
    name: 'Detective Morgan',
    personality: 'sarcastic',
    backstory: 'A sharp-witted detective with 15 years on the force. Has seen it all and approaches cases with dry humor and cynical wisdom. Never misses a detail.',
    avatar: 'D',
    avatarColor: '#ff006e',
    category: 'Mystery',
    tags: ['crime', 'investigation', 'cynical'],
  },
  {
    id: 'ai-companion',
    name: 'ARIA',
    personality: 'friendly',
    backstory: 'An advanced AI assistant designed to be helpful, friendly, and supportive. Always eager to learn and adapt to user preferences while maintaining a warm personality.',
    avatar: 'A',
    avatarColor: '#00ff41',
    category: 'Sci-Fi',
    tags: ['ai', 'helper', 'futuristic'],
  },
  {
    id: 'pirate',
    name: 'Captain Blackbeard',
    personality: 'dark',
    backstory: 'A feared pirate captain who sails the seven seas in search of treasure and adventure. Ruthless in battle but honorable to those who earn respect.',
    avatar: 'B',
    avatarColor: '#ffff00',
    category: 'Adventure',
    tags: ['pirate', 'treasure', 'seas'],
  },
  {
    id: 'chef',
    name: 'Chef Isabella',
    personality: 'cheerful',
    backstory: 'A passionate chef who believes cooking is an art form. Loves sharing recipes, cooking tips, and stories from culinary adventures around the world.',
    avatar: 'I',
    avatarColor: '#00f0ff',
    category: 'Lifestyle',
    tags: ['cooking', 'food', 'enthusiastic'],
  },
  {
    id: 'vampire',
    name: 'Lord Dracula',
    personality: 'dark',
    backstory: 'An immortal vampire lord from medieval times. Elegant, sophisticated, and mysterious. Speaks of the old world and the weight of eternal life.',
    avatar: 'D',
    avatarColor: '#ffff00',
    category: 'Horror',
    tags: ['vampire', 'immortal', 'gothic'],
  },
  {
    id: 'scientist',
    name: 'Dr. Einstein',
    personality: 'wise',
    backstory: 'A brilliant scientist specializing in quantum physics and theoretical science. Loves explaining complex concepts in simple terms and encouraging curiosity.',
    avatar: 'E',
    avatarColor: '#b026ff',
    category: 'Educational',
    tags: ['science', 'physics', 'teacher'],
  },
  {
    id: 'comedian',
    name: 'Joker Jack',
    personality: 'sarcastic',
    backstory: 'A stand-up comedian with quick wit and sharp observations about everyday life. Finds humor in everything and loves making people laugh.',
    avatar: 'J',
    avatarColor: '#ff006e',
    category: 'Entertainment',
    tags: ['comedy', 'jokes', 'witty'],
  },
  {
    id: 'knight',
    name: 'Sir Galahad',
    personality: 'friendly',
    backstory: 'A noble knight devoted to honor, chivalry, and protecting the innocent. Speaks with old English formality and upholds the code of knights.',
    avatar: 'G',
    avatarColor: '#00ff41',
    category: 'Fantasy',
    tags: ['knight', 'honor', 'medieval'],
  },
  {
    id: 'therapist',
    name: 'Dr. Sarah Chen',
    personality: 'friendly',
    backstory: 'A compassionate therapist specializing in mental health and emotional wellbeing. Provides a safe space for open conversation and personal growth.',
    avatar: 'S',
    avatarColor: '#00ff41',
    category: 'Wellness',
    tags: ['therapy', 'support', 'listening'],
  },
  {
    id: 'alien',
    name: 'Zyx-9',
    personality: 'cheerful',
    backstory: 'An extraterrestrial visitor from a distant galaxy. Curious about Earth culture, asks unusual questions, and sees everything from a fresh perspective.',
    avatar: 'Z',
    avatarColor: '#00f0ff',
    category: 'Sci-Fi',
    tags: ['alien', 'space', 'curious'],
  },
  {
    id: 'samurai',
    name: 'Takeshi Yamamoto',
    personality: 'wise',
    backstory: 'A masterful samurai who follows the way of Bushido. Speaks of discipline, honor, and the path to inner peace through martial arts.',
    avatar: 'T',
    avatarColor: '#b026ff',
    category: 'Historical',
    tags: ['samurai', 'martial-arts', 'discipline'],
  },
];

export default function Templates() {
  const navigate = useNavigate();
  const addCharacter = useStore((state) => state.addCharacter);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...new Set(CHARACTER_TEMPLATES.map(t => t.category))];

  const filteredTemplates = CHARACTER_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.backstory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    const newCharacter = {
      name: template.name,
      personality: template.personality,
      backstory: template.backstory,
      avatar: template.avatar,
      avatarColor: template.avatarColor,
    };
    addCharacter(newCharacter);
    navigate('/characters');
  };

  const handleCustomizeTemplate = (template) => {
    // Store template in sessionStorage and navigate to create page
    sessionStorage.setItem('template', JSON.stringify(template));
    navigate('/create');
  };

  const getPersonalityInfo = (personality) => {
    const info = {
      friendly: { icon: 'F', color: 'neon-green' },
      sarcastic: { icon: 'S', color: 'neon-pink' },
      wise: { icon: 'W', color: 'neon-purple' },
      dark: { icon: 'D', color: 'neon-yellow' },
      cheerful: { icon: 'C', color: 'neon-cyan' },
    };
    return info[personality.toLowerCase()] || info.friendly;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-pure-white mb-2">
          Character <span className="text-neon-purple">Templates</span>
        </h1>
        <p className="text-white/60">Pre-made characters ready to use or customize</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 slide-up">
        <div className="card bg-off-black border-neon-green/30 text-center">
          <div className="text-3xl font-bold text-neon-green mb-1">{CHARACTER_TEMPLATES.length}</div>
          <div className="text-sm text-white/60">Templates</div>
        </div>
        <div className="card bg-off-black border-neon-cyan/30 text-center">
          <div className="text-3xl font-bold text-neon-cyan mb-1">{categories.length - 1}</div>
          <div className="text-sm text-white/60">Categories</div>
        </div>
        <div className="card bg-off-black border-neon-yellow/30 text-center">
          <div className="text-3xl font-bold text-neon-yellow mb-1">5</div>
          <div className="text-sm text-white/60">Personalities</div>
        </div>
        <div className="card bg-off-black border-neon-pink/30 text-center">
          <div className="text-3xl font-bold text-neon-pink mb-1">100%</div>
          <div className="text-sm text-white/60">Free</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card slide-up">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="input-field w-full pl-10"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                    : 'bg-pure-black/50 text-white/60 border border-white/10 hover:border-white/30'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="card text-center py-16 slide-up">
          <div className="text-6xl sm:text-8xl mb-6 font-bold text-neon-cyan">0</div>
          <p className="text-xl sm:text-2xl text-white/80 mb-2">No Templates Found</p>
          <p className="text-white/60 mb-8">Try adjusting your search or category filter</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="btn-outline">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 slide-up">
          {filteredTemplates.map(template => {
            const personalityInfo = getPersonalityInfo(template.personality);
            
            return (
              <div key={template.id} className="card card-hover group">
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-pure-black/70 backdrop-blur-sm text-white/80 text-xs rounded-full border border-white/20">
                    {template.category}
                  </span>
                </div>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-4 transition-transform group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${template.avatarColor}30`,
                      borderColor: template.avatarColor,
                      color: template.avatarColor 
                    }}
                  >
                    {template.avatar}
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-pure-white mb-2 text-center group-hover:text-neon-cyan transition-colors">
                  {template.name}
                </h3>

                {/* Personality */}
                <div className="flex justify-center mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 bg-${personalityInfo.color}/20 text-${personalityInfo.color} rounded-full border border-${personalityInfo.color}/30 text-sm font-medium`}>
                    <span className="font-bold">{personalityInfo.icon}</span>
                    {template.personality}
                  </span>
                </div>

                {/* Backstory */}
                <p className="text-sm text-white/60 mb-4 line-clamp-3">
                  {template.backstory}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="btn-primary text-sm py-2 flex-1"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => handleCustomizeTemplate(template)}
                    className="btn-outline text-sm py-2 flex-1"
                  >
                    Customize
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <div className="card bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 border-neon-purple/30 slide-up">
        <h2 className="text-lg font-bold text-pure-white mb-4">💡 Using Templates</h2>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-neon-green mt-1">•</span>
            <span><strong>Use Template:</strong> Instantly add the character to your collection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-cyan mt-1">•</span>
            <span><strong>Customize:</strong> Edit the template before adding it to your characters</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-yellow mt-1">•</span>
            <span>All templates are fully editable after creation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-pink mt-1">•</span>
            <span>Use templates as inspiration for your own unique characters</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
