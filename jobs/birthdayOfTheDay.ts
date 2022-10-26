import { TextChannel } from 'discord.js'
import moment from 'moment';

async function getBdayUsers(date) {
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
    const momentVariable = moment(new Date, 'MM/DD/YYYY')
    const dateFormatted = momentVariable.format('MM/DD')
    const date = new Date(dateFormatted)
    const users = await getBdayUsers(date)

    for (const user of users)
      await channel.send(`Wish <@${user.discordId}> a happy birthday!`)
  }
}

export default birthdayOfTheDay
