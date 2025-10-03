# MapleStory Web App

A comprehensive web application for managing MapleStory characters with React frontend, Node.js backend, PostgreSQL database, and Discord bot integration.

## 🚀 Features

- **Character Management**: Create, view, edit, and delete MapleStory characters
- **Real-time Updates**: Live character data synchronization
- **Discord Integration**: Bot commands for character lookup and management
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Database Management**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript support across all components

## 🏗️ Architecture

```
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express.js backend (Node.js + TypeScript)
├── database/        # Prisma schema and migrations
├── discord-bot/     # Discord bot (discord.js + TypeScript)
├── shared/          # Shared types and utilities
└── docker-compose.yml
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Prisma** ORM for database management
- **JWT** for authentication
- **Express Rate Limit** for API protection
- **Helmet** for security headers

### Database
- **PostgreSQL** as the primary database
- **Prisma** as the ORM
- **Redis** for caching (optional)

### Discord Bot
- **discord.js v14** for Discord API integration
- **Slash commands** for user interaction
- **Webhook integration** for notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- PostgreSQL 15+
- Docker (optional)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd MaplestoryWebApp
npm install
```

### 2. Environment Setup

Copy the environment files and configure them:

```bash
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
cp discord-bot/.env.example discord-bot/.env
```

Update the `.env` files with your configuration:

- **Database**: Set up PostgreSQL and update `DATABASE_URL`
- **Discord Bot**: Get bot token from Discord Developer Portal
- **JWT Secrets**: Generate secure random strings

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 4. Development

#### Option A: Using Docker (Recommended)

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option B: Local Development

```bash
# Start all services
npm run dev

# Or start individually
npm run dev:client    # React frontend (port 3000)
npm run dev:server    # Express backend (port 5000)
npm run dev:discord   # Discord bot
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **Prisma Studio**: http://localhost:5555 (if running locally)

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Character Endpoints

- `GET /api/characters` - Get all characters
- `POST /api/characters` - Create new character
- `GET /api/characters/:id` - Get character by ID
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

## 🤖 Discord Bot Commands

- `/ping` - Check bot latency
- `/character <name>` - Get character information
- `/characters` - List all characters
- `/help` - Show available commands

## 🐳 Docker Commands

```bash
# Development
docker-compose up -d

# Production build
docker build -f Dockerfile.prod -t maplestory-webapp .

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Clean up
docker-compose down -v
```

## 🗄️ Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run migrate

# Open Prisma Studio
npm run studio

# Reset database
npm run db:reset
```

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install:all

# Build all packages
npm run build

# Development mode
npm run dev

# Lint all packages
npm run lint

# Test (when implemented)
npm run test
```

## 📁 Project Structure

```
MaplestoryWebApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
│   └── package.json
├── database/               # Database layer
│   ├── schema.prisma       # Prisma schema
│   ├── src/seed.ts         # Database seeding
│   └── package.json
├── discord-bot/            # Discord bot
│   ├── src/
│   │   ├── handlers/       # Command and event handlers
│   │   ├── services/       # Bot services
│   │   └── index.ts        # Bot entry point
│   └── package.json
├── shared/                 # Shared code
│   ├── src/
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── docker-compose.yml      # Docker configuration
├── Dockerfile.dev          # Development Dockerfile
├── Dockerfile.prod         # Production Dockerfile
└── package.json            # Root package.json
```

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection via Prisma

## 🚀 Deployment

### Production Environment Variables

Ensure these are set in production:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
DISCORD_BOT_TOKEN=your-discord-bot-token
```

### Docker Production

```bash
# Build production image
docker build -f Dockerfile.prod -t maplestory-webapp .

# Run production container
docker run -p 5000:5000 --env-file .env maplestory-webapp
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our Discord server for community support

## 🎯 Roadmap

- [ ] Character equipment management
- [ ] Guild system integration
- [ ] Real-time character updates
- [ ] Mobile app support
- [ ] Advanced character statistics
- [ ] Social features and leaderboards
- [ ] Integration with MapleStory APIs
- [ ] Character import/export functionality

---

**Happy coding! 🍁**