import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CharacterList } from './components/CharacterList'
import { CharacterDetail } from './components/CharacterDetail'
import { CharacterProgression } from './components/CharacterProgression'
import { UserList } from './components/UserList'
import { UserCharacters } from './components/UserCharacters'
import { Navigation } from './components/Navigation'
import { Home } from './components/Home'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<CharacterList />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route path="/characters/:id/progression" element={<CharacterProgression />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserCharacters />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
