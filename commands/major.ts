import type {
  CommandInteraction,
  GuildMemberRoleManager,
  SelectMenuInteraction
} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'

const options: { [key: string]: string | boolean }[] = [
  {
    label: 'Aerospace',
    emoji: '✈️',
    value: 'Aerospace'
  },
  {
    label: 'Business',
    emoji: '🏢',
    value: 'Business'
  },
  {
    label: 'Computer Engineering',
    emoji: '👨‍💻',
    value: 'ComputerEngineering'
  },
  {
    label: 'Computer Science',
    emoji: '👨‍💻',
    value: 'ComputerScience'
  },
  {
    label: 'Electrical Engineering',
    emoji: '📐',
    value: 'ElectricalEngineering'
  },
  {
    label: 'Finance',
    emoji: '💰',
    value: 'Finance'
  },
  {
    label: 'Health Sciences',
    emoji: '⚕️',
    value: 'HealthSciences'
  },
  {
    label: 'Information Technology',
    emoji: '👨‍💻',
    value: 'InformationTechnology'
  },
  {
    label: 'Mathematics',
    emoji: '🧮',
    value: 'Mathematics'
  },
  {
    label: 'Mechanical Engineering',
    emoji: '📐',
    value: 'MechanicalEngineering'
  },
  {
    label: 'Political Science',
    emoji: '🤡',
    value: 'PoliticalScience'
  },
  {
    label: 'Psychology',
    emoji: '🤯',
    value: 'Psychology'
  },
  {
    label: 'Women Studies',
    emoji: '👯‍♀️',
    value: 'WomenStudies'
  }
]

const rolesMap: { [key: string]: string } = {
  Aerospace: 'Aerospace',
  Business: 'Business',
  ComputerEngineering: 'Computer Engineering',
  ComputerScience: 'Computer Science',
  ElectricalEngineering: 'Electrical Engineering',
  Finance: 'Finance',
  HealthSciences: 'Health Sciences',
  InformationTechnology: 'Information Technology',
  Mathematics: 'Mathematics',
  MechanicalEngineering: 'Mechanical Engineering',
  Psychology: 'Psychology',
  PoliticalScience: 'Political Science',
  WomenStudies: 'Women Studies'
}

const rolesSet = new Set(Object.keys(rolesMap))

const Major = {
  builder: new SlashCommandBuilder()
    .setName('major')
    .setDescription('Select your majors.'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.guild?.roles.cache

    const majorOptions = options

    for (const option of majorOptions) {
      const role = roles?.find(role => role.name === rolesMap[option.value as string])
      option['default'] = false
      if (role && (interaction.member.roles as GuildMemberRoleManager).resolve(role.id))
        option['default'] = true
    }

    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('major')
          .setPlaceholder('Select your majors.')
          .setMaxValues(3)
          .addOptions(majorOptions as any)
      )

    await interaction.reply({
      content: 'Select majors to add.',
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
      content: `You are now part of the ${interaction.values.join(', ')} majors.`,
      components: []
    })
  }
}

export default Major
