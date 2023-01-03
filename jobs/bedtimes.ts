import type { TextChannel } from 'discord.js'
import 'moment-timezone'
import moment from 'moment'

const bedtimes: { [key: number]: string[] } = {
  0: ['209837832230010881', '358323509233057795'],
  1: ['609330932431716353'],
  21: ['841043611414954034'],
  22: ['969978958168850462']
}

const Bedtimes = {
  cronPattern: '0 * * * *', // every hour at minute 0
  channel: '💬｜general',
  async execute(channel: TextChannel) {
    const hour = moment().tz('America/New_York').hour()

    if (bedtimes[hour]) {
      for (const id of bedtimes[hour])
        await channel.send(`go to cleep <@${id}>`)
    }
  }
}

export default Bedtimes
