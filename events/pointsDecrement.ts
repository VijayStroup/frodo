import type { Message } from 'discord.js'
import prisma from '../utils/prisma'

async function minusPoints(discordId) {
  if (discordId === null) return

  try {
    const user = await prisma.user.upsert({
      where: {
        discordId: discordId
      },
      update: {},
      create: {
        discordId: discordId
      }
    })

    const points = await prisma.points.upsert({
      where: {
        userId: user.id
      },
      update: {},
      create: {
        userId: user.id,
        points: 1
      }
    })

    if (points.points !== 0) {
      const update = await prisma.points.update({
        where: {
          userId: user.id
        },
        data: {
          points: { increment: -1 }
        }
      })
    }
  } catch (PrismaClientKnownRequestError) { }
}

const Points = {
  name: 'messageDelete',
  async execute(message: Message) {
    if (message.author.bot) return
    await minusPoints(message.author.id)
  }
}

export default Points
