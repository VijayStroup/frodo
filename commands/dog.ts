import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import axios from 'axios'

const url = 'https://dog.ceo/api/breeds/image/random'

const Dog = {
  builder: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('get dog pictures'),
  channels: ['🐕｜pets'],
  async execute(interaction: CommandInteraction) {
    const res = await axios.get(url)

    if (res.status !== 200) {
      console.error(`[${new Date().toString()}] Error getting dog of the day`)
      return
    }

    await interaction.reply({ files: [res.data.message] })
  }
}

export default Dog
