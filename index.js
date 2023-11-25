const Discord = require('discord.js');
const blitzcrank = new Discord.Client();
require('dotenv').config()
const prompt = require('prompt-sync')();

const TOKEN = process.env.DISCORD_TOKEN
const OPTION = {
    SERVER: 0,
    CHANNEL: 1
}

if (!TOKEN) {
    console.error("ERROR: Token not found. Please check your .env file.")
    process.exit(1)
}


const parse = () => {
    return process.argv
        .filter(arg => arg.startsWith('-s=') || arg.startsWith('-c='))
        .map(arg => {
            return {
                type: arg.startsWith('-s=') ? OPTION.SERVER : OPTION.CHANNEL,
                id: arg.split('=')[1]
            }
        })
}

const deleteAllMsgFromServer = async (serverId) => {
    const server = blitzcrank.guilds.get(serverId)
    if (!server) {
        console.log(`ERROR: server with id '${serverId}' not found`)
        return(1)
    }

    const validation = prompt(`Are you sure you want to delete all your messages from server '${server.name}' ? (y/N) : `);
    if (validation !== 'y' && validation !== 'Y') {
        console.log(`Deletion of your messages from server '${server.name}' canceled.`)
        return(0)
    }

    const channels = server.channels.filter(channel => channel.type === 'text');

    await Promise.all(
        channels.map(async channel => {
            await channel.fetchMessages().then(async messages => {
                await Promise.all(
                    messages
                        .filter(message => message.member?.user.id === blitzcrank.user.id)
                        .map(async message => {
                            await message.delete() && console.log(`[DELETED] (${message.id}): ${message.content}`)
                        })
                )
            });
        })
    )
}



blitzcrank.on('ready', async () => {
    console.log('Fired up and ready to serve.\n')

    const options = parse()

    await Promise.all(
        options.map(async option => {
            if (option.type === OPTION.SERVER) return await deleteAllMsgFromServer(option.id)
            else console.log('channel')
        })
    )

    process.exit(0)
});

blitzcrank.login(TOKEN);