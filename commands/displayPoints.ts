import { CommandInteraction, GuildMember, Message, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import prisma from '../utils/prisma'

async function getPoints(discordId) {
  if (discordId === null) return

  try {
    const user = await prisma.user.findFirst({
      where: {
        discordId: discordId
      },
      include: {
        points: {}
      }
    })

    return user.points.points
  } catch (PrismaClientKnownRequestError) {
    return -1
  }
}

const DisplayPoints = {
  builder: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Display Points.')
    .addUserOption((option) =>
      option.setName('user').setDescription('User.').setRequired(true)
    ),
  async execute(interaction: CommandInteraction, message: Message) {
    const target = interaction.options.getMember('user') as GuildMember
    const user = await getPoints(target.user.id)
    const plural = `points!`
    const singular = `point!`
    let content = `${target.user.username} does not have any points`

    if (user !== -1) {
      content = `${target.user.username} has ${user} `
      content += user === 1 ? singular : plural
    }

    await interaction.reply({
      content: `${content}`,
      ephemeral: true
    })
  }
}

export default DisplayPoints
