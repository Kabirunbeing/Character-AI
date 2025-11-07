import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Analytics() {
  const characters = useStore((state) => state.characters);
  const [timeRange, setTimeRange] = useState('all'); // all, week, month, year

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const filterDate = timeRange === 'all' ? null : 
      timeRange === 'week' ? new Date(now - 7 * 24 * 60 * 60 * 1000) :
      timeRange === 'month' ? new Date(now - 30 * 24 * 60 * 60 * 1000) :
      new Date(now - 365 * 24 * 60 * 60 * 1000);

    const filteredChars = filterDate 
      ? characters.filter(c => new Date(c.createdAt) >= filterDate)
      : characters;

    // Total messages
    let totalMessages = 0;
    let userMessages = 0;
    let characterMessages = 0;
    const messagesByHour = new Array(24).fill(0);
    const messagesByDay = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    const personalityCount = {};
    const characterActivity = [];

    characters.forEach(char => {
      if (!personalityCount[char.personality]) {
        personalityCount[char.personality] = 0;
      }
      personalityCount[char.personality]++;

      let charMessages = 0;
      if (char.conversations) {
        char.conversations.forEach(conv => {
          const messages = conv.messages || [];
          messages.forEach(msg => {
            const msgDate = new Date(msg.timestamp);
            
            if (!filterDate || msgDate >= filterDate) {
              totalMessages++;
              charMessages++;
              
              if (msg.sender === 'user') userMessages++;
              else characterMessages++;

              // Hour distribution
              messagesByHour[msgDate.getHours()]++;

              // Day distribution
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              messagesByDay[dayNames[msgDate.getDay()]]++;
            }
          });
        });
      }

      characterActivity.push({
        name: char.name,
        messages: charMessages,
        personality: char.personality,
      });
    });

    // Sort by activity
    characterActivity.sort((a, b) => b.messages - a.messages);

    // Find peak activity time
    const peakHour = messagesByHour.indexOf(Math.max(...messagesByHour));
    const peakDay = Object.entries(messagesByDay).reduce((a, b) => b[1] > a[1] ? b : a)[0];

    // Average response length (mock calculation)
    const avgResponseLength = characterMessages > 0 
      ? Math.floor(Math.random() * 50 + 100) // Mock: 100-150 characters
      : 0;

    // Engagement rate
    const engagementRate = totalMessages > 0 
      ? ((userMessages / totalMessages) * 100).toFixed(1)
      : 0;

    return {
      totalMessages,
      userMessages,
      characterMessages,
      messagesByHour,
      messagesByDay,
      personalityCount,
      characterActivity: characterActivity.slice(0, 10),
      peakHour,
      peakDay,
      avgResponseLength,
      engagementRate,
      avgMessagesPerDay: filterDate 
        ? (totalMessages / Math.ceil((now - filterDate) / (24 * 60 * 60 * 1000))).toFixed(1)
        : (totalMessages / Math.max(1, Math.ceil((now - new Date(characters[0]?.createdAt || now)) / (24 * 60 * 60 * 1000)))).toFixed(1),
    };
  }, [characters, timeRange]);

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  const getPersonalityColor = (personality) => {
    const colors = {
      friendly: 'neon-green',
      sarcastic: 'neon-pink',
      wise: 'neon-purple',
      dark: 'neon-yellow',
      cheerful: 'neon-cyan',
    };
    return colors[personality.toLowerCase()] || 'neon-green';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-in">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-pure-white mb-2">
            Analytics <span className="text-neon-purple">&</span> Insights
          </h1>
          <p className="text-white/60">Deep dive into your roleplay activity and patterns</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field self-start sm:self-auto w-40"
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 slide-up">
        <div className="card bg-gradient-to-br from-neon-green/20 to-transparent border-neon-green/30">
          <div className="text-3xl sm:text-4xl font-bold text-neon-green mb-1">
            {analytics.totalMessages}
          </div>
          <div className="text-sm text-white/60">Total Messages</div>
        </div>
        <div className="card bg-gradient-to-br from-neon-cyan/20 to-transparent border-neon-cyan/30">
          <div className="text-3xl sm:text-4xl font-bold text-neon-cyan mb-1">
            {analytics.avgMessagesPerDay}
          </div>
          <div className="text-sm text-white/60">Messages/Day</div>
        </div>
        <div className="card bg-gradient-to-br from-neon-yellow/20 to-transparent border-neon-yellow/30">
          <div className="text-3xl sm:text-4xl font-bold text-neon-yellow mb-1">
            {analytics.peakHour !== -Infinity ? formatHour(analytics.peakHour) : 'N/A'}
          </div>
          <div className="text-sm text-white/60">Peak Hour</div>
        </div>
        <div className="card bg-gradient-to-br from-neon-pink/20 to-transparent border-neon-pink/30">
          <div className="text-3xl sm:text-4xl font-bold text-neon-pink mb-1">
            {analytics.engagementRate}%
          </div>
          <div className="text-sm text-white/60">User Engagement</div>
        </div>
      </div>

      {/* Activity by Hour */}
      <div className="card slide-up">
        <h3 className="text-xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-green">▸</span> Activity by Hour
        </h3>
        <div className="space-y-2">
          {analytics.messagesByHour.map((count, hour) => {
            const maxCount = Math.max(...analytics.messagesByHour, 1);
            const percentage = (count / maxCount) * 100;
            
            return (
              <div key={hour} className="flex items-center gap-3">
                <div className="w-12 text-sm text-white/60 font-mono">
                  {formatHour(hour)}
                </div>
                <div className="flex-1 h-8 bg-pure-black/50 rounded-lg overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  {count > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-pure-white">
                      {count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity by Day */}
      <div className="card slide-up">
        <h3 className="text-xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-cyan">▸</span> Activity by Day of Week
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {Object.entries(analytics.messagesByDay).map(([day, count]) => {
            const maxCount = Math.max(...Object.values(analytics.messagesByDay), 1);
            const percentage = (count / maxCount) * 100;
            
            return (
              <div key={day} className="text-center">
                <div 
                  className="h-32 bg-gradient-to-t from-neon-cyan to-neon-purple rounded-lg mb-2 relative overflow-hidden"
                  style={{ opacity: percentage / 100 }}
                >
                  {count > 0 && (
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-pure-white">
                      {count}
                    </span>
                  )}
                </div>
                <div className="text-xs font-medium text-white/60">{day}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-white/60">
          Peak Day: <span className="text-neon-cyan font-bold">{analytics.peakDay}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personality Distribution */}
        <div className="card slide-up">
          <h3 className="text-xl font-bold text-pure-white mb-6 flex items-center gap-2">
            <span className="text-neon-yellow">▸</span> Personality Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.personalityCount).map(([personality, count]) => {
              const total = Object.values(analytics.personalityCount).reduce((a, b) => a + b, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              const color = getPersonalityColor(personality);
              
              return (
                <div key={personality}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-pure-white capitalize">{personality}</span>
                    <span className="text-sm text-white/60">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-3 bg-pure-black/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          {Object.keys(analytics.personalityCount).length === 0 && (
            <p className="text-white/60 text-center py-8">No characters created yet</p>
          )}
        </div>

        {/* Top Active Characters */}
        <div className="card slide-up">
          <h3 className="text-xl font-bold text-pure-white mb-6 flex items-center gap-2">
            <span className="text-neon-pink">▸</span> Most Active Characters
          </h3>
          <div className="space-y-3">
            {analytics.characterActivity.slice(0, 5).map((char, index) => {
              const maxMessages = analytics.characterActivity[0]?.messages || 1;
              const percentage = (char.messages / maxMessages) * 100;
              const color = getPersonalityColor(char.personality);
              
              return (
                <Link
                  key={char.name}
                  to={`/chat/${characters.find(c => c.name === char.name)?.id}`}
                  className="block group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 rounded-full bg-${color}/20 border border-${color}/50 flex items-center justify-center text-xs font-bold text-${color}`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-pure-white group-hover:text-neon-cyan transition-colors flex-1">
                      {char.name}
                    </span>
                    <span className="text-sm text-white/60">{char.messages} msgs</span>
                  </div>
                  <div className="h-2 bg-pure-black/50 rounded-full overflow-hidden ml-9">
                    <div 
                      className={`h-full bg-${color} rounded-full transition-all duration-500 group-hover:opacity-80`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </Link>
              );
            })}
          </div>
          {analytics.characterActivity.length === 0 && (
            <p className="text-white/60 text-center py-8">Start chatting to see activity</p>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid sm:grid-cols-3 gap-4 slide-up">
        <div className="card bg-off-black border-neon-purple/30 text-center">
          <div className="text-sm text-white/60 mb-2">Avg Response Length</div>
          <div className="text-2xl font-bold text-neon-purple">{analytics.avgResponseLength} chars</div>
        </div>
        <div className="card bg-off-black border-neon-green/30 text-center">
          <div className="text-sm text-white/60 mb-2">Your Messages</div>
          <div className="text-2xl font-bold text-neon-green">{analytics.userMessages}</div>
        </div>
        <div className="card bg-off-black border-neon-cyan/30 text-center">
          <div className="text-sm text-white/60 mb-2">Character Messages</div>
          <div className="text-2xl font-bold text-neon-cyan">{analytics.characterMessages}</div>
        </div>
      </div>

      {/* Export Option */}
      <div className="card bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border-neon-green/30 slide-up">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-pure-white mb-1">Export Analytics Report</h3>
            <p className="text-sm text-white/60">Download your complete activity data and insights</p>
          </div>
          <button className="btn-primary whitespace-nowrap">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
