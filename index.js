const { Client, GatewayIntentBits } = require('discord.js');
const { token, CountingChannel } = require('./config.json');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ] });

client.once('ready', c => {
	console.log(`${c.user.tag}`);
});

client.on('messageCreate', m => {
	let mesages;
	if(m.channelId.toString() == CountingChannel.toString()){
		try {
		const channel = client.channels.cache.get(m.channelId);
		channel.messages.fetch({ limit: 2 }).then(messages => {
			const iterator = messages.values();
			let curr = iterator.next().value;
			let prev = iterator.next().value;
			let nextNum = Number(prev.content.match(/\d+/)[0]) + 1;
			console.log(`Received ${messages.size} messages. ${prev.content} -> ${curr.content}. Expecting ${nextNum}.`);
			if (curr.content.toString().includes((nextNum))) {
				console.log("valid number");
			} else {
				m.author.send(`Hey, you sent an invalid number to <#${m.channelId}>. The next number is **${nextNum}**. If this is in error, please let <@!213074932458979330> know.`)
				m.delete();
			}
		  })
		} catch (error) {
			client.users.fetch('213074932458979330', false).then((user) => {
				user.send(`${m.url} caused:\n\`\`\`${error}\`\`\``);
			   });
		}
	}
});

client.login(token);
