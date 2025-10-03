import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TrendingUp, Calendar, Award, Zap } from 'lucide-react'
import { formatNumber } from '../utils/experienceUtils'

interface ProgressionData {
  id: string
  level: number
  experience: number | string // Can be BigInt from server
  rank?: number
  legionLevel?: number
  raidPower?: number
  lastUpdated: string
}

interface ProgressionStats {
  characterName: string
  currentLevel: number
  currentExperience: number
  levelGained: number
  experienceGained: number
  daysTracked: number
  averageExpPerDay: number
}

export function CharacterProgression() {
  const { id } = useParams<{ id: string }>()
  const [progression, setProgression] = useState<ProgressionData[]>([])
  const [stats, setStats] = useState<ProgressionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    const fetchProgressionData = async () => {
      try {
        // Fetch progression history
        const progressionResponse = await fetch(`http://localhost:5000/api/characters/${id}/progression?days=${days}`)
        if (progressionResponse.ok) {
          const progressionData = await progressionResponse.json()
          setProgression(progressionData.progression)
        }

        // Fetch progression stats
        const statsResponse = await fetch(`http://localhost:5000/api/characters/${id}/progression/stats`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.stats)
        }
      } catch (error) {
        console.error('Error fetching progression data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProgressionData()
    }
  }, [id, days])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No progression data found</h3>
        <p className="text-gray-400">This character hasn't been tracked yet.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
          <TrendingUp className="h-8 w-8" />
          <span>Character Progression</span>
        </h1>
        <p className="text-gray-400">Track {stats.characterName}'s growth over time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Current Level</p>
              <p className="text-2xl font-bold text-white">{stats.currentLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Levels Gained</p>
              <p className="text-2xl font-bold text-white">{stats.levelGained}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">EXP Gained</p>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.experienceGained)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">Days Tracked</p>
              <p className="text-2xl font-bold text-white">{stats.daysTracked}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Time Period
        </label>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Progression Chart */}
      {progression.length > 0 ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Level Progression</h2>
          <div className="space-y-4">
            {progression.map((entry, index) => {
              const prevEntry = index > 0 ? progression[index - 1] : null
              const levelGained = prevEntry ? entry.level - prevEntry.level : 0
              const expGained = prevEntry ? Number(entry.experience) - Number(prevEntry.experience) : 0
              
              return (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{entry.level}</p>
                      <p className="text-xs text-gray-400">Level</p>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {new Date(entry.lastUpdated).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        EXP: {formatNumber(entry.experience)}
                      </p>
                      {entry.rank && (
                        <p className="text-sm text-gray-400">
                          Rank: #{formatNumber(entry.rank)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {levelGained > 0 && (
                    <div className="text-right">
                      <p className="text-green-500 font-semibold">+{levelGained} Level{levelGained > 1 ? 's' : ''}</p>
                      <p className="text-sm text-gray-400">
                        +{formatNumber(expGained)} EXP
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No progression data</h3>
          <p className="text-gray-400">No progression data available for the selected time period.</p>
        </div>
      )}

      {/* Average Stats */}
      {stats.daysTracked > 0 && (
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Average Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{formatNumber(stats.averageExpPerDay)}</p>
              <p className="text-gray-400">EXP per day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {stats.daysTracked > 0 ? (stats.levelGained / stats.daysTracked * 7).toFixed(2) : 0}
              </p>
              <p className="text-gray-400">Levels per week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {formatNumber(stats.daysTracked > 0 ? Math.round(stats.experienceGained / stats.daysTracked * 30) : 0)}
              </p>
              <p className="text-gray-400">EXP per month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
