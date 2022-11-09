import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import getCommands from '../utils/getCommands'
import colors from '../utils/colors'

let commands: { [key: string]: any }
(async () => commands = await getCommands())()

const Help = {
  builder: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Respond with a list of commands.'),
  async execute(interaction: CommandInteraction) {
    const commandsEmbed = new MessageEmbed()
      .setColor(colors.gold)
      .setTitle('Commands')
      .setDescription(
        'Below is a list of all available commands and their descriptions.'
      )
      .setTimestamp()

    const fields = []
    for (const key in commands) {
      if (commands[key].members) continue
      else if (commands[key].roles && commands[key].roles.includes('Admin'))
        fields.push({ name: key, value: `${commands[key].builder.description}*` })
      else fields.push({ name: key, value: commands[key].builder.description })
    }
    commandsEmbed.addFields(fields)

    await interaction.reply({ embeds: [commandsEmbed], ephemeral: true })
  }
}

export default Help
