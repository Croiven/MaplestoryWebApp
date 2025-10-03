import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Shield, Sword, Star, TrendingUp } from 'lucide-react'
import { calculateExperienceProgress, formatNumber } from '../utils/experienceUtils'

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
    // Basic stats
    str: number
    dex: number
    int: number
    luk: number
    hp: number
    mp: number
    
    // Combat stats
    combatPower: number
    damageRange: number
    finalDamage: number
    ignoreDefense: number
    attackPower: number
    magicAttack: number
    bossDamage: number
    criticalRate: number
    criticalDamage: number
    
    // Power stats
    starForce: number
    arcanePower: number
    sacredPower: number
    
    // Social stats
    legion: number
    muLungDojo: string
    fame: number
    
    // Cooldown stats
    cooldownReduction: string
    cooldownNotApplied: number
    
    // Status & Buff stats
    additionalStatusDamage: number
    damage: number
    normalEnemyDamage: number
    buffDuration: number
    ignoreElementalResistance: number
    summonsDurationIncrease: number
    
    // Utility stats
    mesosObtained: number
    itemDropRate: number
    additionalExpObtained: number
  }
}

export function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/characters/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch character')
        }

        const data = await response.json()
        setCharacter(data.character)
      } catch (error) {
        console.error('Error fetching character:', error)
        setCharacter(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCharacter()
    }
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
    <div className="w-full">
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
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
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
              <User className={`h-10 w-10 text-white ${character.avatar ? 'hidden' : 'flex'}`} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-white">{character.name}</h1>
              {character.main && (
                <span className="bg-yellow-600 text-yellow-100 text-sm px-3 py-1 rounded-full font-medium">
                  MAIN
                </span>
              )}
            </div>
            <p className="text-xl text-gray-300">{character.job} • Level {character.level}</p>
            <p className="text-gray-400">{character.world}</p>
            {character.experience && (
              <div className="text-sm text-gray-500">
                {(() => {
                  const expProgress = calculateExperienceProgress(character.level, character.experience);
                  if (!expProgress.isMaxLevel) {
                    return (
                      <div className="mt-1">
                        <div className="text-xs mb-1">
                          <div className="flex justify-between">
                            <span>{expProgress.expText}</span>
                          </div>
                          <div className="text-center mt-1">
                            <span className="font-semibold text-blue-400">{expProgress.percentageText}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${expProgress.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                  return <p className="text-xs text-yellow-400">Max Level</p>;
                })()}
              </div>
            )}
            <div className="mt-4">
              <Link
                to={`/characters/${character.id}/progression`}
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                <span>View Progression</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Basic Stats */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>Basic Stats</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">STR:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.str)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">DEX:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.dex)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">INT:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.int)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">LUK:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.luk)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">HP:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.hp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">MP:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.mp)}</span>
              </div>
            </div>
          </div>

          {/* Combat Stats */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Sword className="h-6 w-6" />
              <span>Combat Stats</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Combat Power:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.combatPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Damage Range:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.damageRange)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Final Damage:</span>
                <span className="text-white font-semibold">{character.stats.finalDamage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Ignore Defense:</span>
                <span className="text-white font-semibold">{character.stats.ignoreDefense}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Attack Power:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.attackPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Magic Attack:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.magicAttack)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Boss Damage:</span>
                <span className="text-white font-semibold">{character.stats.bossDamage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Critical Rate:</span>
                <span className="text-white font-semibold">{character.stats.criticalRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Critical Damage:</span>
                <span className="text-white font-semibold">{character.stats.criticalDamage}%</span>
              </div>
            </div>
          </div>

          {/* Power & Social Stats */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Star className="h-6 w-6" />
              <span>Power & Social</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Star Force:</span>
                <span className="text-white font-semibold">{character.stats.starForce}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Arcane Power:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.arcanePower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Sacred Power:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.sacredPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Legion:</span>
                <span className="text-white font-semibold">{formatNumber(character.stats.legion)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Mu Lung Dojo:</span>
                <span className="text-white font-semibold">{character.stats.muLungDojo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fame:</span>
                <span className="text-white font-semibold">{character.stats.fame}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          {/* Status & Buff Stats */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Status & Buff Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Damage:</span>
                <span className="text-white font-semibold">{character.stats.damage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Normal Enemy Damage:</span>
                <span className="text-white font-semibold">{character.stats.normalEnemyDamage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Buff Duration:</span>
                <span className="text-white font-semibold">{character.stats.buffDuration}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Ignore Elemental Resistance:</span>
                <span className="text-white font-semibold">{character.stats.ignoreElementalResistance}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Summons Duration Increase:</span>
                <span className="text-white font-semibold">{character.stats.summonsDurationIncrease}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Additional Status Damage:</span>
                <span className="text-white font-semibold">{character.stats.additionalStatusDamage}%</span>
              </div>
            </div>
          </div>

          {/* Utility Stats */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Utility Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Mesos Obtained:</span>
                <span className="text-white font-semibold">{character.stats.mesosObtained}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Item Drop Rate:</span>
                <span className="text-white font-semibold">{character.stats.itemDropRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Additional EXP Obtained:</span>
                <span className="text-white font-semibold">{character.stats.additionalExpObtained}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cooldown Reduction:</span>
                <span className="text-white font-semibold">{character.stats.cooldownReduction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cooldown Not Applied:</span>
                <span className="text-white font-semibold">{character.stats.cooldownNotApplied}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
