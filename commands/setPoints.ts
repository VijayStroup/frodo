import type { CommandInteraction, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import prisma from '../utils/prisma'

async function insertPoints(
  discordId: string,
  points: number,
  interaction: CommandInteraction
) {
  try {
    const user = await prisma.user.findUnique({
      where: { discordId },
      include: { points: true }
    })
    console.log(user)
    if (!user) {
      await interaction.reply({
        content: `Invalid user, user does not exist!`,
        ephemeral: true
      })
      return
    } else {
      await prisma.points.update({
        data: {
          points: points
        },
        where: {
          userId: user.id
        }
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}

const SetPoints = {
  builder: new SlashCommandBuilder()
    .setName('setpoints')
    .setDescription('Set the points of a given user.')
    .addUserOption((option) =>
      option.setName('user').setDescription('user').setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName('points').setDescription('points').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const discordId = interaction.member.user.id
    const pointsAmount = interaction.options.getNumber('points')
    try {
      await insertPoints(discordId, pointsAmount, interaction)
      await interaction.reply({
        content: `User has points updated to ${pointsAmount}`,
        ephemeral: true
      })
    } catch (error) {
      await interaction.reply({
        content: error.message,
        ephemeral: true
      })
    }
  }
}

export default SetPoints
