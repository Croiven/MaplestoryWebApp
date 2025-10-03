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
          // Basic Stats
          str: 9999,
          dex: 1000,
          int: 100,
          luk: 100,
          hp: 50000,
          mp: 15000,
          
          // Combat Power
          combatPower: 615480646,
          
          // Damage Stats
          damageRange: 162354023,
          finalDamage: 45.20,
          ignoreDefense: 97.14,
          attackPower: 11762,
          magicAttack: 2656,
          
          // Cooldown Stats
          cooldownReduction: 4,
          cooldownNotApplied: 26.50,
          
          // Status & Buff Stats
          additionalStatusDamage: 12.00,
          damage: 84.00,
          bossDamage: 482.00,
          normalEnemyDamage: 12.00,
          criticalRate: 219,
          criticalDamage: 110.05,
          buffDuration: 50,
          ignoreElementalResistance: 5.00,
          summonsDurationIncrease: 10,
          
          // Utility Stats
          mesosObtained: 28,
          itemDropRate: 53,
          additionalExpObtained: 195.00,
          
          // Power Stats
          starForce: 404,
          arcanePower: 1350,
          sacredPower: 750,
          
          // Social Stats
          legion: 9578,
          muLungDojo: 83,
          fame: 333
        },
        userId: user1.id
      },
      {
        name: 'MageMaster',
        level: 200,
        job: 'Arch Mage (Ice/Lightning)',
        world: 'Bera',
        stats: {
          str: 100, dex: 100, int: 9999, luk: 1000, hp: 30000, mp: 50000,
          combatPower: 300000000, damageRange: 80000000, finalDamage: 30.00, ignoreDefense: 85.00,
          attackPower: 5000, magicAttack: 12000, cooldownReduction: 2, cooldownNotApplied: 20.00,
          additionalStatusDamage: 8.00, damage: 60.00, bossDamage: 350.00, normalEnemyDamage: 8.00,
          criticalRate: 180, criticalDamage: 95.00, buffDuration: 40, ignoreElementalResistance: 3.00,
          summonsDurationIncrease: 8, mesosObtained: 20, itemDropRate: 40, additionalExpObtained: 150.00,
          starForce: 300, arcanePower: 1000, sacredPower: 500, legion: 7500, muLungDojo: 60, fame: 250
        },
        userId: user1.id
      },
      {
        name: 'BowMaster',
        level: 180,
        job: 'Bow Master',
        world: 'Scania',
        stats: {
          str: 100, dex: 9999, int: 100, luk: 1000, hp: 35000, mp: 20000,
          combatPower: 250000000, damageRange: 60000000, finalDamage: 25.00, ignoreDefense: 80.00,
          attackPower: 8000, magicAttack: 2000, cooldownReduction: 1, cooldownNotApplied: 15.00,
          additionalStatusDamage: 6.00, damage: 50.00, bossDamage: 300.00, normalEnemyDamage: 6.00,
          criticalRate: 200, criticalDamage: 100.00, buffDuration: 35, ignoreElementalResistance: 2.00,
          summonsDurationIncrease: 6, mesosObtained: 15, itemDropRate: 35, additionalExpObtained: 120.00,
          starForce: 250, arcanePower: 800, sacredPower: 400, legion: 6000, muLungDojo: 50, fame: 200
        },
        userId: user2.id
      },
      {
        name: 'NightLord',
        level: 220,
        job: 'Night Lord',
        world: 'Windia',
        stats: {
          str: 100, dex: 1000, int: 100, luk: 9999, hp: 40000, mp: 25000,
          combatPower: 400000000, damageRange: 100000000, finalDamage: 35.00, ignoreDefense: 90.00,
          attackPower: 6000, magicAttack: 3000, cooldownReduction: 3, cooldownNotApplied: 25.00,
          additionalStatusDamage: 10.00, damage: 70.00, bossDamage: 400.00, normalEnemyDamage: 10.00,
          criticalRate: 250, criticalDamage: 105.00, buffDuration: 45, ignoreElementalResistance: 4.00,
          summonsDurationIncrease: 8, mesosObtained: 25, itemDropRate: 45, additionalExpObtained: 170.00,
          starForce: 350, arcanePower: 1200, sacredPower: 600, legion: 8500, muLungDojo: 70, fame: 300
        },
        userId: user2.id
      },
      {
        name: 'Paladin',
        level: 190,
        job: 'Paladin',
        world: 'Bera',
        stats: {
          str: 8000, dex: 1000, int: 100, luk: 100, hp: 60000, mp: 10000,
          combatPower: 350000000, damageRange: 90000000, finalDamage: 32.00, ignoreDefense: 88.00,
          attackPower: 10000, magicAttack: 1500, cooldownReduction: 2, cooldownNotApplied: 22.00,
          additionalStatusDamage: 9.00, damage: 65.00, bossDamage: 380.00, normalEnemyDamage: 9.00,
          criticalRate: 190, criticalDamage: 98.00, buffDuration: 42, ignoreElementalResistance: 3.50,
          summonsDurationIncrease: 7, mesosObtained: 22, itemDropRate: 42, additionalExpObtained: 160.00,
          starForce: 320, arcanePower: 1100, sacredPower: 550, legion: 8000, muLungDojo: 65, fame: 280
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
