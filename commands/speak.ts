import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

const Speak = {
  builder: new SlashCommandBuilder()
    .setName('speak')
    .setDescription('Make Tyrone speak.')
    .addStringOption((option) =>
      option.setName('message').setDescription('Message.').setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const message = interaction.options.getString('message')
    if (message) {
      await interaction.channel?.send(message)
      await interaction.reply({ content: '.', ephemeral: true })
    }
  }
}

export default Speak
