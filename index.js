const { Client, GatewayIntentBits, ChannelType, PermissionsBitField  } = require('discord.js');
require('dotenv').config()

if (process.argv.length < 3) {
    console.error(`ERROR: missing argument(s)`);
    console.log(`Usage: node ${process.argv[1]} [OPTION]...`)
    process.exit(1);
}

const TOKEN = process.env['DISCORD_TOKEN'];
const SERVER_ID = process.argv[2]

const blitzcrank = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

blitzcrank.on('ready', () => {
    const server = blitzcrank.guilds.cache.get(SERVER_ID)
    if (!server) {
        console.log("ERROR: server not found")
        process.exit(1)
    }
    
    const channels = server.channels.cache.filter(channel => channel.type === 0); // 0 = textChannel
    channels.forEach(channel => {
        console.log(channel.name)
        //const tmp = channel.messages.cache.get('923326955330338887')
        //console.log(tmp)
        console.log(channel)
    })
})

blitzcrank.login(TOKEN);