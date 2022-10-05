import type { Message, TextChannel } from 'discord.js'
import { config } from 'dotenv'

const GothReplies = {
  name: 'messageCreate',

  async execute(message: Message) {
    if (message.author.bot) return

    const nsfwChannel = await message.guild?.channels.cache.find(
        channel => channel.name === '🔞｜nsfw'
      ) as TextChannel

    const coin = (Math.floor(Math.random() * 2) == 0)

    if (message.channel === nsfwChannel && coin)
    {
        const loweredMessage = message.content.toLowerCase()
        const fetch = require('node-fetch');
    
        const url = `https://g.tenor.com/v1/search?q=${loweredMessage + " girl"}&key=${process.env.KEY}`
        const response = await fetch(url);

        if (response.status !== 200) 
          return
          
        const json = await response.json();
        const index = Math.floor(Math.random() * json.results.length);
    
        if (loweredMessage.split(' ')[0] === 'goth')
          await message.reply(json.results[index].url)
    }
  }
}

export default GothReplies
