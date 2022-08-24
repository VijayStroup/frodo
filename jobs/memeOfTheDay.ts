import type { TextChannel } from 'discord.js'
import axios from 'axios'

const url = 'https://meme-api.herokuapp.com/gimme'

async function getMeme() {
  const res = await axios.get(url)

  if (res.status !== 200) {
    console.error(`[${new Date().toString()}] Error getting meme of the day`)
    return null
  }

  return res.data.url
}

const MemeOfTheDay = {
  cronPattern: '0 18 * * *', // every day at 18:00
  channel: '🤣｜memes',
  async execute(channel: TextChannel) {
    let success = false
    while (!success) {
      try {
        const meme = await getMeme()
        if (meme === null) throw new Error('Didn\'t get a meme.')
        else {
          await channel.send({ files: [meme] })
          success = true
        }
      } catch { /* get another one */ }
    }
  }
}

export default MemeOfTheDay
