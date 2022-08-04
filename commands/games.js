import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'

const options = [
  {
    label: 'CS:GO',
    emoji: '🔫',
    value: 'csgo'
  },
  {
    label: 'Minecraft',
    emoji: '⛏️',
    value: 'minecraft'
  },
  {
    label: 'Fortnite',
    emoji: '✏️',
    value: 'fortnite'
  }
]

const rolesMap = {
  csgo: 'CS:GO',
  minecraft: 'Minecraft',
  fortnite: 'Fortnite'
}

const rolesSet = new Set(Object.keys(rolesMap))

const Games = {
  builder: new SlashCommandBuilder()
    .setName('games')
    .setDescription('Select your games.'),
  async execute(interaction) {
    const roles = interaction.guild.roles.cache

    const gameOptions = options

    for (const option of gameOptions) {
      const role = roles.find(role => role.name === rolesMap[option.value])
      option['default'] = false
      if (interaction.member.roles.resolve(role.id))
        option['default'] = true
    }

    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('games')
          .setPlaceholder('Select your games.')
          .setMaxValues(gameOptions.length)
          .addOptions(gameOptions)
      )

    await interaction.reply({ content: 'Select games to add.', components: [row], ephemeral: true })
  },
  async onSelect(interaction) {
    const roles = interaction.guild.roles.cache
    const valueSet = new Set(interaction.values)
    const notSelected = new Set([...rolesSet].filter(x => !valueSet.has(x)))

    // roles to add
    valueSet.forEach(async v => {
      const role = roles.find(role => role.name === rolesMap[v])
      await interaction.member.roles.add(role)
    })

    // roles to remove
    notSelected.forEach(async v => {
      const role = roles.find(role => role.name === rolesMap[v])
      await interaction.member.roles.remove(role)
    })

    await interaction.update({ content: `You are now part of the ${interaction.values.join(', ')} game(s).`, components: [] })
  }
}

export default Games
