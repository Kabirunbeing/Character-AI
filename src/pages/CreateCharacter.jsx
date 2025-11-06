import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const PERSONALITY_TYPES = [
  { value: 'friendly', label: 'Friendly', emoji: '😊', description: 'Warm, kind, and supportive', color: 'neon-green' },
  { value: 'sarcastic', label: 'Sarcastic', emoji: '😏', description: 'Witty with a sharp tongue', color: 'neon-yellow' },
  { value: 'wise', label: 'Wise', emoji: '🧙', description: 'Thoughtful and philosophical', color: 'neon-cyan' },
  { value: 'dark', label: 'Dark', emoji: '🌑', description: 'Mysterious and brooding', color: 'neon-purple' },
  { value: 'cheerful', label: 'Cheerful', emoji: '🌟', description: 'Bubbly and enthusiastic', color: 'neon-pink' },
];

export default function CreateCharacter() {
  const navigate = useNavigate();
  const addCharacter = useStore((state) => state.addCharacter);
  const setActiveCharacter = useStore((state) => state.setActiveCharacter);

  const [formData, setFormData] = useState({
    name: '',
    personality: 'friendly',
    backstory: '',
    avatar: '👤',
  });

  const [errors, setErrors] = useState({});

  const avatarOptions = ['👤', '🧙‍♂️', '🧙‍♀️', '👑', '🎭', '⚔️', '🗡️', '🛡️', '🔮', '📿', '🌙', '⭐'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Character name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.backstory.trim()) {
      newErrors.backstory = 'Backstory is required';
    } else if (formData.backstory.trim().length < 10) {
      newErrors.backstory = 'Backstory must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const characterId = addCharacter(formData);
    setActiveCharacter(characterId);
    navigate(`/chat/${characterId}`);
  };

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-pure-white mb-3">
          Create New <span className="text-neon-green">Character</span>
        </h1>
        <p className="text-white/60 text-sm sm:text-base md:text-lg">
          Design a unique character with their own personality and backstory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Avatar Selection */}
        <div className="card border-white/20 slide-up">
          <label className="block text-xs sm:text-sm font-bold text-pure-white mb-3 sm:mb-4 uppercase tracking-wider">
            Choose Avatar
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
            {avatarOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, avatar: emoji }))}
                className={`text-3xl sm:text-4xl p-3 sm:p-4 rounded-lg transition-all duration-300 ${
                  formData.avatar === emoji
                    ? 'bg-neon-green/20 ring-2 ring-neon-green scale-110 shadow-neon-green'
                    : 'bg-dark-gray hover:bg-mid-gray border border-white/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Character Name */}
        <div className="card border-white/20 slide-up" style={{ animationDelay: '0.1s' }}>
          <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-pure-white mb-2 sm:mb-3 uppercase tracking-wider">
            Character Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-neon-pink shadow-neon-pink' : ''}`}
            placeholder="e.g., Aria Shadowblade"
          />
          {errors.name && (
            <p className="mt-2 text-xs sm:text-sm text-neon-pink font-medium">{errors.name}</p>
          )}
        </div>

        {/* Personality Type */}
        <div className="card border-white/20 slide-up" style={{ animationDelay: '0.2s' }}>
          <label className="block text-xs sm:text-sm font-bold text-pure-white mb-3 sm:mb-4 uppercase tracking-wider">
            Personality Type *
          </label>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {PERSONALITY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, personality: type.value }))}
                className={`p-4 sm:p-5 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.personality === type.value
                    ? `border-${type.color} bg-${type.color}/10 shadow-lg`
                    : 'border-white/10 bg-dark-gray hover:border-white/30'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-3xl sm:text-4xl flex-shrink-0">{type.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-pure-white text-base sm:text-lg truncate">{type.label}</p>
                    <p className="text-xs text-white/60 truncate">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Backstory */}
        <div className="card border-white/20 slide-up" style={{ animationDelay: '0.3s' }}>
          <label htmlFor="backstory" className="block text-xs sm:text-sm font-bold text-pure-white mb-2 sm:mb-3 uppercase tracking-wider">
            Backstory *
          </label>
          <textarea
            id="backstory"
            name="backstory"
            value={formData.backstory}
            onChange={handleChange}
            rows={6}
            className={`input-field resize-none ${errors.backstory ? 'border-neon-pink shadow-neon-pink' : ''}`}
            placeholder="Write a compelling backstory for your character... Who are they? What's their history? What motivates them?"
          />
          {errors.backstory && (
            <p className="mt-2 text-xs sm:text-sm text-neon-pink font-medium">{errors.backstory}</p>
          )}
          <p className="mt-2 text-xs text-white/40 font-mono">
            {formData.backstory.length} characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-4 slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline w-full sm:w-auto"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Create & Start Chatting
          </button>
        </div>
      </form>
    </div>
  );
}
