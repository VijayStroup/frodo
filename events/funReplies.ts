import type { Message } from 'discord.js'

const FunReplies = {
  name: 'messageCreate',
  async execute(message: Message) {
    if (message.author.bot) return

    const loweredMessage = message.content.toLowerCase()
    const coin = (Math.floor(Math.random() * 2) == 0)

    if (coin) {
      if (loweredMessage.split(' ')[0] === 'who')
        await message.reply('https://tenor.com/view/nba-shaquille-o-neal-yo-moma-point-laugh-gif-4759702')
      else if (loweredMessage === 'yo')
        await message.reply('yo')
      else if (loweredMessage === 'based')
        await message.reply('based on what?')
      else if (`${loweredMessage.split(' ')[0]} ${loweredMessage.split(' ')[1]}` === 'homie said') {
        if (message.content.length <= 1987)
          await message.reply({
            content: `homie said "${message.content}"`,
            allowedMentions: { parse: [] }
          })
      }
      else if (message.client.user && message.mentions.has(message.client.user.id))
        await message.reply('bing chilling')
      else if (loweredMessage === 'poggers in chat')
        await message.reply('poggers')
      else if (loweredMessage === 'bing bong')
        await message.reply('bing bong')
      else if (loweredMessage === 'stop')
        await message.reply('no you')
    }
  }
}

export default FunReplies