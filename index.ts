import fs from 'fs'
import { config } from 'dotenv'
import client from './utils/client'

config()

const setupEvents = async () => {
  const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.ts'))
  for (const file of eventFiles) {
    const event = await import(`./events/${file}`)
    if (event.default.once)
      client.once(event.default.name, (...args) =>
        event.default.execute(...args)
      )
    else
      client.on(event.default.name, (...args) => event.default.execute(...args))
  }
}

setupEvents()

client.login(process.env.TOKEN)
