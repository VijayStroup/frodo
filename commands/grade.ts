import type { CommandInteraction, GuildMemberRoleManager, SelectMenuInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'

const options: { [key: string]: string | boolean }[] = [
  {
    label: 'Undergraduate',
    emoji: '🤓',
    value: 'Undergraduate'
  },
  {
    label: 'Graduate',
    emoji: '👨‍🎓',
    value: 'Graduate'
  },
  {
    label: 'Alumni',
    emoji: '👴',
    value: 'Alumni'
  }
]

const rolesMap: { [key: string]: string } = {
  Undergraduate: 'Undergraduate',
  Graduate: 'Graduate',
  Alumni: 'Alumni'
}

const rolesSet = new Set(Object.keys(rolesMap))

const Grade = {
  builder: new SlashCommandBuilder()
    .setName('grade')
    .setDescription('Select your grade.'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.guild?.roles.cache

    const gradeOptions = options

    for (const option of gradeOptions) {
      const role = roles?.find((role) => role.name === rolesMap[option.value as string])
      option['default'] = false
      if (role && (interaction.member.roles as GuildMemberRoleManager).resolve(role.id))
        option['default'] = true
    }

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('status')
        .setPlaceholder('Select your status.')
        .setMaxValues(1)
        .addOptions(gradeOptions as any)
    )

    await interaction.reply({
      content: 'Select a grade to add.',
      components: [row],
      ephemeral: true
    })
  },
  async onSelect(interaction: SelectMenuInteraction) {
    const roles = interaction.guild?.roles.cache
    const valueSet = new Set(interaction.values)
    const notSelected = new Set([...rolesSet].filter((x) => !valueSet.has(x)))

    // roles to add
    valueSet.forEach(async (v) => {
      const role = roles?.find((role) => role.name === rolesMap[v])
      if (role)
        await (interaction.member.roles as GuildMemberRoleManager).add(role)
    })

    // roles to remove
    notSelected.forEach(async (v) => {
      const role = roles?.find((role) => role.name === rolesMap[v])
      if (role)
        await (interaction.member.roles as GuildMemberRoleManager).remove(role)
    })

    await interaction.update({
      content: `You are now part of the ${interaction.values.join(
        ', '
      )} grade.`,
      components: []
    })
  }
}

export default Grade
