import type { CommandInteraction, TextChannel } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

const NSFW = {
  builder: new SlashCommandBuilder()
    .setName('nsfw')
    .setDescription('Toggle nsfw on and off.'),
  async execute(interaction: CommandInteraction) {
    const nsfwChannel = await interaction.guild?.channels.cache.find(
      channel => channel.name === '🔞｜nsfw'
    ) as TextChannel

    const toggledOn = await nsfwChannel.permissionOverwrites.cache.get(interaction.member.user.id)

    if (toggledOn)
      await nsfwChannel.permissionOverwrites.delete(interaction.member.user.id)
    else
      await nsfwChannel.permissionOverwrites.edit(
        interaction.member.user.id,
        { VIEW_CHANNEL: toggledOn ? false : true }
      )

    await interaction.reply({
      content: `Toggled ${toggledOn ? 'off' : 'on'} <#${nsfwChannel.id}>.`,
      ephemeral: true
    })
  }
}

export default NSFW
