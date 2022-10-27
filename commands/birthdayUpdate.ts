import { CommandInteraction, GuildMember, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function updateBday(userId, date) {
  if (userId === null || date === null) return

  try {
    const user = await prisma.user.findFirst({
      where: {
        discordId: userId
      }
    })

    if (user === undefined) {
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

    if (birthday === undefined) {
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
    } else {
      const user = await prisma.user.update({
        where: {
          discordId: userId
        },
        data: {
          birthday: {
            update: {
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
    const userId = target.user.id
    let content = `The inputted date is invalid. Please try again.`

    if (dateFormatted !== 'Invalid date') {
      const check = await updateBday(userId, date)
      content = `The birthday for ${target.user.username} has been updated to ${dateFormatted}.`
    }

    await interaction.reply({
      content: `${content}`,
      ephemeral: true
    })
  }
}

export default BirthdayUpdate
