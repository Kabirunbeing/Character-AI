import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateCharacter from './pages/CreateCharacter';
import EditCharacter from './pages/EditCharacter';
import CharacterList from './pages/CharacterList';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import History from './pages/History';
import Analytics from './pages/Analytics';
import CharacterProfile from './pages/CharacterProfile';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import Backup from './pages/Backup';
import Templates from './pages/Templates';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCharacter />} />
          <Route path="/edit/:characterId" element={<EditCharacter />} />
          <Route path="/characters" element={<CharacterList />} />
          <Route path="/character/:id" element={<CharacterProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/chat/:characterId" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/search" element={<Search />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

