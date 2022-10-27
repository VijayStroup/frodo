import type { Message } from 'discord.js'
import prisma from '../utils/prisma'

async function minusPoints(userId) {
  if (userId === null) return

  try {
    let user = await prisma.points.findFirst({
      where: {
        discordId: userId
      },
    })

    if (user.points === 0)
      return;

    user = await prisma.points.update({
      where: {
        discordId: userId
      },
      data: {
        points: { decrement: 1 }
      }
    })
  } catch (PrismaClientKnownRequestError) {
  }
}

const Points = {
  name: 'messageDelete',
  async execute(message: Message) {
    if (message.author.bot) return
    await minusPoints(message.author.id)
  }
}

export default Points
