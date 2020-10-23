const Discord = require('discord.js');
const client = new Discord.Client();
const { token } = require('./config.json');

const { readdirSync } = require('fs');

const { join } = require('path');

client.commands = new Discord.Collection();
const prefix = '?';
const commandsFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for(const file of commandsFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);
client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity(`${prefix}help`, {type: "LISTENING"});
});

client.on("message", async message => {
    if(message.channel.bot) return;
    if(message.channel.type === 'dm') return;

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;
        try {
            client.commands.get(command).run(client, message, args);
        } catch (error){
            console.error(error);
        }
    }
    client.on('guildMemberAdd', member => {
        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        // Send the message, mentioning the member
        channel.send(`Welcome to the server, ${member} Please read <#766275848713404416>`);
      });
})

client.login(token);