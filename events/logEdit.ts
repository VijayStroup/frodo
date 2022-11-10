import type { Message, TextChannel } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import colors from '../utils/colors'

const logEdit = {
  name: 'messageUpdate',
  async execute(oldMessage: Message, newMessage: Message) {
    if (oldMessage.author.bot) return

    const logChannel = await oldMessage.guild.channels.cache.find(
      channel => channel.name === 'logs'
    ) as TextChannel

    if (!logChannel) return

    const deleteEmbed = new MessageEmbed()
      .setColor(colors.orange)
      .setTitle(`Message Edit`)
      .setAuthor({ name: 'Message Link', url: `https://discord.com/channels/${newMessage.guildId}/${newMessage.channelId}/${newMessage.id}` })
      .setDescription(`<@${oldMessage.author.id}> <#${oldMessage.channel.id}>\n` + oldMessage.content.slice(0, 4096 - 44)) // 44 offset for author and channel
      .addFields(oldMessage.attachments.map((attchment) => ({ name: 'Attachment', value: attchment.url, inline: false })))
      .setImage(oldMessage.attachments.first()?.url)
      .setTimestamp()

    await logChannel.send({ embeds: [deleteEmbed] })
  }
}

export default logEdit
