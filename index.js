const Discord = require('discord.js');
const blitzcrank = new Discord.Client();
require('dotenv').config()

const TOKEN = process.env.DISCORD_TOKEN

if (!TOKEN) {
    console.error("ERROR: Token not found. Please check your .env file.")
    process.exit(1)
}

blitzcrank.on('message', msg => {
// Action quand un message est envoyé dans un channel ou le bot a accès
});


blitzcrank.on('ready', () => {
// Action quand le bot se lance
    console.log('Bobip')
});

blitzcrank.login(TOKEN); // Token