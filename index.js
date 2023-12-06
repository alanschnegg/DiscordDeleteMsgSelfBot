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



/******************************
    SECONDARY FUNCTIONS
*******************************/
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

const deleteFromChannel = async (channel) => {
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) options.before = last_id;

        const messages = await channel.fetchMessages(options);
        await Promise.all(
            messages
                .filter(message => message.member?.user.id === blitzcrank.user.id)
                .map(async message => {
                    await message.delete() && totalMessageDeleted++ && console.log(`[DELETED] (${message.id}): ${message.content}`)
                })
        )
        last_id = messages.last()?.id;

        if (messages.size !== 100) {
            break;
        }
    }
}



/******************************
       PRIMARY FUNCTIONS
*******************************/
const optionByServerId = async (serverId) => {
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

    const channels = server.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(server.me).has(['READ_MESSAGE_HISTORY', 'VIEW_CHANNEL']));

    await Promise.all(channels.map(async channel => await deleteFromChannel(channel)))
}

const optionByChannelId = async (channelId) => {
    const channel = blitzcrank.channels.get(channelId)
    if (!channel) {
        console.log(`ERROR: channel with id '${channelId}' not found`)
        return(1)
    } else if (!channel.permissionsFor(server.me).has(['READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'])) {
        console.log(`ERROR: channel found but no access`)
        return(1)
    }

    const validation = prompt(`Are you sure you want to delete all your messages from the channel '${channel.name}' of the server '${channel.guild.name}' ? (y/N) : `);
    if (validation !== 'y' && validation !== 'Y') {
        console.log(`Deletion of your messages from channel '${channel.name}' of the server '${channel.guild.name}' canceled.`)
        return(0)
    }

    await deleteFromChannel(channel)
}


/******************************
        MAIN LOOP
*******************************/
let totalMessageDeleted = 0;

blitzcrank.on('ready', async () => {
    console.log('Fired up and ready to serve.\n')

    const options = parse()

    await Promise.all(
        options.map(async option => {
            if (option.type === OPTION.SERVER) return await optionByServerId(option.id)
            else return await optionByChannelId(option.id)
        })
    )

    console.log(`\nMessage deleted: ${totalMessageDeleted}`)
    console.log('Exterminate. Exterminate.')
    process.exit(0)
});

blitzcrank.login(TOKEN);