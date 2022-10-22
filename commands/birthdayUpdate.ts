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
        birthday:  date,
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
      option.setName('date').setDescription('Date.').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const target = interaction.options.getMember('user') as GuildMember
    const str = interaction.options.getString('date')
    const momentVariable = moment(str, 'MM/DD/YYYY')
    const dateFormatted = momentVariable.format('MM/DD')
    const date = new Date(dateFormatted)
    const userId = target.user.id
    var content = `The inputted date is invalid. Please try again.`

    if (dateFormatted !== 'Invalid date'){
      updateBday(userId, date)
      content = `The birthday for ${target.user.username} has been updated to ${dateFormatted}.`
    }

    await interaction.reply({
      content: `${content}`,
      ephemeral: true
    })
  }
}

export default BirthdayUpdate
