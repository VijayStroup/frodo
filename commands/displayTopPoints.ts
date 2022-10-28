import { CommandInteraction, Message, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import prisma from '../utils/prisma'
import client from '../utils/client'

async function getTopPoints() {
  try {
    const user = await prisma.points.findMany({
      take: 10,
      orderBy: {
        points: 'desc'
      },
      include: {
        user: true
      }
    })

    return user
  } catch (PrismaClientKnownRequestError) {
    return -1
  }
}

const DisplayTopPoints = {
  builder: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Display Top Points.'),
  async execute(interaction: CommandInteraction, message: Message) {
    const userArray = await getTopPoints()
    const plural = `points\n`
    const singular = `point\n`
    let content = ``
    let i = 1

    const pointsEmbed = new MessageEmbed()
      .setColor('#649CDB')
      .setTitle('Top Points')
      .setDescription('')
      .setThumbnail('https://i.imgur.com/RKchYn7.jpeg')
      .setTimestamp()

    if (userArray !== -1)
      for (const discordUser of userArray) {
        try {
          let fetchUser = await client.users.fetch(
            `${discordUser.user.discordId}`
          )
          pointsEmbed.addField(
            '\u200b',
            `${i++}. ${fetchUser.username}\t${discordUser.points} ` +
            (discordUser.points === 1 ? singular : plural),

          )
        } catch (error) { }
      }
    else content = `...`

    await interaction.reply({
      embeds: [pointsEmbed],
    })
  }
}

export default DisplayTopPoints
