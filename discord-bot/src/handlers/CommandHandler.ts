import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} from 'discord.js'
import { CharacterService } from '../services/CharacterService'

export class CommandHandler {
  private characterService: CharacterService

  constructor(characterService: CharacterService) {
    this.characterService = characterService
  }

  async handleCommand(interaction: ChatInputCommandInteraction) {
    const { commandName } = interaction

    try {
      switch (commandName) {
        case 'ping':
          await this.handlePing(interaction)
          break
        case 'character':
          await this.handleCharacter(interaction)
          break
        case 'characters':
          await this.handleCharacters(interaction)
          break
        case 'help':
          await this.handleHelp(interaction)
          break
        default:
          await interaction.reply({ 
            content: 'Unknown command!', 
            ephemeral: true 
          })
      }
    } catch (error) {
      console.error(`Error handling command ${commandName}:`, error)
      await interaction.reply({ 
        content: 'An error occurred while processing your command.', 
        ephemeral: true 
      })
    }
  }

  private async handlePing(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setDescription(`Latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`)
      .setColor(0x00ff00)
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }

  private async handleCharacter(interaction: ChatInputCommandInteraction) {
    const characterName = interaction.options.getString('name', true)
    
    try {
      // In a real implementation, you'd fetch from your database
      const character = await this.characterService.getCharacterByName(characterName)
      
      if (!character) {
        await interaction.reply({ 
          content: `Character "${characterName}" not found!`, 
          ephemeral: true 
        })
        return
      }

      const embed = new EmbedBuilder()
        .setTitle(`📊 ${character.name}`)
        .setDescription(`**${character.job}** • Level ${character.level} • ${character.world}`)
        .addFields(
          { name: 'STR', value: character.stats.str.toString(), inline: true },
          { name: 'DEX', value: character.stats.dex.toString(), inline: true },
          { name: 'INT', value: character.stats.int.toString(), inline: true },
          { name: 'LUK', value: character.stats.luk.toString(), inline: true },
          { name: 'HP', value: character.stats.hp.toLocaleString(), inline: true },
          { name: 'MP', value: character.stats.mp.toLocaleString(), inline: true }
        )
        .setColor(0x0099ff)
        .setTimestamp()


      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`character_detail_${character.id}`)
            .setLabel('View Details')
            .setStyle(ButtonStyle.Primary),
        )

      await interaction.reply({ embeds: [embed], components: [row] })
    } catch (error) {
      console.error('Error fetching character:', error)
      await interaction.reply({ 
        content: 'An error occurred while fetching character data.', 
        ephemeral: true 
      })
    }
  }

  private async handleCharacters(interaction: ChatInputCommandInteraction) {
    try {
      const characters = await this.characterService.getAllCharacters()
      
      if (characters.length === 0) {
        await interaction.reply({ 
          content: 'No characters found!', 
          ephemeral: true 
        })
        return
      }

      const embed = new EmbedBuilder()
        .setTitle('📋 Character List')
        .setDescription('Here are all available characters:')
        .setColor(0x0099ff)
        .setTimestamp()

      characters.slice(0, 10).forEach((char, index) => {
        embed.addFields({
          name: `${index + 1}. ${char.name}`,
          value: `**${char.job}** • Level ${char.level} • ${char.world}`,
          inline: false
        })
      })

      if (characters.length > 10) {
        embed.setFooter({ text: `And ${characters.length - 10} more...` })
      }

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching characters:', error)
      await interaction.reply({ 
        content: 'An error occurred while fetching characters.', 
        ephemeral: true 
      })
    }
  }

  private async handleHelp(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('🆘 MapleStory Bot Help')
      .setDescription('Here are the available commands:')
      .addFields(
        { name: '/ping', value: 'Check bot latency', inline: true },
        { name: '/character <name>', value: 'Get character information', inline: true },
        { name: '/characters', value: 'List all characters', inline: true },
        { name: '/help', value: 'Show this help message', inline: true }
      )
      .setColor(0x0099ff)
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }
}
