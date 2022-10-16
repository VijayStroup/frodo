import type { CommandInteraction, GuildMember, GuildMemberRoleManager } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

const ReadOnly = {
  builder: new SlashCommandBuilder()
    .setName('readonly')
    .setDescription('Set a user to readonly mode.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to assign readonly to.')
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const target = interaction.options.getMember('user') as GuildMember
    if (!target) return

    const roles = interaction.guild?.roles.cache
    const hasReadOnly = (target.roles).cache.some(role => role.name === 'readonly')

    if (hasReadOnly) {
      await (target.roles as GuildMemberRoleManager).remove(roles?.find(role => role.name === 'readonly') ?? '')
        .then(() => interaction.reply({ content: `<@${target.user.id}> has been removed from readonly mode.` }))
    } else {
      await (target.roles as GuildMemberRoleManager).add(roles?.find(role => role.name === 'readonly') ?? '')
        .then(() => interaction.reply({ content: `<@${target.user.id}> is now in readonly mode.` }))
    }
  }
}

export default ReadOnly
