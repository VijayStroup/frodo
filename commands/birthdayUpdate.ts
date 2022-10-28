import { CommandInteraction, GuildMember, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function printALL() {
  const birthday = await prisma.birthday.findMany({})

  console.log(birthday)
}

async function updateBday(userId, date) {
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
        birthday: date
      },
      create: {
        userId: user.id,
        birthday: date
      }
    })
  } catch (error) {
    return -1
  }
}

const BirthdayUpdate = {
  builder: new SlashCommandBuilder()
    .setName('update')
    .setDescription('Update Birthdays.')
    .addUserOption((option) =>
      option.setName('user').setDescription('User.').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('month').setDescription('month').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('day').setDescription('day').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const target = interaction.options.getMember('user') as GuildMember
    const month = interaction.options.getString('month')
    const day = interaction.options.getString('day')
    const dateFormatted = moment(month + day, 'MM/DD').format('MM/DD')
    const date = new Date(dateFormatted)
    const discordId = target.user.id
    let content = `The inputted date is invalid. Please try again.`

    if (dateFormatted !== 'Invalid date') {
      const check = await updateBday(discordId, date)
      printALL()
      content = `The birthday for ${target.user.username} has been updated to ${dateFormatted}.`
    }

    await interaction.reply({
      content: `${content}`,
      ephemeral: true
    })
  }
}

export default BirthdayUpdate
