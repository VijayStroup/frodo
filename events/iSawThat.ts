import type { Message } from 'discord.js'

const ignored = ['864311867765686332', '369212248553422850']

const ISawThat = {
  name: 'messageDelete',
  async execute(message: Message) {
    if (message.author.bot) return
    if (ignored.includes(message.author.id)) return
    await message.channel.send(`i saw that <@${message.author.id}>`)
  }
}

export default ISawThat
