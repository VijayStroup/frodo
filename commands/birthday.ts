import type { CommandInteraction, GuildMember, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import prisma from '../utils/prisma'
import moment from 'moment-timezone'

async function getBirthday(discordId: string) {
  const user = await prisma.user.findUnique({
    where: { discordId },
    include: { birthday: true }
  })

  if (user) return user.birthday.birthday
  return -1
}

const Birthday = {
  builder: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Display birthday of a user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to get birthday of.')
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const target = interaction.options.getMember('user') as GuildMember
    const birthday = await getBirthday(target.user.id)
    if (birthday === -1)
      await interaction.reply({
        content: `${target.user.username} has no birthday set`,
        ephemeral: true
      })
    else
      await interaction.reply({
        content: `${target.user.username} birthday is ${moment(birthday).format(
          'MM/DD'
        )}`,
        ephemeral: true
      })
  }
}

export default Birthday
