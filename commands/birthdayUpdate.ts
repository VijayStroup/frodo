import { CommandInteraction, GuildMember, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function updateBday(userId, date) {
  if (userId === null || date === null) return
  const user = await prisma.user.upsert({
    where: {
      discordId: userId
    },
    update: {
      birthday: {
        update: {
          birthday: date
        }
      }
    },
    create: {
      discordId: userId,
      birthday: {
        create: {
          discordId: userId,
          birthday: date,
        }
      }
    }
  })
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
      await updateBday(userId, date)
      content = `The birthday for ${target.user.username} has been updated to ${dateFormatted}.`
    }

    await interaction.reply({
      content: `${content}`,
      ephemeral: true
    })
  }
}

export default BirthdayUpdate
