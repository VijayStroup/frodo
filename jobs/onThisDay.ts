import type { TextChannel } from 'discord.js'
import axios from 'axios'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import colors from '../utils/colors'

const urlTemplate = 'https://byabbe.se/on-this-day/MONTH/DAY/events.json'

const OnThisDay = {
  cronPattern: '0 9 * * *', // every day at 9:00
  channel: '🤓｜random',
  async execute(channel: TextChannel) {
    const d = new Date()
    const url = urlTemplate.replace('MONTH', `${d.getUTCMonth() + 1}`).replace('DAY', `${d.getUTCDate()}`)
    const res = await axios.get(url)

    if (res.status !== 200) {
      console.error('Error getting on this day.')
      return
    }

    // select random event from list
    const event = res.data.events[Math.floor(Math.random() * res.data.events.length)]

    const factEmbed = new MessageEmbed()
      .setColor(colors.blue)
      .setTitle(`${d.getUTCMonth() + 1}/${d.getUTCDate()}/${event.year}`)
      .setAuthor({ name: 'On This Day' })
      .setThumbnail('https://i.imgur.com/B6QSudr.png')
      .setDescription((event.description as string).slice(0, 4096))
      .setTimestamp()

    const links = new MessageActionRow()
    for (const wiki of event.wikipedia) {
      links.addComponents(
        new MessageButton()
          .setLabel(wiki.title)
          .setStyle('LINK')
          .setURL(wiki.wikipedia)
      )
    }

    await channel.send({ embeds: [factEmbed], components: [links] })
  }
}

export default OnThisDay
