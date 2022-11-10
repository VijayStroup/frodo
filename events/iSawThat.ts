import type { Message, TextChannel } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import colors from '../utils/colors'

const ISawThat = {
  name: 'messageDelete',
  async execute(message: Message) {
    if (message.author.bot) return

    const logChannel = await message.guild.channels.cache.find(
      channel => channel.name === 'logs'
    ) as TextChannel

    if (!logChannel) {
      await message.channel.send(`i saw that <@${message.author.id}>`)
      return
    }

    const deleteEmbed = new MessageEmbed()
      .setColor(colors.red)
      .setTitle(`Message Delete`)
      .setDescription(`<@${message.author.id}> <#${message.channel.id}>\n` + message.content.slice(0, 4096 - 44)) // 44 offset for author and channel
      .addFields(message.attachments.map((attchment) => ({ name: 'Attachment', value: attchment.url, inline: false })))
      .setImage(message.attachments.first()?.url)
      .setTimestamp()

    await logChannel.send({ embeds: [deleteEmbed] })
    await message.channel.send(`i saw that <@${message.author.id}>`)
  }
}

export default ISawThat
