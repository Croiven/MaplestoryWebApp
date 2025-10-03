const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function addTestData() {
  try {
    console.log('🌱 Adding test data...')

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const user1 = await prisma.user.upsert({
      where: { email: 'test1@example.com' },
      update: {},
      create: {
        username: 'TestUser1',
        email: 'test1@example.com',
        password: hashedPassword
      }
    })

    const user2 = await prisma.user.upsert({
      where: { email: 'test2@example.com' },
      update: {},
      create: {
        username: 'TestUser2',
        email: 'test2@example.com',
        password: hashedPassword
      }
    })

    console.log('✅ Created users:', user1.username, user2.username)

    // Create test characters
    const characters = [
      {
        name: 'MapleWarrior',
        level: 250,
        job: 'Hero',
        world: 'Scania',
        stats: {
          str: 9999,
          dex: 1000,
          int: 100,
          luk: 100,
          hp: 50000,
          mp: 15000
        },
        userId: user1.id
      },
      {
        name: 'MageMaster',
        level: 200,
        job: 'Arch Mage (Ice/Lightning)',
        world: 'Bera',
        stats: {
          str: 100,
          dex: 100,
          int: 9999,
          luk: 1000,
          hp: 30000,
          mp: 50000
        },
        userId: user1.id
      },
      {
        name: 'BowMaster',
        level: 180,
        job: 'Bow Master',
        world: 'Scania',
        stats: {
          str: 100,
          dex: 9999,
          int: 100,
          luk: 1000,
          hp: 35000,
          mp: 20000
        },
        userId: user2.id
      },
      {
        name: 'NightLord',
        level: 220,
        job: 'Night Lord',
        world: 'Windia',
        stats: {
          str: 100,
          dex: 1000,
          int: 100,
          luk: 9999,
          hp: 40000,
          mp: 25000
        },
        userId: user2.id
      },
      {
        name: 'Paladin',
        level: 190,
        job: 'Paladin',
        world: 'Bera',
        stats: {
          str: 8000,
          dex: 1000,
          int: 100,
          luk: 100,
          hp: 60000,
          mp: 10000
        },
        userId: user1.id
      }
    ]

    for (const charData of characters) {
      await prisma.character.create({
        data: charData
      })
    }

    console.log('✅ Created 5 test characters')

    // Create Discord user connections
    await prisma.discordUser.upsert({
      where: { discordId: '123456789012345678' },
      update: {},
      create: {
        discordId: '123456789012345678',
        username: 'TestDiscordUser',
        discriminator: '1234',
        userId: user1.id
      }
    })

    console.log('✅ Created Discord user connection')

    console.log('🎉 Test data added successfully!')
    console.log('\n📊 Summary:')
    console.log('- 2 users created')
    console.log('- 5 characters created')
    console.log('- 1 Discord user connection created')

  } catch (error) {
    console.error('❌ Error adding test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestData()
