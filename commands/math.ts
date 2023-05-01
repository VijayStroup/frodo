import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import mathjs from 'mathjs'

const Math = {
  builder: new SlashCommandBuilder()
    .setName('math')
    .setDescription('Do simple math.')
    .addStringOption((option) =>
      option.setName('expression').setDescription('Expression.').setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const expression = interaction.options.getString('expression')

    try {
      const result = mathjs.evaluate(expression)
      await interaction.reply(`${expression} = ${result}`)
    }
    catch (e) {
      await interaction.reply({
        content: `Failed to evaluate ${expression}.`,
        ephemeral: true
      })
    }
  }
}

export default Math
