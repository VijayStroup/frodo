import { CommandInteraction, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function setBday(userId, date) {
  if (userId === null || date === null) return
  const user = await prisma.user.upsert({
    where: {
      discordId: userId
    },
    update: {
      Bday: {
        update: {
          birthday: date
        }
      }
    },
    create: {
      discordId: userId,
      Bday: {
        create: {
          birthday:  date,
        }
      }
    }
  })
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
    var dateFormatted = momentVariable.format('MM/DD')
    const userId = interaction.member.user.id
    const date = new Date(dateFormatted)

    if (Date.toString() !== 'Invalid Date')
      setBday(userId, date);
    else
      dateFormatted = 'an invalid date'

    await interaction.reply({
      content: `Your birthday has been set for ${dateFormatted}.`,
      ephemeral: true
    })
  }
}

export default Birthday
