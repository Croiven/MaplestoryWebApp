export interface Character {
  id: string
  name: string
  level: number
  job: string
  world: string
  stats: CharacterStats
  equipment?: CharacterEquipment
  createdAt: Date
  updatedAt: Date
  userId?: string
}

export interface CharacterStats {
  str: number
  dex: number
  int: number
  luk: number
  hp: number
  mp: number
}

export interface CharacterEquipment {
  weapon?: string
  armor?: string
  accessories?: string[]
}

export interface CreateCharacterData {
  name: string
  level: number
  job: string
  world: string
  stats: CharacterStats
  equipment?: CharacterEquipment
}

export interface UpdateCharacterData {
  name?: string
  level?: number
  job?: string
  world?: string
  stats?: Partial<CharacterStats>
  equipment?: Partial<CharacterEquipment>
}

export interface CharacterFilters {
  world?: string
  job?: string
  minLevel?: number
  maxLevel?: number
  search?: string
}
