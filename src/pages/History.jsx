import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Avatar from '../components/Avatar';

export default function History() {
  const characters = useStore((state) => state.characters);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCharacter, setFilterCharacter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('list'); // list, grid, timeline

  // Get all conversations with metadata
  const allConversations = useMemo(() => {
    const conversations = [];
    
    characters.forEach(character => {
      if (character.conversations && character.conversations.length > 0) {
        character.conversations.forEach((conv, index) => {
          const messages = conv.messages || [];
          const lastMessage = messages[messages.length - 1];
          
          conversations.push({
            id: `${character.id}-${index}`,
            characterId: character.id,
            characterName: character.name,
            character: character,
            messages: messages,
            messageCount: messages.length,
            lastMessageText: lastMessage?.text || 'No messages',
            lastMessageTime: lastMessage?.timestamp || conv.timestamp || character.createdAt,
            conversationDate: conv.timestamp || character.createdAt,
          });
        });
      }
    });
    
    return conversations;
  }, [characters]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = allConversations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(conv => 
        conv.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some(msg => 
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Character filter
    if (filterCharacter !== 'all') {
      filtered = filtered.filter(conv => conv.characterId === filterCharacter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        case 'oldest':
          return new Date(a.lastMessageTime) - new Date(b.lastMessageTime);
        case 'longest':
          return b.messageCount - a.messageCount;
        case 'shortest':
          return a.messageCount - b.messageCount;
        case 'name':
          return a.characterName.localeCompare(b.characterName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allConversations, searchQuery, filterCharacter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const totalMessages = allConversations.reduce((sum, conv) => sum + conv.messageCount, 0);
    const avgMessagesPerConv = allConversations.length > 0 
      ? Math.round(totalMessages / allConversations.length) 
      : 0;
    
    return {
      totalConversations: allConversations.length,
      totalMessages,
      avgMessagesPerConv,
      charactersWithChats: new Set(allConversations.map(c => c.characterId)).size,
    };
  }, [allConversations]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-in">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-pure-white mb-2">
            Conversation <span className="text-neon-cyan">History</span>
          </h1>
          <p className="text-white/60">Browse all your conversations across all characters</p>
        </div>
        <Link to="/characters" className="btn-outline self-start sm:self-auto">
          Back to Characters
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 slide-up">
        <div className="card bg-off-black border-neon-green/30">
          <div className="text-2xl sm:text-3xl font-bold text-neon-green mb-1">{stats.totalConversations}</div>
          <div className="text-xs sm:text-sm text-white/60">Total Conversations</div>
        </div>
        <div className="card bg-off-black border-neon-cyan/30">
          <div className="text-2xl sm:text-3xl font-bold text-neon-cyan mb-1">{stats.totalMessages}</div>
          <div className="text-xs sm:text-sm text-white/60">Total Messages</div>
        </div>
        <div className="card bg-off-black border-neon-yellow/30">
          <div className="text-2xl sm:text-3xl font-bold text-neon-yellow mb-1">{stats.avgMessagesPerConv}</div>
          <div className="text-xs sm:text-sm text-white/60">Avg Per Conversation</div>
        </div>
        <div className="card bg-off-black border-neon-pink/30">
          <div className="text-2xl sm:text-3xl font-bold text-neon-pink mb-1">{stats.charactersWithChats}</div>
          <div className="text-xs sm:text-sm text-white/60">Active Characters</div>
        </div>
      </div>

      {/* Controls */}
      <div className="card space-y-4 slide-up">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations and messages..."
            className="input-field w-full pl-10"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters and View */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Character Filter */}
          <select
            value={filterCharacter}
            onChange={(e) => setFilterCharacter(e.target.value)}
            className="input-field flex-1"
          >
            <option value="all">All Characters ({characters.length})</option>
            {characters.map(char => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field flex-1"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="longest">Most Messages</option>
            <option value="shortest">Fewest Messages</option>
            <option value="name">Character Name</option>
          </select>

          {/* View Mode */}
          <div className="flex gap-2 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                  : 'bg-pure-black/50 text-white/60 border border-white/10 hover:border-white/30'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                  : 'bg-pure-black/50 text-white/60 border border-white/10 hover:border-white/30'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'timeline'
                  ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/50'
                  : 'bg-pure-black/50 text-white/60 border border-white/10 hover:border-white/30'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Conversations */}
      {filteredConversations.length === 0 ? (
        <div className="card text-center py-16 slide-up">
          <div className="text-6xl sm:text-8xl mb-6 font-bold text-neon-cyan">0</div>
          <p className="text-xl sm:text-2xl text-white/80 mb-2">
            {searchQuery || filterCharacter !== 'all' ? 'No Matching Conversations' : 'No Conversations Yet'}
          </p>
          <p className="text-white/60 mb-8">
            {searchQuery || filterCharacter !== 'all' 
              ? 'Try adjusting your filters or search query'
              : 'Start chatting with your characters to see conversations here'
            }
          </p>
          {!searchQuery && filterCharacter === 'all' && (
            <Link to="/characters" className="btn-primary inline-block">
              View Characters
            </Link>
          )}
        </div>
      ) : (
        <div className={`slide-up ${
          viewMode === 'grid' 
            ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : viewMode === 'timeline'
            ? 'space-y-6'
            : 'space-y-3'
        }`}>
          {viewMode === 'timeline' && (
            <div className="relative pl-8 border-l-2 border-neon-cyan/30">
              {filteredConversations.map((conv, index) => (
                <div key={conv.id} className="relative mb-8 last:mb-0">
                  {/* Timeline dot */}
                  <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-neon-cyan border-2 border-off-black"></div>
                  
                  <Link 
                    to={`/chat/${conv.characterId}`}
                    className="card card-hover block"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <Avatar character={conv.character} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-lg font-bold text-pure-white truncate">
                            {conv.characterName}
                          </h3>
                          <span className="text-xs text-white/40 whitespace-nowrap">
                            {formatDate(conv.lastMessageTime)}
                          </span>
                        </div>
                        <div className="text-xs text-neon-cyan mb-2">
                          {conv.messageCount} message{conv.messageCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 line-clamp-2">
                      {conv.lastMessageText}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'grid' && filteredConversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/chat/${conv.characterId}`}
              className="card card-hover group"
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="mb-3">
                  <Avatar character={conv.character} size="lg" />
                </div>
                <h3 className="text-lg font-bold text-pure-white mb-1 group-hover:text-neon-cyan transition-colors">
                  {conv.characterName}
                </h3>
                <span className="text-xs text-white/40">
                  {formatDate(conv.lastMessageTime)}
                </span>
              </div>
              
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 bg-neon-green/20 text-neon-green text-xs rounded-full border border-neon-green/30">
                  {conv.messageCount} message{conv.messageCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              <p className="text-sm text-white/60 line-clamp-3">
                {conv.lastMessageText}
              </p>
            </Link>
          ))}

          {viewMode === 'list' && filteredConversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/chat/${conv.characterId}`}
              className="card card-hover flex items-center gap-4 group"
            >
              <Avatar character={conv.character} size="md" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-pure-white group-hover:text-neon-cyan transition-colors truncate">
                    {conv.characterName}
                  </h3>
                  <span className="text-xs text-white/40 whitespace-nowrap">
                    {formatDate(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-2 line-clamp-1">
                  {conv.lastMessageText}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {conv.messageCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
