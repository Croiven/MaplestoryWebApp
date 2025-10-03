import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Users, Calendar } from 'lucide-react'

interface DiscordUser {
  id: string
  discordId: string
  username: string
  discriminator: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export function UserList() {
  const [users, setUsers] = useState<DiscordUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()
        setUsers(data.users)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No users found</h3>
        <p className="text-gray-400">No Discord users have been registered yet.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
          <Users className="h-8 w-8" />
          <span>Discord Users</span>
        </h1>
        <p className="text-gray-400">Browse all registered Discord users and their characters</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {user.username}
                  {user.discriminator && user.discriminator !== '0' && (
                    <span className="text-gray-400">#{user.discriminator}</span>
                  )}
                </h3>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link
                to={`/users/${user.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
              >
                View Characters
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
