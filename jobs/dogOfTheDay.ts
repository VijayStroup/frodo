import type { TextChannel } from 'discord.js'
import axios from 'axios'

const url = 'https://dog.ceo/api/breeds/image/random'

const DogOfTheDay = {
  cronPattern: '0 9 * * *', // every day at 09:00
  channel: '🐕｜pets',
  async execute(channel: TextChannel) {
    const res = await axios.get(url)

    if (res.status !== 200) {
      console.error(`[${new Date().toString()}] Error getting dog of the day`)
      return
    }

    await channel.send({ files: [res.data.message] })
  }
}

export default DogOfTheDay
