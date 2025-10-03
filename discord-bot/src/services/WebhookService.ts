import axios from 'axios'

export class WebhookService {
  private webhookUrl: string

  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || ''
  }

  async sendMemberJoinNotification(member: any) {
    if (!this.webhookUrl) return

    try {
      const embed = {
        title: '👋 New Member Joined',
        description: `${member.user.username} joined the server`,
        color: 0x00ff00,
        fields: [
          {
            name: 'User',
            value: `${member.user.username}#${member.user.discriminator}`,
            inline: true
          },
          {
            name: 'Server',
            value: member.guild.name,
            inline: true
          },
          {
            name: 'Member Count',
            value: member.guild.memberCount.toString(),
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        thumbnail: {
          url: member.user.displayAvatarURL()
        }
      }

      await axios.post(this.webhookUrl, {
        embeds: [embed]
      })
    } catch (error) {
      console.error('Error sending member join webhook:', error)
    }
  }

  async sendMemberLeaveNotification(member: any) {
    if (!this.webhookUrl) return

    try {
      const embed = {
        title: '👋 Member Left',
        description: `${member.user.username} left the server`,
        color: 0xff0000,
        fields: [
          {
            name: 'User',
            value: `${member.user.username}#${member.user.discriminator}`,
            inline: true
          },
          {
            name: 'Server',
            value: member.guild.name,
            inline: true
          },
          {
            name: 'Member Count',
            value: member.guild.memberCount.toString(),
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        thumbnail: {
          url: member.user.displayAvatarURL()
        }
      }

      await axios.post(this.webhookUrl, {
        embeds: [embed]
      })
    } catch (error) {
      console.error('Error sending member leave webhook:', error)
    }
  }

  async sendCharacterUpdateNotification(character: any, action: 'created' | 'updated' | 'deleted') {
    if (!this.webhookUrl) return

    try {
      const actionEmojis = {
        created: '✨',
        updated: '🔄',
        deleted: '🗑️'
      }

      const actionColors = {
        created: 0x00ff00,
        updated: 0x0099ff,
        deleted: 0xff0000
      }

      const embed = {
        title: `${actionEmojis[action]} Character ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        description: `Character **${character.name}** was ${action}`,
        color: actionColors[action],
        fields: [
          {
            name: 'Character',
            value: character.name,
            inline: true
          },
          {
            name: 'Job',
            value: character.job,
            inline: true
          },
          {
            name: 'Level',
            value: character.level.toString(),
            inline: true
          },
          {
            name: 'World',
            value: character.world,
            inline: true
          }
        ],
        timestamp: new Date().toISOString()
      }

      await axios.post(this.webhookUrl, {
        embeds: [embed]
      })
    } catch (error) {
      console.error('Error sending character update webhook:', error)
    }
  }

  async sendServerStatusNotification(status: 'online' | 'offline' | 'maintenance') {
    if (!this.webhookUrl) return

    try {
      const statusEmojis = {
        online: '🟢',
        offline: '🔴',
        maintenance: '🟡'
      }

      const statusColors = {
        online: 0x00ff00,
        offline: 0xff0000,
        maintenance: 0xffaa00
      }

      const embed = {
        title: `${statusEmojis[status]} Server Status Update`,
        description: `The MapleStory Web App server is now **${status.toUpperCase()}**`,
        color: statusColors[status],
        timestamp: new Date().toISOString()
      }

      await axios.post(this.webhookUrl, {
        embeds: [embed]
      })
    } catch (error) {
      console.error('Error sending server status webhook:', error)
    }
  }
}
