import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} from 'discord.js'
import { CharacterService } from '../services/CharacterService'
import { OCRService } from '../services/OCRService'
import { UserService } from '../services/UserService'

export class CommandHandler {
  private characterService: CharacterService
  private ocrService: OCRService
  private userService: UserService

  constructor(characterService: CharacterService) {
    this.characterService = characterService
    this.ocrService = new OCRService()
    this.userService = new UserService()
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
        case 'addcharacter':
          await this.handleAddCharacter(interaction)
          break
        case 'registeruser':
          await this.handleRegisterUser(interaction)
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
    const subcommand = interaction.options.getSubcommand()
    
    switch (subcommand) {
      case 'search':
        await this.handleCharacterSearch(interaction)
        break
      case 'world':
        await this.handleCharacterWorld(interaction)
        break
      case 'job':
        await this.handleCharacterJob(interaction)
        break
        case 'top':
          await this.handleCharacterTop(interaction)
          break
      default:
        await interaction.reply({ 
          content: 'Unknown character subcommand!', 
          ephemeral: true 
        })
    }
  }

  private async handleCharacterSearch(interaction: ChatInputCommandInteraction) {
    const characterName = interaction.options.getString('name', true)
    
    try {
      const characters = await this.characterService.searchCharactersByName(characterName)
      const character = characters.length > 0 ? characters[0] : null
      
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
            .setStyle(ButtonStyle.Primary)
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

  private async handleCharacterWorld(interaction: ChatInputCommandInteraction) {
    const world = interaction.options.getString('world', true)
    
    try {
      const characters = await this.characterService.getCharactersByWorld(world)
      
      if (characters.length === 0) {
        await interaction.reply({ 
          content: `No characters found in world "${world}"!`, 
          ephemeral: true 
        })
        return
      }

      const embed = new EmbedBuilder()
        .setTitle(`🌍 Characters in ${world}`)
        .setDescription(`Found ${characters.length} character(s)`)
        .setColor(0x0099ff)
        .setTimestamp()

      characters.slice(0, 10).forEach(char => {
        embed.addFields({
          name: char.name,
          value: `**${char.job}** • Level ${char.level}`,
          inline: true
        })
      })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching characters by world:', error)
      await interaction.reply({ 
        content: 'An error occurred while fetching characters.', 
        ephemeral: true 
      })
    }
  }

  private async handleCharacterJob(interaction: ChatInputCommandInteraction) {
    const job = interaction.options.getString('job', true)
    
    try {
      const characters = await this.characterService.getCharactersByJob(job)
      
      if (characters.length === 0) {
        await interaction.reply({ 
          content: `No characters found with job "${job}"!`, 
          ephemeral: true 
        })
        return
      }

      const embed = new EmbedBuilder()
        .setTitle(`⚔️ ${job} Characters`)
        .setDescription(`Found ${characters.length} character(s)`)
        .setColor(0x0099ff)
        .setTimestamp()

      characters.slice(0, 10).forEach(char => {
        embed.addFields({
          name: char.name,
          value: `**${char.world}** • Level ${char.level}`,
          inline: true
        })
      })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching characters by job:', error)
      await interaction.reply({ 
        content: 'An error occurred while fetching characters.', 
        ephemeral: true 
      })
    }
  }

  private async handleCharacterTop(interaction: ChatInputCommandInteraction) {
    const limit = interaction.options.getInteger('limit') || 10
    
    try {
      const characters = await this.characterService.getTopCharacters(limit)
      
      if (characters.length === 0) {
        await interaction.reply({ 
          content: 'No characters found!', 
          ephemeral: true 
        })
        return
      }

      const embed = new EmbedBuilder()
        .setTitle(`🏆 Top ${limit} Characters`)
        .setDescription('Ranked by level')
        .setColor(0xffd700)
        .setTimestamp()

      characters.forEach((char, index) => {
        embed.addFields({
          name: `#${index + 1} ${char.name}`,
          value: `**${char.job}** • Level ${char.level} • ${char.world}`,
          inline: false
        })
      })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching top characters:', error)
      await interaction.reply({ 
        content: 'An error occurred while fetching characters.', 
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
        { name: '/character search <name>', value: 'Search for a character by name', inline: true },
        { name: '/character world <world>', value: 'List characters by world', inline: true },
        { name: '/character job <job>', value: 'List characters by job class', inline: true },
        { name: '/character top [limit]', value: 'Show top characters by level', inline: true },
        { name: '/characters', value: 'List all characters', inline: true },
        { name: '/addcharacter', value: 'Add character by uploading screenshot', inline: true },
        { name: '/registeruser', value: 'Register yourself in the database', inline: true },
        { name: '/help', value: 'Show this help message', inline: true }
      )
      .setColor(0x0099ff)
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }


  private async handleAddCharacter(interaction: ChatInputCommandInteraction) {
    try {
      const attachment = interaction.options.getAttachment('screenshot', true)
      const isMain = interaction.options.getBoolean('main') || false

      // Check if it's an image
      if (!attachment.contentType?.startsWith('image/')) {
        await interaction.reply({ 
          content: 'Please upload a valid image file!', 
          ephemeral: true 
        })
        return
      }

      // Check if user is registered
      const discordUser = await this.userService.getDiscordUserByDiscordId(interaction.user.id)
      if (!discordUser) {
        await interaction.reply({ 
          content: '❌ You need to register first! Use `/registeruser` to create your account.', 
          ephemeral: true 
        })
        return
      }

      // Send initial processing message
      await interaction.deferReply({ ephemeral: false })

      try {
        // Extract stats from image using OCR
        const extractedStats = await this.ocrService.extractStatsFromImage(attachment.url)
        
        // Use extracted stats (no manual fallbacks)
        const name = extractedStats.name || 'Unknown Character'
        const world = extractedStats.world || 'Luna' // Default to Luna as specified
        const job = extractedStats.job || 'Unknown Job'
        const level = extractedStats.level || 1

        // Create character data with extracted stats
        const characterData = {
          name,
          level,
          job,
          world,
          main: isMain,
          stats: {
            // Basic stats
            str: extractedStats.stats.str || 0,
            dex: extractedStats.stats.dex || 0,
            int: extractedStats.stats.int || 0,
            luk: extractedStats.stats.luk || 0,
            hp: extractedStats.stats.hp || 0,
            mp: extractedStats.stats.mp || 0,
            
            // Combat stats
            combatPower: extractedStats.stats.combatPower || 0,
            damageRange: extractedStats.stats.damageRange || 0,
            finalDamage: extractedStats.stats.finalDamage || 0,
            ignoreDefense: extractedStats.stats.ignoreDefense || 0,
            attackPower: extractedStats.stats.attackPower || 0,
            magicAttack: extractedStats.stats.magicAttack || 0,
            bossDamage: extractedStats.stats.bossDamage || 0,
            criticalRate: extractedStats.stats.criticalRate || 0,
            criticalDamage: extractedStats.stats.criticalDamage || 0,
            
            // Power stats
            starForce: extractedStats.stats.starForce || 0,
            arcanePower: extractedStats.stats.arcanePower || 0,
            sacredPower: extractedStats.stats.sacredPower || 0,
            
            // Social stats
            legion: extractedStats.stats.legion || 0,
            muLungDojo: extractedStats.stats.muLungDojo || "0F",
            fame: extractedStats.stats.fame || 0,
            
            // Cooldown stats
            cooldownReduction: extractedStats.stats.cooldownReduction || "0%",
            cooldownNotApplied: extractedStats.stats.cooldownNotApplied || 0,
            
            // Status & Buff stats
            additionalStatusDamage: extractedStats.stats.additionalStatusDamage || 0,
            damage: extractedStats.stats.damage || 0,
            normalEnemyDamage: extractedStats.stats.normalEnemyDamage || 0,
            buffDuration: extractedStats.stats.buffDuration || 0,
            ignoreElementalResistance: extractedStats.stats.ignoreElementalResistance || 0,
            summonsDurationIncrease: extractedStats.stats.summonsDurationIncrease || 0,
            
            // Utility stats
            mesosObtained: extractedStats.stats.mesosObtained || 0,
            itemDropRate: extractedStats.stats.itemDropRate || 0,
            additionalExpObtained: extractedStats.stats.additionalExpObtained || 0,
            
            // Store original extracted stats for detection logic
            _originalExtracted: extractedStats.stats
          },
          discordUserId: discordUser.id
        }

        // Check if character already exists for this user
        const existingCharacters = await this.characterService.searchCharactersByName(name)
        const existingCharacter = existingCharacters.find(char => 
          char.discordUserId === discordUser.id && 
          char.name.toLowerCase() === name.toLowerCase()
        )

        let character
        let isUpdate = false

        if (existingCharacter) {
          // Update existing character
          character = await this.characterService.updateCharacter(existingCharacter.id, characterData)
          isUpdate = true
        } else {
          // Create new character
          character = await this.characterService.createCharacter(characterData)
        }

        if (!character) {
          await interaction.editReply({ 
            content: '❌ Failed to save character data. Please try again.' 
          })
          return
        }

        const embed = new EmbedBuilder()
          .setTitle(isUpdate ? '🔄 Character Updated Successfully!' : '✅ Character Added Successfully!')
          .setDescription(`**${character.name}** has been ${isUpdate ? 'updated' : 'added to the database'}`)
          .setColor(0x00ff00)
          .setTimestamp()
          .setFooter({ text: 'Stats extracted from screenshot using OCR' })

        // Basic Info
        embed.addFields(
          { name: 'Job', value: character.job, inline: true },
          { name: 'Level', value: character.level.toString(), inline: true },
          { name: 'World', value: character.world, inline: true }
        )

        // Combat Power (Top Section)
        const combatPower = (character.stats as any).combatPower > 0 
          ? `✅ Combat Power: ${(character.stats as any).combatPower.toLocaleString()}`
          : `❌ Combat Power: Not detected`
        embed.addFields({ name: 'Combat Power', value: combatPower, inline: false })

        // Basic Stats (Two Columns - Left: HP, STR, INT | Right: MP, DEX, LUK)
        const basicStatsLeft = []
        const basicStatsLeftMissing = []
        const basicStatsRight = []
        const basicStatsRightMissing = []
        
        // Left Column: HP, STR, INT
        if ((character.stats as any)._originalExtracted?.hp !== undefined) basicStatsLeft.push(`✅ HP: ${character.stats.hp.toLocaleString()}`)
        else basicStatsLeftMissing.push(`❌ HP: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.str !== undefined) basicStatsLeft.push(`✅ STR: ${character.stats.str}`)
        else basicStatsLeftMissing.push(`❌ STR: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.int !== undefined) basicStatsLeft.push(`✅ INT: ${character.stats.int}`)
        else basicStatsLeftMissing.push(`❌ INT: Not detected`)
        
        // Right Column: MP, DEX, LUK
        if ((character.stats as any)._originalExtracted?.mp !== undefined) basicStatsRight.push(`✅ MP: ${character.stats.mp.toLocaleString()}`)
        else basicStatsRightMissing.push(`❌ MP: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.dex !== undefined) basicStatsRight.push(`✅ DEX: ${character.stats.dex}`)
        else basicStatsRightMissing.push(`❌ DEX: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.luk !== undefined) basicStatsRight.push(`✅ LUK: ${character.stats.luk}`)
        else basicStatsRightMissing.push(`❌ LUK: Not detected`)
        
        const allBasicStatsLeft = [...basicStatsLeft, ...basicStatsLeftMissing]
        const allBasicStatsRight = [...basicStatsRight, ...basicStatsRightMissing]
        
        embed.addFields(
          { name: 'Basic Stats (Left)', value: allBasicStatsLeft.join('\n'), inline: true },
          { name: 'Basic Stats (Right)', value: allBasicStatsRight.join('\n'), inline: true }
        )

        // Detailed Stats (Two Columns)
        const detailedStatsLeft = []
        const detailedStatsLeftMissing = []
        const detailedStatsRight = []
        const detailedStatsRightMissing = []
        
        // Left Column: DAMAGE RANGE, FINAL DAMAGE, IGNORE DEFENSE, ATTACK POWER, MAGIC ATT, COOLDOWN REDUCTION, COOLDOWN NOT APPLIED, ADDITIONAL STATUS DAMAGE
        if ((character.stats as any)._originalExtracted?.damageRange !== undefined) detailedStatsLeft.push(`✅ Damage Range: ${(character.stats as any).damageRange.toLocaleString()}`)
        else detailedStatsLeftMissing.push(`❌ Damage Range: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.finalDamage !== undefined) detailedStatsLeft.push(`✅ Final Damage: ${(character.stats as any).finalDamage}%`)
        else detailedStatsLeftMissing.push(`❌ Final Damage: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.ignoreDefense !== undefined) detailedStatsLeft.push(`✅ Ignore Defense: ${(character.stats as any).ignoreDefense}%`)
        else detailedStatsLeftMissing.push(`❌ Ignore Defense: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.attackPower !== undefined) detailedStatsLeft.push(`✅ Attack Power: ${(character.stats as any).attackPower.toLocaleString()}`)
        else detailedStatsLeftMissing.push(`❌ Attack Power: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.magicAttack !== undefined) detailedStatsLeft.push(`✅ Magic Attack: ${(character.stats as any).magicAttack.toLocaleString()}`)
        else detailedStatsLeftMissing.push(`❌ Magic Attack: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.cooldownReduction !== undefined) detailedStatsLeft.push(`✅ Cooldown Reduction: ${(character.stats as any).cooldownReduction}`)
        else detailedStatsLeftMissing.push(`❌ Cooldown Reduction: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.cooldownNotApplied !== undefined) detailedStatsLeft.push(`✅ Cooldown Not Applied: ${(character.stats as any).cooldownNotApplied}%`)
        else detailedStatsLeftMissing.push(`❌ Cooldown Not Applied: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.additionalStatusDamage !== undefined) detailedStatsLeft.push(`✅ Additional Status Damage: ${(character.stats as any).additionalStatusDamage}%`)
        else detailedStatsLeftMissing.push(`❌ Additional Status Damage: Not detected`)
        
        // Right Column: DAMAGE, BOSS DAMAGE, NORMAL ENEMY DAMAGE, CRITICAL RATE, CRITICAL DAMAGE, BUFF DURATION, IGNORE ELEMENTAL RESISTANCE, SUMMONS DURATION INCREASE
        if ((character.stats as any)._originalExtracted?.damage !== undefined) detailedStatsRight.push(`✅ Damage: ${(character.stats as any).damage}%`)
        else detailedStatsRightMissing.push(`❌ Damage: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.bossDamage !== undefined) detailedStatsRight.push(`✅ Boss Damage: ${(character.stats as any).bossDamage}%`)
        else detailedStatsRightMissing.push(`❌ Boss Damage: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.normalEnemyDamage !== undefined) detailedStatsRight.push(`✅ Normal Enemy Damage: ${(character.stats as any).normalEnemyDamage}%`)
        else detailedStatsRightMissing.push(`❌ Normal Enemy Damage: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.criticalRate !== undefined) detailedStatsRight.push(`✅ Critical Rate: ${(character.stats as any).criticalRate}%`)
        else detailedStatsRightMissing.push(`❌ Critical Rate: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.criticalDamage !== undefined) detailedStatsRight.push(`✅ Critical Damage: ${(character.stats as any).criticalDamage}%`)
        else detailedStatsRightMissing.push(`❌ Critical Damage: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.buffDuration !== undefined) detailedStatsRight.push(`✅ Buff Duration: ${(character.stats as any).buffDuration}%`)
        else detailedStatsRightMissing.push(`❌ Buff Duration: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.ignoreElementalResistance !== undefined) detailedStatsRight.push(`✅ Ignore Elemental Resistance: ${(character.stats as any).ignoreElementalResistance}%`)
        else detailedStatsRightMissing.push(`❌ Ignore Elemental Resistance: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.summonsDurationIncrease !== undefined) detailedStatsRight.push(`✅ Summons Duration Increase: ${(character.stats as any).summonsDurationIncrease}%`)
        else detailedStatsRightMissing.push(`❌ Summons Duration Increase: Not detected`)
        
        const allDetailedStatsLeft = [...detailedStatsLeft, ...detailedStatsLeftMissing]
        const allDetailedStatsRight = [...detailedStatsRight, ...detailedStatsRightMissing]
        
        embed.addFields(
          { name: 'Detailed Stats (Left)', value: allDetailedStatsLeft.join('\n'), inline: true },
          { name: 'Detailed Stats (Right)', value: allDetailedStatsRight.join('\n'), inline: true }
        )

        // Utility/Power Stats (Bottom Section - Two Columns)
        const utilityPowerStatsLeft = []
        const utilityPowerStatsLeftMissing = []
        const utilityPowerStatsRight = []
        const utilityPowerStatsRightMissing = []
        
        // Left Column: MESOS OBTAINED, ITEM DROP RATE, ADDITIONAL EXP OBTAINED
        if ((character.stats as any)._originalExtracted?.mesosObtained !== undefined) utilityPowerStatsLeft.push(`✅ Mesos Obtained: ${(character.stats as any).mesosObtained}%`)
        else utilityPowerStatsLeftMissing.push(`❌ Mesos Obtained: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.itemDropRate !== undefined) utilityPowerStatsLeft.push(`✅ Item Drop Rate: ${(character.stats as any).itemDropRate}%`)
        else utilityPowerStatsLeftMissing.push(`❌ Item Drop Rate: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.additionalExpObtained !== undefined) utilityPowerStatsLeft.push(`✅ Additional EXP Obtained: ${(character.stats as any).additionalExpObtained}%`)
        else utilityPowerStatsLeftMissing.push(`❌ Additional EXP Obtained: Not detected`)
        
        // Right Column: STAR FORCE, ARCANE POWER, SACRED POWER
        if ((character.stats as any)._originalExtracted?.starForce !== undefined) utilityPowerStatsRight.push(`✅ Star Force: ${(character.stats as any).starForce}`)
        else utilityPowerStatsRightMissing.push(`❌ Star Force: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.arcanePower !== undefined) utilityPowerStatsRight.push(`✅ Arcane Power: ${(character.stats as any).arcanePower.toLocaleString()}`)
        else utilityPowerStatsRightMissing.push(`❌ Arcane Power: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.sacredPower !== undefined) utilityPowerStatsRight.push(`✅ Sacred Power: ${(character.stats as any).sacredPower.toLocaleString()}`)
        else utilityPowerStatsRightMissing.push(`❌ Sacred Power: Not detected`)
        
        const allUtilityPowerStatsLeft = [...utilityPowerStatsLeft, ...utilityPowerStatsLeftMissing]
        const allUtilityPowerStatsRight = [...utilityPowerStatsRight, ...utilityPowerStatsRightMissing]
        
        embed.addFields(
          { name: 'Utility/Power Stats (Left)', value: allUtilityPowerStatsLeft.join('\n'), inline: true },
          { name: 'Utility/Power Stats (Right)', value: allUtilityPowerStatsRight.join('\n'), inline: true }
        )

        // Social Stats (Legion, Mu Lung Dojo, Fame)
        const socialStats = []
        const socialStatsMissing = []
        
        if ((character.stats as any)._originalExtracted?.legion !== undefined) socialStats.push(`✅ Legion: ${(character.stats as any).legion.toLocaleString()}`)
        else socialStatsMissing.push(`❌ Legion: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.muLungDojo !== undefined) socialStats.push(`✅ Mu Lung Dojo: ${(character.stats as any).muLungDojo}`)
        else socialStatsMissing.push(`❌ Mu Lung Dojo: Not detected`)
        
        if ((character.stats as any)._originalExtracted?.fame !== undefined) socialStats.push(`✅ Fame: ${(character.stats as any).fame}`)
        else socialStatsMissing.push(`❌ Fame: Not detected`)
        
        const allSocialStats = [...socialStats, ...socialStatsMissing]
        embed.addFields({ name: 'Social Stats', value: allSocialStats.join('\n'), inline: false })

        await interaction.editReply({ embeds: [embed] })
      } catch (ocrError) {
        console.error('OCR Error:', ocrError)
        await interaction.editReply({ 
          content: '❌ Failed to process the screenshot. Please make sure the image is clear and shows the character stats window. You can try again or use the manual `/character add` command instead.' 
        })
      }
    } catch (error) {
      console.error('Error adding character from screenshot:', error)
      await interaction.editReply({ 
        content: 'An error occurred while processing the character screenshot.' 
      })
    }
  }

  private async handleRegisterUser(interaction: ChatInputCommandInteraction) {
    try {
      const { user } = interaction
      
      // Register the Discord user
      const result = await this.userService.registerDiscordUser(
        user.id,
        user.username,
        user.discriminator && user.discriminator !== '0' ? user.discriminator : undefined,
        user.avatar || undefined
      )

      if (result.success) {
        const embed = new EmbedBuilder()
          .setTitle('✅ User Registered Successfully!')
          .setDescription(`Welcome to the MapleStory database, **${user.username}**!`)
          .setColor(0x00ff00)
          .setTimestamp()
          .setFooter({ text: 'You can now add characters using /addcharacter' })
          .addFields(
            { name: 'Discord User', value: user.username, inline: true },
            { name: 'User ID', value: result.user.id, inline: true },
            { name: 'Status', value: 'Active', inline: true }
          )

        await interaction.reply({ embeds: [embed] })
      } else {
        const embed = new EmbedBuilder()
          .setTitle('ℹ️ User Already Registered')
          .setDescription(`You're already registered in the database, **${user.username}**!`)
          .setColor(0x0099ff)
          .setTimestamp()
          .addFields(
            { name: 'Discord User', value: user.username, inline: true },
            { name: 'User ID', value: result.user.id, inline: true },
            { name: 'Status', value: 'Already exists', inline: true }
          )

        await interaction.reply({ embeds: [embed] })
      }
    } catch (error) {
      console.error('Error registering user:', error)
      await interaction.reply({ 
        content: '❌ An error occurred while registering your user account. Please try again later.',
        ephemeral: true
      })
    }
  }
}
