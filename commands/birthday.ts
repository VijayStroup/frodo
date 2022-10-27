import { CommandInteraction, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function setBday(userId, date) {
  if (userId === null || date === null) return

  try {
    const user = await prisma.user.findFirst({
      where: {
        discordId: userId
      }
    })

    if (!user) {
      const user = await prisma.user.create({
        data: {
          discordId: userId
        }
      })
    }

    const birthday = await prisma.birthday.findFirst({
      where: {
        discordId: userId
      }
    })

    if (!birthday) {
      const user = await prisma.user.update({
        where: {
          discordId: userId
        },
        data: {
          birthday: {
            create: {
              discordId: userId,
              birthday: date
            }
          }
        }
      })
    }
  } catch (error) {
    return -1
  }
}

const Birthday = {
  builder: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Set Your Birthday.')
    .addStringOption((option) =>
      option.setName('month').setDescription('month').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('day').setDescription('day').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const month = interaction.options.getString('month')
    const day = interaction.options.getString('day')
    const dateFormatted = moment(month + day, 'MM/DD').format('MM/DD')
    const date = new Date(dateFormatted)
    const userId = interaction.member.user.id
    let content = `The inputted date is invalid. Please try again.`

    if (dateFormatted !== 'Invalid date') {
      const check = await setBday(userId, date)
      if (check === -1)
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
