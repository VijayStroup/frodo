import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions'
import JsonResponse from '../utils/json'

const url = 'https://dog.ceo/api/breeds/image/random'

export const Dog = {
  name: 'dog',
  description: 'get dog picture',
  async execute(interaction) {
    const res = await fetch(url)

    if (res.status !== 200) {
      console.error(`[${new Date().toString()}] Error getting dog`)
      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Error getting dog.',
          flags: InteractionResponseFlags.EPHEMERAL
        }
      })
    }

    const data = await res.json()

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: data.message
      }
    })
  }
}
