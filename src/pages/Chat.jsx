import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import SearchBar from '../components/SearchBar';

const PERSONALITY_INFO = {
  friendly: { emoji: '😊', color: 'bg-neon-green' },
  sarcastic: { emoji: '😏', color: 'bg-neon-yellow' },
  wise: { emoji: '🧙', color: 'bg-neon-cyan' },
  dark: { emoji: '🌑', color: 'bg-neon-purple' },
  cheerful: { emoji: '🌟', color: 'bg-neon-pink' },
};

export default function Chat() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const characters = useStore((state) => state.characters);
  const getMessages = useStore((state) => state.getMessages);
  const searchMessages = useStore((state) => state.searchMessages);
  const sendMessage = useStore((state) => state.sendMessage);
  const setActiveCharacter = useStore((state) => state.setActiveCharacter);
  const clearConversation = useStore((state) => state.clearConversation);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const character = characters.find((c) => c.id === characterId);
  const allMessages = getMessages(characterId);
  const messages = messageSearch ? searchMessages(characterId, messageSearch) : allMessages;

  useEffect(() => {
    if (character) {
      setActiveCharacter(characterId);
    }
  }, [character, characterId, setActiveCharacter]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setMessageSearch('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isTyping) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    await sendMessage(message);
    setIsTyping(false);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages with this character?')) {
      clearConversation(characterId);
    }
  };

  if (!character) {
    return (
      <div className="text-center py-20 fade-in">
        <div className="text-6xl sm:text-8xl mb-6">❌</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-pure-white mb-3">Character Not Found</h2>
        <p className="text-white/60 mb-8 text-base sm:text-lg">This character doesn't exist or has been deleted.</p>
        <Link to="/characters" className="btn-primary">
          View All Characters
        </Link>
      </div>
    );
  }

  const personalityInfo = PERSONALITY_INFO[character.personality.toLowerCase()] || PERSONALITY_INFO.friendly;

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col fade-in">
      {/* Character Header */}
      <div className="card mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-white/20 p-4 sm:p-6 gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <span className="text-4xl sm:text-6xl flex-shrink-0">{character.avatar}</span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pure-white truncate">{character.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${personalityInfo.color}`}></span>
              <span className="text-xs sm:text-sm text-white/60 capitalize font-medium">{character.personality}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-6 flex-1 sm:flex-none"
            title="Search messages (Ctrl+F)"
          >
            🔍
          </button>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-6 flex-1 sm:flex-none"
            >
              Clear
            </button>
          )}
          <Link to="/characters" className="btn-outline text-xs sm:text-sm py-2 px-3 sm:px-6 flex-1 sm:flex-none">
            Back
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="mb-4 slide-up">
          <SearchBar
            value={messageSearch}
            onChange={setMessageSearch}
            placeholder="Search messages... (Esc to close)"
          />
          {messageSearch && (
            <p className="text-xs text-white/60 mt-2 font-mono">
              Found {messages.length} of {allMessages.length} messages
            </p>
          )}
        </div>
      )}

      {/* Character Info */}
      <div className="card mb-4 bg-off-black border-white/20 p-4">
        <p className="text-xs sm:text-sm text-white/70 italic leading-relaxed line-clamp-2">"{character.backstory}"</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 card overflow-y-auto mb-4 space-y-3 sm:space-y-4 border-white/20 p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="text-6xl sm:text-8xl mb-6">{character.avatar}</div>
            <h3 className="text-xl sm:text-2xl font-bold text-pure-white mb-3">
              {allMessages.length > 0 ? 'No messages match your search' : `Start a Conversation with ${character.name}`}
            </h3>
            <p className="text-white/60 text-sm sm:text-lg">
              {allMessages.length > 0 ? 'Try different keywords' : 'Type a message below to begin chatting!'}
            </p>
            {allMessages.length > 0 && messageSearch && (
              <button
                onClick={() => setMessageSearch('')}
                className="btn-outline text-sm mt-4"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 sm:px-5 py-3 sm:py-4 ${
                    msg.isUser
                      ? 'bg-neon-green text-pure-black font-medium'
                      : 'bg-dark-gray text-pure-white border border-white/20'
                  }`}
                >
                  {!msg.isUser && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-base sm:text-xl">{character.avatar}</span>
                      <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{character.name}</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-words">{msg.text}</p>
                  <p className={`text-xs mt-2 font-mono ${msg.isUser ? 'text-pure-black/60' : 'text-white/40'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start fade-in">
                <div className="bg-dark-gray border border-white/20 rounded-xl px-4 sm:px-5 py-3 sm:py-4 max-w-[85%] sm:max-w-[75%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-base sm:text-xl">{character.avatar}</span>
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{character.name}</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 bg-neon-green rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-neon-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="card border-white/20 p-4">
        <div className="flex space-x-2 sm:space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${character.name}...`}
            className="flex-1 input-field text-sm sm:text-base"
            disabled={isTyping}
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap px-4 sm:px-6"
          >
            Send →
          </button>
        </div>
      </form>
    </div>
  );
}
