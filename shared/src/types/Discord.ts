export interface DiscordUser {
  id: string
  discordId: string
  username: string
  discriminator?: string
  avatar?: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface DiscordWebhookData {
  title: string
  description?: string
  color?: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  timestamp?: string
  thumbnail?: {
    url: string
  }
  footer?: {
    text: string
  }
}

export interface DiscordCommand {
  name: string
  description: string
  options?: Array<{
    name: string
    description: string
    type: number
    required?: boolean
    choices?: Array<{
      name: string
      value: string
    }>
  }>
}
