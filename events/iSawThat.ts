import type { Message, TextChannel } from 'discord.js'

const ignored = ['864311867765686332', '536716152680873988']

const ISawThat = {
  name: 'messageDelete',
  async execute(message: Message) {
    if (message.author.bot) return
    if (ignored.includes(message.author.id)) return
    const logChannel = await message.guild.channels.cache.find(
      channel => channel.name === 'logs'
    ) as TextChannel

    if (!logChannel) {
      await message.channel.send(`i saw that <@${message.author.id}>`)
      return
    }

    if (message.attachments.size > 0) {
      await message.attachments.forEach(att => logChannel.send(att.proxyURL)
        .then(async () => await logChannel.send(
          { content: `DELETE from ${message.author} in ${message.channel}\n\`${message.content}\``, allowedMentions: { parse: [] } }

        ))
      )
      await message.channel.send(`i saw that <@${message.author.id}>`)
    } else {
      await logChannel.send(
        { content: `DELETE from ${message.author} in ${message.channel}\n\`${message.content}\``, allowedMentions: { parse: [] } }
      )
        .then(async () => await message.channel.send(`i saw that <@${message.author.id}>`))
    }
  }
}

export default ISawThat
