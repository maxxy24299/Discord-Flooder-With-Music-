// MADE BY ϻᴀχ </>
const { owners } = require('../config');

module.exports = {
    name: 'owners',
    ownerOnly: true,
    async execute(client, message, args) {
        const list = owners
            .map(id => `<@${id}> (${id})`)
            .join('\n') || 'No owners set';

        message.channel.send({
            content: `**Bot Owners:**\n${list}`,
            allowedMentions: { users: [] }
        });
    }
};