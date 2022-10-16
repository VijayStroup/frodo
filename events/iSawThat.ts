import { Message, TextChannel } from 'discord.js'

const ignored = ['864311867765686332', '369212248553422850']

const ISawThat = {
  name: 'messageDelete',
  async execute(message: Message) {
    if (message.author.bot) return
    if (ignored.includes(message.author.id)) return
    const logChannel = await message.guild.channels.cache.find(
      channel => channel.name === 'logs'
    ) as TextChannel

    if (message.attachments.size > 0) {
      await message.attachments.forEach(att => logChannel.send(att.proxyURL)
        .then(() => logChannel.send(`The message attachment(s) with content "${message.content}" by ${message.author} [${message.author.id}] was deleted.`)))
      await message.channel.send(`i saw that <@${message.author.id}>`)
    } else {
      await logChannel.send(`The message "${message.content}" by ${message.author} [${message.author.id}] was deleted.`)
        .then(() => message.channel.send(`i saw that <@${message.author.id}>`))
    }
  }
}

export default ISawThat
