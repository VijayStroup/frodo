import type { TextChannel } from 'discord.js'
import moment from 'moment'
import prisma from '../utils/prisma'

async function getBirthdayUsers(date: Date) {
  const users = await prisma.user.findMany({
    where: {
      birthday: {
        birthday: date
      }
    }
  })

  return users
}

const birthdayOfTheDay = {
  cronPattern: '0 12 * * *', // every day at 12:00
  channel: '💬｜general',
  async execute(channel: TextChannel) {
    const date = new Date(moment(new Date, 'MM/DD/YYYY').format('MM/DD'))
    const users = await getBirthdayUsers(date)

    for (const user of users)
      await channel.send(`Happy birthday, <@${user.discordId}>! 🥳`)
  }
}

export default birthdayOfTheDay
