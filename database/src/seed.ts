import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    },
  })

  console.log('✅ Created test user:', user.username)

  // Create sample characters
  const characters = await Promise.all([
    prisma.character.upsert({
      where: { id: 'char1' },
      update: {},
      create: {
        id: 'char1',
        name: 'TestCharacter',
        level: 200,
        job: 'Hero',
        world: 'Scania',
        userId: user.id,
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
      },
    }),
    prisma.character.upsert({
      where: { id: 'char2' },
      update: {},
      create: {
        id: 'char2',
        name: 'AnotherChar',
        level: 150,
        job: 'Arch Mage',
        world: 'Bera',
        userId: user.id,
        stats: {
          str: 200,
          dex: 300,
          int: 1200,
          luk: 400,
          hp: 30000,
          mp: 25000
        },
        equipment: {
          weapon: 'Arcane Staff',
          armor: 'Mystic Robes',
          accessories: ['Wizard Hat', 'Magic Ring']
        }
      },
    }),
  ])

  console.log('✅ Created sample characters:', characters.map(c => c.name))

  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
