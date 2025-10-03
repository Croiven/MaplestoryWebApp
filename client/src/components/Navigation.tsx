import { Link, useLocation } from 'react-router-dom'
import { Sword, Home, Users, UserCheck } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/characters', label: 'Characters', icon: Users },
    { path: '/users', label: 'Users', icon: UserCheck },
  ]

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Sword className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">MapleStory Web App</span>
          </div>
          
          <div className="flex space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
