import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';

export default function Backup() {
  const characters = useStore((state) => state.characters);
  const exportData = useStore((state) => state.exportData);
  const importData = useStore((state) => state.importData);
  const fileInputRef = useRef(null);
  const [backupHistory, setBackupHistory] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate data size
  const dataSize = new Blob([JSON.stringify({ characters })]).size;
  const dataSizeKB = (dataSize / 1024).toFixed(2);
  const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roleplayforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Add to history
    const newBackup = {
      id: Date.now(),
      date: new Date().toISOString(),
      format: 'JSON',
      size: dataSizeKB,
      characters: characters.length,
    };
    setBackupHistory(prev => [newBackup, ...prev].slice(0, 10));
    showSuccessMessage('Backup exported successfully!');
  };

  const handleExportCSV = () => {
    // CSV headers
    let csv = 'Name,Personality,Backstory,Avatar,Avatar Color,Created At,Updated At,Is Favorite,Total Messages\n';
    
    characters.forEach(char => {
      const totalMessages = char.conversations?.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0) || 0;
      csv += `"${char.name}","${char.personality}","${char.backstory.replace(/"/g, '""')}","${char.avatar || ''}","${char.avatarColor || ''}","${char.createdAt}","${char.updatedAt || char.createdAt}","${char.isFavorite}","${totalMessages}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roleplayforge-characters-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSuccessMessage('CSV export completed!');
  };

  const handleExportMarkdown = () => {
    let markdown = `# RolePlayForge Character Database\n\n`;
    markdown += `**Export Date:** ${new Date().toLocaleString()}\n`;
    markdown += `**Total Characters:** ${characters.length}\n\n`;
    markdown += `---\n\n`;

    characters.forEach((char, index) => {
      const totalMessages = char.conversations?.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0) || 0;
      
      markdown += `## ${index + 1}. ${char.name}\n\n`;
      markdown += `**Personality:** ${char.personality}\n\n`;
      markdown += `**Backstory:**\n${char.backstory}\n\n`;
      markdown += `**Statistics:**\n`;
      markdown += `- Created: ${new Date(char.createdAt).toLocaleDateString()}\n`;
      markdown += `- Total Messages: ${totalMessages}\n`;
      markdown += `- Favorite: ${char.isFavorite ? 'Yes' : 'No'}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roleplayforge-characters-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSuccessMessage('Markdown export completed!');
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        const success = importData(content);
        if (success) {
          showSuccessMessage('Data imported successfully!');
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      } catch (error) {
        alert('Error importing file: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleAutoBackup = () => {
    // Save to localStorage with timestamp
    const backup = {
      data: exportData(),
      timestamp: new Date().toISOString(),
      auto: true,
    };
    localStorage.setItem('roleplayforge-auto-backup', JSON.stringify(backup));
    showSuccessMessage('Auto-backup created!');
  };

  const handleRestoreAutoBackup = () => {
    const backup = localStorage.getItem('roleplayforge-auto-backup');
    if (backup) {
      const parsed = JSON.parse(backup);
      const success = importData(parsed.data);
      if (success) {
        showSuccessMessage('Auto-backup restored!');
      }
    } else {
      alert('No auto-backup found.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 fade-in">
          <div className="card bg-neon-green/20 border-neon-green/50 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-pure-white font-medium">{successMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-pure-white mb-2">
          Backup <span className="text-neon-cyan">&</span> Restore
        </h1>
        <p className="text-white/60">Secure your data and manage backups</p>
      </div>

      {/* Data Overview */}
      <div className="grid sm:grid-cols-3 gap-4 slide-up">
        <div className="card bg-gradient-to-br from-neon-green/20 to-transparent border-neon-green/30">
          <div className="text-sm text-white/60 mb-2">Total Characters</div>
          <div className="text-3xl font-bold text-neon-green">{characters.length}</div>
        </div>
        <div className="card bg-gradient-to-br from-neon-cyan/20 to-transparent border-neon-cyan/30">
          <div className="text-sm text-white/60 mb-2">Data Size</div>
          <div className="text-3xl font-bold text-neon-cyan">
            {dataSizeMB >= 1 ? `${dataSizeMB} MB` : `${dataSizeKB} KB`}
          </div>
        </div>
        <div className="card bg-gradient-to-br from-neon-yellow/20 to-transparent border-neon-yellow/30">
          <div className="text-sm text-white/60 mb-2">Last Backup</div>
          <div className="text-xl font-bold text-neon-yellow">
            {backupHistory.length > 0 
              ? new Date(backupHistory[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Never'
            }
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-green">▸</span> Export Backup
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-4">
          {/* JSON Export */}
          <button
            onClick={handleExportJSON}
            className="card card-hover bg-off-black border-neon-green/30 text-left group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-pure-white mb-2">JSON Format</h3>
            <p className="text-sm text-white/60 mb-4">
              Complete backup with all data including conversations and metadata
            </p>
            <span className="text-neon-green text-sm font-medium">Recommended</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="card card-hover bg-off-black border-neon-cyan/30 text-left group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-pure-white mb-2">CSV Format</h3>
            <p className="text-sm text-white/60 mb-4">
              Character data in spreadsheet format for Excel or Google Sheets
            </p>
            <span className="text-neon-cyan text-sm font-medium">Spreadsheet</span>
          </button>

          {/* Markdown Export */}
          <button
            onClick={handleExportMarkdown}
            className="card card-hover bg-off-black border-neon-yellow/30 text-left group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-neon-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-pure-white mb-2">Markdown Format</h3>
            <p className="text-sm text-white/60 mb-4">
              Human-readable document with all character information
            </p>
            <span className="text-neon-yellow text-sm font-medium">Readable</span>
          </button>
        </div>
      </div>

      {/* Import Options */}
      <div className="card slide-up">
        <h2 className="text-2xl font-bold text-pure-white mb-6 flex items-center gap-2">
          <span className="text-neon-cyan">▸</span> Import & Restore
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Import from File */}
          <div>
            <h3 className="text-lg font-bold text-pure-white mb-4">Import from File</h3>
            <p className="text-sm text-white/60 mb-4">
              Restore your data from a previously exported JSON backup file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary w-full"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Choose File
            </button>
          </div>

          {/* Auto Backup */}
          <div>
            <h3 className="text-lg font-bold text-pure-white mb-4">Auto Backup</h3>
            <p className="text-sm text-white/60 mb-4">
              Create or restore an automatic backup stored in your browser
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAutoBackup}
                className="btn-outline flex-1"
              >
                Create
              </button>
              <button
                onClick={handleRestoreAutoBackup}
                className="btn-outline flex-1"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup History */}
      {backupHistory.length > 0 && (
        <div className="card slide-up">
          <h2 className="text-2xl font-bold text-pure-white mb-6 flex items-center gap-2">
            <span className="text-neon-yellow">▸</span> Recent Backups
          </h2>
          
          <div className="space-y-3">
            {backupHistory.map(backup => (
              <div key={backup.id} className="flex items-center justify-between p-4 bg-pure-black/30 rounded-lg border border-white/10">
                <div className="flex-1">
                  <div className="font-medium text-pure-white mb-1">
                    {new Date(backup.date).toLocaleString()}
                  </div>
                  <div className="text-sm text-white/60">
                    {backup.format} • {backup.characters} character{backup.characters !== 1 ? 's' : ''} • {backup.size} KB
                  </div>
                </div>
                <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded text-xs border border-neon-green/30">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 border-neon-purple/30 slide-up">
        <h2 className="text-lg font-bold text-pure-white mb-4">💡 Backup Tips</h2>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-neon-green mt-1">•</span>
            <span>Export backups regularly to prevent data loss</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-cyan mt-1">•</span>
            <span>Store backups in multiple locations (cloud storage, USB drive)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-yellow mt-1">•</span>
            <span>JSON format is recommended for complete data restoration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-pink mt-1">•</span>
            <span>Auto-backup is stored in browser localStorage (cleared if you clear browsing data)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
