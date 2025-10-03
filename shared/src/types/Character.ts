export interface Character {
  id: string
  name: string
  level: number
  job: string
  world: string
  stats: CharacterStats
  createdAt: Date
  updatedAt: Date
  userId?: string
}

export interface CharacterStats {
  // Basic Stats
  str: number
  dex: number
  int: number
  luk: number
  hp: number
  mp: number
  
  // Combat Power
  combatPower: number
  
  // Damage Stats
  damageRange: number
  finalDamage: number
  ignoreDefense: number
  attackPower: number
  magicAttack: number
  
  // Cooldown Stats
  cooldownReduction: number
  cooldownNotApplied: number
  
  // Status & Buff Stats
  additionalStatusDamage: number
  damage: number
  bossDamage: number
  normalEnemyDamage: number
  criticalRate: number
  criticalDamage: number
  buffDuration: number
  ignoreElementalResistance: number
  summonsDurationIncrease: number
  
  // Utility Stats
  mesosObtained: number
  itemDropRate: number
  additionalExpObtained: number
  
  // Power Stats
  starForce: number
  arcanePower: number
  sacredPower: number
  
  // Social Stats
  legion: number
  muLungDojo: number
  fame: number
}

export interface CreateCharacterData {
  name: string
  level: number
  job: string
  world: string
  stats: CharacterStats
}

export interface UpdateCharacterData {
  name?: string
  level?: number
  job?: string
  world?: string
  stats?: Partial<CharacterStats>
}

export interface CharacterFilters {
  world?: string
  job?: string
  minLevel?: number
  maxLevel?: number
  search?: string
}
