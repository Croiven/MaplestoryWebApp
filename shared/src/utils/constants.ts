export const MAPLESTORY_WORLDS = [
  'Scania',
  'Bera',
  'Broa',
  'Khaini',
  'Galicia',
  'El Nido',
  'Zenith',
  'Arcania',
  'Chaos',
  'Nova',
  'Kradia',
  'Renegades',
  'Aurora',
  'Elysium',
  'Luna',
  'Zen',
  'Croa',
  'Judis',
  'Kastia',
  'Kradia',
  'Mardia',
  'Nautilus',
  'Yellonde'
] as const

export const MAPLESTORY_JOBS = [
  // Beginner Jobs
  'Beginner',
  'Noblesse',
  'Legend',
  
  // Warrior Branch
  'Warrior',
  'Fighter',
  'Crusader',
  'Hero',
  'Page',
  'White Knight',
  'Paladin',
  'Spearman',
  'Dragon Knight',
  'Dark Knight',
  
  // Magician Branch
  'Magician',
  'Fire/Poison Wizard',
  'Fire/Poison Mage',
  'Arch Mage (F/P)',
  'Ice/Lightning Wizard',
  'Ice/Lightning Mage',
  'Arch Mage (I/L)',
  'Cleric',
  'Priest',
  'Bishop',
  
  // Bowman Branch
  'Bowman',
  'Hunter',
  'Ranger',
  'Bowmaster',
  'Crossbowman',
  'Sniper',
  'Marksman',
  
  // Thief Branch
  'Thief',
  'Assassin',
  'Hermit',
  'Night Lord',
  'Bandit',
  'Chief Bandit',
  'Shadower',
  
  // Pirate Branch
  'Pirate',
  'Brawler',
  'Marauder',
  'Buccaneer',
  'Gunslinger',
  'Outlaw',
  'Corsair',
  
  // Cygnus Knights
  'Soul Master',
  'Flame Wizard',
  'Wind Breaker',
  'Night Walker',
  'Striker',
  'Mihile',
  
  // Resistance
  'Battle Mage',
  'Wild Hunter',
  'Mechanic',
  'Demon Slayer',
  'Demon Avenger',
  'Xenon',
  
  // Nova
  'Kaiser',
  'Angelic Buster',
  'Cadena',
  'Kain',
  
  // Flora
  'Adele',
  'Illium',
  'Khali',
  'Ark',
  
  // Anima
  'Hoyoung',
  'Lara',
  'Zero',
  
  // Other
  'Beast Tamer',
  'Kinesis',
  'Hayato',
  'Kanna',
  'Mihile',
  'Blaster',
  'Pathfinder',
  'Dual Blade',
  'Cannoneer',
  'Jett',
  'Hayato',
  'Kanna',
  'Mihile',
  'Blaster',
  'Pathfinder',
  'Dual Blade',
  'Cannoneer',
  'Jett'
] as const

export const MAPLESTORY_ITEM_TYPES = [
  'Weapon',
  'Armor',
  'Accessory',
  'Consumable',
  'Etc',
  'Cash',
  'Pet',
  'Mount',
  'Skill Book',
  'Recipe',
  'Quest Item'
] as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me'
  },
  CHARACTERS: {
    LIST: '/api/characters',
    CREATE: '/api/characters',
    GET: '/api/characters/:id',
    UPDATE: '/api/characters/:id',
    DELETE: '/api/characters/:id'
  }
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256'
} as const
