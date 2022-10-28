import { CommandInteraction, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function setBday(userId, date) {
  if (userId === null || date === null) return

  try {
    const user = await prisma.user.upsert({
      where: {
        discordId: userId
      },
      update: {},
      create: {
        discordId: userId
      }
    })

    const birthday = await prisma.birthday.upsert({
      where: {
        userId: user.id
      },
      update: {
        setBirthday: true
      },
      create: {
        userId: user.id,
        birthday: date,
        setBirthday: false
      }
    })

    if (birthday.setBirthday) return -1
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
    const discordId = interaction.member.user.id
    let content = `The inputted date is invalid. Please try again.`

    if (dateFormatted !== 'Invalid date') {
      const check = await setBday(discordId, date)
      if (check === -1) content = `Your birthday has already been set.`
      else content = `Your birthday has been set for ${dateFormatted}.`
    }

    await interaction.reply({
      content: `${content}`,
      ephemeral: true
    })
  }
}

export default Birthday
