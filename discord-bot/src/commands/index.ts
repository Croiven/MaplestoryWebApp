import { SlashCommandBuilder } from 'discord.js'

export const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot to check if it\'s responding'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available commands'),

  new SlashCommandBuilder()
    .setName('character')
    .setDescription('Character management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('search')
        .setDescription('Search for a character by name')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Character name to search for')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('world')
        .setDescription('List characters by world')
        .addStringOption(option =>
          option
            .setName('world')
            .setDescription('World name to filter by')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('job')
        .setDescription('List characters by job class')
        .addStringOption(option =>
          option
            .setName('job')
            .setDescription('Job class to filter by')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('top')
        .setDescription('Show top characters by level')
        .addIntegerOption(option =>
          option
            .setName('limit')
            .setDescription('Number of characters to show (default: 10)')
            .setMinValue(1)
            .setMaxValue(50)
        )
    ),

  new SlashCommandBuilder()
    .setName('characters')
    .setDescription('List all characters'),

  new SlashCommandBuilder()
    .setName('addcharacter')
    .setDescription('Add a character by uploading a screenshot of the stats window')
    .addAttachmentOption(option =>
      option
        .setName('screenshot')
        .setDescription('Screenshot of the MapleStory character stats window')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option
        .setName('main')
        .setDescription('Mark this character as your main character')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('registeruser')
    .setDescription('Register yourself as a user in the MapleStory database')
]
