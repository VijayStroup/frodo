import fs from 'fs'

const getCommands = async () => {
  const commands: { [key: string]: any } = {}
  const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith(process.env.P ? '.js' : '.ts'))
  for (const file of commandFiles) {
    const command = await import(`${__dirname}/../commands/${file}`)
    commands[command.default.builder.name] = command.default
  }
  return commands
}

export default getCommands
