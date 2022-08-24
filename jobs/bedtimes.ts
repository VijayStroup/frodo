import type { TextChannel } from 'discord.js'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(timezone)

const bedtimes: { [key: number]: string[] } = {
  0: ['209837832230010881'],
  1: ['609330932431716353'],
  21: ['841043611414954034'],
  22: ['969978958168850462'],
  23: ['870331693377138728']
}

const Bedtimes = {
  cronPattern: '0 * * * *', // every hour at minute 0
  channel: '💬｜general',
  async execute(channel: TextChannel) {
    const hour = dayjs().tz('America/New_York').hour()

    if (bedtimes[hour]) {
      for (const id of bedtimes[hour])
        await channel.send(`go to cleep <@${id}>`)
    }
  }
}

export default Bedtimes
