import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Users, Calendar } from 'lucide-react'
import { formatNumber } from '../utils/experienceUtils'

interface DiscordUser {
  id: string
  discordId: string
  username: string
  discriminator: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
}

interface Character {
  id: string
  name: string
  level: number
  job: string
  world: string
  main: boolean
  avatar?: string | null
  experience?: number | string | null
  createdAt: string
  updatedAt: string
  stats: {
    str: number
    dex: number
    int: number
    luk: number
    hp: number
    mp: number
    combatPower: number
    damageRange: number
    finalDamage: number
    ignoreDefense: number
    attackPower: number
    magicAttack: number
    bossDamage: number
    criticalRate: number
    criticalDamage: number
    starForce: number
    arcanePower: number
    sacredPower: number
    legion: number
    muLungDojo: string
    fame: number
    cooldownReduction: string
    cooldownNotApplied: number
    additionalStatusDamage: number
    damage: number
    normalEnemyDamage: number
    buffDuration: number
    ignoreElementalResistance: number
    summonsDurationIncrease: number
    mesosObtained: number
    itemDropRate: number
    additionalExpObtained: number
  }
}

export function UserCharacters() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndCharacters = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user')
        }

        const userData = await userResponse.json()
        setUser(userData.user)

        // Fetch user's characters
        const charactersResponse = await fetch(`http://localhost:5000/api/users/${id}/characters`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!charactersResponse.ok) {
          throw new Error('Failed to fetch characters')
        }

        const charactersData = await charactersResponse.json()
        setCharacters(charactersData.characters)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUser(null)
        setCharacters([])
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserAndCharacters()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">User not found</h3>
        <Link to="/users" className="text-blue-500 hover:text-blue-400">
          Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link 
          to="/users" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Link>
      </div>

      {/* User Info Header */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                alt={user.username}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.username}
              {user.discriminator && user.discriminator !== '0' && (
                <span className="text-gray-400">#{user.discriminator}</span>
              )}
            </h1>
            <p className="text-gray-400">Discord ID: {user.discordId}</p>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Characters Section */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <span>Characters ({characters.length})</span>
        </h2>

        {characters.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No characters found</h3>
            <p className="text-gray-400">This user hasn't added any characters yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => (
                <div key={character.id} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
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
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>{character.name}</span>
                        {character.main && (
                          <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded-full">
                            MAIN
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">{character.job} • Level {character.level}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">World:</span>
                    <span className="text-white">{character.world}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Combat Power:</span>
                    <span className="text-white font-semibold">{formatNumber(character.stats.combatPower)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Star Force:</span>
                    <span className="text-white">{character.stats.starForce}</span>
                  </div>
                  {character.experience && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white">{formatNumber(character.experience)}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/characters/${character.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
