import type { Message } from 'discord.js'
import prisma from '../utils/prisma'

async function addPoints(discordId: string) {
  // increment points by 1 or create new user
  try {
    await prisma.user.upsert({
      where: { discordId },
      create: {
        discordId,
        points: { create: { points: 1 } }
      },
      update: {
        points: {
          update: {
            points: { increment: 1 }
          }
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const GivePoints = {
  name: 'messageCreate',
  async execute(message: Message) {
    if (message.author.bot) return
    await addPoints(message.author.id)
  }
}

export default GivePoints
