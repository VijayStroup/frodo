import { CommandInteraction, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function setBday(userId, date) {
  if (userId === null || date === null) 
    return 

  try {
    const user = await prisma.user.create({
      data: {
        discordId: userId,      
        birthday: {
          create: {
            birthday:  date,
          }
        }
      }
    })

  } catch (PrismaClientKnownRequestError) {
    return -1
  }
}

const Birthday = {
  builder: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Set Your Birthday.')
    .addStringOption((option) =>
      option.setName('date').setDescription('Date (slashes).').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const str = interaction.options.getString('date')
    const momentVariable = moment(str, 'MM/DD/YYYY')
    const dateFormatted = momentVariable.format('MM/DD')
    const date = new Date(dateFormatted)
    const userId = interaction.member.user.id
    var content = `The inputted date is invalid. Please try again.`

    if (dateFormatted !== 'Invalid date'){
      var check = setBday(userId, date)
      if (await check === -1)
        content = `Your birthday has already been set.`
      else
        content = `Your birthday has been set for ${dateFormatted}.`
    }

    await interaction.reply({
      content: `${content}`,
      ephemeral: true
    })
  }
}

export default Birthday
