import type { CommandInteraction, GuildMember, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import moment from 'moment-timezone'
import prisma from '../utils/prisma'

async function updateBday(discordId: string, date: Date) {
  const user = await prisma.user.findUnique({
    where: { discordId },
  })

  // only set birthday if user exists
  if (!user) throw new Error('User not initialized.')

  try {
    await prisma.birthday.upsert({
      where: {
        userId: user.id,
      },
      create: {
        user: {
          connect: { id: user.id },
        },
        birthday: date
      },
      update: {
        birthday: date
      },
    })
  } catch (error) {
    throw new Error(error)
  }
}

const UpdateBirthday = {
  builder: new SlashCommandBuilder()
    .setName('updatebirthday')
    .setDescription('Update User Birthday.')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to set birthday of.').setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName('month').setDescription('month').setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName('day').setDescription('day').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const target = interaction.options.getMember('user') as GuildMember
    const discordId = target.user.id
    const month = interaction.options.getNumber('month')
    const day = interaction.options.getNumber('day')

    const dateFormatted = moment(`${month}/${day}`, 'MM/DD').format('MM/DD')
    const date = new Date(dateFormatted)

    if (dateFormatted === 'Invalid date') {
      await interaction.reply({
        content: 'Invalid input date. Please try again.',
        ephemeral: true,
      })
      return
    }

    try {
      await await updateBday(discordId, date)
      await interaction.reply({
        content: `${target.user}'s birthday set to ${dateFormatted}.`,
        ephemeral: true,
      })
    } catch (error) {
      await interaction.reply({
        content: error.message,
        ephemeral: true,
      })
    }
  }
}

export default UpdateBirthday
