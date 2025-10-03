export interface User {
  id: string
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenData {
  refreshToken: string
}
