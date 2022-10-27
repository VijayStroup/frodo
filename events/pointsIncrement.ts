import type { Message } from 'discord.js'
import prisma from '../utils/prisma'

async function incrementPoints(userId) {
  if (userId === null) return

  try {
    const user = await prisma.user.upsert({
      where: {
        discordId: userId
      },
      update: {
        points: {
          update: {
            points: { increment: 1 }
          }
        }
      },
      create: {
        discordId: userId,
        points: {
          create: {
            discordId: userId,
            points: 1
          }
        }
      }
    })
  } catch (error) {
  }
}

const pointsIncrement = {
  name: 'messageCreate',
  async execute(message: Message) {
    if (message.author.bot) return
    await incrementPoints(message.author.id)
  }
}

export default pointsIncrement
