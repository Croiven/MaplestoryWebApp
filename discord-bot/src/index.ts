import { Client, GatewayIntentBits, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } from 'discord.js'
import { CommandHandler } from './handlers/CommandHandler'
import { EventHandler } from './handlers/EventHandler'
import { CharacterService } from './services/CharacterService'
import { WebhookService } from './services/WebhookService'
import { commands } from './commands'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config()

// Debug: Check if token is loaded
console.log('Discord Bot Token loaded:', process.env.DISCORD_BOT_TOKEN ? 'YES' : 'NO')

class MapleStoryBot {
  private client: Client
  private commandHandler: CommandHandler
  private eventHandler: EventHandler
  private characterService: CharacterService
  private webhookService: WebhookService

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ]
    })

    this.characterService = new CharacterService()
    this.webhookService = new WebhookService()
    this.commandHandler = new CommandHandler(this.characterService)
    this.eventHandler = new EventHandler(this.client, this.characterService, this.webhookService)

    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.client.once(Events.ClientReady, (readyClient) => {
      console.log(`🤖 Bot is ready! Logged in as ${readyClient.user.tag}`)
      console.log(`📊 Serving ${readyClient.guilds.cache.size} guilds`)
    })

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        await this.commandHandler.handleCommand(interaction)
      } else if (interaction.isButton()) {
        await this.eventHandler.handleButtonInteraction(interaction)
      }
    })

    this.client.on(Events.GuildMemberAdd, async (member) => {
      await this.eventHandler.handleGuildMemberAdd(member)
    })

    this.client.on(Events.GuildMemberRemove, async (member) => {
      if (member.partial) return // Skip partial members
      await this.eventHandler.handleGuildMemberRemove(member)
    })

    this.client.on(Events.Error, (error) => {
      console.error('Discord client error:', error)
    })
  }

  private async registerCommands() {
    try {
      const token = process.env.DISCORD_BOT_TOKEN
      const clientId = process.env.DISCORD_CLIENT_ID
      
      if (!token || !clientId) {
        throw new Error('DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID are required')
      }

      const rest = new REST().setToken(token)
      
      console.log('🔄 Started refreshing application (/) commands.')

      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      ) as any[]

      console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
      console.error('❌ Error registering commands:', error)
    }
  }

  public async start() {
    try {
      const token = process.env.DISCORD_BOT_TOKEN
      if (!token) {
        throw new Error('DISCORD_BOT_TOKEN is required')
      }

      // Register commands first
      await this.registerCommands()

      await this.client.login(token)
    } catch (error) {
      console.error('Failed to start bot:', error)
      process.exit(1)
    }
  }

  public async stop() {
    await this.client.destroy()
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down bot...')
  await bot.stop()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down bot...')
  await bot.stop()
  process.exit(0)
})

const bot = new MapleStoryBot()
bot.start()
