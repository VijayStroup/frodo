import { TextChannel } from "discord.js"
import moment from "moment";

async function getBdayUsers(date) 
{
  const users = await prisma.user.findMany({
    where: {
        Bday: {
          birthday: date
        }
    }
  })
  
  const arrayIds = []
  
  for (let i = 0; i < users.length; i++)
    arrayIds.push(users[i].discordId)

  return arrayIds
}

const birthdayOfTheDay = {
  cronPattern: '0 12 * * *', // every day at 12:00
  channel: 'announcements',
  async execute(channel: TextChannel) {
    const momentVariable = moment(new Date, 'MM/DD/YYYY')
    var dateFormatted = momentVariable.format('MM/DD/YYYY')
    const date = new Date(dateFormatted)

    const arrayIds = (await getBdayUsers(date)).slice();

    if (arrayIds[0] === undefined)
      return;
    
    for (let i = 0; i < arrayIds.length; i++)
      await channel.send(`Wish <@${arrayIds[i]}> a happy birthday!`)
  }
}

export default birthdayOfTheDay