import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import Avatar from '../components/Avatar';

export default function Favorites() {
  const characters = useStore((state) => state.characters);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const [sortBy, setSortBy] = useState('recent');

  const favoriteCharacters = useMemo(() => {
    const favorites = characters.filter(char => char.isFavorite);
    
    // Sort
    favorites.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'mostChats': {
          const aChats = a.conversations?.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0) || 0;
          const bChats = b.conversations?.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0) || 0;
          return bChats - aChats;
        }
        default:
          return 0;
      }
    });

    return favorites;
  }, [characters, sortBy]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-in">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-pure-white mb-2">
            <span className="text-neon-yellow">★</span> Favorite Characters
          </h1>
          <p className="text-white/60">Quick access to your most loved characters</p>
        </div>
        <Link to="/characters" className="btn-outline self-start sm:self-auto">
          All Characters
        </Link>
      </div>

      {/* Controls */}
      {favoriteCharacters.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 slide-up">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="recent">Recently Updated</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="mostChats">Most Active</option>
          </select>
          
          <div className="text-sm text-white/60 flex items-center">
            {favoriteCharacters.length} favorite{favoriteCharacters.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Favorites Grid */}
      {favoriteCharacters.length === 0 ? (
        <div className="card text-center py-16 slide-up">
          <div className="text-6xl sm:text-8xl mb-6">
            <svg className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-neon-yellow/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-xl sm:text-2xl text-white/80 mb-2">No Favorites Yet</p>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Start adding characters to your favorites by clicking the star icon on any character card
          </p>
          <Link to="/characters" className="btn-primary inline-block">
            Browse Characters
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 slide-up">
          {favoriteCharacters.map((character) => {
            const personalityInfo = getPersonalityInfo(character.personality);
            const totalMessages = character.conversations?.reduce(
              (sum, conv) => sum + (conv.messages?.length || 0),
              0
            ) || 0;

            return (
              <div
                key={character.id}
                className="card card-hover group relative overflow-hidden"
              >
                {/* Favorite Badge */}
                <button
                  onClick={() => toggleFavorite(character.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-pure-black/50 backdrop-blur-sm border border-neon-yellow/50 hover:bg-neon-yellow/20 transition-all"
                >
                  <svg className="w-5 h-5 text-neon-yellow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <Avatar character={character} size="lg" />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-pure-white mb-2 text-center group-hover:text-neon-cyan transition-colors">
                  {character.name}
                </h3>

                {/* Personality Badge */}
                <div className="flex justify-center mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 bg-${personalityInfo.color}/20 text-${personalityInfo.color} rounded-full border border-${personalityInfo.color}/30 text-sm font-medium`}>
                    <span className="font-bold">{personalityInfo.icon}</span>
                    {character.personality}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 mb-4 text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {totalMessages}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(character.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/chat/${character.id}`}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    Chat
                  </Link>
                  <Link
                    to={`/character/${character.id}`}
                    className="flex-1 btn-outline text-sm py-2"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      {favoriteCharacters.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4 slide-up">
          <div className="card bg-off-black border-neon-yellow/30 text-center">
            <div className="text-3xl font-bold text-neon-yellow mb-1">{favoriteCharacters.length}</div>
            <div className="text-sm text-white/60">Favorite Characters</div>
          </div>
          <div className="card bg-off-black border-neon-green/30 text-center">
            <div className="text-3xl font-bold text-neon-green mb-1">
              {favoriteCharacters.reduce((sum, char) => 
                sum + (char.conversations?.reduce((s, conv) => s + (conv.messages?.length || 0), 0) || 0), 0
              )}
            </div>
            <div className="text-sm text-white/60">Total Messages</div>
          </div>
          <div className="card bg-off-black border-neon-cyan/30 text-center">
            <div className="text-3xl font-bold text-neon-cyan mb-1">
              {((favoriteCharacters.length / Math.max(characters.length, 1)) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-white/60">Of All Characters</div>
          </div>
        </div>
      )}
    </div>
  );
}
