import type { Message } from 'discord.js'
import prisma from '../utils/prisma'

async function subPoints(discordId: string) {
  // find user
  const user = await prisma.user.findUnique({
    where: { discordId },
    include: { points: true }
  })

  // if user exists, decrement points by 1
  if (user) {
    await prisma.points.update({
      where: { id: user.points.id },
      data: { points: user.points.points > 0 ? { decrement: 1 } : 0 }
    })
  }
}

const RemovePoints = {
  name: 'messageDelete',
  async execute(message: Message) {
    if (message.author.bot) return
    await subPoints(message.author.id)
  }
}

export default RemovePoints
