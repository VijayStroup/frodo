import type { CommandInteraction, GuildMember } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

const Warn = {
  builder: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member.')
    .addUserOption((option) =>
      option.setName('user').setDescription('User to warn.').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason.').setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const target = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    try {
      await target.send(
        `You have been warned from ${interaction.member.user.username} for reason\n${reason}`
      )

      await interaction.reply({
        content: `You have warned ${target.user.username} for reason ${reason}.`,
        ephemeral: true
      })
    } catch (e) {
      await interaction.reply({
        content: `Failed to warn ${target.user.username}.`,
        ephemeral: true
      })
    }
  }
}

export default Warn
