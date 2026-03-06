const config = require('../config');

module.exports = {
    name: 'dm',
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send("Usage: !dm <@user|id> <message>");

        
        const targetId = args[0].replace(/[<@!>]/g, '');
        const content = args.slice(1).join(' ');

        if (!content) return message.channel.send("Please provide a message.");

        
        if (config.owners.includes(targetId)) {
            return message.channel.send("Nice Try Diddy!");
        }

        try {
            const user = await client.users.fetch(targetId);
            await user.send(content);
            message.react('✅');
        } catch (e) {
            console.error(`[${client.user.tag}] Failed to DM ${targetId}: ${e.message}`);
            
        }
    }
};