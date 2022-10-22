import type {
  CommandInteraction,
  SelectMenuInteraction,
  GuildMemberRoleManager
} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'

const options: { [key: string]: string | boolean }[] = [
  {
    label: 'CS:GO',
    emoji: '🔫',
    value: 'csgo'
  },
  {
    label: 'Fortnite',
    emoji: '✏️',
    value: 'fortnite'
  },
  {
    label: 'Minecraft',
    emoji: '⛏️',
    value: 'minecraft'
  },
  {
    label: 'Overwatch',
    emoji: '🛡️',
    value: 'overwatch'
  },
]

const rolesMap: { [key: string]: string } = {
  csgo: 'CS:GO',
  fortnite: 'Fortnite',
  minecraft: 'Minecraft',
  overwatch: 'Overwatch',
}

const rolesSet = new Set(Object.keys(rolesMap))

const Games = {
  builder: new SlashCommandBuilder()
    .setName('games')
    .setDescription('Select your games.'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.guild?.roles.cache

    const gameOptions = options

    for (const option of gameOptions) {
      const role = roles?.find(role => role.name === rolesMap[option.value as string])
      option['default'] = false
      if (role && (interaction.member.roles as GuildMemberRoleManager).resolve(role.id))
        option['default'] = true
    }

    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('games')
          .setPlaceholder('Select your games.')
          .setMaxValues(gameOptions.length)
          .addOptions(gameOptions as any)
      )

    await interaction.reply({
      content: 'Select games to add.',
      components: [row],
      ephemeral: true
    })
  },
  async onSelect(interaction: SelectMenuInteraction) {
    const roles = interaction.guild?.roles.cache
    const valueSet = new Set(interaction.values)
    const notSelected = new Set([...rolesSet].filter(x => !valueSet.has(x)))

    // roles to add
    valueSet.forEach(async v => {
      const role = roles?.find(role => role.name === rolesMap[v])
      if (role)
        await (interaction.member.roles as GuildMemberRoleManager).add(role)
    })

    // roles to remove
    notSelected.forEach(async v => {
      const role = roles?.find(role => role.name === rolesMap[v])
      if (role)
        await (interaction.member.roles as GuildMemberRoleManager).remove(role)
    })

    await interaction.update({
      content: `You are now part of the ${interaction.values.join(', ')} game(s).`,
      components: []
    })
  }
}

export default Games
