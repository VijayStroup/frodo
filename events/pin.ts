import type { Message, TextChannel } from 'discord.js'
import { config } from 'dotenv'
import client from '../utils/client'

config()

interface Packet {
  t: string
  d: {
    channel_id: string
    message_id: string
  }
}

const threshold = 1

const Pin = {
  name: 'raw',
  async execute(packet: Packet) {
    if (packet.t !== 'MESSAGE_REACTION_ADD') return
    const channel = await client.channels.cache.get(packet.d.channel_id) as TextChannel
    const message = await channel.messages.fetch(packet.d.message_id) as Message
    const reactionCount = message.reactions.resolve('📌')?.count

    if (!reactionCount) return

    if (!message.pinned && reactionCount >= threshold) await message.pin()
  }
}

export default Pin
