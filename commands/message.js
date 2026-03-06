const { delay } = require('../utils');

module.exports = {
    name: 'message',
    async execute(client, message, args) {
        if (args.length < 2) return message.channel.send("Usage: !message <count> <text>");

        const count = parseInt(args[0]);
        const content = args.slice(1).join(' ');

        if (isNaN(count)) return message.channel.send("Invalid number.");
        if (!content) return message.channel.send("Please provide a message.");

        const actualCount = Math.min(count, 100); 

        for (let i = 0; i < actualCount; i++) {
            await message.channel.send(content);
            await delay(100); 
        }
    }
};