export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long')
  }
  
  if (username.length > 30) {
    errors.push('Username must be less than 30 characters')
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCharacterName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (name.length < 1) {
    errors.push('Character name is required')
  }
  
  if (name.length > 50) {
    errors.push('Character name must be less than 50 characters')
  }
  
  if (!/^[a-zA-Z0-9\s_-]+$/.test(name)) {
    errors.push('Character name can only contain letters, numbers, spaces, underscores, and hyphens')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateLevel = (level: number): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!Number.isInteger(level)) {
    errors.push('Level must be a whole number')
  }
  
  if (level < 1) {
    errors.push('Level must be at least 1')
  }
  
  if (level > 300) {
    errors.push('Level must be at most 300')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateStats = (stats: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  const requiredStats = ['str', 'dex', 'int', 'luk', 'hp', 'mp']
  
  for (const stat of requiredStats) {
    if (!(stat in stats)) {
      errors.push(`${stat.toUpperCase()} is required`)
      continue
    }
    
    const value = stats[stat]
    if (!Number.isInteger(value)) {
      errors.push(`${stat.toUpperCase()} must be a whole number`)
    } else if (value < 0) {
      errors.push(`${stat.toUpperCase()} must be non-negative`)
    }
  }
  
  if (stats.hp !== undefined && stats.hp <= 0) {
    errors.push('HP must be positive')
  }
  
  if (stats.mp !== undefined && stats.mp <= 0) {
    errors.push('MP must be positive')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
