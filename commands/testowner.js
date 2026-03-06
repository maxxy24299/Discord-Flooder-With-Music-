const config = require('../config');

module.exports = {
    name: 'testowner',
    ownerOnly: true,
    async execute(client, message, args) {
        const myId = message.author.id;
        const isOwner = config.owners.includes(myId);

        await message.reply(
            `Your ID: **${myId}**\n` +
            `Recognized as owner? → **${isOwner ? 'YES ✅' : 'NO ❌'}**\n\n` +
            `Owners in config:\n` +
            config.owners.map(id => `• ${id}`).join('\n')
        );
    }
};