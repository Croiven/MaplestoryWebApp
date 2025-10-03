import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, User } from 'lucide-react'

interface Character {
  id: string
  name: string
  level: number
  job: string
  world: string
  main: boolean
  avatar?: string | null
  experience?: number | null
  createdAt: string
  updatedAt: string
}

export function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/characters', {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch characters')
        }

        const data = await response.json()
        setCharacters(data.characters || [])
      } catch (error) {
        console.error('Error fetching characters:', error)
        setCharacters([])
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [])

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.world.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Characters</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Character</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No characters found</h3>
              <p className="text-gray-400">Try adjusting your search or add a new character.</p>
            </div>
          ) : (
            filteredCharacters.map((character) => (
              <Link
                key={character.id}
                to={`/characters/${character.id}`}
                className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-lg transition-colors"
              >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    {/* Henesys Background for Avatar */}
                    <div 
                      className="absolute inset-0 bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: 'url("/images/henesys_background.png")',
                        backgroundSize: '115%',
                        backgroundPosition: 'center 0%'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {character.avatar ? (
                        <img 
                          src={character.avatar} 
                          alt={`${character.name} avatar`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            (e.currentTarget.nextElementSibling as HTMLElement)?.style.setProperty('display', 'flex');
                          }}
                        />
                      ) : null}
                      <User className={`h-6 w-6 text-white ${character.avatar ? 'hidden' : 'flex'}`} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold text-white">{character.name}</h3>
                      {character.main && (
                        <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded-full font-medium">
                          MAIN
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">{character.job} • Level {character.level}</p>
                    <p className="text-sm text-gray-500">{character.world}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-gray-300">{new Date(character.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
