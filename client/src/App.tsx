import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CharacterList } from './components/CharacterList'
import { CharacterDetail } from './components/CharacterDetail'
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
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
