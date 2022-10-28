import type { CommandInteraction, Message } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import client from '../utils/client'
import prisma from '../utils/prisma'
import colors from '../utils/colors'

async function getTopPoints() {
  const users = await prisma.points.findMany({
    include: {
      user: true
    },
    orderBy: {
      points: 'desc'
    },
    take: 10
  })
  return users
}

const Top = {
  builder: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Display top 10 users by their points.'),
  async execute(interaction: CommandInteraction, message: Message) {
    const pointsEmbed = new MessageEmbed()
      .setColor(colors.blue)
      .setTitle('Top 10 Users')
      .setDescription('Top 10 users by their points.')
      .setThumbnail('https://i.imgur.com/qn74b3m.png')
      .setTimestamp()

    const top10 = await getTopPoints()

    for (const user of top10) {
      let fetchUser = await client.users.fetch(
        `${user.user.discordId}`
      )
      pointsEmbed.addField(
        `${fetchUser.username}#${fetchUser.discriminator}`,
        `${user.points} ${user.points === 1 ? 'point' : 'points'}`,
        true
      )
    }

    await interaction.reply({
      embeds: [pointsEmbed],
    })
  }
}

export default Top
