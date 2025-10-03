import { Sword, Database, Bot, Server } from 'lucide-react'

export function Home() {
  const features = [
    {
      icon: Sword,
      title: 'Character Management',
      description: 'View and manage your MapleStory characters with detailed stats and equipment.'
    },
    {
      icon: Database,
      title: 'Data Storage',
      description: 'Secure database storage for all your character data and progress.'
    },
    {
      icon: Bot,
      title: 'Discord Integration',
      description: 'Connect with Discord bot for real-time updates and notifications.'
    },
    {
      icon: Server,
      title: 'Real-time Updates',
      description: 'Get live updates on character changes and game events.'
    }
  ]

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to MapleStory Web App
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Manage your MapleStory characters, track progress, and connect with the community
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            View Characters
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, description }, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Icon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
