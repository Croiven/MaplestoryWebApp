import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Shield, Sword, Star } from 'lucide-react'

interface Character {
  id: string
  name: string
  level: number
  job: string
  world: string
  lastLogin?: string
  stats: {
    str: number
    dex: number
    int: number
    luk: number
    hp: number
    mp: number
  }
  equipment: {
    weapon?: string
    armor?: string
    accessories?: string[]
  }
}

export function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockCharacter: Character = {
      id: id || '1',
      name: 'TestCharacter',
      level: 200,
      job: 'Hero',
      world: 'Scania',
      lastLogin: '2024-01-15',
      stats: {
        str: 1000,
        dex: 500,
        int: 200,
        luk: 300,
        hp: 50000,
        mp: 15000
      },
      equipment: {
        weapon: 'Heaven\'s Hammer',
        armor: 'Dragon Scale Armor',
        accessories: ['Ring of Power', 'Necklace of Wisdom']
      }
    }
    
    setTimeout(() => {
      setCharacter(mockCharacter)
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Character not found</h3>
        <Link to="/characters" className="text-blue-500 hover:text-blue-400">
          Back to Characters
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/characters" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Characters</span>
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{character.name}</h1>
            <p className="text-xl text-gray-300">{character.job} • Level {character.level}</p>
            <p className="text-gray-400">{character.world}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>Stats</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">STR:</span>
                <span className="text-white font-semibold">{character.stats.str.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">DEX:</span>
                <span className="text-white font-semibold">{character.stats.dex.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">INT:</span>
                <span className="text-white font-semibold">{character.stats.int.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">LUK:</span>
                <span className="text-white font-semibold">{character.stats.luk.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">HP:</span>
                <span className="text-white font-semibold">{character.stats.hp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">MP:</span>
                <span className="text-white font-semibold">{character.stats.mp.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Sword className="h-6 w-6" />
              <span>Equipment</span>
            </h2>
            <div className="space-y-3">
              {character.equipment.weapon && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Weapon:</span>
                  <span className="text-white font-semibold">{character.equipment.weapon}</span>
                </div>
              )}
              {character.equipment.armor && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Armor:</span>
                  <span className="text-white font-semibold">{character.equipment.armor}</span>
                </div>
              )}
              {character.equipment.accessories && character.equipment.accessories.length > 0 && (
                <div>
                  <span className="text-gray-300">Accessories:</span>
                  <ul className="mt-2 space-y-1">
                    {character.equipment.accessories.map((accessory, index) => (
                      <li key={index} className="text-white font-semibold">• {accessory}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
