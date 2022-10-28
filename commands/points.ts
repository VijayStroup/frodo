import type { CommandInteraction, GuildMember, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import prisma from '../utils/prisma'

async function getPoints(discordId: string) {
  const user = await prisma.user.findUnique({
    where: { discordId },
    include: { points: true }
  })

  if (user) return user.points.points
  return -1
}

const Points = {
  builder: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Display points of a user.')
    .addUserOption((option) =>
      option.setName('user').setDescription('User to get points of.').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const target = interaction.options.getMember('user') as GuildMember
    const points = await getPoints(target.user.id)

    if (points === -1) await interaction.reply({
      content: `${target.user.username} has no points.`,
      ephemeral: true
    })
    else await interaction.reply({
      content: `${target.user.username} has ${points === 1 ? '1 point' : `${points} points`}.`,
      ephemeral: true
    })
  }
}

export default Points
