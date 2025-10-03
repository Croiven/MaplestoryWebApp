import { 
  Client, 
  GuildMember, 
  ButtonInteraction, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} from 'discord.js'
import { CharacterService } from '../services/CharacterService'
import { WebhookService } from '../services/WebhookService'

export class EventHandler {
  private client: Client
  private characterService: CharacterService
  private webhookService: WebhookService

  constructor(client: Client, characterService: CharacterService, webhookService: WebhookService) {
    this.client = client
    this.characterService = characterService
    this.webhookService = webhookService
  }

  async handleGuildMemberAdd(member: GuildMember) {
    try {
      const welcomeChannel = member.guild.channels.cache.find(
        channel => channel.name.includes('welcome') || channel.name.includes('general')
      )

      if (welcomeChannel && welcomeChannel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setTitle('🎉 Welcome to MapleStory Community!')
          .setDescription(`Welcome ${member.user.username} to our MapleStory community!`)
          .addFields(
            { name: '📊 Character Management', value: 'Use `/characters` to view your characters', inline: true },
            { name: '🆘 Need Help?', value: 'Use `/help` for available commands', inline: true },
            { name: '🌐 Web App', value: 'Visit our web app for full features!', inline: true }
          )
          .setColor(0x00ff00)
          .setTimestamp()
          .setThumbnail(member.user.displayAvatarURL())

        await welcomeChannel.send({ embeds: [embed] })
      }

      // Send webhook notification
      await this.webhookService.sendMemberJoinNotification(member)
    } catch (error) {
      console.error('Error handling guild member add:', error)
    }
  }

  async handleGuildMemberRemove(member: GuildMember) {
    try {
      // Send webhook notification
      await this.webhookService.sendMemberLeaveNotification(member)
    } catch (error) {
      console.error('Error handling guild member remove:', error)
    }
  }

  async handleButtonInteraction(interaction: ButtonInteraction) {
    try {
      const { customId } = interaction

      if (customId.startsWith('character_detail_')) {
        await this.handleCharacterDetail(interaction)
      } else {
        await interaction.reply({ 
          content: 'Unknown button interaction!', 
          ephemeral: true 
        })
      }
    } catch (error) {
      console.error('Error handling button interaction:', error)
      await interaction.reply({ 
        content: 'An error occurred while processing your request.', 
        ephemeral: true 
      })
    }
  }

  private async handleCharacterDetail(interaction: ButtonInteraction) {
    const characterId = interaction.customId.replace('character_detail_', '')
    
    try {
      const character = await this.characterService.getCharacterById(characterId)
      
      if (!character) {
        await interaction.reply({ 
          content: 'Character not found!', 
          ephemeral: true 
        })
        return
      }

      const embed = new EmbedBuilder()
        .setTitle(`📊 ${character.name} - Detailed Stats`)
        .setDescription(`**${character.job}** • Level ${character.level} • ${character.world}`)
        .addFields(
          { name: 'Strength', value: character.stats.str.toString(), inline: true },
          { name: 'Dexterity', value: character.stats.dex.toString(), inline: true },
          { name: 'Intelligence', value: character.stats.int.toString(), inline: true },
          { name: 'Luck', value: character.stats.luk.toString(), inline: true },
          { name: 'Health Points', value: character.stats.hp.toLocaleString(), inline: true },
          { name: 'Mana Points', value: character.stats.mp.toLocaleString(), inline: true }
        )
        .setColor(0x0099ff)
        .setTimestamp()

      await interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (error) {
      console.error('Error fetching character details:', error)
      await interaction.reply({ 
        content: 'An error occurred while fetching character details.', 
        ephemeral: true 
      })
    }
  }

}
